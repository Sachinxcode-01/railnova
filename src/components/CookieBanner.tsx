'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

export const COOKIE_CONSENT_KEY = 'railnova_cookie_consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!saved) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: 'all' | 'essential') => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, choice);
      document.cookie = `${COOKIE_CONSENT_KEY}=${choice}; path=/; max-age=31536000; SameSite=Lax`;
      window.dispatchEvent(new CustomEvent('railnova-consent-changed', { detail: choice }));
    } catch {
      // Ignore storage errors
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-20 md:bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-90 rounded-2xl border border-(--border-subtle) bg-(--bg-surface)/95 backdrop-blur-md p-4 shadow-2xl no-print"
    >
      <div className="flex items-start gap-3">
        <Cookie className="h-5 w-5 shrink-0 text-(--accent-primary) mt-0.5" aria-hidden="true" />
        <div className="space-y-3">
          <p className="text-xs text-(--text-primary) leading-relaxed">
            We use essential cookies for sign-in sessions and optional analytics to improve RailNova. Read our{' '}
            <Link href="/privacy" className="text-(--accent-primary) underline underline-offset-2">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" className="text-(--accent-primary) underline underline-offset-2">
              Terms
            </Link>.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleChoice('all')}
              className="rounded-lg bg-(--accent-primary) px-3.5 py-2 text-xs font-semibold text-(--accent-on-primary) cursor-pointer"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={() => handleChoice('essential')}
              className="rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-3.5 py-2 text-xs font-semibold text-(--text-primary) hover:border-(--accent-primary) cursor-pointer"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
