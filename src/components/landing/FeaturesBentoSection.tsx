'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Armchair,
  ArrowUpRight,
  Globe2,
  QrCode,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { QUOTA_LABELS } from '@/lib/railway-data';
import { BookingQuotaCode } from '@/lib/types';

const BERTH_DEMO = [
  { code: 'LB', label: 'Lower Berth', note: 'Step-free bay access & senior priority' },
  { code: 'SL', label: 'Side Lower', note: 'Panoramic window view + single-seat comfort' },
  { code: 'WS', label: 'Window Seat', note: 'Vande Bharat & Shatabdi Executive / Chair Car' },
  { code: 'UB', label: 'Upper Berth', note: 'Quiet elevated privacy for overnight runs' },
];

const AI_LANG_PREVIEWS: Record<'en' | 'hi' | 'kn', { label: string; sample: string }> = {
  en: {
    label: 'English',
    sample: '“20607 Vande Bharat departs SBC at 10:25 and reaches Mysuru in 2 hours.”',
  },
  hi: {
    label: 'हिन्दी',
    sample: '“20607 वंदे भारत सुबह 10:25 पर बेंगलुरु से चलकर 2 घंटे में मैसूर पहुँचती है।”',
  },
  kn: {
    label: 'ಕನ್ನಡ',
    sample: '“20607 ವಂದೇ ಭಾರತ್ ಬೆಳಿಗ್ಗೆ 10:25 ಕ್ಕೆ ಬೆಂಗಳೂರಿನಿಂದ ಹೊರಟು ಮೈಸೂರು ತಲುಪುತ್ತದೆ.”',
  },
};

const QUOTA_MULTIPLIERS: Record<BookingQuotaCode, string> = {
  GN: 'Base Fare · Standard',
  TQ: '+30% Tatkal Surcharge',
  PT: 'Dynamic Surge Tier',
  LD: 'Base Fare · Ladies Bay',
  SS: 'Lower Berth Priority',
};

