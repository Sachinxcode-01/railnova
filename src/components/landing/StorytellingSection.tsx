'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { AlertCircle, ArrowUpRight, CheckCircle2, Compass, Layers, Radio } from 'lucide-react';

interface StoryChapter {
  id: string;
  step: string;
  problemTitle: string;
  problemDetail: string;
  legacyMetric: string;
  solutionTitle: string;
  solutionDetail: string;
  railnovaMetric: string;
  highlights: string[];
  ctaLabel: string;
  ctaHref: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 'clarity',
    step: '01 · Search & Quota',
    problemTitle: 'Legacy booking hides availability behind fragmented forms.',
    problemDetail:
      'Travellers jump between five tabs to compare Vande Bharat, Rajdhani, Tatkal rules, and flexible dates — often discovering a waitlist only at checkout.',
    legacyMetric: '4–6 manual lookups per trip',
    solutionTitle: 'One unified search surface with instant quota intelligence.',
    solutionDetail:
      'RailNova evaluates General, Tatkal, Premium Tatkal, Ladies, and Senior Citizen quotas side-by-side with clear AVL, RAC, and WL guidance before you commit.',
    railnovaMetric: 'Real-time multi-class matrix',
    highlights: ['Live AVL / RAC / WL clarity', '12 iconic Indian rail hubs', 'Smart quota rule tooltips'],
    ctaLabel: 'Search Corridors',
    ctaHref: '/trains',
  },
  {
    id: 'berths',
    step: '02 · Coach & Berth',
    problemTitle: 'Blind seat requests lead to awkward overnight allocations.',
    problemDetail:
      'Generic dropdowns never show where Bay 1 Lower Berth or Side Lower sits relative to doors, accessible bays, or coach ends.',
    legacyMetric: 'Opaque text-only dropdowns',
    solutionTitle: 'Interactive bay-by-bay coach diagrams before booking.',
    solutionDetail:
      'Inspect every bay across 1A, 2A, 3A, Sleeper, and Chair Car layouts, preview accessible berths, and align your preference clearly with IRCTC allocation logic.',
    railnovaMetric: 'Visual bay & berth preview',
    highlights: ['3-tier & Chair Car diagrams', 'Accessible berth markers', 'Preference vs. allocation clarity'],
    ctaLabel: 'Try Coach Preview',
    ctaHref: '/trains?from=SBC&to=MAO',
  },
  {
    id: 'journey',
    step: '03 · Pass & Telemetry',
    problemTitle: 'Post-booking tracking fractures across SMS alerts and PDFs.',
    problemDetail:
      'Once booked, passengers scramble for static PNR portals, clunky PDF downloads, and unreliable station arrival estimates.',
    legacyMetric: 'Disconnected PNR & map tools',
    solutionTitle: 'Champagne boarding pass, QR verification, and live telemetry.',
    solutionDetail:
      'Every confirmed journey mints a printable QR boarding pass, links directly to 10-digit PNR lookup, and syncs simulated corridor speed and ETA on one canvas.',
    railnovaMetric: 'Unified pass + live corridor sync',
    highlights: ['Instant QR & PDF export', '10-digit PNR status lookup', 'Live IST corridor progress'],
    ctaLabel: 'Inspect Demo PNR',
    ctaHref: '/pnr?pnr=8429104521',
  },
];

