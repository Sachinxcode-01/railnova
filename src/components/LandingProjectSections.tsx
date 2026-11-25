'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Armchair,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  Cpu,
  ExternalLink,
  FileText,
  GitBranch,
  HelpCircle,
  KeyRound,
  Layers,
  Lock,
  PhoneCall,
  Radio,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrainFront,
  Users,
} from 'lucide-react';
import {
  DESTINATIONS,
  QUOTA_LABELS,
  STATIONS,
  TRAINS,
  TRAVEL_CLASS_LABELS,
} from '@/lib/railway-data';
import { RAILNOVA_CONTACT } from '@/lib/contact';
import { BookingQuotaCode, TravelClassCode } from '@/lib/types';

const TRAIN_CATEGORIES = Array.from(new Set(TRAINS.map((t) => t.category)));
const TRAVEL_CLASSES = Object.entries(TRAVEL_CLASS_LABELS) as [TravelClassCode, string][];
const BOOKING_QUOTAS = Object.entries(QUOTA_LABELS) as [
  BookingQuotaCode,
  { name: string; description: string },
][];

const CLASS_DESCRIPTIONS: Record<TravelClassCode, string> = {
  '1A': 'Lockable 2- or 4-berth private AC cabins with bedding and attendant service on Rajdhani and overnight Express trains.',
  '2A': 'Two-tier air-conditioned sleeper bays (4 main + 2 side berths) with privacy curtains and reading lamps.',
  '3A': 'Three-tier air-conditioned sleeper coaches balancing long-distance comfort with economical fares.',
  '3E': 'Modern high-capacity AC 3-tier economy coaches with individual AC vents and USB charging points.',
  SL: 'Non-AC three-tier sleeper coaches suited for budget overnight and cross-country rail journeys.',
  CC: 'Air-conditioned 3+2 reclining chair cars built for daytime Shatabdi and Vande Bharat corridors.',
  EC: '2+2 wide-recline executive seating with rotatable chairs on flagship Vande Bharat and Shatabdi trains.',
  '2S': 'Reserved non-AC daytime seating for short intercity and heritage mountain railway sectors.',
};

const PROBLEMS_SOLVED = [
  {
    title: 'Fragmented Railway Portals',
    detail:
      'Travellers typically switch across separate sites for timetable lookup, coach diagrams, PNR checks, and live train status. RailNova brings every step into one continuous workspace.',
  },
  {
    title: 'Opaque Berth & Coach Layouts',
    detail:
      'Booking without seeing bay arrangements leads to guesswork around Lower, Middle, Upper, Side-Lower, and accessible berths. Interactive coach maps make seat selection spatial and clear.',
  },
  {
    title: 'Cluttered Tables & Low Accessibility',
    detail:
      'Dense legacy tables obscure critical departure times and fares. RailNova pairs high-contrast dark and light themes with tabular monospace PNRs, keyboard navigation, and reduced-motion compliance.',
  },
  {
    title: 'Disconnected Post-Booking Tools',
    detail:
      'From instant QR-verified PDF boarding passes to self-service cancellation refunds and multilingual AI guidance, post-booking management lives directly inside the traveller dashboard.',
  },
];

const BOOKING_STEPS = [
  {
    step: '01',
    title: 'Search & Filter Corridors',
    description:
      'Pick origin and destination across 63 Indian stations, choose a journey date, class, and quota, and compare schedules across 35 curated trains.',
    href: '/trains',
    cta: 'Search Trains',
  },
  {
    step: '02',
    title: 'Inspect Coach & Berths',
    description:
      'Open the interactive coach diagram to review bay positions (LB, MB, UB, SL, SU, WS), check accessible berths, and assign passenger preferences.',
    href: '/book?train=20607&class=CC',
    cta: 'Preview Coach Layout',
  },
  {
    step: '03',
    title: 'Review Fare & Checkout',
    description:
      'Inspect transparent base fares, quota multipliers (Tatkal 1.25×, Premium Tatkal 1.45×), concession discounts, 5% AC GST, and simulated UPI/Card checkout.',
    href: '/trains?from=SBC&to=MAO',
    cta: 'Check Sample Fares',
  },
  {
    step: '04',
    title: 'Download QR Ticket & Track',
    description:
      'Receive a 10-digit demonstration PNR, scannable QR boarding pass, one-click PDF export, live corridor map telemetry, and cancellation refund handling.',
    href: '/dashboard',
    cta: 'Open My Journeys',
  },
];

