'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Armchair, ArrowUpRight, CheckCircle2, FileCheck2, Train } from 'lucide-react';
import { generateCoachLayout, TRAINS } from '@/lib/railway-data';
import { TravelClassCode } from '@/lib/types';

type PreviewTab = 'coach' | 'fares' | 'pnr';

const PREVIEW_TABS: { id: PreviewTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'coach', label: 'Coach Selector', icon: Armchair },
  { id: 'fares', label: 'Corridor & Fares', icon: Train },
  { id: 'pnr', label: 'PNR Inspector', icon: FileCheck2 },
];

const PREVIEW_TRAINS = TRAINS.slice(0, 4);

export function ProductShowcaseSection() {
  const prefersReduced = useReducedMotion();
  const [tab, setTab] = useState<PreviewTab>('coach');
  const [coachClass, setCoachClass] = useState<TravelClassCode>('3A');
  const [selectedSeat, setSelectedSeat] = useState<string>('1');
  const [selectedTrainIdx, setSelectedTrainIdx] = useState(0);
  const tabRefs = useRef<Record<PreviewTab, HTMLButtonElement | null>>({
    coach: null,
    fares: null,
    pnr: null,
  });

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIdx = (currentIdx + 1) % PREVIEW_TABS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIdx = (currentIdx - 1 + PREVIEW_TABS.length) % PREVIEW_TABS.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = PREVIEW_TABS.length - 1;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      const nextTab = PREVIEW_TABS[nextIdx].id;
      setTab(nextTab);
      tabRefs.current[nextTab]?.focus();
    }
  };

  const previewBerths = useMemo(() => generateCoachLayout(coachClass).slice(0, 16), [coachClass]);
  const selectedTrain = PREVIEW_TRAINS[selectedTrainIdx];

  return (
    <section
      aria-labelledby="product-showcase-heading"
      className="py-20 lg:py-28 bg-(--bg-surface) border-b border-(--border-subtle)"
    >
      <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
              Product Showcase · Interactive Application Previews
            </span>
            <h2
              id="product-showcase-heading"
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight"
            >
              Test-drive the workspace live.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="RailNova interactive application previews"
            className="inline-flex flex-wrap gap-2 rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-1.5"
          >
              {
                PREVIEW_TABS.map((item, idx) => {
                  const Icon = item.icon;
                  const active = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      ref={(el) => {
                        tabRefs.current[item.id] = el;
                      }}
                      id={`showcase-tab-${item.id}`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls={`showcase-panel-${item.id}`}
                      tabIndex={active ? 0 : -1}
                      onClick={() => setTab(item.id)}
                      onKeyDown={(e) => handleTabKeyDown(e, idx)}
                      className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${active
                          ? 'bg-(--accent-primary) text-(--accent-on-primary)'
                          : 'text-(--text-secondary) hover:text-(--text-primary)'
                        }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })
              }
          </div>
        </div>

        {/* Interactive App Viewport Frame */}
        <div className="rounded-2xl border border-[#2A2D35] bg-[#0C0D10] text-[#F8F9FC] shadow-2xl overflow-hidden">
          {/* Window Chrome */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2D35] bg-[#17191F] px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FB7185]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
              <span className="ml-3 font-mono-tech text-xs text-[#9296A3]">
                railnova.app/{tab === 'coach' ? 'book/coach-preview' : tab === 'fares' ? 'trains' : 'pnr/8429104521'}
              </span>
            </div>
            <span className="font-mono-tech text-[11px] text-[#D4FF3F]">
              LIVE INTERACTIVE SANDBOX
            </span>
          </div>

            <div
              role="tabpanel"
              id={`showcase-panel-${tab}`}
              aria-labelledby={`showcase-tab-${tab}`}
              tabIndex={0}
              className="p-6 sm:p-8 focus:outline-none"
            >
              <AnimatePresence mode="wait">
                {tab === 'coach' && (
                  <motion.div
                    key="coach"
                    initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReduced ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
                  >
                    <div className="lg:col-span-5 space-y-4">
                      <span className="font-mono-tech text-xs text-[#D4FF3F] uppercase tracking-wider">
                        Interactive Coach Diagram
                      </span>
                      <h3 className="font-display text-2xl font-bold">
                        Tap any available berth in {coachClass}
                      </h3>
                      <p className="text-sm text-[#A3A8B8] leading-relaxed">
                        Switch between Third AC (3A) sleeping bays and Vande Bharat Executive Chair Car (EC) seating to preview availability states.
                      </p>
                        <div className="flex gap-2" role="group" aria-label="Travel class selector">
                          {(['3A', 'EC'] as TravelClassCode[]).map((cls) => (
                            <button
                              key={cls}
                              type="button"
                              aria-pressed={coachClass === cls}
                              onClick={() => {
                                setCoachClass(cls);
                                setSelectedSeat('1');
                              }}
                              className={`rounded-lg px-3.5 py-2 text-xs font-mono-tech font-semibold border cursor-pointer ${coachClass === cls
                                  ? 'bg-[#D4FF3F] text-[#0C0D10] border-[#D4FF3F]'
                                  : 'bg-[#17191F] text-[#F8F9FC] border-[#2A2D35]'
                                }`}
                            >
                              {cls === '3A' ? 'Third AC (3A)' : 'Executive Chair (EC)'}
                            </button>
                          ))}
                        </div>
                        <div className="rounded-xl border border-[#2A2D35] bg-[#17191F] p-4 font-mono-tech text-xs flex items-center justify-between">
                          <span className="text-[#A3A8B8]">Demo Seat Selected:</span>
                          <span className="text-[#D4FF3F] font-bold">
                            {coachClass} · Seat #{selectedSeat}
                          </span>
                        </div>
                      </div>

                      <div className="lg:col-span-7 rounded-xl border border-[#2A2D35] bg-[#17191F] p-5">
                          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5" role="group" aria-label="Demo coach berth selector">
                            {previewBerths.map((b) => {
                              const isOccupied = b.status === 'OCCUPIED';
                              const isSelected = selectedSeat === String(b.number) && !isOccupied;
                              return (
                                <button
                                  key={b.id}
                                  type="button"
                                  disabled={isOccupied}
                                  aria-pressed={isSelected}
                                  onClick={() => setSelectedSeat(String(b.number))}
                                  className={`rounded-lg border px-3 py-2.5 text-xs font-mono-tech flex items-center justify-between transition-all ${isOccupied
                                      ? 'border-[#2A2D35] bg-[#0C0D10] text-[#626672] cursor-not-allowed opacity-60'
                                      : isSelected
                                        ? 'border-[#D4FF3F] bg-[#D4FF3F] text-[#0C0D10] font-bold cursor-pointer'
                                        : 'border-[#D4FF3F]/40 bg-[#D4FF3F]/10 text-[#F8F9FC] hover:bg-[#D4FF3F]/25 cursor-pointer'
                                    }`}
                                >
                                  <span>#{b.number}</span>
                                  <span className="text-[10px]">{b.berthType}</span>
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-4 pt-3 border-t border-[#2A2D35] flex items-center justify-between text-xs text-[#9296A3]">
                            <span>Lime = Available · Dark = Occupied</span>
                            <Link href="/trains" className="text-[#D4FF3F] font-semibold inline-flex items-center gap-1">
                              <span>Full Coach Map</span>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
              )}

                      {tab === 'fares' && (
                        <motion.div
                          key="fares"
                          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={prefersReduced ? undefined : { opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                        >
                            <div className="lg:col-span-5 space-y-2.5" role="group" aria-label="Train corridor selector">
                              {PREVIEW_TRAINS.map((t, idx) => (
                                <button
                                  key={t.number}
                                  type="button"
                                  aria-pressed={selectedTrainIdx === idx}
                                  onClick={() => setSelectedTrainIdx(idx)}
                                  className={`w-full text-left rounded-xl border p-4 transition-colors cursor-pointer ${selectedTrainIdx === idx
                                      ? 'border-[#D4FF3F] bg-[#17191F]'
                                      : 'border-[#2A2D35] bg-[#17191F]/40 hover:bg-[#17191F]'
                                    }`}
                                >
                                  <div className="flex items-center justify-between font-mono-tech text-xs">
                                    <span className="text-[#D4FF3F]">{t.number} · {t.category}</span>
                                    <span className="text-[#9296A3]">{t.durationLabel}</span>
                                  </div>
                                  <div className="font-display font-bold text-base mt-1">{t.name}</div>
                                  <div className="text-xs text-[#A3A8B8] mt-1">
                                    {t.fromCode} ({t.departureTime}) → {t.toCode} ({t.arrivalTime})
                                  </div>
                                </button>
                              ))}
                            </div>

                            <div className="lg:col-span-7 rounded-xl border border-[#2A2D35] bg-[#17191F] p-6 flex flex-col justify-between gap-6">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <div className="font-mono-tech text-xs text-[#9296A3]">
                                    {selectedTrain.distanceKm} km · Avg {selectedTrain.avgSpeedKmph} km/h
                                  </div>
                                  <h3 className="font-display text-2xl font-bold mt-1">{selectedTrain.name}</h3>
                                </div>
                                <Link
                                  href={`/trains?from=${selectedTrain.fromCode}&to=${selectedTrain.toCode}`}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#D4FF3F] px-3.5 py-2 text-xs font-semibold text-[#0C0D10]"
                                >
                                  <span>Book Train</span>
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {selectedTrain.classes.map((cls) => (
                                  <div
                                    key={cls.classCode}
                                    className="rounded-xl border border-[#2A2D35] bg-[#0C0D10] p-4 flex items-center justify-between"
                                  >
                                    <div>
                                      <div className="font-mono-tech text-xs text-[#9296A3]">{cls.classCode}</div>
                                      <div className="font-semibold text-sm">{cls.className}</div>
                                      <div
                                        className={`font-mono-tech text-xs mt-1 ${cls.status === 'AVAILABLE' ? 'text-[#34D399]' : 'text-[#FBBF24]'
                                          }`}
                                      >
                                        {cls.statusText}
                                      </div>
                                    </div>
                                    <div className="font-mono-tech text-lg font-bold text-[#D4FF3F]">
                                      ₹{cls.fare}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                        </motion.div>
                      )}

                      {tab === 'pnr' && (
                        <motion.div
                          key="pnr"
                          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={prefersReduced ? undefined : { opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
                        >
                          <div className="lg:col-span-5 space-y-4">
                            <span className="font-mono-tech text-xs text-[#B8A7FF] uppercase tracking-wider">
                              10-Digit PNR Verification
                            </span>
                            <h3 className="font-display text-2xl font-bold">
                              Real-time coach &amp; berth status in one view.
                            </h3>
                            <p className="text-sm text-[#A3A8B8] leading-relaxed">
                              Every RailNova demonstration booking generates an inspectable PNR record with passenger status, chart preparation badge, and printable boarding pass.
                            </p>
                            <Link
                              href="/pnr?pnr=8429104521"
                              className="inline-flex items-center gap-2 rounded-lg bg-[#D4FF3F] px-4 py-2.5 text-xs font-semibold text-[#0C0D10]"
                            >
                              <span>Open Demo PNR 8429104521</span>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>

                          <div className="lg:col-span-7 rounded-xl border border-[#2A2D35] bg-[#17191F] p-6 space-y-5">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2D35] pb-4">
                              <div>
                                <div className="text-[11px] font-mono-tech text-[#9296A3]">DEMO PNR NUMBER</div>
                                <div className="font-mono-tech text-2xl font-bold text-[#D4FF3F]">8429104521</div>
                              </div>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#34D399]/15 border border-[#34D399]/40 px-3 py-1 text-xs font-mono-tech text-[#34D399]">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>CNF · CHART PREPARED</span>
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 font-mono-tech text-xs">
                              <div>
                                <div className="text-[#9296A3]">TRAIN</div>
                                <div className="text-sm font-semibold mt-1">17309 Goa Exp</div>
                              </div>
                              <div>
                                <div className="text-[#9296A3]">CORRIDOR</div>
                                <div className="text-sm font-semibold mt-1">SBC → MAO</div>
                              </div>
                              <div>
                                <div className="text-[#9296A3]">ALLOCATION</div>
                                <div className="text-sm font-semibold text-[#D4FF3F] mt-1">B2 / 24 (LB)</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
        </div>
          </div>
        </section>
        );
}
