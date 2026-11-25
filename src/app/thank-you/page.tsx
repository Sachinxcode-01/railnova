'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Compass, Ticket, AlertCircle } from 'lucide-react';
import { BookingRecord } from '@/lib/types';
import { DigitalTicket } from '@/components/DigitalTicket';
import { RAILNOVA_CONTACT } from '@/lib/contact';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const pnr = searchParams.get('pnr') || '';

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(pnr));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pnr) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);

    fetch(`/api/pnr/${encodeURIComponent(pnr)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.booking) {
          throw new Error(data.error || 'Could not retrieve booking confirmation.');
        }
        if (active) setBooking(data.booking);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load booking confirmation.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [pnr]);

  return (
    <div className="pt-28 pb-20 mx-auto max-w-290 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="rounded-2xl border border-(--border-subtle) bg-(--bg-surface) p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--success)/15 text-(--success)">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <div className="space-y-1.5">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
              Confirmation Complete
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
              Thank you for booking with RailNova.
            </h1>
            <p className="text-sm text-(--text-secondary) max-w-2xl">
              {pnr
                ? `Your demonstration reservation (PNR ${pnr}) has been issued. Download your PDF boarding pass or track your train below.`
                : 'Your demonstration booking workflow is complete. Inspect your journeys or look up any 10-digit PNR anytime.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-(--accent-primary) px-4 py-2.5 text-sm font-semibold text-(--accent-on-primary)"
          >
            <span>My Journeys</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/trains"
            className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-4 py-2.5 text-sm font-semibold hover:border-(--accent-primary)"
          >
            <Compass className="h-4 w-4 text-(--accent-primary)" aria-hidden="true" />
            <span>Book Another</span>
          </Link>
        </div>
      </div>

      {loading && (
        <div className="space-y-4" role="status" aria-label="Loading ticket confirmation">
          <div className="h-72 rounded-2xl border border-(--border-subtle) bg-(--bg-surface) animate-pulse" />
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-xl border border-(--error)/40 bg-(--error)/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3 text-sm text-(--error)">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
          <Link
            href="/pnr"
            className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-4 py-2 text-xs font-semibold text-(--text-primary)"
          >
            <Ticket className="h-4 w-4 text-(--accent-primary)" aria-hidden="true" />
            <span>Open PNR Enquiry</span>
          </Link>
        </div>
      )}

      {!loading && booking && <DigitalTicket booking={booking} />}

      {!loading && !pnr && (
        <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold">Need to retrieve an existing booking?</h2>
            <p className="text-xs text-(--text-secondary)">
              Check status using demo PNR <span className="font-mono-tech text-(--text-primary)">8429104521</span> or contact{' '}
              <a href={`mailto:${RAILNOVA_CONTACT.email}`} className="text-(--accent-primary) underline underline-offset-2">
                {RAILNOVA_CONTACT.email}
              </a>.
            </p>
          </div>
          <Link
            href="/pnr?pnr=8429104521"
            className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-4 py-2.5 text-xs font-semibold hover:border-(--accent-primary)"
          >
            <Ticket className="h-4 w-4 text-(--accent-primary)" aria-hidden="true" />
            <span>View Sample Boarding Pass</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-28 pb-20 mx-auto max-w-290 px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-36 rounded-2xl border border-(--border-subtle) bg-(--bg-surface) animate-pulse" />
          <div className="h-72 rounded-2xl border border-(--border-subtle) bg-(--bg-surface) animate-pulse" />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
