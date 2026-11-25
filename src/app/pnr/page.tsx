'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Search, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { BookingRecord } from '@/lib/types';

function PnrContent() {
  const searchParams = useSearchParams();
  const initialPnr = searchParams.get('pnr') || '';

  const [pnrInput, setPnrInput] = useState(initialPnr);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const lookupPnr = async (code: string) => {
    const cleaned = code.trim();
    if (!/^\d{10}$/.test(cleaned)) {
      setError('Enter a valid 10-digit PNR number.');
      setBooking(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pnr/${cleaned}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'PNR not found.');
        setBooking(null);
        return;
      }
      setBooking(data.booking);
      setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString());
    } catch {
      setError('Unable to check PNR status right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPnr && /^\d{10}$/.test(initialPnr)) {
      lookupPnr(initialPnr);
    }
  }, [initialPnr]);

  return (
    <div className="pt-24 pb-20 mx-auto max-w-340 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Split: Search & Status */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
              10-Digit PNR Enquiry
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              PNR Status
            </h1>
            <p className="text-sm text-(--text-secondary)">
              Check demonstration bookings created in RailNova or try our sample PNRs below.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              lookupPnr(pnrInput);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              maxLength={10}
              value={pnrInput}
              aria-invalid={Boolean(error)}
              onChange={(e) => {
                setPnrInput(e.target.value.replace(/\D/g, ''));
                if (error) setError(null);
              }}
              placeholder="Enter 10-digit PNR (e.g. 8429104521)"
              aria-label="10-digit PNR number"
              className={`pnr-input flex-1 h-14 rounded-xl border bg-(--bg-surface) px-4 font-mono-tech text-lg tracking-widest text-(--text-primary) focus:outline-none ${error ? 'border-(--error)' : 'border-(--border-subtle)'
                }`}
            />
            <button
              type="submit"
              disabled={loading}
              className="h-14 inline-flex items-center justify-center gap-2 rounded-xl bg-(--accent-primary) px-6 text-sm font-semibold text-(--accent-on-primary) cursor-pointer disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              <span>{loading ? 'Checking...' : 'Check Status'}</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-(--text-secondary)">Try demo PNRs:</span>
            {['8429104521', '6193048271'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setPnrInput(sample);
                  lookupPnr(sample);
                }}
                className="rounded-md border border-(--border-subtle) bg-(--bg-surface) px-2.5 py-1 font-mono-tech hover:border-(--accent-primary) cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-(--error)/40 bg-(--error)/10 p-4 text-sm text-(--error)"
            >
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {booking && (
            <div className="rounded-2xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-(--border-subtle)">
                <div>
                  <div className="font-mono-tech text-xs text-(--accent-primary)">
                    PNR {booking.pnr} · DEMO RECORD
                  </div>
                  <h2 className="font-display text-xl font-bold mt-0.5">
                    {booking.trainNumber} {booking.trainName}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-(--bg-primary) border border-(--border-subtle) px-3 py-1 text-xs font-mono-tech">
                  {booking.chartPrepared ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-(--success)" />
                      <span>Chart Prepared</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-3.5 w-3.5 text-(--warning)" />
                      <span>Chart Not Prepared</span>
                    </>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs font-mono-tech text-(--text-secondary)">FROM</div>
                  <div className="font-mono-tech text-lg font-bold">{booking.fromCode}</div>
                  <div className="text-xs text-(--text-secondary)">{booking.departureTime}</div>
                </div>
                <div>
                  <div className="text-xs font-mono-tech text-(--text-secondary)">DATE</div>
                  <div className="font-mono-tech text-sm font-semibold">{booking.journeyDate}</div>
                  <div className="text-xs text-(--text-secondary)">Class {booking.classCode}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono-tech text-(--text-secondary)">TO</div>
                  <div className="font-mono-tech text-lg font-bold">{booking.toCode}</div>
                  <div className="text-xs text-(--text-secondary)">{booking.arrivalTime}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono-tech uppercase text-(--text-secondary)">
                  Passenger Status
                </div>
                <div className="rounded-lg border border-(--border-subtle) bg-(--bg-primary)">
                  {booking.passengers.map((p, idx) => (
                    <div
                      key={p.id}
                      className="px-4 py-3 flex items-center justify-between text-sm border-b border-(--border-subtle) last:border-b-0"
                    >
                      <span>
                        0{idx + 1}. {p.fullName}
                      </span>
                      <span className="font-mono-tech text-xs font-bold text-(--accent-primary)">
                        {p.bookingStatus} {p.assignedCoach ? `· ${p.assignedCoach} / ${p.assignedBerth}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {lastUpdated && (
                <div className="text-xs font-mono-tech text-(--text-secondary)">
                  Last checked: {lastUpdated} · Demonstration database record
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Split: Compact Cinematic Visual */}
        <div className="lg:col-span-5 relative min-h-95 rounded-2xl overflow-hidden border border-(--border-subtle)">
          <Image
            src="https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=1200&q=75"
            alt="Railway tracks stretching toward horizon at dusk"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(12,13,16,0.2) 0%, rgba(12,13,16,0.9) 100%)',
            }}
          />
          <div className="relative z-10 h-full p-7 flex flex-col justify-end text-[#F8F9FC] space-y-2">
            <span className="font-mono-tech text-xs text-[#D4FF3F] uppercase tracking-widest">
              Verification Integrity
            </span>
            <h2 className="font-display text-2xl font-bold">
              Honest PNR records without fabricated confirmations.
            </h2>
            <p className="text-sm text-[#9296A3]">
              RailNova only resolves bookings stored in your demonstration session and never invents official IRCTC confirmation statuses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PnrPage() {
  return (
    <Suspense fallback={<div className="pt-28 pb-20 px-4 text-sm font-mono-tech">Loading PNR enquiry...</div>}>
      <PnrContent />
    </Suspense>
  );
}
