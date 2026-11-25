'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Clock, MapPin, ChevronDown, ChevronUp, AlertTriangle, Gauge } from 'lucide-react';
import { TRAINS } from '@/lib/railway-data';
import { TrainStop } from '@/lib/types';

interface LiveTelemetry {
  progressPct: number;
  currentStop: TrainStop;
  nextStop: TrainStop;
  currentIdx: number;
  distanceCoveredKm: number;
  currentSpeedKmph: number;
  istTime: string;
  isSimulatedTelemetry: boolean;
}

export default function LiveTrackingPage() {
  const [selectedTrainNo, setSelectedTrainNo] = useState(TRAINS[3].number); // 12779 Goa Express
  const [telemetry, setTelemetry] = useState<LiveTelemetry | null>(null);
  const [timelineExpanded, setTimelineExpanded] = useState(true);

  const train = useMemo(
    () => TRAINS.find((t) => t.number === selectedTrainNo) || TRAINS[0],
    [selectedTrainNo]
  );

  useEffect(() => {
    let active = true;
    const fetchLive = async () => {
      try {
        const res = await fetch(`/api/live?trainNumber=${selectedTrainNo}`);
        if (!res.ok) return;
        const data = await res.json();
        if (active && data.telemetry) {
          setTelemetry(data.telemetry);
        }
      } catch {
        // ignore transient errors
      }
    };

    fetchLive();
    const id = setInterval(fetchLive, 3000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [selectedTrainNo]);

  const progressPct = telemetry?.progressPct ?? 42;
  const currentIdx = telemetry?.currentIdx ?? 0;
  const currentStop = telemetry?.currentStop ?? train.stops[0];
  const nextStop = telemetry?.nextStop ?? train.stops[train.stops.length - 1];

  return (
    <div className="pt-24 pb-20 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--warning)]/40 bg-[var(--warning)]/10 px-3 py-1 text-xs font-mono-tech text-[var(--warning)]">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>LIVE IST SCHEDULE TELEMETRY (SIMULATED) — NOT OFFICIAL NTES FEED</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            Live Corridor Tracking
          </h1>
        </div>

        <div className="w-full md:w-96">
          <label htmlFor="track-train-select" className="block text-xs font-mono-tech uppercase text-[var(--text-secondary)] mb-1.5">
            Select Indian Train ({TRAINS.length} Active Corridors)
          </label>
          <select
            id="track-train-select"
            value={selectedTrainNo}
            onChange={(e) => setSelectedTrainNo(e.target.value)}
            className="w-full h-11 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-sm font-medium"
          >
            {TRAINS.map((t) => (
              <option key={t.number} value={t.number}>
                {t.number} · {t.name} ({t.fromCode}→{t.toCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Corridor Map Canvas */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--border-subtle)] bg-[#0C0D10] text-[#F8F9FC] p-6 space-y-6 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono-tech text-xs text-[#D4FF3F]">
              <Radio className="h-4 w-4 animate-pulse" />
              <span>REAL-TIME IST SCHEDULE SYNC</span>
            </div>
            <div className="flex items-center gap-4 font-mono-tech text-xs text-[#9296A3]">
              <span className="inline-flex items-center gap-1 text-[#F8F9FC]">
                <Gauge className="h-3.5 w-3.5 text-[#D4FF3F]" />
                {telemetry?.currentSpeedKmph ?? train.avgSpeedKmph} km/h
              </span>
              <span>{telemetry?.istTime || 'Syncing IST...'}</span>
            </div>
          </div>

          {/* Interactive SVG Railway Map */}
          <div className="relative rounded-xl border border-[#2A2D35] bg-[#17191F] p-6 min-h-[300px] flex flex-col justify-between">
            <svg viewBox="0 0 600 180" className="w-full h-44" aria-label="Simulated railway route map">
              <defs>
                <linearGradient id="trackGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D4FF3F" />
                  <stop offset="100%" stopColor="#B8A7FF" />
                </linearGradient>
              </defs>

              <path
                d="M 40 120 Q 180 30, 300 95 T 560 65"
                fill="none"
                stroke="#2A2D35"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 40 120 Q 180 30, 300 95 T 560 65"
                fill="none"
                stroke="url(#trackGlow)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="600"
                strokeDashoffset={600 - (600 * progressPct) / 100}
              />

              {train.stops.map((st, idx) => {
                const t = idx / Math.max(train.stops.length - 1, 1);
                const cx = 40 + t * 520;
                const cy = 120 - Math.sin(t * Math.PI) * 55 - t * 55;
                const passed = t * 100 <= progressPct;
                return (
                  <g key={st.stationCode}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={passed ? 7 : 5}
                      fill={passed ? '#D4FF3F' : '#17191F'}
                      stroke={passed ? '#0C0D10' : '#9296A3'}
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={cy + 22}
                      textAnchor="middle"
                      fill="#F8F9FC"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      {st.stationCode}
                    </text>
                  </g>
                );
              })}

              {(() => {
                const t = progressPct / 100;
                const mx = 40 + t * 520;
                const my = 120 - Math.sin(t * Math.PI) * 55 - t * 55;
                return (
                  <g transform={`translate(${mx}, ${my})`}>
                    <circle r="14" fill="#D4FF3F" opacity="0.25" />
                    <circle r="7" fill="#D4FF3F" />
                  </g>
                );
              })()}
            </svg>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#2A2D35] text-xs">
              <div>
                <div className="text-[#9296A3] font-mono-tech">LAST STATION</div>
                <div className="font-display text-sm font-bold mt-0.5">{currentStop.city} ({currentStop.stationCode})</div>
              </div>
              <div>
                <div className="text-[#9296A3] font-mono-tech">NEXT STATION</div>
                <div className="font-display text-sm font-bold text-[#D4FF3F] mt-0.5">
                  {nextStop.city} ({nextStop.stationCode})
                </div>
              </div>
              <div>
                <div className="text-[#9296A3] font-mono-tech">COVERED</div>
                <div className="font-mono-tech text-sm font-semibold mt-0.5">
                  {telemetry?.distanceCoveredKm ?? 0} / {train.distanceKm} km
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-[#9296A3] font-mono-tech">STATUS</div>
                <div className="font-mono-tech text-sm font-semibold text-[#34D399] mt-0.5">
                  On Time (Sim)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Station Timeline */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono-tech text-xs text-[var(--accent-primary)]">{train.number} · {train.category}</div>
              <h2 className="font-display text-xl font-bold">{train.name}</h2>
            </div>
            <button
              type="button"
              onClick={() => setTimelineExpanded(!timelineExpanded)}
              className="p-2 rounded-lg border border-[var(--border-subtle)] cursor-pointer"
              aria-label="Toggle station timeline"
            >
              {timelineExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono-tech text-[var(--text-secondary)]">
              <span>Journey Progress</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--bg-primary)] overflow-hidden">
              <motion.div
                className="h-full bg-[var(--accent-primary)]"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {timelineExpanded && (
            <div className="space-y-3 pt-2 max-h-[420px] overflow-y-auto pr-1">
              {train.stops.map((st, idx) => {
                const passed = idx <= currentIdx;
                return (
                  <div
                    key={st.stationCode}
                    className={`flex items-start justify-between gap-3 rounded-lg border p-3.5 ${
                      passed
                        ? 'border-[var(--accent-primary)]/40 bg-[var(--bg-primary)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-primary)]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          passed ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'
                        }`}
                      />
                      <div>
                        <div className="font-semibold text-sm">
                          {st.city} <span className="font-mono-tech text-xs text-[var(--text-secondary)]">({st.stationCode})</span>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          Day {st.day} · {st.distanceKm} km · PF {st.platform}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono-tech text-xs">
                      <div className="flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3 text-[var(--text-secondary)]" />
                        <span>{st.arrival === 'Origin' ? st.departure : st.arrival}</span>
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)]">
                        {st.haltMinutes > 0 ? `${st.haltMinutes}m halt` : st.arrival}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
