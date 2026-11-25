import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookies } from '@/lib/auth';
import { getDb, persistDb } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { BookingRecord } from '@/lib/types';

const createBookingSchema = z.object({
  idempotencyKey: z.string().min(8).max(80),
  trainNumber: z.string().min(4).max(6),
  fromCode: z.string().min(2).max(5),
  toCode: z.string().min(2).max(5),
  journeyDate: z.string().min(8).max(20),
  classCode: z.enum(['1A', '2A', '3A', '3E', 'SL', 'CC', 'EC', '2S']),
  quota: z.enum(['GN', 'TQ', 'PT', 'LD', 'SS']),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(8).max(16),
  paymentMethod: z.enum(['UPI', 'CARD', 'NETBANKING', 'WALLET']),
  simulatePaymentOutcome: z.enum(['SUCCESS', 'FAILURE']).default('SUCCESS'),
  passengers: z
    .array(
      z.object({
        id: z.string(),
        fullName: z.string().min(2).max(80),
        age: z.number().int().min(1).max(120),
        gender: z.enum(['Male', 'Female', 'Other']),
        berthPreference: z.enum(['NO_PREF', 'LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER', 'WINDOW']),
        concession: z.enum(['NONE', 'SENIOR_CITIZEN', 'STUDENT', 'DIVYANGJAN']),
        demoSelectedSeat: z.string().optional(),
      })
    )
    .min(1)
    .max(6),
});

