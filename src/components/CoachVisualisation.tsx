'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Accessibility, Info } from 'lucide-react';
import { generateCoachLayout } from '@/lib/railway-data';
import { BerthPreference, BerthType, TravelClassCode } from '@/lib/types';

interface CoachVisualisationProps {
  classCode: TravelClassCode;
  berthPreference: BerthPreference;
  selectedSeat?: string;
  onSelectDemoSeat: (seatNumber: string, berthType: BerthType) => void;
  onChangePreference: (pref: BerthPreference) => void;
}

function matchesPreference(berthType: BerthType, pref: BerthPreference): boolean {
  if (pref === 'LOWER' && berthType === 'LB') return true;
  if (pref === 'MIDDLE' && berthType === 'MB') return true;
  if (pref === 'UPPER' && berthType === 'UB') return true;
  if (pref === 'SIDE_LOWER' && berthType === 'SL') return true;
  if (pref === 'SIDE_UPPER' && berthType === 'SU') return true;
  if (pref === 'WINDOW' && berthType === 'WS') return true;
  return false;
}

export function CoachVisualisation({
  classCode,
  berthPreference,
  selectedSeat,
  onSelectDemoSeat,
  onChangePreference,
}: CoachVisualisationProps) {
  const berths = useMemo(() => generateCoachLayout(classCode), [classCode]);
  const bays = useMemo(() => {
    const map = new Map<number, typeof berths>();
    for (const b of berths) {
      const list = map.get(b.bay) || [];
      list.push(b);
      map.set(b.bay, list);
    }
    return Array.from(map.entries());
  }, [berths]);

  const isChair = classCode === 'CC' || classCode === 'EC' || classCode === '2S';

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono-tech text-xs px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--accent-primary)]">
              COACH {classCode === 'CC' || classCode === 'EC' ? 'C2' : classCode === 'SL' ? 'S4' : 'B2'} (DEMO)
            </span>
            <h3 className="font-display text-base font-bold">Interactive Coach Diagram</h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Select a demonstration berth or set your official berth preference below.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="coach-pref" className="text-xs text-[var(--text-secondary)]">
            Preference:
          </label>
          <select
            id="coach-pref"
            value={berthPreference}
            onChange={(e) => onChangePreference(e.target.value as BerthPreference)}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1.5 text-xs text-[var(--text-primary)]"
          >
            <option value="NO_PREF">No Preference</option>
            {isChair ? (
              <option value="WINDOW">Window Seat (WS)</option>
            ) : (
              <>
                <option value="LOWER">Lower Berth (LB)</option>
                <option value="MIDDLE">Middle Berth (MB)</option>
                <option value="UPPER">Upper Berth (UB)</option>
                <option value="SIDE_LOWER">Side Lower (SL)</option>
                <option value="SIDE_UPPER">Side Upper (SU)</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] border-y border-[var(--border-subtle)] py-2.5">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-xs bg-[#D4FF3F]" />
          <span>Available / Selected (Demo)</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-xs bg-[#B8A7FF]" />
          <span>Matches Preference</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-xs bg-[#FBBF24]" />
          <span>RAC / Waitlist</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-xs bg-[#2A2D35]" />
          <span>Unavailable</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Accessibility className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
          <span>Accessible</span>
        </span>
      </div>

      {/* Coach Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-3 min-w-full">
          {bays.map(([bayNum, items]) => {
            const mainItems = items.filter((i) => !i.side);
            const sideItems = items.filter((i) => i.side);

            return (
              <div
                key={bayNum}
                className="shrink-0 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3 space-y-3 min-w-[140px]"
              >
                <div className="text-[10px] font-mono-tech uppercase tracking-wider text-[var(--text-secondary)] flex justify-between">
                  <span>{isChair ? `Row ${bayNum}` : `Bay ${bayNum}`}</span>
                  <span>{classCode}</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {mainItems.map((b) => {
                    const isSelected = selectedSeat === String(b.number);
                    const isPreferred = b.status === 'AVAILABLE' && matchesPreference(b.berthType, berthPreference);
                    const disabled = b.status === 'OCCUPIED';

                    let styleClass =
                      'border-[#D4FF3F]/50 bg-[#D4FF3F]/15 text-[var(--text-primary)] hover:bg-[#D4FF3F] hover:text-[#0C0D10]';
                    if (isSelected) {
                      styleClass = 'border-[#D4FF3F] bg-[#D4FF3F] text-[#0C0D10] font-bold shadow-md';
                    } else if (disabled) {
                      styleClass = 'border-[#2A2D35] bg-[#1E2129] text-[#626672] cursor-not-allowed opacity-60';
                    } else if (b.status === 'RAC') {
                      styleClass = 'border-[#FBBF24]/60 bg-[#FBBF24]/20 text-[#FBBF24] hover:bg-[#FBBF24] hover:text-[#0C0D10]';
                    } else if (isPreferred) {
                      styleClass = 'border-[#B8A7FF] bg-[#B8A7FF]/25 text-[var(--text-primary)] hover:bg-[#B8A7FF] hover:text-[#0C0D10]';
                    }

                    return (
                      <motion.button
                        key={b.id}
                        type="button"
                        disabled={disabled}
                        whileHover={disabled ? undefined : { scale: 1.04 }}
                        whileTap={disabled ? undefined : { scale: 0.96 }}
                        onClick={() => onSelectDemoSeat(String(b.number), b.berthType)}
                        title={`Seat ${b.number} · ${b.berthType} · ${b.status}`}
                        className={`relative h-10 rounded-md border px-2 text-xs font-mono-tech flex items-center justify-between transition-colors ${
                          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                        } ${styleClass}`}
                      >
                        <span>{b.number}</span>
                        <span className="text-[10px] opacity-85">{b.berthType}</span>
                        {b.accessible && (
                          <Accessibility className="h-3 w-3 absolute -top-1 -right-1 text-[var(--accent-primary)] bg-[var(--bg-primary)] rounded-full" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {sideItems.length > 0 && (
                  <div className="pt-2 border-t border-dashed border-[var(--border-subtle)] grid grid-cols-2 gap-1.5">
                    {sideItems.map((b) => {
                      const isSelected = selectedSeat === String(b.number);
                      const isPreferred = b.status === 'AVAILABLE' && matchesPreference(b.berthType, berthPreference);
                      const disabled = b.status === 'OCCUPIED';

                      let styleClass =
                        'border-[#D4FF3F]/50 bg-[#D4FF3F]/15 text-[var(--text-primary)] hover:bg-[#D4FF3F] hover:text-[#0C0D10]';
                      if (isSelected) {
                        styleClass = 'border-[#D4FF3F] bg-[#D4FF3F] text-[#0C0D10] font-bold';
                      } else if (disabled) {
                        styleClass = 'border-[#2A2D35] bg-[#1E2129] text-[#626672] cursor-not-allowed opacity-60';
                      } else if (b.status === 'RAC') {
                        styleClass = 'border-[#FBBF24]/60 bg-[#FBBF24]/20 text-[#FBBF24]';
                      } else if (isPreferred) {
                        styleClass = 'border-[#B8A7FF] bg-[#B8A7FF]/25 text-[var(--text-primary)]';
                      }

                      return (
                        <motion.button
                          key={b.id}
                          type="button"
                          disabled={disabled}
                          whileHover={disabled ? undefined : { scale: 1.04 }}
                          whileTap={disabled ? undefined : { scale: 0.96 }}
                          onClick={() => onSelectDemoSeat(String(b.number), b.berthType)}
                          className={`h-9 rounded-md border px-2 text-xs font-mono-tech flex items-center justify-between transition-colors ${
                            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                          } ${styleClass}`}
                        >
                          <span>{b.number}</span>
                          <span className="text-[10px] opacity-85">{b.berthType}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Explicit IRCTC / Demo Berth Distinction Notice */}
      <div className="flex items-start gap-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3 text-xs text-[var(--text-secondary)]">
        <Info className="h-4 w-4 shrink-0 text-[var(--accent-lavender)] mt-0.5" />
        <p>
          <strong className="text-[var(--text-primary)]">Berth Allocation Notice:</strong> Interactive seat picking above is a demonstration preview. In standard Indian Railways bookings, passengers submit a berth preference while official coach & berth numbers are assigned by the reservation algorithm.
        </p>
      </div>
    </div>
  );
}
