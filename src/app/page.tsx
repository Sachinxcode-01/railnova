'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Compass,
  Radio,
  Ticket,
  Sparkles,
  Armchair,
  TrainFront,
  ShieldCheck,
  KeyRound,
  Cpu,
  PhoneCall,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { SmartBookingPanel } from '@/components/SmartBookingPanel';
import {
  DESTINATIONS,
  QUOTA_LABELS,
  STATIONS,
  TRAINS,
  TRAVEL_CLASS_LABELS,
} from '@/lib/railway-data';
import { RAILNOVA_CONTACT } from '@/lib/contact';
import { BookingQuotaCode, TravelClassCode } from '@/lib/types';

const FEATURED_CORRIDORS = [
  {
    route: 'Bengaluru → Mysuru',
    train: '20607 Vande Bharat Express',
    duration: '1h 50m',
    fare: 'From ₹550',
    href: '/trains?from=SBC&to=MYS',
  },
  {
    route: 'Bengaluru → Goa',
    train: '17309 Vasco-da-Gama Express',
    duration: '14h 40m',
    fare: 'From ₹395',
    href: '/trains?from=SBC&to=MAO',
  },
  {
    route: 'Mumbai → New Delhi',
    train: '12951 Tejas Rajdhani',
    duration: '15h 32m',
    fare: 'From ₹2,075',
    href: '/trains?from=CSMT&to=NDLS',
  },
  {
    route: 'New Delhi → Varanasi',
    train: '22436 Vande Bharat Express',
    duration: '8h 00m',
    fare: 'From ₹1,805',
    href: '/trains?from=NDLS&to=BSB',
  },
];

const TRAIN_CATEGORIES = Array.from(new Set(TRAINS.map((t) => t.category)));
const TRAVEL_CLASSES = Object.entries(TRAVEL_CLASS_LABELS) as [TravelClassCode, string][];
const BOOKING_QUOTAS = Object.entries(QUOTA_LABELS) as [
  BookingQuotaCode,
  { name: string; description: string },
][];

const JOURNEY_STEPS = [
  {
    step: '01',
    title: 'Search & Filter Corridors',
    description:
      'Compare schedules across 35 Vande Bharat, Rajdhani, Shatabdi, Superfast, and Mail/Express routes with running days and pantry indicators.',
    href: '/trains',
    cta: 'Browse Trains',
  },
  {
    step: '02',
    title: 'Inspect Coach & Berths',
    description:
      'Explore interactive bay layouts (LB, MB, UB, SL, SU, WS) with accessibility badges, passenger concessions, and transparent fare splits.',
    href: '/book?train=20607&class=CC',
    cta: 'Preview Coach',
  },
  {
    step: '03',
    title: 'QR & PDF Boarding Pass',
    description:
      'Generate a 10-digit PNR with perforated digital ticket styling, scannable QR verification, one-click PDF export, and refund cancellation.',
    href: '/dashboard',
    cta: 'Open My Journeys',
  },
  {
    step: '04',
    title: 'Track Live & Ask Nova AI',
    description:
      'Follow simulated IST schedule telemetry on MapLibre GL maps, check PNR status, or ask Nova AI in English, हिन्दी, or ಕನ್ನಡ.',
    href: '/live-tracking',
    cta: 'Live Corridor Map',
  },
];