const PLATFORM_PILLARS = [
  {
    icon: Compass,
    accent: 'text-(--accent-primary)',
    title: 'Train Search & Discovery',
    description:
      'Filter 35 corridors across Vande Bharat, Rajdhani, Shatabdi, Superfast, and Mail/Express categories with running days, pantry indicators, bio-vacuum status, and 12 curated destination guides.',
    href: '/discover',
    cta: 'Explore 12 Destinations',
  },
  {
    icon: Armchair,
    accent: 'text-(--accent-lavender)',
    title: 'Interactive Coach Visualisation',
    description:
      'Visualise bay-by-bay berth availability (Available, Occupied, RAC, Preferred) across AC cabins, Sleeper coaches, and Chair Cars, with explicit guidance separating demo seat picks from official berth allocation.',
    href: '/book?train=12951&class=2A',
    cta: 'Inspect Sleeper Bays',
  },
  {
    icon: Ticket,
    accent: 'text-(--accent-primary)',
    title: 'Digital Railway Tickets',
    description:
      'Every confirmed or RAC demonstration booking generates a perforated Champagne Boarding Pass with an embedded QR payload, client-side PDF export via jsPDF, and print-ready ticket sheets.',
    href: '/pnr?pnr=8429104521',
    cta: 'View Sample Ticket',
  },
  {
    icon: Radio,
    accent: 'text-(--accent-lavender)',
    title: 'Live Tracking & Journey Management',
    description:
      'Monitor simulated IST schedule progression, platform halts, and average speed on interactive MapLibre GL maps, while managing saved passengers, favourites, and cancellations from your dashboard.',
    href: '/live-tracking',
    cta: 'Open Corridor Telemetry',
  },
  {
    icon: Sparkles,
    accent: 'text-(--accent-primary)',
    title: 'Nova AI Travel Assistance',
    description:
      'Ask the built-in Nova AI drawer in English, हिन्दी, or ಕನ್ನಡ for route suggestions, class comparisons, and RAC/waitlist rules—powered deterministically out of the box or via OpenRouter / Gemini.',
    href: '/trains',
    cta: 'Ask Nova AI (Bottom Right)',
  },
  {
    icon: Users,
    accent: 'text-(--accent-lavender)',
    title: 'Quotas, Concessions & Multi-Passenger',
    description:
      'Book up to 6 passengers per PNR with server-side fare computation supporting General, Tatkal, Premium Tatkal, Ladies, and Senior Citizen quotas plus Senior Citizen (40%), Student (25%), and Divyangjan (50%) demo concessions.',
    href: '/trains',
    cta: 'Plan Group Journey',
  },
];

const SECURITY_CONTROLS = [
  {
    title: 'Cryptographic Auth & Sessions',
    detail:
      'Passwords are salted and hashed with Node crypto scrypt and verified via timingSafeEqual. Sessions use HMAC-SHA256 signed HttpOnly railnova_session cookies (7-day TTL).',
  },
  {
    title: 'Schema Validation & Rate Limits',
    detail:
      'API route handlers validate payloads with Zod schemas, enforce IP-scoped sliding rate limits, and guard bookings with idempotency keys to prevent duplicate submissions.',
  },
  {
    title: 'GDPR / DPDPA Consent & Erasure',
    detail:
      'Optional analytics are gated behind the Cookie Banner consent state. Signed-in travellers can export their JSON data or erase their account directly from the dashboard.',
  },
  {
    title: 'Zero Real Payment Card Storage',
    detail:
      'Checkout flows run in demonstration simulation mode (UPI, Card, NetBanking, Wallet) with no real card numbers, CVVs, UPI PINs, or government IDs collected or stored.',
  },
];

const TECH_STACK = [
  { layer: 'Framework', value: 'Next.js 16 (App Router), React 19, TypeScript 6 (strict)' },
  { layer: 'Styling & Motion', value: 'Tailwind CSS v4, CSS Theme Tokens, GSAP, Framer Motion' },
  { layer: 'Maps & Ticketing', value: 'MapLibre GL corridor maps, qrcode, jsPDF boarding pass export' },
  { layer: 'Validation & Auth', value: 'Zod schemas, scrypt + HMAC-SHA256 cookies, rate-limit guard' },
  { layer: 'Persistence', value: 'Queued local JSON store (data/railnova-db.json) with /tmp Vercel fallback' },
  { layer: 'Optional Integrations', value: 'RailKit live feeds, PostgreSQL / Supabase, Razorpay Test Mode, Gemini / OpenRouter' },
];

