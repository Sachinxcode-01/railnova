import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookies } from '@/lib/auth';
import { getDb, persistDb } from '@/lib/db';

const cancelSchema = z.object({
  bookingId: z.string().min(3),
  reason: z.string().min(3).max(200).default('Change of travel plans'),
});

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required to cancel bookings.' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = cancelSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid cancellation request.' }, { status: 400 });
  }

  const db = await getDb();
  const booking = db.bookings.find(
    (b) => b.id === parsed.data.bookingId && (b.userId === session.userId || session.role === 'admin')
  );
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }
  if (booking.bookingStatus === 'CANCELLED') {
    return NextResponse.json({ error: 'Booking is already cancelled.' }, { status: 409 });
  }

  const refundAmount = Math.max(0, Math.round(booking.baseFare * 0.85));
  const now = new Date().toISOString();

  booking.bookingStatus = 'CANCELLED';
  booking.paymentStatus = 'REFUNDED';
  booking.updatedAt = now;

  // Restore seats to train inventory in real time
  const train = db.trains.find((t) => t.number === booking.trainNumber);
  const classInfo = train?.classes.find((c) => c.classCode === booking.classCode);
  if (classInfo && classInfo.status === 'AVAILABLE') {
    classInfo.count += booking.passengers.length;
    classInfo.statusText = `AVL ${classInfo.count}`;
  }

  const cancellation = {
    id: `can_${Date.now()}`,
    bookingId: booking.id,
    pnr: booking.pnr,
    userId: booking.userId,
    reason: parsed.data.reason,
    refundAmount,
    status: 'PROCESSED' as const,
    createdAt: now,
    processedAt: now,
  };

  db.cancellations.unshift(cancellation);
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorId: session.userId,
    actorEmail: session.email,
    action: 'BOOKING_CANCELLED',
    target: booking.pnr,
    details: `Refund INR ${refundAmount} processed (demo)`,
    timestamp: now,
  });
  await persistDb(db);

  return NextResponse.json({ cancellation, booking });
}