const TECH_STACK_ITEMS = [
  'Next.js App Router',
  'React 19 & TypeScript',
  'Tailwind CSS v4',
  'MapLibre GL Telemetry',
  'GSAP & Framer Motion',
  'jsPDF & QRCode',
  'Zod & HMAC-SHA256 Auth',
  'Local JSON + Optional Supabase',
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 28,
        opacity: 0,
        duration: 0.75,
        stagger: 0.09,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col">
      {/* HERO EXPERIENCE */}
      <section
        ref={heroRef}
        className="relative min-h-[88svh] sm:min-h-[94vh] flex flex-col justify-center lg:justify-end pt-20 pb-8 sm:pt-24 sm:pb-12 overflow-hidden bg-[#0C0D10] text-[#F8F9FC]"
      >
        {/* Atmospheric railway background + perspective track lines */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=75"
            alt="High-speed passenger train moving through atmospheric evening landscape"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-50 scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(12,13,16,0.72) 0%, rgba(12,13,16,0.45) 45%, rgba(12,13,16,0.96) 100%)',
            }}
          />
          {/* Subtle animated railway track perspective */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 400"
            className="pointer-events-none absolute bottom-0 left-0 right-0 w-full opacity-20"
            preserveAspectRatio="none"
          >
            <line x1="620" y1="0" x2="120" y2="400" stroke="#D4FF3F" strokeWidth="1.2" />
            <line x1="820" y1="0" x2="1320" y2="400" stroke="#D4FF3F" strokeWidth="1.2" />
            <line x1="720" y1="0" x2="720" y2="400" stroke="#9296A3" strokeWidth="0.6" strokeDasharray="8 12" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-340 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
          <div className="max-w-4xl space-y-4 sm:space-y-5">
            <div className="hero-stagger inline-flex items-center gap-2.5 rounded-full border border-[#2A2D35] bg-[#17191F]/80 px-3.5 py-1.5 text-xs font-mono-tech uppercase tracking-widest text-[#9296A3]">
              <span className="h-2 w-2 rounded-full bg-[#D4FF3F]" />
              <span>RailNova · Next-Gen Indian Rail</span>
            </div>

            <h1 className="hero-stagger font-display text-4xl sm:text-7xl lg:text-[84px] font-bold tracking-[-0.035em] leading-[0.95]">
              THE JOURNEY.
              <br />
              <span className="text-[#D4FF3F]">REDEFINED.</span>
            </h1>

            <p className="hero-stagger max-w-xl text-sm sm:text-lg text-[#9296A3] leading-relaxed">
              Explore more. Travel smarter. Experience railway journeys like never before across India’s fastest corridors.
            </p>

            <div className="hero-stagger flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#smart-booking"
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4FF3F] px-5 sm:px-6 py-3 sm:py-3.5 text-sm font-semibold text-[#0C0D10] transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Find My Train</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-lg border border-[#2A2D35] bg-[#17191F]/80 px-5 sm:px-6 py-3 sm:py-3.5 text-sm font-semibold text-[#F8F9FC] hover:border-[#D4FF3F] transition-colors cursor-pointer"
              >
                <span>Explore Destinations</span>
              </Link>
            </div>
          </div>

          {/* Integrated Smart Booking Interface */}
          <div id="smart-booking" className="hero-stagger">
            <SmartBookingPanel />
          </div>
        </div>
      </section>

      {/* ABOUT THE PROJECT & NETWORK OVERVIEW */}
      <section className="py-16 lg:py-22 border-y border-(--border-subtle) bg-(--bg-surface)">
        <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-(--border-subtle) bg-(--bg-primary) px-3 py-1 text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
                <TrainFront className="h-3.5 w-3.5" />
                <span>About RailNova</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
                An editorial, dark-first workspace for Indian rail travel.
              </h2>
              <p className="text-sm sm:text-base text-(--text-secondary) leading-relaxed max-w-2xl">
                RailNova brings together train discovery, coach berth visualisation, live IST corridor telemetry,
                10-digit PNR lookup, and digital e-ticketing in one cohesive web application. Built by{' '}
                <span className="text-(--text-primary) font-medium">{RAILNOVA_CONTACT.companyName}</span>, it replaces
                dense legacy railway interfaces with real-time spatial clarity and dual-theme craft.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {TRAIN_CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    href="/trains"
                    className="rounded-full border border-(--border-subtle) bg-(--bg-primary) px-3 py-1 text-xs font-mono-tech text-(--text-secondary) hover:border-(--accent-primary) hover:text-(--text-primary) transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-5 space-y-1">
                <div className="font-display text-3xl sm:text-4xl font-bold text-(--accent-primary) font-mono-tech">
                  {STATIONS.length}
                </div>
                <div className="text-sm font-semibold text-(--text-primary)">Indian Stations</div>
                <p className="text-xs text-(--text-secondary)">
                  Major junctions across South, West, North, Central &amp; East India.
                </p>
              </div>
              <div className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-5 space-y-1">
                <div className="font-display text-3xl sm:text-4xl font-bold text-(--accent-primary) font-mono-tech">
                  {TRAINS.length}
                </div>
                <div className="text-sm font-semibold text-(--text-primary)">Active Corridors</div>
                <p className="text-xs text-(--text-secondary)">
                  Distance-calibrated fares, halts, platforms &amp; running days.
                </p>
              </div>
              <div className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-5 space-y-1">
                <div className="font-display text-3xl sm:text-4xl font-bold text-(--text-primary) font-mono-tech">
                  {DESTINATIONS.length}
                </div>
                <div className="text-sm font-semibold text-(--text-primary)">Curated Cities</div>
                <p className="text-xs text-(--text-secondary)">
                  Editorial rail guides from Nilgiri hills to Konkan coasts.
                </p>
              </div>
              <div className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-5 space-y-1">
                <div className="font-display text-3xl sm:text-4xl font-bold text-(--text-primary) font-mono-tech">
                  {TRAVEL_CLASSES.length} × {BOOKING_QUOTAS.length}
                </div>
                <div className="text-sm font-semibold text-(--text-primary)">Classes &amp; Quotas</div>
                <p className="text-xs text-(--text-secondary)">
                  1A to 2S cabins &amp; chair cars with GN, TQ, PT, LD, SS quotas.
                </p>
              </div>
            </div>
          </div>

          {/* Transparent Demo Scope Notice */}
          <div className="rounded-xl border border-(--warning)/35 bg-(--warning)/10 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-(--warning) shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-xs sm:text-sm text-(--text-primary) leading-relaxed">
                <strong className="font-semibold">Demonstration Environment:</strong> Train schedules, fares, PNRs,
                live IST telemetry, and payment flows run locally via <code className="font-mono-tech">data/railnova-db.json</code>{' '}
                for demonstration purposes and are <strong>not</strong> valid for official IRCTC travel.
              </p>
            </div>
            <Link
              href="/pnr?pnr=8429104521"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-3.5 py-2 text-xs font-semibold text-(--text-primary) hover:border-(--accent-primary) transition-colors"
            >
              <span>Try Sample PNR</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL WARM IVORY CONTRAST SECTION */}
      <section className="bg-[#F5F2EA] text-[#15171B] py-20 lg:py-28">
        <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-14">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-[#626672]">
                Signature Corridors
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
                Precision timetables across twelve iconic Indian cities.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <Link
                href="/trains"
                className="inline-flex items-center gap-2 font-semibold text-sm text-[#15171B] border-b-2 border-[#527A00] pb-1 hover:text-[#527A00] transition-colors"
              >
                <span>View all corridors</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_CORRIDORS.map((c) => (
              <Link
                key={c.route}
                href={c.href}
                className="group rounded-xl border border-[#E4E1D9] bg-white p-6 flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:border-[#527A00]"
              >
                <div className="space-y-2">
                  <div className="text-xs font-mono-tech text-[#626672]">{c.duration}</div>
                  <h3 className="font-display text-xl font-bold text-[#15171B]">{c.route}</h3>
                  <p className="text-sm text-[#626672]">{c.train}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#E4E1D9] flex items-center justify-between">
                  <span className="font-mono-tech text-sm font-semibold text-[#527A00]">{c.fare}</span>
                  <ArrowUpRight className="h-4 w-4 text-[#15171B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATION DISCOVERY HORIZONTAL SHOWCASE */}
      <section className="py-20 lg:py-28 bg-(--bg-primary)">
        <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
                Destination Editorial
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
                Curated Arrivals
              </h2>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-4 py-2.5 text-sm font-semibold hover:border-(--accent-primary) transition-colors"
            >
              <Compass className="h-4 w-4 text-(--accent-primary)" />
              <span>All 12 Destinations</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {DESTINATIONS.slice(0, 5).map((dest, idx) => {
              const spanClass =
                idx === 0
                  ? 'md:col-span-7 md:row-span-2 min-h-[420px]'
                  : idx === 1 || idx === 2
                    ? 'md:col-span-5 min-h-[200px]'
                    : 'md:col-span-6 min-h-[260px]';
              return (
                <Link
                  key={dest.slug}
                  href={`/trains?to=${dest.stationCode}`}
                  data-cursor-label="EXPLORE"
                  className={`group relative overflow-hidden rounded-xl border border-(--border-subtle) bg-(--bg-surface) ${spanClass}`}
                >
                  <Image
                    src={dest.imageUrl}
                    alt={`${dest.city}, ${dest.state} — ${dest.tagline}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(12,13,16,0.12) 0%, rgba(12,13,16,0.88) 100%)',
                    }}
                  />
                  <div className="relative z-10 h-full p-6 flex flex-col justify-between text-[#F8F9FC]">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-[#0C0D10]/70 backdrop-blur-xs px-2.5 py-1 text-xs font-mono-tech text-[#D4FF3F]">
                        {dest.stationCode}
                      </span>
                      <span className="text-xs font-mono-tech text-[#F8F9FC]/80">{dest.bestTime}</span>
                    </div>
                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold">{dest.city}</h3>
                      <p className="mt-1 text-sm text-[#F8F9FC]/80 line-clamp-2">{dest.tagline}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLATFORM ARCHITECTURE BENTO */}
      <section className="py-20 border-t border-(--border-subtle) bg-(--bg-surface)">
        <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 space-y-3">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-lavender)">
              Built for Clarity
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Every stage of rail travel, engineered.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div
              whileHover={{ y: -2 }}
              className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-6 space-y-4"
            >
              <Armchair className="h-6 w-6 text-(--accent-primary)" />
              <h3 className="font-display text-xl font-bold">Interactive Coach Layout</h3>
              <p className="text-sm text-(--text-secondary) leading-relaxed">
                Inspect Lower, Middle, Upper, Side-Lower, and accessible berths with clear preference vs. official allocation guidance.
              </p>
              <Link href="/trains" className="inline-flex items-center gap-1 text-xs font-semibold text-(--accent-primary)">
                <span>Try Coach Selector</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-6 space-y-4"
            >
              <Radio className="h-6 w-6 text-(--accent-lavender)" />
              <h3 className="font-display text-xl font-bold">Live Corridor Telemetry</h3>
              <p className="text-sm text-(--text-secondary) leading-relaxed">
                Track simulated train movement on interactive railway maps with station halts, delay indicators, and ETAs.
              </p>
              <Link href="/live-tracking" className="inline-flex items-center gap-1 text-xs font-semibold text-(--accent-lavender)">
                <span>Open Live Map</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-6 space-y-4"
            >
              <Ticket className="h-6 w-6 text-(--accent-primary)" />
              <h3 className="font-display text-xl font-bold">Champagne Boarding Pass</h3>
              <p className="text-sm text-(--text-secondary) leading-relaxed">
                Instant QR-verified demonstration tickets with PDF download, print layout, and 10-digit PNR status lookup.
              </p>
              <Link href="/pnr" className="inline-flex items-center gap-1 text-xs font-semibold text-(--accent-primary)">
                <span>Check Demo PNR</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>

          {/* END-TO-END BOOKING WORKFLOW */}
          <div className="mt-14 pt-12 border-t border-(--border-subtle) space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
                  End-to-End Workflow
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  From station search to QR boarding pass in four steps.
                </h3>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-mono-tech text-(--text-secondary)">
                <Sparkles className="h-4 w-4 text-(--accent-primary)" />
                <span>Nova AI Assistant ready in EN · HI · KN</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {JOURNEY_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    <span className="inline-block font-mono-tech text-xs px-2 py-0.5 rounded bg-(--bg-surface) border border-(--border-subtle) text-(--accent-primary)">
                      STEP {item.step}
                    </span>
                    <h4 className="font-display text-lg font-bold text-(--text-primary)">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
                      {item.description}
                    </p>
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
        </div>
      </section>

      {/* TRAVEL CLASSES & BOOKING QUOTAS REFERENCE */}
      <section className="py-20 bg-(--bg-primary) border-t border-(--border-subtle)">
        <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
                Classes &amp; Quotas
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Complete Indian Railways cabin &amp; quota coverage.
              </h2>
              <p className="text-sm text-(--text-secondary) leading-relaxed">
                Every corridor computes distance-calibrated INR fares, dynamic availability states (Available, RAC, Waitlist),
                and concession eligibility for Senior Citizens, Students, and Divyangjan travellers.
              </p>
            </div>
            <Link
              href="/trains"
              className="inline-flex items-center gap-2 rounded-lg bg-(--accent-primary) px-4 py-2.5 text-sm font-semibold text-(--accent-on-primary) hover:-translate-y-0.5 transition-transform self-start md:self-auto"
            >
              <span>Compare Live Fares</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-2xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-(--accent-primary)" />
                  <h3 className="font-display text-lg font-bold">8 Supported Travel Classes</h3>
                </div>
                <span className="text-xs font-mono-tech text-(--text-secondary)">1A – 2S</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TRAVEL_CLASSES.map(([code, label]) => (
                  <Link
                    key={code}
                    href={`/trains?class=${code}`}
                    className="group rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-4 py-3 flex items-center justify-between hover:border-(--accent-primary) transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 text-center rounded-md bg-(--bg-surface) border border-(--border-subtle) py-1 font-mono-tech text-xs font-bold text-(--accent-primary)">
                        {code}
                      </span>
                      <span className="text-sm font-medium text-(--text-primary)">{label}</span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-(--text-secondary) group-hover:text-(--accent-primary) transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-(--accent-lavender)" />
                  <h3 className="font-display text-lg font-bold">5 Booking Quotas</h3>
                </div>
                <span className="text-xs font-mono-tech text-(--text-secondary)">IRCTC Standard</span>
              </div>
              <div className="space-y-3">
                {BOOKING_QUOTAS.map(([code, meta]) => (
                  <div
                    key={code}
                    className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-4 py-3 flex items-start gap-3"
                  >
                    <span className="mt-0.5 w-10 shrink-0 text-center rounded-md bg-(--bg-surface) border border-(--border-subtle) py-1 font-mono-tech text-xs font-bold text-(--accent-lavender)">
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
          </div>
        </div>
      </section>

      {/* DEMO SANDBOX, TECHNICAL ARCHITECTURE & SUPPORT */}
      <section className="py-20 bg-(--bg-surface) border-t border-(--border-subtle)">
        <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
              Sandbox &amp; Architecture
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to explore out of the box.
            </h2>
            <p className="text-sm text-(--text-secondary) leading-relaxed">
              Test complete traveller and admin workflows immediately using our pre-seeded PNRs and accounts,
              or connect optional live IRCTC, PostgreSQL/Supabase, Razorpay Test Mode, and Gemini/OpenRouter keys.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Sample PNRs & Demo Accounts */}
            <div className="rounded-2xl border border-(--border-subtle) bg-(--bg-primary) p-6 space-y-5">
              <div className="flex items-center gap-2.5">
                <KeyRound className="h-5 w-5 text-(--accent-primary)" />
                <h3 className="font-display text-xl font-bold">Demo Accounts &amp; PNRs</h3>
              </div>

              <div className="space-y-2.5 text-xs font-mono-tech">
                <div className="rounded-lg border border-(--border-subtle) bg-(--bg-surface) p-3 space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-(--text-secondary)">Traveller Login</div>
                  <div className="text-(--text-primary)">traveler@railnova.demo</div>
                  <div className="text-(--text-secondary)">Pass: Travel@RailNova2026 · OTP: 123456</div>
                </div>
                <div className="rounded-lg border border-(--border-subtle) bg-(--bg-surface) p-3 space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-(--text-secondary)">Admin Console</div>
                  <div className="text-(--text-primary)">admin@railnova.demo</div>
                  <div className="text-(--text-secondary)">Pass: Admin@RailNova2026</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href="/pnr?pnr=8429104521"
                  className="inline-flex items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-3 py-1.5 text-xs font-mono-tech text-(--accent-primary) hover:border-(--accent-primary) transition-colors"
                >
                  <span>PNR 8429104521 (CNF)</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/pnr?pnr=6193048271"
                  className="inline-flex items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-3 py-1.5 text-xs font-mono-tech text-(--accent-lavender) hover:border-(--accent-lavender) transition-colors"
                >
                  <span>PNR 6193048271 (RAC)</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-1 rounded-lg bg-(--accent-primary) px-3 py-1.5 text-xs font-semibold text-(--accent-on-primary)"
                >
                  <span>Sign In</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Platform Stack */}
            <div className="rounded-2xl border border-(--border-subtle) bg-(--bg-primary) p-6 space-y-5">
              <div className="flex items-center gap-2.5">
                <Cpu className="h-5 w-5 text-(--accent-lavender)" />
                <h3 className="font-display text-xl font-bold">Engineering Stack</h3>
              </div>
              <p className="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
                Zero-config boot with queued local JSON persistence, Zod schema validation, rate-limited API routes,
                keyboard-accessible focus states, and full <code className="font-mono-tech">prefers-reduced-motion</code> compliance.
              </p>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK_ITEMS.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-(--border-subtle) bg-(--bg-surface) px-2.5 py-1 text-[11px] font-mono-tech text-(--text-primary)"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="pt-1 flex flex-wrap gap-4 text-xs font-semibold">
                <Link href="/admin" className="inline-flex items-center gap-1 text-(--accent-lavender) hover:underline">
                  <span>Admin Operations</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/licenses" className="inline-flex items-center gap-1 text-(--text-secondary) hover:text-(--text-primary)">
                  <span>Open-Source Licences</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Support & Passenger Assistance */}
            <div className="rounded-2xl border border-(--border-subtle) bg-(--bg-primary) p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="h-5 w-5 text-(--accent-primary)" />
                  <h3 className="font-display text-xl font-bold">Support &amp; Helpdesk</h3>
                </div>
                <div className="space-y-2 text-xs text-(--text-secondary) leading-relaxed">
                  <div className="text-sm font-semibold text-(--text-primary)">{RAILNOVA_CONTACT.companyName}</div>
                  <div>
                    Support Desk:{' '}
                    <a href={`mailto:${RAILNOVA_CONTACT.email}`} className="text-(--accent-primary) hover:underline">
                      {RAILNOVA_CONTACT.email}
                    </a>
                  </div>
                  <div>
                    Helpline:{' '}
                    <a href={RAILNOVA_CONTACT.phoneHref} className="font-mono-tech text-(--text-primary) hover:underline">
                      {RAILNOVA_CONTACT.phoneDisplay}
                    </a>
                  </div>
                  <div>Hours: {RAILNOVA_CONTACT.hours}</div>
                  <div>Official Rail Enquiry: {RAILNOVA_CONTACT.emergencyDisplay}</div>
                  <div>
                    {RAILNOVA_CONTACT.addressLine1}, {RAILNOVA_CONTACT.addressLine2}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-(--border-subtle) flex items-center justify-between text-xs">
                <Link href="/contact" className="inline-flex items-center gap-1 font-semibold text-(--accent-primary) hover:underline">
                  <span>Open Contact Desk</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/privacy" className="text-(--text-secondary) hover:text-(--text-primary)">
                  Privacy &amp; Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
