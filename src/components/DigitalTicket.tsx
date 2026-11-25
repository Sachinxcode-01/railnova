'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';
import { Download, Printer, Share2, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { BookingRecord } from '@/lib/types';

interface DigitalTicketProps {
  booking: BookingRecord;
}

export function DigitalTicket({ booking }: DigitalTicketProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [sharedMsg, setSharedMsg] = useState<string | null>(null);

  useEffect(() => {
    const payload = JSON.stringify({
      brand: 'RailNova Demo',
      pnr: booking.pnr,
      ref: booking.bookingReference,
      train: booking.trainNumber,
      route: `${booking.fromCode}-${booking.toCode}`,
      date: booking.journeyDate,
      demoOnly: true,
    });
    QRCode.toDataURL(payload, { width: 180, margin: 1, color: { dark: '#0C0D10', light: '#F5F2EA' } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''));
  }, [booking]);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFillColor(245, 242, 234);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(12, 13, 16);
    doc.setFontSize(20);
    doc.text('RAILNOVA — DEMONSTRATION BOARDING PASS', 15, 22);
    doc.setFontSize(10);
    doc.setTextColor(180, 40, 40);
    doc.text('INVALID FOR ACTUAL TRAVEL — DEMONSTRATION TICKET ONLY', 15, 30);

    doc.setTextColor(12, 13, 16);
    doc.setFontSize(12);
    doc.text(`PNR: ${booking.pnr}   |   Ref: ${booking.bookingReference}`, 15, 44);
    doc.text(`Train: ${booking.trainNumber} ${booking.trainName}`, 15, 54);
    doc.text(`Route: ${booking.fromCode} (${booking.departureTime}) -> ${booking.toCode} (${booking.arrivalTime})`, 15, 64);
    doc.text(`Date: ${booking.journeyDate}   |   Class: ${booking.className} (${booking.classCode})   |   Quota: ${booking.quota}`, 15, 74);
    doc.text(`Total Paid (Demo): INR ${booking.totalAmount}`, 15, 84);

    doc.text('Passengers:', 15, 98);
    booking.passengers.forEach((p, idx) => {
      doc.text(
        `${idx + 1}. ${p.fullName} (${p.age}/${p.gender}) — ${p.bookingStatus} ${p.assignedCoach || ''} ${p.assignedBerth || ''}`,
        18,
        108 + idx * 9
      );
    });

    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', 150, 40, 42, 42);
    }

    doc.save(`RailNova-Demo-Ticket-${booking.pnr}.pdf`);
  };

  const handleShare = async () => {
    const text = `RailNova Demo Ticket · PNR ${booking.pnr} · ${booking.trainNumber} ${booking.fromCode}→${booking.toCode} on ${booking.journeyDate}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'RailNova Boarding Pass (Demo)', text });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    await navigator.clipboard?.writeText(text);
    setSharedMsg('Ticket summary copied to clipboard');
    setTimeout(() => setSharedMsg(null), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, clipPath: 'inset(0 0 100% 0)' }}
      animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      {/* Demo Warning Banner */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-[#FBBF24]/50 bg-[#FBBF24]/10 px-4 py-2.5 text-xs text-[#FBBF24]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="font-semibold uppercase tracking-wider">
            Demonstration Ticket — Invalid for Actual Railway Travel
          </span>
        </div>
        <span className="font-mono-tech hidden sm:inline">DEMO MODE</span>
      </div>

      {/* Champagne Ivory Boarding Pass */}
      <div className="relative rounded-2xl bg-[#F5F2EA] text-[#0C0D10] shadow-2xl overflow-hidden border border-[#E4E1D9]">
        {/* Top Header Band */}
        <div className="bg-[#0C0D10] text-[#F8F9FC] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-[#D4FF3F]" />
            <span className="font-display text-lg font-bold tracking-tight">
              Rail<span className="text-[#D4FF3F]">Nova</span> Boarding Pass
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono-tech text-xs">
            <span>PNR: <strong className="text-[#D4FF3F]">{booking.pnr}</strong></span>
            <span className="text-[#9296A3]">REF: {booking.bookingReference}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Journey Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono-tech uppercase tracking-wider text-[#626672]">
                  {booking.category} · {booking.trainNumber}
                </div>
                <h2 className="font-display text-2xl font-bold text-[#0C0D10]">{booking.trainName}</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4FF3F] px-3 py-1 text-xs font-bold text-[#0C0D10]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{booking.bookingStatus}</span>
              </span>
            </div>

            <div className="grid grid-cols-3 items-center gap-4 py-4 border-y border-[#E4E1D9]">
              <div>
                <div className="font-mono-tech text-3xl font-bold">{booking.fromCode}</div>
                <div className="text-xs text-[#626672]">{booking.fromName}</div>
                <div className="font-mono-tech text-sm font-semibold mt-1">{booking.departureTime}</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-xs font-mono-tech text-[#626672]">{booking.durationLabel}</div>
                <div className="h-[2px] w-full bg-[#0C0D10]/20 relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#0C0D10]" />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#527A00]" />
                </div>
                <div className="text-[11px] font-mono-tech text-[#626672]">{booking.journeyDate}</div>
              </div>
              <div className="text-right">
                <div className="font-mono-tech text-3xl font-bold">{booking.toCode}</div>
                <div className="text-xs text-[#626672]">{booking.toName}</div>
                <div className="font-mono-tech text-sm font-semibold mt-1">{booking.arrivalTime}</div>
              </div>
            </div>

            {/* Passengers Table */}
            <div className="space-y-2">
              <div className="text-xs font-mono-tech uppercase tracking-wider text-[#626672]">
                Passengers · {booking.className} ({booking.classCode}) · Quota {booking.quota}
              </div>
              <div className="divide-y divide-[#E4E1D9] rounded-lg border border-[#E4E1D9] bg-white">
                {booking.passengers.map((p, i) => (
                  <div key={p.id} className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <div>
                      <span className="font-mono-tech text-xs text-[#626672] mr-2">0{i + 1}</span>
                      <span className="font-semibold">{p.fullName}</span>
                      <span className="text-xs text-[#626672] ml-2">
                        ({p.age}, {p.gender})
                      </span>
                    </div>
                    <div className="font-mono-tech text-xs font-semibold">
                      <span className="text-[#527A00]">{p.bookingStatus}</span>
                      {p.assignedCoach && <span className="ml-2">· {p.assignedCoach} / {p.assignedBerth}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Perforated QR Stub */}
          <div className="lg:col-span-4 lg:border-l lg:border-dashed lg:border-[#0C0D10]/25 lg:pl-6 flex flex-col items-center justify-center text-center space-y-3">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Demonstration ticket QR code" className="h-36 w-36 rounded-lg border border-[#E4E1D9]" />
            ) : (
              <div className="h-36 w-36 rounded-lg bg-[#E4E1D9] animate-pulse" />
            )}
            <div className="font-mono-tech text-xs text-[#626672]">
              Total Paid: <strong className="text-[#0C0D10]">₹{booking.totalAmount}</strong>
            </div>
            <div className="text-[10px] font-mono-tech uppercase tracking-wider text-[#626672]">
              DEMO BOARDING PASS · NOT VALID FOR TRAVEL
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-on-primary)] cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--accent-primary)] cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Ticket</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--accent-primary)] cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Booking</span>
          </button>
        </div>

        <Link
          href={`/pnr?pnr=${booking.pnr}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-primary)]"
        >
          <span>View PNR Status</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {sharedMsg && (
        <div className="text-xs font-mono-tech text-[var(--success)]">{sharedMsg}</div>
      )}
    </motion.div>
  );
}
