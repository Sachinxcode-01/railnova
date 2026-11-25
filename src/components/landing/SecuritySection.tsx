import React from 'react';
import Link from 'next/link';
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
  return (
    <section
      aria-labelledby="security-heading"
      className="py-20 lg:py-24 bg-(--bg-primary) border-b border-(--border-subtle)"
    >
      <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-(--border-subtle)">
          {SECURITY_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.code}
                className="border-r border-b border-(--border-subtle) bg-(--bg-primary) p-6 sm:p-7 space-y-4"
              >
                <div className="flex items-center justify-between text-(--text-secondary)">
                  <span className="font-mono-tech text-xs">{pillar.code}</span>
                  <Icon className="h-4 w-4 text-(--text-primary)" />
                </div>
                <h3 className="font-display text-lg font-bold text-(--text-primary)">
                  {pillar.title}
                </h3>
                <p className="text-sm text-(--text-secondary) leading-relaxed">
                  {pillar.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