const ROADMAP_ITEMS = [
  {
    phase: 'Implemented · v1.0 Demo',
    status: 'Available Now',
    tone: 'text-(--success)',
    items: [
      '63-station & 35-corridor search with distance-based INR fares and 5 quotas',
      'Interactive coach bay diagram (1A, 2A, 3A, 3E, SL, CC, EC, 2S)',
      '10-digit PNR inquiry, QR + PDF boarding pass, and 85% base-fare refund cancellations',
      'Simulated IST MapLibre GL corridor tracking, Nova AI (EN/HI/KN), and Admin Console',
    ],
  },
  {
    phase: 'Optional · Live Provider Hooks',
    status: 'Configurable via Env',
    tone: 'text-(--accent-primary)',
    items: [
      'Live Indian Railways search adapter via RAILKIT_API_KEY with automatic local fallback',
      'LLM-enhanced Nova AI replies via GEMINI_API_KEY or OPENROUTER_API_KEY',
      'Razorpay Test Mode checkout & Google Analytics 4 gated by cookie consent',
    ],
  },
  {
    phase: 'Planned · Future Milestones',
    status: 'Roadmap',
    tone: 'text-(--accent-lavender)',
    items: [
      'Full PostgreSQL / Supabase persistence adapter replacing local JSON storage in multi-instance deployments',
      'Multi-leg connecting train itinerary planner with minimum transfer buffer checks',
      'Automated chart-preparation simulation notifications and printable itinerary calendars',
    ],
  },
];

const REPO_DOCS = [
  { name: 'README.md', role: 'Setup guide, environment variables, demo credentials & API table' },
  { name: 'docs/PRD.md', role: 'Product requirements, personas, functional & security specifications' },
  { name: 'docs/design.md', role: 'Dark/light color tokens, typography scale & motion guidelines' },
  { name: 'docs/CLAUDE.md', role: 'Repository map, coding conventions & verification gates' },
  { name: 'docs/ULTRA-PLAN-MODE.md', role: 'Deep reconnaissance & edge-case audit engineering workflow' },
];

const FAQS = [
  {
    q: 'Are tickets, PNRs, and payments generated on RailNova valid for real IRCTC travel?',
    a: 'No. RailNova is a demonstration platform. All schedules, seat counts, fares, 10-digit PNRs (such as 8429104521 and 6193048271), live IST telemetry, and payment outcomes are simulated locally for demonstration and cannot be used for official Indian Railways boarding.',
  },
  {
    q: 'How does selecting a seat in the Interactive Coach Visualisation work?',
    a: 'Clicking an available berth in the coach bay diagram records a demonstration seat preference for your pass. In real Indian Railways operations, berth selection is treated as a preference and final coach/berth numbers are allocated during charting.',
  },
  {
    q: 'What is the difference between Confirmed (CNF), RAC, and Waitlist (WL)?',
    a: 'CNF guarantees a dedicated full berth or seat. RAC (Reservation Against Cancellation) guarantees boarding on a shared Side-Lower seat and upgrades to a full berth if confirmed passengers cancel. Waitlist (WL) places a ticket in queue until cancellations move it to RAC or CNF.',
  },
  {
    q: 'How are fares, Tatkal quotas, taxes, and concessions calculated?',
    a: 'Fares are computed server-side from corridor distance and train category. Tatkal (TQ) applies a 1.25× multiplier and Premium Tatkal (PT) applies 1.45×. Demo concessions apply 40% off for Senior Citizens, 25% for Students, and 50% for Divyangjan, plus 5% tax on AC classes and ₹35 (AC) or ₹18 (non-AC) convenience fee.',
  },
  {
    q: 'Does Live Tracking show real-time GPS train locations?',
    a: 'By default, Live Corridor Tracking computes deterministic IST schedule-based progress, station halts, and simulated speed using train timetables so it works offline without third-party feeds, and clearly labels telemetry as simulated.',
  },
  {
    q: 'How does the Nova AI assistant respond if no AI API key is configured?',
    a: 'Nova AI works out of the box using a deterministic local railway catalog responder supporting English, Hindi, and Kannada. When OPENROUTER_API_KEY or GEMINI_API_KEY is configured in the environment, it upgrades responses using those providers.',
  },
  {
    q: 'How can I test Traveller workflows immediately?',
    a: 'Use the pre-seeded Traveller account (traveler@railnova.demo / Travel@RailNova2026, OTP 123456) for bookings, PDF tickets, and cancellations. Admin console access at /admin requires an authorized administrator session.',
  },
];

