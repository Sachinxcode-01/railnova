'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, FileCheck, KeyRound, Lock, ShieldCheck } from 'lucide-react';

const SECURITY_PILLARS = [
  {
    code: '01',
    title: 'HMAC-Signed Session Cookies',
    detail:
      'Authentication sessions use signed HttpOnly, SameSite=Lax cookies so session state cannot be tampered with client-side.',
    icon: KeyRound,
  },
  {
    code: '02',
    title: 'Strict Zod Schema Validation',
    detail:
      'Every search, booking, PNR, and assistant payload is validated at runtime against typed Zod schemas before touching persistence.',
    icon: FileCheck,
  },
  {
    code: '03',
    title: 'Hardened Headers & Rate Limits',
    detail:
      'Protected with HSTS, X-Frame-Options: DENY, nosniff headers, and server-side rate limiting across auth and assistant routes.',
    icon: Lock,
  },
  {
    code: '04',
    title: 'Transparent Demo Isolation',
    detail:
      'Simulated payments, PNRs, and IST telemetry are strictly isolated and clearly marked so no real financial or IRCTC data is exposed.',
    icon: ShieldCheck,
  },
];

export function SecuritySection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="security-heading"
      className="py-20 lg:py-24 bg-(--bg-primary) border-b border-(--border-subtle)"
    >
      <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-12">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end"
          >
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-(--text-secondary)">
                Security &amp; Trust Architecture
              </span>
              <h2
                id="security-heading"
                className="font-display text-3xl sm:text-4xl font-bold tracking-tight"
              >
                Built with disciplined engineering defaults.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--text-primary) hover:text-(--accent-primary) transition-colors border-b border-(--border-subtle) pb-1"
              >
                <span>Review Privacy &amp; Security Policy</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-(--border-subtle)">
          {
            SECURITY_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                  <motion.div
                key={pillar.code}
                  initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={prefersReduced ? undefined : { y: -2 }}
                  className="group border-r border-b border-(--border-subtle) bg-(--bg-primary) p-6 sm:p-7 space-y-4 transition-colors hover:bg-(--bg-surface)/40"
                >
                  <div className="flex items-center justify-between text-(--text-secondary)">
                    <span className="font-mono-tech text-xs">{pillar.code}</span>
                    <Icon className="h-4 w-4 text-(--text-primary) transition-transform group-hover:scale-110 group-hover:text-(--accent-primary)" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-(--text-primary)">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-(--text-secondary) leading-relaxed">
                    {pillar.detail}
                  </p>
              </motion.div>
      );
          })}
    </div>
      </div >
    </section >
  );
}
