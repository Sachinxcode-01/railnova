import type { Metadata } from 'next';
import Link from 'next/link';
import { RAILNOVA_CONTACT } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How RailNova handles demonstration account data, cookies, and analytics.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-20 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-3 border-b border-(--border-subtle) pb-6">
        <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
          Legal &amp; Compliance
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono-tech text-(--text-secondary)">
          Last updated: November 25, 2026 · RailNova Demonstration Platform
        </p>
      </div>

      <div className="space-y-6 text-sm text-(--text-secondary) leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-(--text-primary)">1. Information We Collect</h2>
          <p>
            RailNova is a demonstration railway booking platform. When you create a demo account or submit a booking, we store your name, email address, optional phone number, saved passenger profiles, and simulated PNR records in the application&apos;s local data store.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-(--text-primary)">2. Cookies &amp; Session Storage</h2>
          <p>
            We use an HTTP-only signed session cookie (<code className="font-mono-tech text-(--text-primary)">railnova_session</code>) strictly to keep you signed in. Optional analytics tracking only activates if you choose &ldquo;Accept All&rdquo; in our Cookie Banner.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-(--text-primary)">3. Payment &amp; Sensitive Data</h2>
          <p>
            No real payment card numbers, UPI PINs, or government IDs are collected, processed, or stored. All payment flows operate in simulated test mode.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-(--text-primary)">4. Analytics &amp; Your Choices</h2>
          <p>
            When consented, RailNova records anonymized page-view counts to measure route popularity and performance. You can decline optional cookies at any time by choosing &ldquo;Essential Only&rdquo; or clearing site storage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-(--text-primary)">5. Contact &amp; Grievance Officer</h2>
          <p>
            For privacy questions or data deletion requests, email{' '}
            <a href={`mailto:${RAILNOVA_CONTACT.grievanceEmail}`} className="text-(--accent-primary) underline underline-offset-4">
              {RAILNOVA_CONTACT.grievanceEmail}
            </a>{' '}
            or call{' '}
            <a href={RAILNOVA_CONTACT.phoneHref} className="text-(--accent-primary) underline underline-offset-4">
              {RAILNOVA_CONTACT.phoneDisplay}
            </a>{' '}
            ({RAILNOVA_CONTACT.companyName}, {RAILNOVA_CONTACT.addressLine1}, {RAILNOVA_CONTACT.addressLine2}). You can also use our{' '}
            <Link href="/contact" className="text-(--accent-primary) underline underline-offset-4">
              Contact Page
            </Link>{' '}
            or review our{' '}
            <Link href="/terms" className="text-(--accent-primary) underline underline-offset-4">
              Terms of Service
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