// Track idempotency keys in memory to prevent duplicate submissions
const processedKeys = new Map<string, string>();

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  const db = await getDb();
  const bookings = db.bookings.filter((b) => b.userId === session.userId);
  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  const rl = checkRateLimit(`booking:${ip}`, 15, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait before submitting again.' }, { status: 429 });
  }

  const session = await getSessionFromCookies();

  try {
    const body = await req.json();
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed for booking details.', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const db = await getDb();

    // Duplicate-submission protection
    const existingId = processedKeys.get(data.idempotencyKey);
    if (existingId) {
      const existing = db.bookings.find((b) => b.id === existingId);
      if (existing) {
        return NextResponse.json({ booking: existing, deduplicated: true });
      }
    }

    const train = db.trains.find((t) => t.number === data.trainNumber);
    if (!train) {
      return NextResponse.json({ error: 'Selected train was not found.' }, { status: 404 });
    }

    const classInfo = train.classes.find((c) => c.classCode === data.classCode);
    if (!classInfo) {
      return NextResponse.json({ error: 'Selected travel class is not available on this train.' }, { status: 400 });
    }

    if (!train.applicableQuotas.includes(data.quota)) {
      return NextResponse.json({ error: `Quota ${data.quota} is not applicable on train ${train.number}.` }, { status: 400 });
    }

    // Server-side fare calculation (never trust client totals)
    const quotaMultiplier = data.quota === 'TQ' ? 1.25 : data.quota === 'PT' ? 1.45 : 1;
    let baseFare = 0;
    for (const pax of data.passengers) {
      let paxFare = Math.round(classInfo.fare * quotaMultiplier);
      if (pax.concession === 'SENIOR_CITIZEN') paxFare = Math.round(paxFare * 0.6);
      if (pax.concession === 'STUDENT') paxFare = Math.round(paxFare * 0.75);
      if (pax.concession === 'DIVYANGJAN') paxFare = Math.round(paxFare * 0.5);
      baseFare += paxFare;
    }

    const isAC = ['1A', '2A', '3A', '3E', 'CC', 'EC'].includes(data.classCode);
    const taxes = isAC ? Math.round(baseFare * 0.05) : 0;
    const convenienceFee = isAC ? 35 : 18;
    const totalAmount = baseFare + taxes + convenienceFee;

    const paymentSucceeded = data.simulatePaymentOutcome === 'SUCCESS';
    const paymentId = `pay_demo_${crypto.randomBytes(4).toString('hex')}`;

    // Do NOT mark booking as confirmed solely because payment succeeded;
    // verify seat/availability inventory state on server.
    let bookingStatus: BookingRecord['bookingStatus'] = 'CONFIRMED';
    if (!paymentSucceeded) {
      bookingStatus = 'PAYMENT_FAILED';
    } else if (classInfo.status === 'RAC') {
      bookingStatus = 'RAC';
    } else if (classInfo.status === 'WL') {
      bookingStatus = 'WAITLIST';
    }

    const pnr = `9${Math.floor(100000000 + Math.random() * 899999999)}`;
    const bookingRef = `RN-${new Date().getFullYear()}-${pnr.slice(-4)}`;
    const now = new Date().toISOString();

    const fromStation = db.stations.find((s) => s.code === data.fromCode);
    const toStation = db.stations.find((s) => s.code === data.toCode);

    const assignedPassengers = data.passengers.map((p, idx) => {
      if (!paymentSucceeded) {
        return { ...p, bookingStatus: 'PAYMENT_FAILED' };
      }
      if (bookingStatus === 'RAC') {
        return {
          ...p,
          bookingStatus: `RAC ${classInfo.count + idx}`,
          assignedCoach: `${classInfo.coachPrefix}1`,
          assignedBerth: `RAC ${classInfo.count + idx} (SL)`,
        };
      }
      if (bookingStatus === 'WAITLIST') {
        return {
          ...p,
          bookingStatus: `WL ${classInfo.count + idx}`,
        };
      }
      const seatNum = p.demoSelectedSeat || `${12 + idx * 3}`;
      const berthLabel =
        p.berthPreference === 'LOWER'
          ? 'LB'
          : p.berthPreference === 'UPPER'
          ? 'UB'
          : p.berthPreference === 'SIDE_LOWER'
          ? 'SL'
          : p.berthPreference === 'WINDOW'
          ? 'WS'
          : 'LB';

      return {
        ...p,
        bookingStatus: 'CNF',
        assignedCoach: `${classInfo.coachPrefix}2`,
        assignedBerth: `${seatNum} (${berthLabel})`,
      };
    });

    const booking: BookingRecord = {
      id: `bkg_${Date.now()}`,
      pnr,
      bookingReference: bookingRef,
      userId: session?.userId || 'guest_demo',
      trainNumber: train.number,
      trainName: train.name,
      category: train.category,
      fromCode: data.fromCode,
      fromName: fromStation?.name || data.fromCode,
      toCode: data.toCode,
      toName: toStation?.name || data.toCode,
      journeyDate: data.journeyDate,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      durationLabel: train.durationLabel,
      classCode: data.classCode,
      className: classInfo.className,
      quota: data.quota,
      passengers: assignedPassengers,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      baseFare,
      taxes,
      convenienceFee,
      totalAmount,
      paymentId,
      paymentMethod: data.paymentMethod,
      paymentStatus: paymentSucceeded ? 'PAID' : 'FAILED',
      bookingStatus,
      chartPrepared: false,
      isDemo: true,
      createdAt: now,
      updatedAt: now,
    };

    if (paymentSucceeded) {
      // Real-time inventory update in persistent store
      const paxCount = data.passengers.length;
      if (classInfo.status === 'AVAILABLE') {
        const remaining = classInfo.count - paxCount;
        if (remaining > 0) {
          classInfo.count = remaining;
          classInfo.statusText = `AVL ${remaining}`;
        } else {
          classInfo.status = 'RAC';
          classInfo.count = 1;
          classInfo.statusText = 'RAC 1';
        }
      } else if (classInfo.status === 'RAC') {
        classInfo.count += paxCount;
        classInfo.statusText = `RAC ${classInfo.count}`;
      } else if (classInfo.status === 'WL') {
        classInfo.count += paxCount;
        classInfo.statusText = `WL ${classInfo.count}`;
      }

      db.bookings.unshift(booking);
      processedKeys.set(data.idempotencyKey, booking.id);
    }

    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      actorId: session?.userId || 'guest_demo',
      actorEmail: data.contactEmail,
      action: paymentSucceeded ? 'BOOKING_CREATED_DEMO' : 'PAYMENT_FAILED_DEMO',
      target: booking.pnr,
      details: `${train.number} ${data.fromCode}->${data.toCode} (${data.classCode}) INR ${totalAmount}`,
      timestamp: now,
    });
    await persistDb(db);

    if (!paymentSucceeded) {
      return NextResponse.json(
        {
          error: 'Test-mode payment authorization declined. You can safely retry with another method.',
          paymentStatus: 'FAILED',
          booking,
        },
        { status: 402 }
      );
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create booking.' }, { status: 500 });
  }
}