export function FeaturesBentoSection() {
  const prefersReduced = useReducedMotion();
  const [selectedBerth, setSelectedBerth] = useState(0);
  const [selectedQuota, setSelectedQuota] = useState<BookingQuotaCode>('GN');
  const [aiLang, setAiLang] = useState<'en' | 'hi' | 'kn'>('en');

  return (
    <section
      aria-labelledby="bento-features-heading"
      className="py-20 lg:py-28 bg-(--bg-surface) border-b border-(--border-subtle)"
    >
      <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
              Platform Features · Interactive Bento
            </span>
            <h2
              id="bento-features-heading"
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight"
            >
              Every stage of rail travel, engineered.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-(--text-secondary)">
            Click any interactive control inside the grid below to preview RailNova’s live booking modules.
          </p>
        </div>

        {/* 12-Column Asymmetric Interactive Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Tile 1: Coach & Berth Engine (7 cols) */}
          <motion.div
            whileHover={prefersReduced ? undefined : { y: -2 }}
            className="md:col-span-7 rounded-2xl border border-(--border-subtle) bg-(--bg-primary) p-6 sm:p-7 flex flex-col justify-between gap-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-(--bg-surface) border border-(--border-subtle) px-2.5 py-1 text-[11px] font-mono-tech text-(--accent-primary)">
                  <Armchair className="h-3.5 w-3.5" />
                  <span>INTERACTIVE COACH ENGINE</span>
                </span>
                <h3 className="font-display text-2xl font-bold">Visual Berth &amp; Seat Selection</h3>
                <p className="text-sm text-(--text-secondary) max-w-xl">
                  Inspect Lower, Middle, Upper, Side-Lower, and Window berths across 8 Indian railway classes with accessible bay markers.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {BERTH_DEMO.map((b, i) => (
                  <button
                    key={b.code}
                    type="button"
                    onClick={() => setSelectedBerth(i)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-mono-tech font-semibold transition-colors cursor-pointer border ${
                      selectedBerth === i
                        ? 'bg-(--accent-primary) text-(--accent-on-primary) border-(--accent-primary)'
                        : 'bg-(--bg-primary) text-(--text-primary) border-(--border-subtle) hover:border-(--accent-primary)'
                    }`}
                  >
                    {b.code} · {b.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-(--border-subtle) text-xs">
                <span className="text-(--text-secondary)">{BERTH_DEMO[selectedBerth].note}</span>
                <Link
                  href="/trains"
                  className="inline-flex items-center gap-1 font-semibold text-(--accent-primary) shrink-0"
                >
                  <span>Try Coach Map</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Tile 2: Quota & Fare Switcher (5 cols) */}
          <motion.div
            whileHover={prefersReduced ? undefined : { y: -2 }}
            className="md:col-span-5 rounded-2xl border border-(--border-subtle) bg-(--bg-primary) p-6 sm:p-7 flex flex-col justify-between gap-5"
          >
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-(--bg-surface) border border-(--border-subtle) px-2.5 py-1 text-[11px] font-mono-tech text-(--accent-primary)">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>QUOTA INTELLIGENCE</span>
              </span>
              <h3 className="font-display text-2xl font-bold">All 5 Official Quotas</h3>
              <p className="text-sm text-(--text-secondary)">
                Switch quotas dynamically before picking your train.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {(['GN', 'TQ', 'PT', 'LD', 'SS'] as BookingQuotaCode[]).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setSelectedQuota(q)}
                    className={`rounded-md px-2.5 py-1.5 font-mono-tech text-xs font-semibold border transition-colors cursor-pointer ${
                      selectedQuota === q
                        ? 'bg-(--accent-primary) text-(--accent-on-primary) border-(--accent-primary)'
                        : 'bg-(--bg-surface) text-(--text-secondary) border-(--border-subtle) hover:text-(--text-primary)'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-(--text-primary)">{QUOTA_LABELS[selectedQuota].name}</span>
                  <span className="font-mono-tech text-(--accent-primary)">{QUOTA_MULTIPLIERS[selectedQuota]}</span>
                </div>
                <p className="text-xs text-(--text-secondary)">{QUOTA_LABELS[selectedQuota].description}</p>
              </div>
            </div>
          </motion.div>

          {/* Tile 3: Live Telemetry (4 cols) */}
          <motion.div
            whileHover={prefersReduced ? undefined : { y: -2 }}
            className="md:col-span-4 rounded-2xl border border-[#2A2D35] bg-[#0C0D10] text-[#F8F9FC] p-6 flex flex-col justify-between gap-5"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Radio className="h-5 w-5 text-[#D4FF3F]" />
                <span className="inline-flex items-center gap-1.5 font-mono-tech text-[11px] text-[#34D399]">
                  <span className="h-2 w-2 rounded-full bg-[#34D399] animate-pulse" />
                  <span>IST SYNC</span>
                </span>
              </div>
              <h3 className="font-display text-xl font-bold">Live Corridor Telemetry</h3>
              <p className="text-sm text-[#A3A8B8]">
                Track simulated movement, intermediate halts, platform numbers, and average speeds across active trains.
              </p>
            </div>
            <div className="rounded-xl border border-[#2A2D35] bg-[#17191F] p-3.5 flex items-center justify-between font-mono-tech text-xs">
              <div>
                <div className="text-[#9296A3] text-[10px]">20607 VANDE BHARAT</div>
                <div className="text-[#F8F9FC] font-semibold">SBC → MYS · 76 km/h</div>
              </div>
              <Link href="/live-tracking" className="text-[#D4FF3F] inline-flex items-center gap-1 font-semibold">
                <span>Track</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Tile 4: Trilingual Nova AI (4 cols) */}
          <motion.div
            whileHover={prefersReduced ? undefined : { y: -2 }}
            className="md:col-span-4 rounded-2xl border border-(--border-subtle) bg-(--bg-primary) p-6 flex flex-col justify-between gap-5"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Globe2 className="h-5 w-5 text-(--accent-primary)" />
                <div className="flex gap-1">
                  {(['en', 'hi', 'kn'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setAiLang(lang)}
                      className={`rounded px-2 py-0.5 font-mono-tech text-[11px] uppercase border cursor-pointer ${
                        aiLang === lang
                          ? 'bg-(--accent-primary) text-(--accent-on-primary) border-(--accent-primary)'
                          : 'border-(--border-subtle) text-(--text-secondary)'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <h3 className="font-display text-xl font-bold">Trilingual Nova AI</h3>
              <p className="text-sm text-(--text-secondary)">
                Query trains, RAC rules, and class trade-offs in English, Hindi, or Kannada.
              </p>
            </div>
            <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-3.5 text-xs text-(--text-primary) leading-relaxed">
              <span className="font-mono-tech text-[10px] uppercase text-(--accent-primary) block mb-1">
                {AI_LANG_PREVIEWS[aiLang].label} Sample
              </span>
              {AI_LANG_PREVIEWS[aiLang].sample}
            </div>
          </motion.div>

          {/* Tile 5: Champagne Boarding Pass & PNR (4 cols) */}
          <motion.div
            whileHover={prefersReduced ? undefined : { y: -2 }}
            className="md:col-span-4 rounded-2xl border border-[#E4E1D9] bg-[#F5F2EA] text-[#15171B] p-6 flex flex-col justify-between gap-5"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <QrCode className="h-5 w-5 text-[#466800]" />
                <span className="inline-flex items-center gap-1 font-mono-tech text-[11px] text-[#466800]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>QR + PDF</span>
                </span>
              </div>
              <h3 className="font-display text-xl font-bold">Champagne Boarding Pass</h3>
              <p className="text-sm text-[#4F5360]">
                Instant demonstration QR pass with jsPDF export, print stylesheet, and 10-digit PNR verification.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#E4E1D9]">
              <span className="font-mono-tech text-xs font-semibold text-[#15171B]">PNR: 8429104521</span>
              <Link
                href="/pnr?pnr=8429104521"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#466800]"
              >
                <span>Open Pass</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
