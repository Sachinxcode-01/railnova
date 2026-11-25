'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { COOKIE_CONSENT_KEY } from './CookieBanner';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function trackAnalyticsEvent(
  eventName: string,
  params?: Record<string, string | number>
) {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem(COOKIE_CONSENT_KEY) !== 'all') return;
  } catch {
    return;
  }

  const gtagFn = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtagFn === 'function') {
    gtagFn('event', eventName, params || {});
  }

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: window.location.pathname, event: eventName }),
    keepalive: true,
  }).catch(() => {});
}

export function Analytics() {
  const pathname = usePathname();
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        setConsented(localStorage.getItem(COOKIE_CONSENT_KEY) === 'all');
      } catch {
        setConsented(false);
      }
    };
    check();
    const onChange = () => check();
    window.addEventListener('railnova-consent-changed', onChange);
    return () => window.removeEventListener('railnova-consent-changed', onChange);
  }, []);

  useEffect(() => {
    if (!consented || !pathname) return;
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, event: 'page_view' }),
      keepalive: true,
    }).catch(() => {});
  }, [consented, pathname]);

  if (!consented || !GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="railnova-ga" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
