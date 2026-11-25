import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { getDb, persistDb } from '@/lib/db';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Administrator privileges required.' }, { status: 403 });
  }

  const db = await getDb();
  const totalRevenue = db.bookings
    .filter((b) => b.paymentStatus === 'PAID')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return NextResponse.json({
    metrics: {
      totalUsers: db.users.length,
      totalTrains: db.trains.length,
      totalStations: db.stations.length,
      totalBookings: db.bookings.length,
      totalRevenue,
      pendingCancellations: db.cancellations.filter((c) => c.status === 'REQUESTED').length,
      systemHealth: 'OPERATIONAL',
    },
    users: db.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    })),
    trains: db.trains,
    stations: db.stations,
    bookings: db.bookings,
    cancellations: db.cancellations,
    auditLogs: db.auditLogs.slice(0, 50),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Administrator privileges required.' }, { status: 403 });
  }

  const body = (await req.json()) as { action: string; pnr?: string };
  const db = await getDb();

  if (body.action === 'TOGGLE_CHART' && body.pnr) {
    const booking = db.bookings.find((b) => b.pnr === body.pnr);
    if (booking) {
      booking.chartPrepared = !booking.chartPrepared;
      booking.updatedAt = new Date().toISOString();
      db.auditLogs.unshift({
        id: `aud_${Date.now()}`,
        actorId: session.userId,
        actorEmail: session.email,
        action: 'ADMIN_TOGGLE_CHART',
        target: booking.pnr,
        details: `Chart prepared set to ${booking.chartPrepared}`,
        timestamp: new Date().toISOString(),
      });
      await persistDb(db);
      return NextResponse.json({ ok: true, booking });
    }
  }

  return NextResponse.json({ error: 'Unsupported admin action.' }, { status: 400 });
}
