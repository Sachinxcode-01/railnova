import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const proto = req.headers.get('x-forwarded-proto');
  const host = req.headers.get('host') || '';
  const isLocalHost = host.startsWith('localhost') || host.startsWith('127.0.0.1');

  // Force HTTPS in production behind reverse proxies/CDNs
  if (process.env.NODE_ENV === 'production' && proto === 'http' && !isLocalHost) {
    const httpsUrl = req.nextUrl.clone();
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl, 308);
  }

  const res = NextResponse.next();
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
