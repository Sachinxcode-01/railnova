'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Search, Ticket } from 'lucide-react';

const HIDDEN_PREFIXES = ['/book', '/thank-you', '/auth', '/admin'];

export function StickyMobileCTA() {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);

  const isHiddenRoute = HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) {
      setPastHero(true);
      return;
    }
    const onScroll = () => setPastHero(window.scrollY > 240);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  if (isHiddenRoute || (isHome && !pastHero)) return null;

  const isTrainsPage = pathname.startsWith('/trains');

  return (
    <div
      role="region"
      aria-label="Quick booking actions"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-(--border-subtle) bg-(--bg-primary)/95 backdrop-blur-md px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-2xl no-print"
    >
      <div className="flex items-center gap-2.5">
        <Link
          href={isTrainsPage ? '/book' : '/trains'}
          className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-(--accent-primary) px-4 text-sm font-semibold text-(--accent-on-primary) active:scale-[0.99] transition-transform"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>{isTrainsPage ? 'Book Express Ticket' : 'Find My Train'}</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="/pnr"
          aria-label="Check PNR status"
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-3.5 text-xs font-semibold text-(--text-primary)"
        >
          <Ticket className="h-4 w-4 text-(--accent-primary)" aria-hidden="true" />
          <span>PNR</span>
        </Link>
      </div>
    </div>
  );
}
