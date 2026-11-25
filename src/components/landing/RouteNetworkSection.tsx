'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Gauge, Radio, Route } from 'lucide-react';
import { STATION_MAP, TRAINS } from '@/lib/railway-data';

interface NetworkCorridor {
  id: string;
  trainNumber: string;
  label: string;
  from: string;
  to: string;
  color: string;
  highlight: string;
}

const CORRIDORS: NetworkCorridor[] = [
  {
    id: 'mumbai-delhi',
    trainNumber: '12951',
    label: 'Western Rajdhani Spine',
    from: 'MMCT',
    to: 'NDLS',
    color: '#D4FF3F',
    highlight: '1,386 km · Overnight High-Speed',
  },
  {
    id: 'delhi-varanasi',
    trainNumber: '22436',
    label: 'Ganga Vande Bharat',
    from: 'NDLS',
    to: 'BSB',
    color: '#B8A7FF',
    highlight: '759 km · 8h 00m Semi-High-Speed',
  },
  {
    id: 'kolkata-delhi',
    trainNumber: '12301',
    label: 'Eastern Rajdhani Corridor',
    from: 'HWH',
    to: 'NDLS',
    color: '#34D399',
    highlight: '1,451 km · Howrah Flagship',
  },
  {
    id: 'blr-goa',
    trainNumber: '17309',
    label: 'Western Ghats & Konkan',
    from: 'SBC',
    to: 'MAO',
    color: '#D4FF3F',
    highlight: '676 km · Deccan to Coast',
  },
  {
    id: 'chennai-mysuru',
    trainNumber: '20607',
    label: 'Southern Vande Bharat',
    from: 'MAS',
    to: 'MYS',
    color: '#B8A7FF',
    highlight: '500 km · via Bengaluru SBC',
  },
];

const MAP_HUBS = ['NDLS', 'JP', 'ADI', 'BSB', 'HWH', 'MMCT', 'SC', 'MAO', 'SBC', 'MAS', 'MYS'];

function projectToSvg(lat: number, lng: number): { x: number; y: number } {
  // Bounds covering Indian rail network stations: lng 68..96, lat 7.5..34
  const x = ((lng - 68) / (96 - 68)) * 520 + 60;
  const y = ((34 - lat) / (34 - 7.5)) * 480 + 40;
  return { x: Math.round(x), y: Math.round(y) };
}

