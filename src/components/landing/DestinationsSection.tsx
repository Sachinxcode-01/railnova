'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Compass } from 'lucide-react';
import { DESTINATIONS } from '@/lib/railway-data';

type MoodFilter = 'all' | 'coastal' | 'heritage' | 'metro';

const MOOD_SLUGS: Record<Exclude<MoodFilter, 'all'>, string[]> = {
  coastal: ['goa', 'ooty', 'mangaluru', 'chennai'],
  heritage: ['mysuru', 'varanasi', 'jaipur', 'hyderabad'],
  metro: ['bengaluru', 'mumbai', 'delhi', 'kolkata'],
};

export function DestinationsSection() {
  const [mood, setMood] = useState<MoodFilter>('all');

  const items = useMemo(() => {
    if (mood === 'all') return DESTINATIONS.slice(0, 5);
    const slugs = MOOD_SLUGS[mood];
    return DESTINATIONS.filter((d) => slugs.includes(d.slug)).slice(0, 4);
  }, [mood]);

  return (
    <section
      aria-labelledby="destinations-heading"
      className="py-20 lg:py-28 bg-[#F5F2EA] text-[#15171B] border-b border-[#E4E1D9]"
    >
      <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[#466800]">
              Destinations · Luxury Travel Photography
            </span>
            <h2
              id="destinations-heading"
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05]"
            >
              Curated arrivals across twelve Indian horizons.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all' as const, label: 'Editorial Picks' },
              { id: 'coastal' as const, label: 'Coasts & Hills' },
              { id: 'heritage' as const, label: 'Royal & Sacred' },
              { id: 'metro' as const, label: 'Metro Flagships' },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                aria-pressed={mood === filter.id}
                onClick={() => setMood(filter.id)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer border ${
                  mood === filter.id
                    ? 'bg-[#15171B] text-[#F5F2EA] border-[#15171B]'
                    : 'bg-white text-[#4F5360] border-[#E4E1D9] hover:border-[#466800]'
                }`}
              >
                {filter.label}
              </button>
            ))}

            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-lg border border-[#15171B] bg-transparent px-4 py-2 text-xs font-semibold text-[#15171B] hover:bg-[#15171B] hover:text-[#F5F2EA] transition-colors"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>All 12 Cities</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {items.map((dest, idx) => {
            const spanClass =
              mood === 'all'
                ? idx === 0
                  ? 'md:col-span-7 md:row-span-2 min-h-[430px]'
                  : idx === 1 || idx === 2
                    ? 'md:col-span-5 min-h-[205px]'
                    : 'md:col-span-6 min-h-[270px]'
                : idx === 0 || idx === 3
                  ? 'md:col-span-7 min-h-[300px]'
                  : 'md:col-span-5 min-h-[300px]';

            const lowestFare = dest.fromHubs[0]?.startingFare;

            return (
              <Link
                key={dest.slug}
                href={`/trains?to=${dest.stationCode}`}
                data-cursor-label="EXPLORE"
                className={`group relative overflow-hidden rounded-2xl border border-[#E4E1D9] bg-[#15171B] ${spanClass}`}
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
                      'linear-gradient(180deg, rgba(12,13,16,0.18) 0%, rgba(12,13,16,0.45) 45%, rgba(12,13,16,0.92) 100%)',
                  }}
                />
                <div className="relative z-10 h-full p-6 flex flex-col justify-between text-[#F8F9FC]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-[#0C0D10]/75 backdrop-blur-xs px-2.5 py-1 text-xs font-mono-tech font-semibold text-[#D4FF3F]">
                      {dest.stationCode} · {dest.state}
                    </span>
                    <span className="rounded-md bg-[#0C0D10]/65 backdrop-blur-xs px-2.5 py-1 text-[11px] font-mono-tech text-[#F8F9FC]/90">
                      Best {dest.bestTime}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold">{dest.city}</h3>
                        <p className="mt-1 text-sm text-[#F8F9FC]/85 line-clamp-2">{dest.tagline}</p>
                      </div>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4FF3F] text-[#0C0D10] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-mono-tech text-[#D1D5E0]">
                      <span>{dest.signatureTrain}</span>
                      {lowestFare && <span className="text-[#D4FF3F]">From ₹{lowestFare}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
