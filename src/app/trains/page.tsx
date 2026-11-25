'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Clock,
  TrainFront,
  ArrowUpRight,
  RotateCcw,
} from 'lucide-react';
import { SmartBookingPanel } from '@/components/SmartBookingPanel';
import { BookingQuotaCode, Train, TrainCategory } from '@/lib/types';

function TrainsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const classCodeParam = searchParams.get('classCode') || 'ALL';
  const quotaParam = (searchParams.get('quota') || 'GN') as BookingQuotaCode;
  const passengersParam = Number(searchParams.get('passengers') || '1');

  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<TrainCategory[]>([]);
  const [departureWindow, setDepartureWindow] = useState<'ALL' | 'MORNING' | 'AFTERNOON' | 'NIGHT'>('ALL');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState(7000);
  const [sortBy, setSortBy] = useState<'DEPARTURE' | 'DURATION' | 'FARE'>('DEPARTURE');

  const [expandedTrain, setExpandedTrain] = useState<string | null>(null);
  const [selectedClassByTrain, setSelectedClassByTrain] = useState<Record<string, string>>({});

  const fetchTrains = async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (from) qs.set('from', from);
      if (to) qs.set('to', to);
      if (classCodeParam && classCodeParam !== 'ALL') qs.set('classCode', classCodeParam);
      if (quotaParam) qs.set('quota', quotaParam);

      const res = await fetch(`/api/trains?${qs.toString()}`);
      if (!res.ok) throw new Error('Unable to load trains');
      const data = await res.json();
      setTrains(data.trains || []);
    } catch {
      setError('Could not load railway schedules. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
    const id = setInterval(fetchTrains, 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, classCodeParam, quotaParam]);

  const filteredTrains = useMemo(() => {
    const list = trains.filter((t) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(t.category)) return false;

      const depHour = Number(t.departureTime.split(':')[0]);
      if (departureWindow === 'MORNING' && (depHour < 5 || depHour >= 12)) return false;
      if (departureWindow === 'AFTERNOON' && (depHour < 12 || depHour >= 18)) return false;
      if (departureWindow === 'NIGHT' && depHour >= 5 && depHour < 18) return false;

      if (onlyAvailable && !t.classes.some((c) => c.status === 'AVAILABLE')) return false;

      const minFare = Math.min(...t.classes.map((c) => c.fare));
      if (minFare > maxPrice) return false;

      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'DURATION') return a.durationMinutes - b.durationMinutes;
      if (sortBy === 'FARE') {
        return Math.min(...a.classes.map((c) => c.fare)) - Math.min(...b.classes.map((c) => c.fare));
      }
      return a.departureTime.localeCompare(b.departureTime);
    });
  }, [trains, selectedCategories, departureWindow, onlyAvailable, maxPrice, sortBy]);

  const toggleCategory = (cat: TrainCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleBookNow = (train: Train) => {
    const chosenClass =
      selectedClassByTrain[train.number] ||
      (classCodeParam !== 'ALL' && train.classes.some((c) => c.classCode === classCodeParam)
        ? classCodeParam
        : train.classes[0]?.classCode || '3A');

    const params = new URLSearchParams({
      trainNumber: train.number,
      from: from || train.fromCode,
      to: to || train.toCode,
      date,
      classCode: chosenClass,
      quota: train.applicableQuotas.includes(quotaParam) ? quotaParam : 'GN',
      passengers: String(passengersParam),
    });
    router.push(`/book?${params.toString()}`);
  };

  return (
    <div className="pt-24 pb-20 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <div className="text-xs font-mono-tech uppercase tracking-widest text-[var(--accent-primary)]">
          Demonstration Schedule & Fares
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
          {from && to ? `${from} → ${to} Trains` : 'Explore All Rail Corridors'}
        </h1>
      </div>

      <SmartBookingPanel
        key={`${from}-${to}`}
        initialFrom={from || (to ? '' : 'SBC')}
        initialTo={to || (from ? '' : 'MAO')}
        initialDate={date}
        initialClass={classCodeParam}
        initialQuota={quotaParam}
        initialPassengers={passengersParam}
        compact
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-display font-bold text-sm">
              <SlidersHorizontal className="h-4 w-4 text-[var(--accent-primary)]" />
              <span>Filters</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategories([]);
                setDepartureWindow('ALL');
                setOnlyAvailable(false);
                setMaxPrice(7000);
              }}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono-tech uppercase tracking-wider text-[var(--text-secondary)]">
              Train Type
            </div>
            {(['Vande Bharat', 'Rajdhani', 'Shatabdi', 'Superfast', 'Mail/Express'] as TrainCategory[]).map(
              (cat) => (
                <label key={cat} className="flex items-center gap-2.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="h-4 w-4 rounded accent-[var(--accent-primary)]"
                  />
                  <span>{cat}</span>
                </label>
              )
            )}
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono-tech uppercase tracking-wider text-[var(--text-secondary)]">
              Departure Window
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'ALL', label: 'Any Time' },
                  { id: 'MORNING', label: '05:00–12:00' },
                  { id: 'AFTERNOON', label: '12:00–18:00' },
                  { id: 'NIGHT', label: '18:00–05:00' },
                ] as const
              ).map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setDepartureWindow(w.id)}
                  className={`rounded-md border px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors ${departureWindow === w.id
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--accent-on-primary)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                    }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono-tech text-[var(--text-secondary)]">
              <span>Max Base Fare</span>
              <span className="text-[var(--text-primary)]">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min={300}
              max={7000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Maximum base fare"
              className="w-full accent-[var(--accent-primary)]"
            />
          </div>

          <label className="flex items-center gap-2.5 text-sm cursor-pointer pt-2 border-t border-[var(--border-subtle)]">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="h-4 w-4 rounded accent-[var(--accent-primary)]"
            />
            <span>Available seats only</span>
          </label>
        </aside>

        {/* Results Column */}
        <div className="lg:col-span-9 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-[var(--text-secondary)] font-mono-tech">
              Showing <strong className="text-[var(--text-primary)]">{filteredTrains.length}</strong> trains · {date}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--text-secondary)]">Sort by:</span>
              <select
                aria-label="Sort trains"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'DEPARTURE' | 'DURATION' | 'FARE')}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium"
              >
                <option value="DEPARTURE">Departure Time</option>
                <option value="DURATION">Fastest Duration</option>
                <option value="FARE">Lowest Fare</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className="h-44 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-[var(--error)]/40 bg-[var(--bg-surface)] p-8 text-center space-y-4">
              <p className="text-sm text-[var(--error)]">{error}</p>
              <button
                type="button"
                onClick={fetchTrains}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--accent-on-primary)] cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retry Search</span>
              </button>
            </div>
          ) : filteredTrains.length === 0 ? (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-10 text-center space-y-4">
              <TrainFront className="h-8 w-8 mx-auto text-[var(--text-secondary)]" />
              <h2 className="font-display text-xl font-bold">No matching trains found</h2>
              <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                Try clearing filters or searching one of our active demonstration corridors such as SBC → MAO, SBC → MYS, CSMT → NDLS, or NDLS → BSB.
              </p>
              <button
                type="button"
                onClick={() => router.push('/trains')}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--accent-on-primary)] cursor-pointer"
              >
                Show All Demo Trains
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrains.map((train) => {
                const activeClass =
                  selectedClassByTrain[train.number] || train.classes[0]?.classCode;
                const isExpanded = expandedTrain === train.number;

                return (
                  <motion.article
                    key={train.number}
                    layout
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5 hover:border-[var(--accent-primary)]/60 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono-tech text-xs px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--accent-primary)]">
                            {train.number}
                          </span>
                          <span className="text-xs font-mono-tech text-[var(--accent-lavender)]">
                            {train.category}
                          </span>
                        </div>
                        <h2 className="font-display text-xl font-bold">{train.name}</h2>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-[var(--text-secondary)]">
                        {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((d) => (
                          <span
                            key={d}
                            className={`px-1.5 py-0.5 rounded ${train.runningDays.includes(d)
                                ? 'text-[var(--text-primary)] bg-[var(--bg-primary)]'
                                : 'opacity-30'
                              }`}
                          >
                            {d[0]}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Horizontal Railway Timeline */}
                    <div className="grid grid-cols-12 items-center gap-3 py-3 border-y border-[var(--border-subtle)]">
                      <div className="col-span-4 sm:col-span-3">
                        <div className="font-mono-tech text-2xl font-bold">{train.departureTime}</div>
                        <div className="text-xs font-mono-tech text-[var(--text-secondary)]">{train.fromCode}</div>
                      </div>

                      <div className="col-span-4 sm:col-span-6 flex flex-col items-center gap-1">
                        <span className="inline-flex items-center gap-1 text-xs font-mono-tech text-[var(--text-secondary)]">
                          <Clock className="h-3 w-3" />
                          <span>{train.durationLabel}</span>
                        </span>
                        <div className="w-full h-[2px] bg-[var(--border-subtle)] relative">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[var(--text-primary)]" />
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[var(--accent-primary)]" />
                        </div>
                        <span className="text-[11px] font-mono-tech text-[var(--text-secondary)]">
                          {train.distanceKm} km · {train.stops.length} stops
                        </span>
                      </div>

                      <div className="col-span-4 sm:col-span-3 text-right">
                        <div className="font-mono-tech text-2xl font-bold">{train.arrivalTime}</div>
                        <div className="text-xs font-mono-tech text-[var(--text-secondary)]">{train.toCode}</div>
                      </div>
                    </div>

                    {/* Interactive Class Selector */}
                    <div className="flex flex-wrap gap-2.5">
                      {train.classes.map((c) => {
                        const isSelected = activeClass === c.classCode;
                        const statusColor =
                          c.status === 'AVAILABLE'
                            ? 'text-[var(--success)]'
                            : c.status === 'RAC'
                              ? 'text-[var(--warning)]'
                              : 'text-[var(--error)]';

                        return (
                          <button
                            key={c.classCode}
                            type="button"
                            onClick={() =>
                              setSelectedClassByTrain((prev) => ({
                                ...prev,
                                [train.number]: c.classCode,
                              }))
                            }
                            className={`rounded-lg border px-3.5 py-2.5 text-left transition-all cursor-pointer min-w-[125px] ${isSelected
                                ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                                : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--text-secondary)]'
                              }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-mono-tech text-xs font-bold">{c.classCode}</span>
                              <span className="font-mono-tech text-xs font-semibold">₹{c.fare}</span>
                            </div>
                            <div className={`mt-1 text-[11px] font-mono-tech font-semibold ${statusColor}`}>
                              {c.statusText}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setExpandedTrain(isExpanded ? null : train.number)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        <span>{isExpanded ? 'Hide Route & Amenities' : 'View Route & Amenities'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBookNow(train)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-on-primary)] transition-transform hover:-translate-y-0.5 cursor-pointer"
                      >
                        <span>Book Now ({activeClass})</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pt-4 border-t border-[var(--border-subtle)] space-y-3"
                        >
                          <div className="flex flex-wrap gap-4 text-xs text-[var(--text-secondary)] font-mono-tech">
                            <span>Avg Speed: {train.avgSpeedKmph} km/h</span>
                            <span>Pantry: {train.pantry ? 'Available' : 'E-Catering'}</span>
                            <span>Quotas: {train.applicableQuotas.join(', ')}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                            {train.stops.map((st) => (
                              <div
                                key={st.stationCode}
                                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-2.5 text-xs"
                              >
                                <div className="font-mono-tech font-bold text-[var(--accent-primary)]">
                                  {st.stationCode} · PF {st.platform}
                                </div>
                                <div className="font-medium truncate">{st.city}</div>
                                <div className="font-mono-tech text-[11px] text-[var(--text-secondary)] mt-0.5">
                                  Arr: {st.arrival} · Dep: {st.departure}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrainsPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-28 pb-20 mx-auto max-w-[1360px] px-4 text-sm font-mono-tech text-[var(--text-secondary)]">
          Loading railway schedules...
        </div>
      }
    >
      <TrainsContent />
    </Suspense>
  );
}
