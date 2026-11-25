import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb, persistDb } from '@/lib/db';
import { getSessionCookieConfig, hashPassword, signSessionToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(80),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{8,16}$/, 'Please enter a valid phone number.')
    .optional()
    .or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(100),
  marketingConsent: z.boolean().optional(),
  website: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  const rl = checkRateLimit(`register:${ip}`, 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many registration requests.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please check your registration details.', details: parsed.error.flatten() }, { status: 400 });
    }
    if (parsed.data.website && parsed.data.website.trim().length > 0) {
      return NextResponse.json({ error: 'Registration blocked by spam filter.' }, { status: 400 });
    }

    const db = await getDb();
    const email = parsed.data.email.toLowerCase().trim();
    if (db.users.some((u) => u.email.toLowerCase() === email)) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: parsed.data.name.trim(),
      email,
      phone: parsed.data.phone?.trim(),
      passwordHash: hashPassword(parsed.data.password),
      role: 'user' as const,
      provider: 'credentials' as const,
      savedPassengers: [],
      favouriteRoutes: [],
      favouriteDestinations: [],
      recentSearches: [],
      notifications: [
        {
          id: `notif_${Date.now()}`,
          title: 'Welcome to RailNova',
          message: 'Your demonstration travel account is ready.',
          read: false,
          createdAt: new Date().toISOString(),
        },
      ],
      marketingConsent: Boolean(parsed.data.marketingConsent),
      marketingConsentUpdatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      actorId: newUser.id,
      actorEmail: newUser.email,
      action: 'USER_REGISTER',
      target: newUser.id,
      details: 'New account registered',
      timestamp: new Date().toISOString(),
    });
    await persistDb(db);

    const token = signSessionToken({ userId: newUser.id, email: newUser.email, role: newUser.role });
    const res = NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
    res.cookies.set(getSessionCookieConfig(token));
    return res;
  } catch {
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }
}
