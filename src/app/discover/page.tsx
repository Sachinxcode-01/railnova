'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { DESTINATIONS } from '@/lib/railway-data';

export default function DiscoverPage() {
  return (
    <div className="pt-24 pb-20 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono-tech uppercase tracking-widest text-[var(--accent-primary)]">
          RailNova Travel Magazine
        </span>
        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-[1.02]">
          Twelve Indian Destinations by Rail.
        </h1>
        <p className="text-base text-[var(--text-secondary)] leading-relaxed">
          From Nilgiri rack-and-pinion mountain ascents to Konkan coastal expresses and high-speed Vande Bharat corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {DESTINATIONS.map((dest, idx) => {
          const isWide = idx % 5 === 0 || idx % 5 === 3;
          return (
            <motion.article
              key={dest.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45 }}
              data-cursor-label="EXPLORE"
              className={`group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden flex flex-col justify-between ${
                isWide ? 'md:col-span-7' : 'md:col-span-5'
              }`}
            >
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={dest.imageUrl}
                  alt={`${dest.city}, ${dest.state}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="rounded-md bg-[#0C0D10]/80 backdrop-blur-xs px-2.5 py-1 font-mono-tech text-xs font-bold text-[#D4FF3F]">
                    {dest.stationCode}
                  </span>
                  <span className="rounded-md bg-[#0C0D10]/80 backdrop-blur-xs px-2.5 py-1 font-mono-tech text-xs text-[#F8F9FC]">
                    {dest.bestTime}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs font-mono-tech text-[var(--text-secondary)]">
                    {dest.state} · {dest.signatureTrain}
                  </div>
                  <h2 className="font-display text-2xl font-bold">{dest.city}</h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {dest.editorialDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {dest.highlights.map((h) => (
                      <span
                        key={h}
                        className="rounded-md bg-[var(--bg-primary)] px-2 py-1 text-[11px] font-mono-tech text-[var(--text-secondary)]"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/trains?to=${dest.stationCode}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-primary)]"
                  >
                    <span>Search Trains</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