export function StorytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualSelection, setManualSelection] = useState(false);

  const selectChapter = (idx: number) => {
    setManualSelection(true);
    setActiveIndex(idx);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 35%'],
  });

  const trackWidth = useTransform(scrollYProgress, [0, 1], ['8%', '100%']);

  const active = CHAPTERS[activeIndex];

  return (
    <section
      ref={containerRef}
      aria-labelledby="storytelling-heading"
      className="py-20 lg:py-28 bg-(--bg-primary) border-b border-(--border-subtle)"
    >
      <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8">
        {/* Header + Scroll Progress Rail */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
              Problem &amp; Solution · Scroll Narrative
            </span>
            <h2
              id="storytelling-heading"
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.06]"
            >
              Why rail booking felt broken — and how RailNova rebuilds it.
            </h2>
          </div>

          <div className="w-full lg:w-72 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono-tech text-(--text-secondary)">
              <span>STORY PROGRESS</span>
              <div className="flex items-center gap-2">
                {manualSelection && (
                  <button
                    type="button"
                    onClick={() => setManualSelection(false)}
                    className="text-(--accent-primary) underline-offset-2 hover:underline cursor-pointer"
                  >
                    Resume sync
                  </button>
                )}
                <span>0{activeIndex + 1} / 0{CHAPTERS.length}</span>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-(--border-subtle) overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-(--accent-primary)"
                style={prefersReduced ? { width: `${((activeIndex + 1) / CHAPTERS.length) * 100}%` } : { width: trackWidth }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Scroll-triggered narrative chapters */}
          <div className="lg:col-span-6 space-y-4">
            {CHAPTERS.map((chapter, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <motion.button
                  key={chapter.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => selectChapter(idx)}
                  onViewportEnter={() => {
                    if (!manualSelection) setActiveIndex(idx);
                  }}
                  viewport={{ amount: 0.6 }}
                  className={`w-full text-left rounded-2xl border p-6 transition-all cursor-pointer ${isSelected
                      ? 'border-(--accent-primary) bg-(--bg-surface) shadow-lg'
                      : 'border-(--border-subtle) bg-(--bg-surface)/50 opacity-75 hover:opacity-100'
                    }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="font-mono-tech text-xs uppercase tracking-wider text-(--accent-primary)">
                      {chapter.step}
                    </span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${isSelected ? 'bg-(--accent-primary)' : 'bg-(--border-subtle)'
                        }`}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 text-(--error) shrink-0 mt-1" />
                      <div>
                        <div className="text-[11px] font-mono-tech uppercase tracking-wider text-(--text-secondary)">
                          Legacy Friction
                        </div>
                        <h3 className="font-display text-lg font-bold text-(--text-primary)">
                          {chapter.problemTitle}
                        </h3>
                        <p className="mt-1 text-sm text-(--text-secondary) leading-relaxed">
                          {chapter.problemDetail}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-(--border-subtle) flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-(--success) shrink-0 mt-1" />
                      <div>
                        <div className="text-[11px] font-mono-tech uppercase tracking-wider text-(--accent-primary)">
                          RailNova Architecture
                        </div>
                        <p className="font-semibold text-sm text-(--text-primary)">
                          {chapter.solutionTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right: Sticky Solution Transformation Panel */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
                      <div className="rounded-2xl border border-[#2A2D35] bg-[#0C0D10] text-[#F8F9FC] p-6 sm:p-8 space-y-6 shadow-2xl">
                        <motion.div
                          key={active.id}
                          initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.32 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center justify-between gap-4 border-b border-[#2A2D35] pb-4">
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4FF3F] text-[#0C0D10]">
                                {activeIndex === 0 ? (
                                  <Compass className="h-4 w-4" />
                                ) : activeIndex === 1 ? (
                                  <Layers className="h-4 w-4" />
                                ) : (
                                  <Radio className="h-4 w-4" />
                                )}
                              </span>
                              <div>
                                <div className="text-[11px] font-mono-tech uppercase tracking-wider text-[#9296A3]">
                                  Chapter {active.step}
                                </div>
                                <div className="font-display text-base font-bold text-[#F8F9FC]">
                                  Friction → Clarity Shift
                                </div>
                              </div>
                            </div>
                            <span className="rounded-full border border-[#D4FF3F]/40 bg-[#D4FF3F]/10 px-3 py-1 font-mono-tech text-[11px] text-[#D4FF3F]">
                              SOLVED
                            </span>
                          </div>

                            {/* Before vs After Comparison */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="rounded-xl border border-[#2A2D35] bg-[#17191F] p-4 space-y-1.5">
                                <div className="text-[10px] font-mono-tech uppercase tracking-wider text-[#FB7185]">
                                  Before · Legacy Flow
                                </div>
                                <div className="font-display text-base font-semibold text-[#F8F9FC]">
                                  {active.legacyMetric}
                                </div>
                                <p className="text-xs text-[#A3A8B8]">
                                  High cognitive load, unclear berth visibility, fragmented status checks.
                                </p>
                              </div>

                                <div className="rounded-xl border border-[#D4FF3F]/40 bg-[#17191F] p-4 space-y-1.5">
                                  <div className="text-[10px] font-mono-tech uppercase tracking-wider text-[#D4FF3F]">
                                    After · RailNova
                                  </div>
                                  <div className="font-display text-base font-semibold text-[#F8F9FC]">
                                    {active.railnovaMetric}
                                  </div>
                                  <p className="text-xs text-[#A3A8B8]">
                                    Single-screen speed with live visual cues and instant boarding artifacts.
                                  </p>
                                </div>
                              </div>

                            <p className="text-sm text-[#D1D5E0] leading-relaxed">{active.solutionDetail}</p>

                            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              {active.highlights.map((item) => (
                                <li
                                  key={item}
                                  className="rounded-lg border border-[#2A2D35] bg-[#17191F]/90 px-3 py-2.5 text-xs font-medium text-[#F8F9FC] flex items-center gap-2"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4FF3F] shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>

                          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center gap-2" role="group" aria-label="Chapter selector">
                                {CHAPTERS.map((c, idx) => (
                                  <button
                                    key={c.id}
                                    type="button"
                                    aria-pressed={idx === activeIndex}
                                    onClick={() => selectChapter(idx)}
                                    aria-label={`View chapter ${idx + 1}: ${c.step}`}
                                    className={`h-2 rounded-full transition-all cursor-pointer ${idx === activeIndex ? 'w-7 bg-[#D4FF3F]' : 'w-2 bg-[#2A2D35] hover:bg-[#626672]'
                                      }`}
                                  />
                                ))}
                              </div>
                              <Link
                                href={active.ctaHref}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#D4FF3F] px-4 py-2.5 text-xs font-semibold text-[#0C0D10] hover:brightness-95 transition"
                              >
                                <span>{active.ctaLabel}</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                );
}
