import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const db = await getDb();
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    dataController: 'RailNova Mobility Labs Pvt. Ltd.',
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      role: user.role,
      provider: user.provider,
      marketingConsent: Boolean(user.marketingConsent),
      marketingConsentUpdatedAt: user.marketingConsentUpdatedAt ?? null,
      savedPassengers: user.savedPassengers,
      favouriteRoutes: user.favouriteRoutes,
      favouriteDestinations: user.favouriteDestinations,
      recentSearches: user.recentSearches,
      createdAt: user.createdAt,
    },
    bookings: db.bookings.filter((b) => b.userId === user.id),
    cancellations: db.cancellations.filter((c) => c.userId === user.id),
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="railnova-personal-data.json"',
    },
  });
}