export function RouteNetworkSection() {
  const prefersReduced = useReducedMotion();
  const [activeId, setActiveId] = useState(CORRIDORS[0].id);

  const activeCorridor = CORRIDORS.find((c) => c.id === activeId) || CORRIDORS[0];
  const train = TRAINS.find((t) => t.number === activeCorridor.trainNumber) || TRAINS[0];

  return (
    <section
      aria-labelledby="route-network-heading"
      className="py-20 lg:py-28 bg-[#0C0D10] text-[#F8F9FC] border-b border-[#2A2D35]"
    >
      <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-[#D4FF3F]">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>Railway Map · Animated Route Network</span>
            </span>
            <h2
              id="route-network-heading"
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight"
            >
              India’s high-speed rail topology, live.
            </h2>
          </div>

          <Link
            href="/live-tracking"
            className="inline-flex items-center gap-2 rounded-lg border border-[#2A2D35] bg-[#17191F] px-4 py-2.5 text-sm font-semibold text-[#F8F9FC] hover:border-[#D4FF3F] transition-colors w-fit"
          >
            <Route className="h-4 w-4 text-[#D4FF3F]" />
            <span>Open Full Telemetry Map</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive SVG Railway Network */}
          <div className="lg:col-span-7 rounded-2xl border border-[#2A2D35] bg-[#17191F] p-4 sm:p-6 relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#9296A3] mb-2">
              <span>SCHEMATIC NETWORK · 11 PRIMARY HUBS</span>
              <span className="text-[#D4FF3F]">SELECT A CORRIDOR</span>
            </div>

            <svg
              viewBox="0 0 640 560"
              className="w-full h-auto max-h-115"
              role="img"
              aria-label="Animated Indian railway corridor map connecting major hubs"
            >
              {/* Subtle coordinate grid */}
              <g stroke="#2A2D35" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.55">
                {[120, 220, 320, 420, 520].map((x) => (
                  <line key={`vx-${x}`} x1={x} y1="20" x2={x} y2="540" />
                ))}
                {[100, 200, 300, 400, 500].map((y) => (
                  <line key={`hy-${y}`} x1="30" y1={y} x2="610" y2={y} />
                ))}
              </g>

              {/* Corridor Tracks */}
              {CORRIDORS.map((corridor) => {
                const start = STATION_MAP[corridor.from];
                const end = STATION_MAP[corridor.to];
                if (!start || !end) return null;
                const p1 = projectToSvg(start.lat, start.lng);
                const p2 = projectToSvg(end.lat, end.lng);
                const midX = (p1.x + p2.x) / 2 + (p1.y - p2.y) * 0.14;
                const midY = (p1.y + p2.y) / 2 - (p2.x - p1.x) * 0.08;
                const pathD = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;
                const isActive = corridor.id === activeId;

                return (
                  <g
                    key={corridor.id}
                    onClick={() => setActiveId(corridor.id)}
                    className="cursor-pointer"
                  >
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isActive ? corridor.color : '#2A2D35'}
                      strokeWidth={isActive ? 3.5 : 2}
                      strokeLinecap="round"
                      opacity={isActive ? 1 : 0.75}
                    />
                    {!prefersReduced && (
                      <motion.path
                        d={pathD}
                        fill="none"
                        stroke={corridor.color}
                        strokeWidth={isActive ? 3.5 : 1.5}
                        strokeLinecap="round"
                        strokeDasharray="10 22"
                        initial={{ strokeDashoffset: 64 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{
                          repeat: Infinity,
                          duration: isActive ? 1.8 : 4,
                          ease: 'linear',
                        }}
                        opacity={isActive ? 1 : 0.45}
                      />
                    )}
                  </g>
                );
              })}

              {/* Station Nodes */}
              {MAP_HUBS.map((code) => {
                const st = STATION_MAP[code];
                if (!st) return null;
                const { x, y } = projectToSvg(st.lat, st.lng);
                const isEndpoint = activeCorridor.from === code || activeCorridor.to === code;
                return (
                  <g key={code}>
                    {isEndpoint && !prefersReduced && (
                      <motion.circle
                        cx={x}
                        cy={y}
                        r={12}
                        fill="none"
                        stroke={activeCorridor.color}
                        strokeWidth="1.5"
                        initial={{ scale: 0.7, opacity: 0.9 }}
                        animate={{ scale: 1.35, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isEndpoint ? 6 : 4}
                      fill={isEndpoint ? activeCorridor.color : '#F8F9FC'}
                      stroke="#0C0D10"
                      strokeWidth="2"
                    />
                    <text
                      x={x + 9}
                      y={y + 4}
                      fontSize="11"
                      fontFamily="var(--font-mono)"
                      fontWeight={isEndpoint ? '700' : '500'}
                      fill={isEndpoint ? activeCorridor.color : '#A3A8B8'}
                    >
                      {code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Corridor Selector & Telemetry Readout */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2.5">
              {CORRIDORS.map((corridor) => {
                const isActive = corridor.id === activeId;
                return (
                  <button
                    key={corridor.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveId(corridor.id)}
                    className={`w-full text-left rounded-xl border p-4 transition-all cursor-pointer ${isActive
                      ? 'border-[#D4FF3F] bg-[#17191F]'
                      : 'border-[#2A2D35] bg-[#17191F]/50 hover:border-[#626672]'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-bold text-base text-[#F8F9FC]">
                        {corridor.label}
                      </span>
                      <span
                        className="font-mono-tech text-xs font-semibold"
                        style={{ color: corridor.color }}
                      >
                        {corridor.from} → {corridor.to}
                      </span>
                    </div>
                    <div className="mt-1 text-xs font-mono-tech text-[#9296A3]">
                      {corridor.highlight}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-[#2A2D35] bg-[#17191F] p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-mono-tech text-[#9296A3]">
                    ACTIVE CORRIDOR · {train.number}
                  </div>
                  <div className="font-display text-lg font-bold text-[#F8F9FC]">{train.name}</div>
                </div>
                <span className="inline-flex items-center gap-1 font-mono-tech text-xs text-[#D4FF3F]">
                  <Gauge className="h-3.5 w-3.5" />
                  <span>{train.avgSpeedKmph} km/h</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#2A2D35] text-xs font-mono-tech">
                <span className="text-[#A3A8B8]">
                  {train.departureTime} → {train.arrivalTime} ({train.durationLabel})
                </span>
                <Link
                  href={`/trains?from=${train.fromCode}&to=${train.toCode}`}
                  className="inline-flex items-center gap-1 font-semibold text-[#D4FF3F]"
                >
                  <span>Search Route</span>
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
