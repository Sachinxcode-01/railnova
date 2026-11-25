import type { Metadata } from 'next';
import Link from 'next/link';
import { RAILNOVA_CONTACT } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Terms & Conditions, payment and cancellation rules, intellectual property notices, and liability limits for RailNova.',
};

export default function TermsPage() {
  return (
      <div className="pt-28 pb-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3 border-b border-(--border-subtle) pb-6">
          <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
            Legal &amp; Compliance
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs font-mono-tech text-(--text-secondary)">
            Last updated: November 25, 2026 · {RAILNOVA_CONTACT.companyName}
          </p>
        </div>

          <div className="space-y-8 text-sm text-(--text-secondary) leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-(--text-primary)">1. Demonstration Platform &amp; Non-Affiliation</h2>
              <p>
                RailNova is a demonstration railway booking and travel discovery platform operated by {RAILNOVA_CONTACT.companyName}. Train schedules, fares, PNR numbers, live telemetry, and digital boarding passes generated on this site are simulated unless live provider keys are explicitly configured, and are not valid for official Indian Railways / IRCTC travel. RailNova is not affiliated with, endorsed by, or an authorized agent of Indian Railways or IRCTC.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-(--text-primary)">2. Eligibility &amp; Account Responsibilities</h2>
              <p>
                You must be at least 18 years old (or have verifiable parental consent) to register an account. You are responsible for safeguarding your account credentials and for all actions taken under your session.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-(--text-primary)">3. Acceptable Use &amp; Rate Limits</h2>
              <p>
                You agree not to bypass rate limits, scrape schedules aggressively, probe administrative endpoints, submit automated spam, or attempt unauthorized access to another user&apos;s PNR or profile records.
              </p>
            </section>

            <section id="payments" className="space-y-2">
              <h2 className="font-display text-xl font-bold text-(--text-primary)">4. Payment, Cancellation &amp; Subscription Terms</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Per-Booking Pricing (No Subscriptions):</strong> RailNova operates strictly on a per-booking basis. There are <strong>no recurring subscriptions, membership fees, or automatic renewals</strong>.</li>
                <li><strong>Fare Breakdown &amp; Taxes:</strong> Displayed totals itemize Base Fare (with applicable quota multipliers and concessions), 5% GST on AC classes, and a flat RailNova convenience fee (₹35 AC / ₹18 Non-AC), verified server-side prior to confirmation.</li>
                <li><strong>Test-Mode Checkout:</strong> Supported payment methods (UPI, Debit/Credit Card, Net Banking, Digital Wallets) run in simulated test mode. No real financial charges are processed and no card/UPI credentials are stored.</li>
                <li><strong>Cancellations &amp; Refunds:</strong> Cancelling a confirmed demonstration booking in <Link href="/dashboard" className="text-(--accent-primary) underline underline-offset-2">My Journeys</Link> immediately records a simulated refund calculation and updates booking status to <code className="font-mono-tech text-(--text-primary)">CANCELLED</code>.</li>
                <li><strong>Idempotency &amp; Duplicate Charges:</strong> Every checkout request includes an idempotency token to prevent accidental duplicate bookings on network retries.</li>
              </ul>
            </section>

            <section id="intellectual-property" className="space-y-2">
              <h2 className="font-display text-xl font-bold text-(--text-primary)">5. Intellectual Property &amp; Attributions</h2>
              <p>
                All RailNova branding, interface designs, custom SVG iconography, layout systems, and original source code are © {new Date().getFullYear()} {RAILNOVA_CONTACT.companyName}. Train names and station codes (such as Vande Bharat, Rajdhani, Shatabdi, IRCTC) remain trademarks of their respective owners and are referenced solely for realistic demonstration context. Editorial photography is served via Unsplash under the Unsplash License. Third-party open-source packages are governed by their respective licences listed on our{' '}
                <Link href="/licenses" className="text-(--accent-primary) underline underline-offset-4">
                  Open-Source Licences
                </Link>{' '}
                page.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-(--text-primary)">6. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, RailNova is provided &ldquo;as is&rdquo; without warranties of uninterrupted availability, timetable accuracy, or fitness for real-world ticketing. We are not liable for missed travel, indirect losses, or reliance on simulated telemetry.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-(--text-primary)">7. Governing Law, Privacy &amp; Contact</h2>
              <p>
                These Terms are governed by the laws of India, with exclusive jurisdiction in Bengaluru, Karnataka, subject to mandatory consumer protections under GDPR/EU law where applicable. Personal data handling is detailed in our{' '}
                <Link href="/privacy" className="text-(--accent-primary) underline underline-offset-4">
                  Privacy Policy
                </Link>
                . Contact us at{' '}
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
