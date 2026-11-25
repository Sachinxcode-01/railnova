'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Calendar, Users, Search, Sparkles } from 'lucide-react';
import { STATIONS, TRAVEL_CLASS_LABELS, QUOTA_LABELS } from '@/lib/railway-data';
import { BookingQuotaCode, Station, TravelClassCode } from '@/lib/types';

interface SmartBookingPanelProps {
  initialFrom?: string;
  initialTo?: string;
  initialDate?: string;
  initialClass?: string;
  initialQuota?: BookingQuotaCode;
  initialPassengers?: number;
  compact?: boolean;
}

export function SmartBookingPanel({
  initialFrom = 'SBC',
  initialTo = 'MAO',
  initialDate,
  initialClass = 'ALL',
  initialQuota = 'GN',
  initialPassengers = 1,
  compact = false,
}: SmartBookingPanelProps) {
  const router = useRouter();
  const todayStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [fromCode, setFromCode] = useState(initialFrom);
  const [toCode, setToCode] = useState(initialTo);
  const [fromQuery, setFromQuery] = useState(() => {
    const s = STATIONS.find((x) => x.code === initialFrom);
    return s ? `${s.city} (${s.code})` : initialFrom;
  });
  const [toQuery, setToQuery] = useState(() => {
    const s = STATIONS.find((x) => x.code === initialTo);
    return s ? `${s.city} (${s.code})` : initialTo;
  });

  const [activeDropdown, setActiveDropdown] = useState<'from' | 'to' | null>(null);
  const [highlightIdx, setHighlightIdx] = useState(0);

  const [date, setDate] = useState(initialDate || todayStr);
  const [flexibleDate, setFlexibleDate] = useState(false);
  const [passengers, setPassengers] = useState(initialPassengers);
  const [classCode, setClassCode] = useState<string>(initialClass);
  const [quota, setQuota] = useState<BookingQuotaCode>(initialQuota);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [swapRotated, setSwapRotated] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const filterStations = (q: string): Station[] => {
    const cleaned = q.toLowerCase().trim();
    if (!cleaned) return STATIONS.slice(0, 8);
    return STATIONS.filter(
      (s) =>
        s.code.toLowerCase().includes(cleaned) ||
        s.city.toLowerCase().includes(cleaned) ||
        s.name.toLowerCase().includes(cleaned)
    ).slice(0, 8);
  };

  const fromResults = filterStations(fromQuery);
  const toResults = filterStations(toQuery);

  const selectStation = (field: 'from' | 'to', station: Station) => {
    const label = `${station.city} (${station.code})`;
    if (field === 'from') {
      setFromCode(station.code);
      setFromQuery(label);
    } else {
      setToCode(station.code);
      setToQuery(label);
    }
    setActiveDropdown(null);
    setError(null);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: 'from' | 'to',
    list: Station[]
  ) => {
    if (activeDropdown !== field) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx((i) => (i + 1) % Math.max(list.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx((i) => (i - 1 + Math.max(list.length, 1)) % Math.max(list.length, 1));
    } else if (e.key === 'Enter' && list[highlightIdx]) {
      e.preventDefault();
      selectStation(field, list[highlightIdx]);
    } else if (e.key === 'Escape') {
      setActiveDropdown(null);
    }
  };

  const handleSwap = () => {
    setSwapRotated((r) => !r);
    setFromCode(toCode);
    setToCode(fromCode);
    setFromQuery(toQuery);
    setToQuery(fromQuery);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCode || !toCode) {
      setError('Please select both origin and destination stations.');
      return;
    }
    if (fromCode === toCode) {
      setError('Origin and destination stations cannot be the same.');
      return;
    }
    if (!date) {
      setError('Please select a journey date.');
      return;
    }

    setError(null);
    setSubmitting(true);
    const params = new URLSearchParams({
      from: fromCode,
      to: toCode,
      date,
      classCode,
      quota,
      passengers: String(passengers),
      flexible: String(flexibleDate),
    });
    router.push(`/trains?${params.toString()}`);
  };

  return (
    <div
      ref={wrapperRef}
      className={`rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-xl shadow-2xl ${
        compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6 lg:p-7'
      }`}
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 px-4 py-2.5 text-xs font-medium text-[var(--error)]"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-end">
          {/* From & To with animated swap */}
          <div className="relative lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <label
                htmlFor="booking-from"
                className="block text-[11px] font-mono-tech uppercase tracking-wider text-[var(--text-secondary)] mb-1.5"
              >
                From Station
              </label>
              <input
                id="booking-from"
                type="text"
                autoComplete="off"
                value={fromQuery}
                onFocus={() => {
                  setActiveDropdown('from');
                  setHighlightIdx(0);
                }}
                onChange={(e) => {
                  setFromQuery(e.target.value);
                  setActiveDropdown('from');
                  setHighlightIdx(0);
                }}
                onKeyDown={(e) => handleKeyDown(e, 'from', fromResults)}
                placeholder="City or code (e.g. SBC)"
                className="w-full h-12 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
              {activeDropdown === 'from' && (
                <ul
                  role="listbox"
                  aria-label="Origin station suggestions"
                  className="absolute left-0 right-0 top-full z-40 mt-1.5 max-h-60 overflow-y-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1 shadow-2xl"
                >
                  {fromResults.length === 0 ? (
                    <li className="px-3 py-2 text-xs text-[var(--text-secondary)]">No matching stations</li>
                  ) : (
                    fromResults.map((s, idx) => (
                      <li key={s.code}>
                        <button
                          type="button"
                          onClick={() => selectStation('from', s)}
                          className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                            idx === highlightIdx
                              ? 'bg-[var(--accent-primary)] text-[var(--accent-on-primary)]'
                              : 'text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{s.city}</div>
                            <div className="text-[11px] opacity-75">{s.name}</div>
                          </div>
                          <span className="font-mono-tech font-semibold">{s.code}</span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap origin and destination stations"
              className="hidden sm:flex absolute left-1/2 top-[34px] -translate-x-1/2 z-10 h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--accent-primary)] shadow-md hover:border-[var(--accent-primary)] cursor-pointer"
            >
              <motion.span
                animate={{ rotate: swapRotated ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-center"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </motion.span>
            </button>

            <div className="relative">
              <label
                htmlFor="booking-to"
                className="block text-[11px] font-mono-tech uppercase tracking-wider text-[var(--text-secondary)] mb-1.5"
              >
                To Station
              </label>
              <input
                id="booking-to"
                type="text"
                autoComplete="off"
                value={toQuery}
                onFocus={() => {
                  setActiveDropdown('to');
                  setHighlightIdx(0);
                }}
                onChange={(e) => {
                  setToQuery(e.target.value);
                  setActiveDropdown('to');
                  setHighlightIdx(0);
                }}
                onKeyDown={(e) => handleKeyDown(e, 'to', toResults)}
                placeholder="City or code (e.g. MAO)"
                className="w-full h-12 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
              {activeDropdown === 'to' && (
                <ul
                  role="listbox"
                  aria-label="Destination station suggestions"
                  className="absolute left-0 right-0 top-full z-40 mt-1.5 max-h-60 overflow-y-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1 shadow-2xl"
                >
                  {toResults.length === 0 ? (
                    <li className="px-3 py-2 text-xs text-[var(--text-secondary)]">No matching stations</li>
                  ) : (
                    toResults.map((s, idx) => (
                      <li key={s.code}>
                        <button
                          type="button"
                          onClick={() => selectStation('to', s)}
                          className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                            idx === highlightIdx
                              ? 'bg-[var(--accent-primary)] text-[var(--accent-on-primary)]'
                              : 'text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{s.city}</div>
                            <div className="text-[11px] opacity-75">{s.name}</div>
                          </div>
                          <span className="font-mono-tech font-semibold">{s.code}</span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="lg:col-span-2">
            <label
              htmlFor="booking-date"
              className="block text-[11px] font-mono-tech uppercase tracking-wider text-[var(--text-secondary)] mb-1.5"
            >
              Journey Date
            </label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
              <input
                id="booking-date"
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-12 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] pl-9 pr-3 text-sm font-medium text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </div>
          </div>

          {/* Class */}
          <div className="lg:col-span-2">
            <label
              htmlFor="booking-class"
              className="block text-[11px] font-mono-tech uppercase tracking-wider text-[var(--text-secondary)] mb-1.5"
            >
              Travel Class
            </label>
            <select
              id="booking-class"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              className="w-full h-12 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-sm font-medium text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
            >
              <option value="ALL">All Classes</option>
              {(Object.keys(TRAVEL_CLASS_LABELS) as TravelClassCode[]).map((code) => (
                <option key={code} value={code}>
                  {TRAVEL_CLASS_LABELS[code]}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="lg:col-span-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] px-5 text-sm font-semibold text-[var(--accent-on-primary)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span>{submitting ? 'Searching...' : 'Search Trains'}</span>
            </button>
          </div>
        </div>

        {/* Secondary options row */}
        <div className="mt-4 pt-3.5 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-[var(--text-secondary)]">
              <Users className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
              <span>Passengers:</span>
              <select
                aria-label="Passenger count"
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="rounded border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-1 text-xs text-[var(--text-primary)]"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Traveller' : 'Travellers'}
                  </option>
                ))}
              </select>
            </label>

            <label className="inline-flex items-center gap-2 text-[var(--text-secondary)]">
              <span>Quota:</span>
              <select
                aria-label="Booking quota"
                value={quota}
                onChange={(e) => setQuota(e.target.value as BookingQuotaCode)}
                className="rounded border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-1 text-xs text-[var(--text-primary)]"
              >
                {(Object.keys(QUOTA_LABELS) as BookingQuotaCode[]).map((q) => (
                  <option key={q} value={q}>
                    {QUOTA_LABELS[q].name}
                  </option>
                ))}
              </select>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={flexibleDate}
                onChange={(e) => setFlexibleDate(e.target.checked)}
                className="h-4 w-4 rounded accent-[var(--accent-primary)]"
              />
              <span>Flexible with date (±3 days)</span>
            </label>
          </div>

          <div className="inline-flex items-center gap-1.5 font-mono-tech text-[11px] text-[var(--text-secondary)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent-lavender)]" />
            <span>Demo corridors: SBC→MAO · SBC→MYS · CSMT→NDLS · NDLS→BSB</span>
          </div>
        </div>
      </form>
    </div>
  );
}
