import type { Metadata } from 'next';
import Link from 'next/link';
import { RAILNOVA_CONTACT } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing use of the RailNova Indian railway booking demonstration platform.',
};

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-3 border-b border-(--border-subtle) pb-6">
        <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
          Legal &amp; Compliance
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs font-mono-tech text-(--text-secondary)">
          Last updated: November 25, 2026 · RailNova Demonstration Platform
        </p>
      </div>

      <div className="space-y-6 text-sm text-(--text-secondary) leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-(--text-primary)">1. Demonstration Purpose Only</h2>
          <p>
            RailNova is a demonstration and portfolio platform. Train schedules, fares, PNR numbers, live telemetry, and digital boarding passes generated on this site are simulated and are not valid for official Indian Railways / IRCTC travel.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-(--text-primary)">2. Acceptable Use</h2>
          <p>
            You agree not to abuse API endpoints, bypass rate limits, submit automated spam, or attempt unauthorized access to administrative consoles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-(--text-primary)">3. Simulated Bookings &amp; Cancellations</h2>
          <p>
            Booking confirmations, RAC/Waitlist allocations, and refund calculations follow illustrative railway rules for demonstration purposes and carry no monetary obligation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-(--text-primary)">4. Privacy &amp; Contact</h2>
          <p>
            Use of this platform is also governed by our{' '}
            <Link href="/privacy" className="text-(--accent-primary) underline underline-offset-4">
              Privacy Policy
            </Link>
            . Questions may be directed to{' '}
            <a href={`mailto:${RAILNOVA_CONTACT.email}`} className="text-(--accent-primary) underline underline-offset-4">
              {RAILNOVA_CONTACT.email}
            </a>{' '}
            or via our{' '}
            <Link href="/contact" className="text-(--accent-primary) underline underline-offset-4">
              Contact Page
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
