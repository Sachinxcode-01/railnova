import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb, persistDb } from '@/lib/db';
import {
  getSessionCookieConfig,
  signSessionToken,
  verifyPassword,
} from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

const loginSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('credentials'),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  z.object({
    mode: z.literal('otp-demo'),
    phone: z.string().min(8).max(16),
    otp: z.string().length(6),
  }),
  z.object({
    mode: z.literal('google-demo'),
    email: z.string().email().optional(),
  }),
]);

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  const rl = checkRateLimit(`login:${ip}`, 20, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many login attempts. Please wait a minute.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid credentials format.', details: parsed.error.flatten() }, { status: 400 });
    }

    const db = await getDb();
    let user;

    if (parsed.data.mode === 'credentials') {
      const email = parsed.data.email.toLowerCase().trim();
      user = db.users.find((u) => u.email.toLowerCase() === email);
      if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }
    } else if (parsed.data.mode === 'otp-demo') {
      // Demo OTP accepts "123456" for demonstration purposes
      if (parsed.data.otp !== '123456') {
        return NextResponse.json({ error: 'Invalid OTP. For demo mode, use 123456.' }, { status: 401 });
      }
      user = db.users.find((u) => u.role === 'user');
    } else {
      user = db.users.find((u) => u.email === 'traveler@railnova.demo');
    }

    if (!user) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    }

    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      actorId: user.id,
      actorEmail: user.email,
      action: 'USER_LOGIN',
      target: user.id,
      details: `Signed in via ${parsed.data.mode}`,
      timestamp: new Date().toISOString(),
    });
    await persistDb(db);

    const token = signSessionToken({ userId: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
    res.cookies.set(getSessionCookieConfig(token));
    return res;
  } catch {
    return NextResponse.json({ error: 'Unable to process login request.' }, { status: 500 });
  }
}
