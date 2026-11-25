'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { ArrowUpRight, Compass, Radio, Ticket, Sparkles, Armchair } from 'lucide-react';
import { SmartBookingPanel } from '@/components/SmartBookingPanel';
import { DESTINATIONS } from '@/lib/railway-data';

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
        className="relative min-h-[94vh] flex flex-col justify-end pt-24 pb-12 overflow-hidden bg-[#0C0D10] text-[#F8F9FC]"
      >
        {/* Atmospheric railway background + perspective track lines */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=2000&q=80"
            alt="High-speed passenger train moving through atmospheric evening landscape"
            className="h-full w-full object-cover object-center opacity-50 scale-105"
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

        <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-4xl space-y-5">
            <div className="hero-stagger inline-flex items-center gap-2.5 rounded-full border border-[#2A2D35] bg-[#17191F]/80 px-3.5 py-1.5 text-xs font-mono-tech uppercase tracking-widest text-[#9296A3]">
              <span className="h-2 w-2 rounded-full bg-[#D4FF3F]" />
              <span>RailNova · Next-Gen Indian Rail</span>
            </div>

            <h1 className="hero-stagger font-display text-5xl sm:text-7xl lg:text-[84px] font-bold tracking-[-0.035em] leading-[0.95]">
              THE JOURNEY.
              <br />
              <span className="text-[#D4FF3F]">REDEFINED.</span>
            </h1>

            <p className="hero-stagger max-w-xl text-base sm:text-lg text-[#9296A3] leading-relaxed">
              Explore more. Travel smarter. Experience railway journeys like never before across India’s fastest corridors.
            </p>

            <div className="hero-stagger flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#smart-booking"
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4FF3F] px-6 py-3.5 text-sm font-semibold text-[#0C0D10] transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Find My Train</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-lg border border-[#2A2D35] bg-[#17191F]/80 px-6 py-3.5 text-sm font-semibold text-[#F8F9FC] hover:border-[#D4FF3F] transition-colors cursor-pointer"
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

      {/* EDITORIAL WARM IVORY CONTRAST SECTION */}
      <section className="bg-[#F5F2EA] text-[#15171B] py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
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
      <section className="py-20 lg:py-28 bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-[var(--accent-primary)]">
                Destination Editorial
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
                Curated Arrivals
              </h2>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-semibold hover:border-[var(--accent-primary)] transition-colors"
            >
              <Compass className="h-4 w-4 text-[var(--accent-primary)]" />
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
                  className={`group relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] ${spanClass}`}
                >
                  <img
                    src={dest.imageUrl}
                    alt={`${dest.city}, ${dest.state}`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
      <section className="py-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 space-y-3">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[var(--accent-lavender)]">
              Built for Clarity
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Every stage of rail travel, engineered.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div
              whileHover={{ y: -2 }}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 space-y-4"
            >
              <Armchair className="h-6 w-6 text-[var(--accent-primary)]" />
              <h3 className="font-display text-xl font-bold">Interactive Coach Layout</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Inspect Lower, Middle, Upper, Side-Lower, and accessible berths with clear preference vs. official allocation guidance.
              </p>
              <Link href="/trains" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-primary)]">
                <span>Try Coach Selector</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 space-y-4"
            >
              <Radio className="h-6 w-6 text-[var(--accent-lavender)]" />
              <h3 className="font-display text-xl font-bold">Live Corridor Telemetry</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Track simulated train movement on interactive railway maps with station halts, delay indicators, and ETAs.
              </p>
              <Link href="/live-tracking" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-lavender)]">
                <span>Open Live Map</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 space-y-4"
            >
              <Ticket className="h-6 w-6 text-[var(--accent-primary)]" />
              <h3 className="font-display text-xl font-bold">Champagne Boarding Pass</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Instant QR-verified demonstration tickets with PDF download, print layout, and 10-digit PNR status lookup.
              </p>
              <Link href="/pnr" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-primary)]">
                <span>Check Demo PNR</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
