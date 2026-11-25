'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, SlidersHorizontal, X } from 'lucide-react';

export const COOKIE_CONSENT_KEY = 'railnova_cookie_consent';
export const COOKIE_PREFERENCES_KEY = 'railnova_cookie_preferences';

export interface CookiePreferences {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

export function openCookieSettings() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('railnova-open-cookie-settings'));
  }
}

export function readConsentCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${COOKIE_CONSENT_KEY}=`;
  const entry = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
        saved = localStorage.getItem(COOKIE_CONSENT_KEY);
      } catch {
        // Ignore storage errors
      }
      if (!saved) {
        saved = readConsentCookie();
      }

      let rawPrefs: string | null = null;
      try {
        rawPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      } catch {
        // Ignore storage errors
      }

      if (rawPrefs) {
        try {
          const parsed = JSON.parse(rawPrefs) as Partial<CookiePreferences>;
          setAnalytics(Boolean(parsed.analytics));
          setMarketing(Boolean(parsed.marketing));
        } catch {
          rawPrefs = null;
        }
      }

      if (!rawPrefs && saved) {
        if (saved === 'all') {
          setAnalytics(true);
          setMarketing(true);
        } else if (saved === 'analytics') {
          setAnalytics(true);
          setMarketing(false);
        } else if (saved === 'marketing') {
          setAnalytics(false);
          setMarketing(true);
        } else {
          setAnalytics(false);
          setMarketing(false);
        }
      }

      if (!saved) {
        setVisible(true);
      }

      const onOpenSettings = () => {
        setShowDetails(true);
        setVisible(true);
      };
      window.addEventListener('railnova-open-cookie-settings', onOpenSettings);
      return () => window.removeEventListener('railnova-open-cookie-settings', onOpenSettings);
    }, []);

  const persistPreferences = (nextAnalytics: boolean, nextMarketing: boolean) => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: nextAnalytics,
      marketing: nextMarketing,
      updatedAt: new Date().toISOString(),
    };
    const consentValue =
      nextAnalytics && nextMarketing
        ? 'all'
        : nextAnalytics
          ? 'analytics'
          : nextMarketing
            ? 'marketing'
            : 'essential';
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, consentValue);
    } catch {
      // Ignore storage errors
    }
    try {
      localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage errors
    }
    try {
      document.cookie = `${COOKIE_CONSENT_KEY}=${consentValue}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore cookie errors
    }
    window.dispatchEvent(new CustomEvent('railnova-consent-changed', { detail: prefs }));
    setAnalytics(nextAnalytics);
    setMarketing(nextMarketing);
    setShowDetails(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-label="Cookie consent and privacy preferences"
      className="fixed bottom-20 md:bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-90 rounded-2xl border border-(--border-subtle) bg-(--bg-surface)/95 backdrop-blur-md p-4 shadow-2xl no-print"
    >
      <div className="flex items-start gap-3">
        <Cookie className="h-5 w-5 shrink-0 text-(--accent-primary) mt-0.5" aria-hidden="true" />
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-(--text-primary) leading-relaxed">
              We use strictly necessary cookies for authentication and optional cookies for analytics and route alerts. See our{' '}
              <Link href="/privacy" className="text-(--accent-primary) underline underline-offset-2">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms" className="text-(--accent-primary) underline underline-offset-2">
                Terms
              </Link>.
            </p>
            {showDetails && (
              <button
                type="button"
                onClick={() => setVisible(false)}
                aria-label="Close cookie preferences"
                className="p-1 text-(--text-secondary) hover:text-(--text-primary) cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {showDetails && (
            <div className="space-y-2 rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-(--text-primary)">Strictly Necessary</div>
                  <div className="text-[11px] text-(--text-secondary)">Signed session &amp; CSRF security</div>
                </div>
                <span className="font-mono-tech text-[10px] uppercase text-(--success)">Always On</span>
              </div>
              <label className="flex items-center justify-between gap-2 pt-2 border-t border-(--border-subtle) cursor-pointer">
                <div>
                  <div className="font-semibold text-(--text-primary)">Analytics</div>
                  <div className="text-[11px] text-(--text-secondary)">Anonymized page &amp; search metrics</div>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="h-4 w-4 accent-(--accent-primary)"
                />
              </label>
              <label className="flex items-center justify-between gap-2 pt-2 border-t border-(--border-subtle) cursor-pointer">
                <div>
                  <div className="font-semibold text-(--text-primary)">Marketing &amp; Alerts</div>
                  <div className="text-[11px] text-(--text-secondary)">Optional fare drops &amp; corridor updates</div>
                </div>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="h-4 w-4 accent-(--accent-primary)"
                />
              </label>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {showDetails ? (
              <button
                type="button"
                onClick={() => persistPreferences(analytics, marketing)}
                className="rounded-lg bg-(--accent-primary) px-3.5 py-2 text-xs font-semibold text-(--accent-on-primary) cursor-pointer"
              >
                Save Preferences
              </button>
            ) : (
              <button
                type="button"
                onClick={() => persistPreferences(true, true)}
                className="rounded-lg bg-(--accent-primary) px-3.5 py-2 text-xs font-semibold text-(--accent-on-primary) cursor-pointer"
              >
                Accept All
              </button>
            )}
            <button
              type="button"
              onClick={() => persistPreferences(false, false)}
              className="rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-3.5 py-2 text-xs font-semibold text-(--text-primary) hover:border-(--accent-primary) cursor-pointer"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="inline-flex items-center gap-1 px-2 py-2 text-xs text-(--text-secondary) hover:text-(--text-primary) cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{showDetails ? 'Hide' : 'Manage'}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
