'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Printer, RotateCcw } from 'lucide-react';

export function DigitalTicketSection() {
  const prefersReduced = useReducedMotion();
  const [printCycle, setPrintCycle] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (prefersReduced) return;
    setIsPrinting(true);
    const t = setTimeout(() => setIsPrinting(false), 950);
    return () => clearTimeout(t);
  }, [printCycle, prefersReduced]);

  useEffect(() => {
    QRCode.toDataURL(
      JSON.stringify({
        brand: 'RailNova Demo',
        pnr: '8429104521',
        train: '17309',
        route: 'SBC-MAO',
        demoOnly: true,
      }),
      { width: 148, margin: 1, color: { dark: '#0C0D10', light: '#F5F2EA' } }
    )
      .then(setQrUrl)
      .catch(() => setQrUrl(''));
  }, []);

  return (
    <section
      aria-labelledby="digital-tickets-heading"
      className="py-20 lg:py-28 bg-(--bg-surface) border-b border-(--border-subtle) overflow-hidden"
    >
      <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copy & Reprint Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
              Digital Tickets · Ticket-Printing Animation
            </span>
            <h2
              id="digital-tickets-heading"
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.06]"
            >
              Champagne Ivory boarding passes, minted in an instant.
            </h2>
            <p className="text-sm sm:text-base text-(--text-secondary) leading-relaxed">
              Every RailNova confirmation feeds a tactile, QR-verified boarding pass with perforated stub details, jsPDF download, and 10-digit PNR verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPrintCycle((c) => c + 1)}
              className="inline-flex items-center gap-2 rounded-lg bg-(--accent-primary) px-5 py-3 text-sm font-semibold text-(--accent-on-primary) hover:brightness-95 transition cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reprint Demo Ticket</span>
            </button>

            <Link
              href="/pnr?pnr=8429104521"
              className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-5 py-3 text-sm font-semibold text-(--text-primary) hover:border-(--accent-primary) transition-colors"
            >
              <span>Inspect PNR 8429104521</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-4 font-mono-tech text-xs text-(--text-secondary)">
            DEMO ARTIFACT — Generated passes carry an explicit demonstration watermark and are invalid for official IRCTC travel.
          </div>
        </div>

        {/* Right: Thermal Printer Slot + Animated Ticket Feed */}
        <div className="lg:col-span-7">
          {/* Printer Head Slot */}
          <div className="relative z-20 mx-auto max-w-xl rounded-t-2xl border border-[#2A2D35] bg-[#0C0D10] px-6 py-4 text-[#F8F9FC] shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 font-mono-tech text-xs">
                <Printer className="h-4 w-4 text-[#D4FF3F]" />
                <span>RAILNOVA PASS PRINTER · THERMAL FEED</span>
              </div>
                <div className="flex items-center gap-2 font-mono-tech text-[11px]">
                  <span
                    className={`h-2 w-2 rounded-full ${isPrinting ? 'bg-[#FBBF24] animate-ping' : 'bg-[#34D399] animate-pulse'
                      }`}
                  />
                  <span className={isPrinting ? 'text-[#FBBF24]' : 'text-[#34D399]'}>
                    {isPrinting ? 'PRINTING...' : 'READY'}
                  </span>
                </div>
              </div>
              {/* Physical paper slot lip + thermal print-head beam */}
              <div className="relative mt-3 h-2.5 rounded-full bg-[#17191F] border border-[#2A2D35] shadow-inner overflow-hidden">
                {isPrinting && !prefersReduced && (
                  <motion.div
                    className="h-full w-24 rounded-full bg-linear-to-r from-transparent via-[#D4FF3F] to-transparent"
                    initial={{ x: '-20%' }}
                    animate={{ x: '420%' }}
                    transition={{ duration: 0.85, ease: 'easeInOut' }}
                  />
                )}
              </div>
            </div>

            {/* Emerging Animated Boarding Pass */}
            <div className="mx-auto max-w-135 -mt-1 px-2 sm:px-4 overflow-hidden">
              <motion.div
                key={printCycle}
                initial={
                  prefersReduced
                    ? false
                    : { y: -120, opacity: 0.2, clipPath: 'inset(0 0 100% 0)' }
                }
                whileInView={{ y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-b-2xl border-x border-b border-[#E4E1D9] bg-[#F5F2EA] text-[#0C0D10] shadow-2xl overflow-hidden"
              >
                {/* Pass Top Bar */}
                <div className="bg-[#15171B] text-[#F8F9FC] px-6 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D4FF3F]" />
                    <span className="font-display text-sm font-bold">RailNova Boarding Pass</span>
                  </div>
                  <span className="font-mono-tech text-xs text-[#D4FF3F]">PNR 8429104521</span>
                </div>

                <div className="p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-mono-tech text-[11px] text-[#626672] uppercase">
                        17309 · Mail/Express · 3A
                      </div>
                      <h3 className="font-display text-xl font-bold">Yesvantpur – Goa Express</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#D4FF3F] px-2.5 py-1 text-[11px] font-bold text-[#0C0D10]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>CNF</span>
                    </span>
                  </div>

                  {/* Route Strip */}
                  <div className="grid grid-cols-3 items-center gap-2 py-3 border-y border-[#E4E1D9]">
                    <div>
                      <div className="font-mono-tech text-2xl font-bold">SBC</div>
                      <div className="text-[11px] text-[#626672]">Bengaluru · 14:30</div>
                    </div>
                    <div className="text-center font-mono-tech text-[11px] text-[#626672]">
                      <div>14h 40m</div>
                      <div className="relative my-1.5 h-0.5 w-full bg-[#0C0D10]/20 overflow-hidden">
                        {!prefersReduced && (
                          <motion.span
                            className="absolute top-0 bottom-0 w-6 rounded-full bg-[#466800]"
                            animate={{ x: ['-20%', '480%'] }}
                            transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
                          />
                        )}
                      </div>
                      <div>676 km</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono-tech text-2xl font-bold">MAO</div>
                      <div className="text-[11px] text-[#626672]">Madgaon · 05:10</div>
                    </div>
                  </div>

                  {/* Perforated Tear Line & QR Stub */}
                  <div className="relative pt-4 border-t-2 border-dashed border-[#0C0D10]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 text-xs">
                      <div className="font-mono-tech text-[10px] uppercase text-[#626672]">
                        Passenger &amp; Allocation
                      </div>
                      <div className="font-semibold text-sm">Aarav Sharma (Demo)</div>
                      <div className="font-mono-tech text-[#466800] font-semibold">
                        Coach B2 · Berth 24 (Lower)
                      </div>
                      <div className="text-[10px] font-mono-tech text-[#626672]">
                        DEMO TICKET · NOT VALID FOR ACTUAL TRAVEL
                      </div>
                    </div>

                    {qrUrl ? (
                      <img
                        src={qrUrl}
                        alt="Sample RailNova QR boarding pass code"
                        className="h-24 w-24 rounded-lg border border-[#E4E1D9] shrink-0"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-lg bg-[#E4E1D9] shrink-0" />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
    </section>
  );
}
