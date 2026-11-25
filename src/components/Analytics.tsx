'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import {
  COOKIE_CONSENT_KEY,
  COOKIE_PREFERENCES_KEY,
  readConsentCookie,
  type CookiePreferences,
} from './CookieBanner';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function readAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const rawPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (rawPrefs) {
      const parsed = JSON.parse(rawPrefs) as Partial<CookiePreferences>;
      if (typeof parsed.analytics === 'boolean') {
        return parsed.analytics;
      }
    }
  } catch {
    // Fall through to consent marker
  }
  let consent: string | null = null;
  try {
    consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch {
    // Ignore storage errors
  }
  if (!consent) {
    consent = readConsentCookie();
  }
  return consent === 'all' || consent === 'analytics';
}

export function trackAnalyticsEvent(
  eventName: string,
  params?: Record<string, string | number>
) {
  if (!readAnalyticsConsent()) return;

  const gtagFn = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtagFn === 'function') {
    gtagFn('event', eventName, params || {});
  }

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: window.location.pathname, event: eventName }),
    keepalive: true,
  }).catch(() => { });
}

export function Analytics() {
  const pathname = usePathname();
  const [consented, setConsented] = useState(false);

  useEffect(() => {
        const check = () => setConsented(readAnalyticsConsent());
        check();
        const onChange = (e: Event) => {
          const detail = (e as CustomEvent<Partial<CookiePreferences>>).detail;
          if (detail && typeof detail.analytics === 'boolean') {
            setConsented(detail.analytics);
          } else {
            check();
          }
        };
        window.addEventListener('railnova-consent-changed', onChange);
        return () => window.removeEventListener('railnova-consent-changed', onChange);
      }, []);

  useEffect(() => {
    if (GA_ID && typeof window !== 'undefined') {
      (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = !consented;
    }
    if (!consented || !pathname) return;
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, event: 'page_view' }),
      keepalive: true,
    }).catch(() => { });
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