export function LandingProjectSections() {
  const [openFaqIndices, setOpenFaqIndices] = useState<Set<number>>(() => new Set([0]));

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <>
      {/* 1. PROJECT OVERVIEW, PROBLEMS SOLVED & MISSION / VISION */}
      <section className="py-20 lg:py-24 bg-(--bg-primary) border-t border-(--border-subtle)">
        <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-(--border-subtle) bg-(--bg-surface) px-3 py-1 text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
                <TrainFront className="h-3.5 w-3.5" />
                <span>About RailNova · Project Overview</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
                Unified Indian railway booking, coach clarity, and corridor telemetry.
              </h2>
              <p className="text-sm sm:text-base text-(--text-secondary) leading-relaxed max-w-2xl">
                <strong className="text-(--text-primary)">RailNova</strong> is an end-to-end railway travel and ticket
                booking demonstration platform created by{' '}
                <span className="text-(--text-primary)">{RAILNOVA_CONTACT.companyName}</span>. It demonstrates how
                long-distance and high-speed rail planning can move beyond cluttered form tables into an editorial,
                dark-first interface covering discovery, seat selection, digital boarding passes, PNR tracking, and
                post-booking self-service.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {TRAIN_CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    href="/trains"
                    className="rounded-full border border-(--border-subtle) bg-(--bg-surface) px-3 py-1 text-xs font-mono-tech text-(--text-secondary) hover:border-(--accent-primary) hover:text-(--text-primary) transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-5 space-y-1">
                <div className="font-display text-3xl sm:text-4xl font-bold font-mono-tech text-(--accent-primary)">
                  {STATIONS.length}
                </div>
                <div className="text-sm font-semibold text-(--text-primary)">Indian Stations</div>
                <p className="text-xs text-(--text-secondary)">
                  Major junctions spanning South, West, North, Central &amp; East zones.
                </p>
              </div>
              <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-5 space-y-1">
                <div className="font-display text-3xl sm:text-4xl font-bold font-mono-tech text-(--accent-primary)">
                  {TRAINS.length}
                </div>
                <div className="text-sm font-semibold text-(--text-primary)">Train Corridors</div>
                <p className="text-xs text-(--text-secondary)">
                  Distance-calibrated INR fares, halts, platforms &amp; running days.
                </p>
              </div>
              <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-5 space-y-1">
                <div className="font-display text-3xl sm:text-4xl font-bold font-mono-tech text-(--text-primary)">
                  {DESTINATIONS.length}
                </div>
                <div className="text-sm font-semibold text-(--text-primary)">Curated Cities</div>
                <p className="text-xs text-(--text-secondary)">
                  Editorial rail guides from Nilgiri ascents to Konkan tidelines.
                </p>
              </div>
              <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-5 space-y-1">
                <div className="font-display text-3xl sm:text-4xl font-bold font-mono-tech text-(--text-primary)">
                  {TRAVEL_CLASSES.length} × {BOOKING_QUOTAS.length}
                </div>
                <div className="text-sm font-semibold text-(--text-primary)">Classes &amp; Quotas</div>
                <p className="text-xs text-(--text-secondary)">
                  1A–2S cabins &amp; chair cars with GN, TQ, PT, LD, SS quotas.
                </p>
              </div>
            </div>
          </div>

          {/* Problems RailNova Aims to Solve */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-lavender)">
                Why RailNova Exists
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Problems the platform aims to solve
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {PROBLEMS_SOLVED.map((problem) => (
                <div
                  key={problem.title}
                  className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-5 space-y-2.5"
                >
                  <h4 className="font-display text-lg font-bold text-(--text-primary)">{problem.title}</h4>
                  <p className="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">{problem.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-2.5">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
                Project Mission
              </span>
              <h3 className="font-display text-xl font-bold text-(--text-primary)">
                Make rail planning spatial, transparent, and zero-friction.
              </h3>
              <p className="text-sm text-(--text-secondary) leading-relaxed">
                Replace opaque railway tables with interactive coach visualisations, upfront fare breakdowns, accessible
                keyboard-first controls, and instant QR boarding passes—running locally out of the box with zero external
                database setup.
              </p>
            </div>
            <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-2.5">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-lavender)">
                Project Vision
              </span>
              <h3 className="font-display text-xl font-bold text-(--text-primary)">
                Bridge editorial journey discovery with live railway operations.
              </h3>
              <p className="text-sm text-(--text-secondary) leading-relaxed">
                Inspire more travellers to explore India by rail by connecting cultural destination storytelling directly
                to real-time schedule engines, multilingual AI assistance, and production-ready backend integrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STEP-BY-STEP BOOKING PROCESS & PLATFORM FEATURES */}
      <section className="py-20 lg:py-24 bg-(--bg-surface) border-t border-(--border-subtle)">
        <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
                  Step-by-Step Booking Flow
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                  From station search to QR boarding pass in four steps.
                </h2>
              </div>
              <Link
                href="/trains"
                className="inline-flex items-center gap-2 rounded-lg bg-(--accent-primary) px-4 py-2.5 text-sm font-semibold text-(--accent-on-primary) hover:-translate-y-0.5 transition-transform self-start md:self-auto"
              >
                <span>Start Booking Flow</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {BOOKING_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-6 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-3">
                    <span className="inline-block rounded-md border border-(--border-subtle) bg-(--bg-surface) px-2.5 py-1 font-mono-tech text-xs font-semibold text-(--accent-primary)">
                      STEP {item.step}
                    </span>
                    <h3 className="font-display text-lg font-bold text-(--text-primary)">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">{item.description}</p>
                  </div>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-(--accent-primary) hover:underline"
                  >
                    <span>{item.cta}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-12 border-t border-(--border-subtle) space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-lavender)">
                Platform Features &amp; Benefits
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Deep capabilities across every rail touchpoint.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PLATFORM_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    whileHover={{ y: -2 }}
                    className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-6 flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-3">
                      <Icon className={`h-6 w-6 ${pillar.accent}`} />
                      <h3 className="font-display text-xl font-bold text-(--text-primary)">{pillar.title}</h3>
                      <p className="text-sm text-(--text-secondary) leading-relaxed">{pillar.description}</p>
                    </div>
                    <Link
                      href={pillar.href}
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${pillar.accent} hover:underline`}
                    >
                      <span>{pillar.cta}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRAVEL CLASSES, QUOTAS, PNR STATUS & RAC / WAITLIST GUIDE */}
      <section className="py-20 lg:py-24 bg-(--bg-primary) border-t border-(--border-subtle)">
        <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
              Railway Reference Guide
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Travel classes, booking quotas, PNR &amp; RAC/Waitlist rules.
            </h2>
            <p className="text-sm text-(--text-secondary) leading-relaxed">
              Every train in RailNova supports realistic Indian Railways class configurations, distance-based pricing,
              quota allocations, and PNR status states.
            </p>
          </div>

          {/* 8 Travel Classes */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-(--accent-primary)" />
                <h3 className="font-display text-xl font-bold">Railway Travel Classes (1A – 2S)</h3>
              </div>
              <Link href="/trains" className="text-xs font-semibold text-(--accent-primary) hover:underline">
                Search by Class →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TRAVEL_CLASSES.map(([code, label]) => (
                <Link
                  key={code}
                  href={`/trains?class=${code}`}
                  className="group rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-5 space-y-2.5 hover:border-(--accent-primary) transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-(--border-subtle) bg-(--bg-primary) px-2.5 py-1 font-mono-tech text-xs font-bold text-(--accent-primary)">
                      {code}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-(--text-secondary) group-hover:text-(--accent-primary) transition-colors" />
                  </div>
                  <div className="text-sm font-bold text-(--text-primary)">{label}</div>
                  <p className="text-xs text-(--text-secondary) leading-relaxed">{CLASS_DESCRIPTIONS[code]}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Quotas + PNR / RAC / WL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 rounded-2xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold">Booking Quotas</h3>
                <span className="text-xs font-mono-tech text-(--text-secondary)">5 Supported Quotas</span>
              </div>
              <div className="space-y-3">
                {BOOKING_QUOTAS.map(([code, meta]) => (
                  <div
                    key={code}
                    className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-4 py-3 flex items-start gap-3"
                  >
                    <span className="mt-0.5 w-10 shrink-0 text-center rounded-md border border-(--border-subtle) bg-(--bg-surface) py-1 font-mono-tech text-xs font-bold text-(--accent-lavender)">
                      {code}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-(--text-primary)">{meta.name}</div>
                      <p className="text-xs text-(--text-secondary)">{meta.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold">PNR Status, RAC &amp; Waiting-List Guide</h3>
                  <Link href="/pnr" className="text-xs font-semibold text-(--accent-primary) hover:underline">
                    Open PNR Enquiry →
                  </Link>
                </div>
                <p className="text-sm text-(--text-secondary) leading-relaxed">
                  A <strong className="text-(--text-primary)">10-digit PNR (Passenger Name Record)</strong> uniquely
                  identifies a reservation, passenger berth allocations, and chart preparation status. Look up any
                  RailNova demo booking or test pre-seeded status states immediately:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-mono-tech font-bold text-(--success)">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>CNF · Confirmed</span>
                    </div>
                    <p className="text-xs text-(--text-secondary) leading-relaxed">
                      Guaranteed full berth or seat with coach &amp; berth number assigned.
                    </p>
                  </div>
                  <div className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-mono-tech font-bold text-(--warning)">
                      <Clock className="h-3.5 w-3.5" />
                      <span>RAC · Shared Seat</span>
                    </div>
                    <p className="text-xs text-(--text-secondary) leading-relaxed">
                      Confirmed boarding on a shared Side-Lower seat; auto-upgrades to a full berth on cancellations.
                    </p>
                  </div>
                  <div className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-mono-tech font-bold text-(--error)">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>WL · Waitlist</span>
                    </div>
                    <p className="text-xs text-(--text-secondary) leading-relaxed">
                      Queued behind confirmed/RAC tickets; upgrades only when prior travellers cancel before charting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-(--border-subtle) flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono-tech text-(--text-secondary)">Sample PNRs:</span>
                <Link
                  href="/pnr?pnr=8429104521"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-3 py-1.5 text-xs font-mono-tech text-(--accent-primary) hover:border-(--accent-primary) transition-colors"
                >
                  <span>8429104521 (CNF)</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/pnr?pnr=6193048271"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-3 py-1.5 text-xs font-mono-tech text-(--warning) hover:border-(--warning) transition-colors"
                >
                  <span>6193048271 (RAC)</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECURITY & PRIVACY, TECHNOLOGY STACK, ROADMAP & REPOSITORY */}
      <section className="py-20 lg:py-24 bg-(--bg-surface) border-t border-(--border-subtle)">
        <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Security & Privacy + Tech Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 rounded-2xl border border-(--border-subtle) bg-(--bg-primary) p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Lock className="h-5 w-5 text-(--accent-primary)" />
                  <h2 className="font-display text-2xl font-bold">Security &amp; Privacy</h2>
                </div>
                <Link href="/privacy" className="text-xs font-semibold text-(--accent-primary) hover:underline">
                  Privacy Policy →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {SECURITY_CONTROLS.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-4 space-y-1.5"
                  >
                    <h3 className="text-sm font-bold text-(--text-primary)">{item.title}</h3>
                    <p className="text-xs text-(--text-secondary) leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl border border-(--border-subtle) bg-(--bg-primary) p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Cpu className="h-5 w-5 text-(--accent-lavender)" />
                  <h2 className="font-display text-2xl font-bold">Project Technology Stack</h2>
                </div>
                <Link href="/licenses" className="text-xs font-semibold text-(--text-secondary) hover:text-(--text-primary)">
                  Licences →
                </Link>
              </div>
              <div className="space-y-2.5">
                {TECH_STACK.map((row) => (
                  <div
                    key={row.layer}
                    className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
                  >
                    <span className="text-xs font-mono-tech uppercase tracking-wider text-(--accent-primary) shrink-0">
                      {row.layer}
                    </span>
                    <span className="text-xs sm:text-sm text-(--text-primary) sm:text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Development Roadmap */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
                Development Roadmap
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                What is implemented today vs. optional &amp; planned milestones.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {ROADMAP_ITEMS.map((stage) => (
                <div
                  key={stage.phase}
                  className="rounded-2xl border border-(--border-subtle) bg-(--bg-primary) p-6 space-y-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-mono-tech font-semibold uppercase ${stage.tone}`}>
                      {stage.status}
                    </span>
                    <ShieldCheck className="h-4 w-4 text-(--text-secondary)" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-(--text-primary)">{stage.phase}</h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
                    {stage.items.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-(--accent-primary) shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Repository, Docs & Demo Sandbox */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-2xl border border-(--border-subtle) bg-(--bg-primary) p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <GitBranch className="h-5 w-5 text-(--accent-primary)" />
                  <h2 className="font-display text-2xl font-bold">GitHub Repository &amp; Documentation</h2>
                </div>
                <a
                  href="https://github.com/Sachinxcode-01/railnova"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-3.5 py-2 text-xs font-semibold text-(--accent-primary) hover:border-(--accent-primary) transition-colors"
                >
                  <span>github.com/Sachinxcode-01/railnova</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REPO_DOCS.map((doc) => (
                  <div
                    key={doc.name}
                    className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-3.5 space-y-1"
                  >
                    <div className="flex items-center gap-1.5 font-mono-tech text-xs font-semibold text-(--text-primary)">
                      <FileText className="h-3.5 w-3.5 text-(--accent-primary)" />
                      <span>{doc.name}</span>
                    </div>
                    <p className="text-xs text-(--text-secondary)">{doc.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-(--border-subtle) bg-(--bg-primary) p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="h-5 w-5 text-(--accent-lavender)" />
                  <h2 className="font-display text-2xl font-bold">Demo Sandbox Access</h2>
                </div>
                <div className="space-y-2.5 text-xs font-mono-tech">
                  <div className="rounded-lg border border-(--border-subtle) bg-(--bg-surface) p-3 space-y-1">
                    <div className="text-[11px] uppercase text-(--text-secondary)">Traveller Account</div>
                    <div className="text-(--text-primary)">traveler@railnova.demo</div>
                    <div className="text-(--text-secondary)">Pass: Travel@RailNova2026 · OTP: 123456</div>
                  </div>
                  <div className="rounded-lg border border-(--border-subtle) bg-(--bg-surface) p-3 space-y-1">
                    <div className="text-[11px] uppercase text-(--text-secondary)">Admin Console</div>
                    <div className="text-(--text-primary)">Restricted Administrator Role</div>
                    <div className="text-(--text-secondary)">Requires authorized admin credentials configured locally</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-(--accent-primary) px-4 py-2 text-xs font-semibold text-(--accent-on-primary)"
                >
                  <span>Sign In to Sandbox</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-4 py-2 text-xs font-semibold text-(--text-primary) hover:border-(--accent-primary) transition-colors"
                >
                  <span>Open Admin Console</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS & PROJECT DISCLAIMER */}
      <section className="py-20 lg:py-24 bg-(--bg-primary) border-t border-(--border-subtle)">
        <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Common questions about RailNova.
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openFaqIndices.has(idx);
              const panelId = `railnova-faq-panel-${idx}`;
              return (
                <div
                  key={item.q}
                  className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-(--bg-surface-elevated)/50 transition-colors"
                  >
                    <span className="font-display text-base sm:text-lg font-semibold text-(--text-primary)">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-(--accent-primary) transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={panelId}
                      className="px-5 pb-5 pt-1 text-sm text-(--text-secondary) leading-relaxed border-t border-(--border-subtle)"
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Project Disclaimer & Contact Desk */}
          <div className="rounded-2xl border border-(--warning)/40 bg-(--warning)/10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-(--warning)">
                <AlertTriangle className="h-4 w-4" />
                <span>Project Disclaimer</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-(--text-primary)">
                Demonstration &amp; Engineering Showcase Only
              </h3>
              <p className="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
                RailNova ({RAILNOVA_CONTACT.companyName}) is an independent demonstration web application and is not
                affiliated with Indian Railways or IRCTC. Train schedules, seat inventory, fares, 10-digit PNRs, live
                IST corridor telemetry, and payment flows are simulated locally via{' '}
                <code className="font-mono-tech">data/railnova-db.json</code> and are invalid for actual travel. For
                official Indian Railways enquiries, dial <strong className="text-(--text-primary)">{RAILNOVA_CONTACT.emergencyDisplay}</strong>.
              </p>
            </div>

            <div className="shrink-0 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-4 py-2.5 text-xs font-semibold text-(--text-primary) hover:border-(--accent-primary) transition-colors"
              >
                <PhoneCall className="h-3.5 w-3.5 text-(--accent-primary)" />
                <span>Open Contact Desk</span>
              </Link>
              <Link
                href="/terms"
                className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-4 py-2.5 text-xs font-semibold text-(--text-secondary) hover:text-(--text-primary) transition-colors"
              >
                <span>Terms &amp; Conditions</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
