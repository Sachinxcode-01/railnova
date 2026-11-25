import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';

const COOKIE_CONSENT_KEY = 'railnova_cookie_consent';

const pageviewSchema = z.object({
  path: z.string().min(1).max(200),
  event: z.string().min(1).max(80).optional(),
});

const pageViews = new Map<string, number>();
const eventCounts = new Map<string, number>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  const rl = checkRateLimit(`analytics:${ip}`, 120, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const consent = req.cookies.get(COOKIE_CONSENT_KEY)?.value;
  if (consent !== 'all' && consent !== 'analytics') {
    return NextResponse.json({ ok: false, error: 'Analytics consent required.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = pageviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const cleanPath = parsed.data.path.split('?')[0];
    if (!parsed.data.event || parsed.data.event === 'page_view') {
      pageViews.set(cleanPath, (pageViews.get(cleanPath) || 0) + 1);
    } else {
      eventCounts.set(parsed.data.event, (eventCounts.get(parsed.data.event) || 0) + 1);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    pages: Object.fromEntries(pageViews.entries()),
    events: Object.fromEntries(eventCounts.entries()),
  });
}
