'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, MapPin, Search, Ticket, TrainFront } from 'lucide-react';

interface TimelineStage {
  code: string;
  platform: string;
  title: string;
  subtitle: string;
  description: string;
  detailBadge: string;
  href: string;
  cta: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TIMELINE_STAGES: TimelineStage[] = [
  {
    code: 'STN-01',
    platform: 'PF 01',
    title: 'Search Corridor & Quota',
    subtitle: 'Origin → Destination in seconds',
    description:
      'Pick any two Indian hubs, toggle flexible ±2 day search, and filter by Vande Bharat, Rajdhani, Shatabdi, or Express classes.',
    detailBadge: '60+ Stations Indexed',
    href: '/trains',
    cta: 'Search Trains',
    icon: Search,
  },
  {
    code: 'STN-02',
    platform: 'PF 02',
    title: 'Inspect Coach & Berth Bay',
    subtitle: 'Visual seat map + preferences',
    description:
      'Preview Bay-by-Bay layouts, check accessible Lower Berths, and set official preference rules before filling passenger details.',
    detailBadge: '8 Travel Classes',
    href: '/trains?from=SBC&to=MAO',
    cta: 'View Coaches',
    icon: TrainFront,
  },
  {
    code: 'STN-03',
    platform: 'PF 03',
    title: 'Confirm & Print QR Pass',
    subtitle: 'Instant PNR + Champagne PDF',
    description:
      'Complete demo checkout to mint a 10-digit PNR, QR-encoded Champagne Ivory boarding pass, and downloadable jsPDF ticket.',
    detailBadge: '10-Digit Demo PNR',
    href: '/pnr?pnr=8429104521',
    cta: 'View Demo Ticket',
    icon: Ticket,
  },
  {
    code: 'STN-04',
    platform: 'PF 04',
    title: 'Track Corridor Telemetry',
    subtitle: 'Live IST schedule progression',
    description:
      'Follow your train along intermediate stops with halt durations, platform numbers, current speed, and ETA updates.',
    detailBadge: 'Simulated IST Sync',
    href: '/live-tracking',
    cta: 'Open Live Map',
    icon: MapPin,
  },
];

export function RailwayTimelineSection() {
  const prefersReduced = useReducedMotion();
  const [activeStage, setActiveStage] = useState(0);
  const [manualSelection, setManualSelection] = useState(false);

  const selectStage = (idx: number) => {
    setManualSelection(true);
    setActiveStage(idx);
  };

  const progressPercent = (activeStage / (TIMELINE_STAGES.length - 1)) * 100;
  const stage = TIMELINE_STAGES[activeStage];

  return (
    <section
      aria-labelledby="railway-timeline-heading"
      className="py-20 lg:py-28 bg-(--bg-primary) border-b border-(--border-subtle) overflow-hidden"
    >
      <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
              How It Works · Animated Railway Timeline
            </span>
            <h2
              id="railway-timeline-heading"
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight"
            >
              Four stops from search to platform.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {manualSelection && (
              <button
                type="button"
                onClick={() => setManualSelection(false)}
                className="rounded-lg px-3 py-1.5 font-mono-tech text-xs border border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary) hover:border-(--accent-primary) transition-colors cursor-pointer"
              >
                Resume scroll sync
              </button>
            )}
            {TIMELINE_STAGES.map((s, idx) => (
              <button
                key={s.code}
                type="button"
                aria-pressed={idx === activeStage}
                onClick={() => selectStage(idx)}
                className={`rounded-lg px-3 py-1.5 font-mono-tech text-xs border transition-colors cursor-pointer ${idx === activeStage
                  ? 'bg-(--accent-primary) text-(--accent-on-primary) border-(--accent-primary) font-semibold'
                  : 'bg-(--bg-surface) text-(--text-secondary) border-(--border-subtle) hover:text-(--text-primary)'
                  }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Animated Horizontal Railway Track (Desktop) */}
        <div className="relative pt-6 pb-2">
          <div className="hidden lg:block relative mb-10 px-12">
            {/* Sleeper rail base */}
            <div className="h-2 rounded-full bg-(--bg-surface) border border-(--border-subtle) relative overflow-hidden">
              <motion.div
                className="h-full bg-(--accent-primary)"
                initial={false}
                animate={{ width: `${progressPercent}%` }}
                transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 24 }}
              />
            </div>

            {/* Gliding Train Marker */}
            <motion.div
              className="absolute -top-3.5 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full border border-[#2A2D35] bg-[#0C0D10] px-3 py-1 text-[11px] font-mono-tech text-[#D4FF3F] shadow-lg"
              initial={false}
              animate={{ left: `calc(${progressPercent}% * 0.88 + 6%)` }}
              transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 24 }}
            >
              <TrainFront className="h-3.5 w-3.5" />
              <span>RN-EXP</span>
            </motion.div>
          </div>

          {/* 4 Station Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIMELINE_STAGES.map((item, idx) => {
              const Icon = item.icon;
              const passed = idx <= activeStage;
              const isCurrent = idx === activeStage;
              return (
                <motion.button
                  key={item.code}
                  type="button"
                  aria-pressed={isCurrent}
                  onClick={() => selectStage(idx)}
                  onViewportEnter={() => {
                    if (!manualSelection && idx > activeStage) setActiveStage(idx);
                  }}
                  viewport={{ amount: 0.5, once: true }}
                  whileHover={prefersReduced ? undefined : { y: -3 }}
                  className={`text-left rounded-2xl border p-6 transition-all cursor-pointer flex flex-col justify-between gap-5 ${isCurrent
                    ? 'border-(--accent-primary) bg-(--bg-surface) shadow-xl'
                    : passed
                      ? 'border-(--border-subtle) bg-(--bg-surface)/80'
                      : 'border-(--border-subtle) bg-(--bg-surface)/40 opacity-80 hover:opacity-100'
                    }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${isCurrent
                          ? 'bg-(--accent-primary) text-(--accent-on-primary) border-(--accent-primary)'
                          : 'bg-(--bg-primary) text-(--accent-primary) border-(--border-subtle)'
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="text-right font-mono-tech text-[11px] text-(--text-secondary)">
                        <div>{item.code}</div>
                        <div className={isCurrent ? 'text-(--accent-primary) font-semibold' : ''}>
                          {item.platform}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-bold text-(--text-primary)">{item.title}</h3>
                      <p className="text-xs font-mono-tech text-(--accent-primary) mt-0.5">{item.subtitle}</p>
                      <p className="mt-2.5 text-sm text-(--text-secondary) leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-(--border-subtle) flex items-center justify-between text-xs font-mono-tech">
                    <span className="inline-flex items-center gap-1 text-(--text-secondary)">
                      <CheckCircle2 className={`h-3.5 w-3.5 ${passed ? 'text-(--success)' : 'text-(--text-secondary)'}`} />
                      <span>{item.detailBadge}</span>
                    </span>
                    <span className="text-(--accent-primary)">{isCurrent ? 'ACTIVE' : 'SELECT'}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Active Station Action Strip */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.code}
              initial={prefersReduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="rounded-2xl border border-(--border-subtle) bg-(--bg-surface) px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-(--accent-primary) px-2.5 py-1 font-mono-tech text-xs font-bold text-(--accent-on-primary)">
            {stage.code}
          </span>
          <p className="text-sm text-(--text-primary)">
            <strong>{stage.title}:</strong>{' '}
            <span className="text-(--text-secondary)">{stage.subtitle}</span>
          </p>
        </div>
        <Link
          href={stage.href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--accent-primary) shrink-0"
        >
          <span>{stage.cta}</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </AnimatePresence>
        </div >
    </section >
  );
}
