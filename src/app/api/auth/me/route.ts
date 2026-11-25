import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClearSessionCookieConfig, getSessionFromCookies } from '@/lib/auth';
import { getDb, persistDb } from '@/lib/db';

function sanitizeUser(user: NonNullable<Awaited<ReturnType<typeof getDb>>['users'][number]>) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    savedPassengers: user.savedPassengers,
    favouriteRoutes: user.favouriteRoutes,
    favouriteDestinations: user.favouriteDestinations,
    recentSearches: user.recentSearches,
    notifications: user.notifications,
    createdAt: user.createdAt,
  };
}

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ user: null });
  }
  const db = await getDb();
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user: sanitizeUser(user) });
}

const patchSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().max(20).optional(),
  addPassenger: z
    .object({
      id: z.string(),
      fullName: z.string().min(2).max(80),
      age: z.number().int().min(1).max(120),
      gender: z.enum(['Male', 'Female', 'Other']),
      berthPreference: z.enum(['NO_PREF', 'LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER', 'WINDOW']),
      concession: z.enum(['NONE', 'SENIOR_CITIZEN', 'STUDENT', 'DIVYANGJAN']),
    })
    .optional(),
  removePassengerId: z.string().optional(),
  toggleFavouriteDestination: z.string().optional(),
  markNotificationsRead: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid profile update.' }, { status: 400 });
  }

  const db = await getDb();
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  if (parsed.data.name) user.name = parsed.data.name.trim();
  if (parsed.data.phone !== undefined) user.phone = parsed.data.phone.trim();
  if (parsed.data.addPassenger) {
    user.savedPassengers.push(parsed.data.addPassenger);
  }
  if (parsed.data.removePassengerId) {
    user.savedPassengers = user.savedPassengers.filter((p) => p.id !== parsed.data.removePassengerId);
  }
  if (parsed.data.toggleFavouriteDestination) {
    const slug = parsed.data.toggleFavouriteDestination;
    if (user.favouriteDestinations.includes(slug)) {
      user.favouriteDestinations = user.favouriteDestinations.filter((s) => s !== slug);
    } else {
      user.favouriteDestinations.push(slug);
    }
  }
  if (parsed.data.markNotificationsRead) {
    user.notifications = user.notifications.map((n) => ({ ...n, read: true }));
  }

  await persistDb(db);
  return NextResponse.json({ user: sanitizeUser(user) });
}

export async function DELETE() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  const db = await getDb();
  db.users = db.users.filter((u) => u.id !== session.userId);
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorId: session.userId,
    actorEmail: session.email,
    action: 'ACCOUNT_DELETED',
    target: session.userId,
    details: 'User deleted their account',
    timestamp: new Date().toISOString(),
  });
  await persistDb(db);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(getClearSessionCookieConfig());
  return res;
}
