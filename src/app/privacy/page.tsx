import type { Metadata } from 'next';
import Link from 'next/link';
import { RAILNOVA_CONTACT } from '@/lib/contact';
import { CookieSettingsButton } from '@/components/CookieSettingsButton';

export const metadata: Metadata = {
  title: 'Privacy Policy & GDPR Compliance',
  description:
    'RailNova Privacy Policy, GDPR rights, legal bases for processing, cookie consent, retention schedule, DPAs, security controls, and breach procedures.',
};

const LEGAL_BASES = [
  {
    activity: 'Account registration, authentication & saved passenger profiles',
    data: 'Name, email, optional phone, hashed password, traveller profile',
    basis: 'Performance of a Contract (GDPR Art. 6(1)(b))',
  },
  {
    activity: 'Simulated ticket booking, PNR generation & cancellation handling',
    data: 'Journey details, passenger names/ages, contact email/phone, PNR',
    basis: 'Performance of a Contract (GDPR Art. 6(1)(b))',
  },
  {
    activity: 'Session security, rate limiting & spam/abuse prevention',
    data: 'Signed session token, IP-scoped rate-limit counters, audit logs',
    basis: 'Legitimate Interests (GDPR Art. 6(1)(f))',
  },
  {
    activity: 'Optional analytics (page views & route search metrics)',
    data: 'Visited route paths, search counts, GA4 telemetry (if configured)',
    basis: 'Explicit Consent (GDPR Art. 6(1)(a))',
  },
  {
    activity: 'Optional marketing alerts & corridor updates',
    data: 'Email address and opt-in marketing preference flag',
    basis: 'Explicit Consent (GDPR Art. 6(1)(a))',
  },
  {
    activity: 'Compliance with tax, fraud, or statutory requests',
    data: 'Transaction references & audit records',
    basis: 'Legal Obligation (GDPR Art. 6(1)(c))',
  },
];

const RETENTION_SCHEDULE = [
  { category: 'Signed session cookie (railnova_session)', period: '7 days (or cleared immediately on sign-out / erasure)' },
  { category: 'User accounts & saved passenger profiles', period: 'Active lifetime of account; erased immediately upon deletion' },
  { category: 'Demonstration booking, PNR & cancellation records', period: '12 months from journey date, or immediately upon account deletion' },
  { category: 'In-memory analytics & event aggregates', period: 'Session/process lifetime (up to 90 days rolling if persisted); GA4 up to 14 months' },
  { category: 'Security & administrative audit logs', period: '180 days (redacted upon user erasure)' },
  { category: 'Encrypted local database backups', period: '30 days rolling rotation' },
];

const THIRD_PARTIES = [
  {
    provider: 'Google Analytics 4 (Optional)',
    purpose: 'Aggregated usage & funnel analytics when user grants Analytics consent',
    safeguard: 'IP anonymization enabled; blocked unless user opts in via Cookie Banner',
  },
  {
    provider: 'Unsplash Editorial CDN',
    purpose: 'Serving licensed destination and railway photography via Next.js Image Optimization',
    safeguard: 'HTTPS-only delivery; no personal booking or passenger data shared',
  },
  {
    provider: 'Live Railway Data APIs (Optional / RailKit)',
    purpose: 'Live train schedules or PNR status when server-side API keys are configured',
    safeguard: 'Server-side only requests; only train number or PNR queried',
  },
  {
    provider: 'Payment Gateway (Simulated Test Mode)',
    purpose: 'Checkout workflow demonstration (UPI / Card / NetBanking / Wallet)',
    safeguard: 'No real card numbers, CVVs, or UPI PINs are collected or transmitted',
  },
];

export default function PrivacyPolicyPage() {
  return (
      <div className="pt-28 pb-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3 border-b border-(--border-subtle) pb-6">
          <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
            Legal, Privacy &amp; Data Governance
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Privacy Policy &amp; GDPR Notice
          </h1>
          <p className="text-xs font-mono-tech text-(--text-secondary)">
            Last updated: November 25, 2026 · Data Controller: {RAILNOVA_CONTACT.companyName}
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <CookieSettingsButton className="rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-3 py-1.5 font-semibold text-(--accent-primary) hover:border-(--accent-primary) cursor-pointer" />
            <Link
              href="/dashboard"
              className="rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-3 py-1.5 font-semibold hover:border-(--accent-primary)"
            >
              Manage Data &amp; Erasure in Dashboard
            </Link>
            <Link
              href="/terms"
              className="rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-3 py-1.5 font-semibold hover:border-(--accent-primary)"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>

            <div className="space-y-8 text-sm text-(--text-secondary) leading-relaxed">
              <section id="controller" className="space-y-2">
                <h2 className="font-display text-xl font-bold text-(--text-primary)">1. Data Controller &amp; Scope</h2>
                <p>
                  {RAILNOVA_CONTACT.companyName} (&ldquo;RailNova&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) acts as the data controller for personal data processed through this railway booking demonstration platform. We process personal data in alignment with the EU General Data Protection Regulation (GDPR) and India&apos;s Digital Personal Data Protection Act (DPDPA).
                </p>
              </section>

                <section id="collection" className="space-y-2">
                  <h2 className="font-display text-xl font-bold text-(--text-primary)">2. Information We Collect</h2>
                  <p>
                    When you register or create a demonstration booking, we collect your full name, email address, optional mobile number, saved passenger profiles, booking/PNR records, and optional marketing consent preferences. No real payment card numbers, CVVs, UPI PINs, or government ID numbers are collected or stored.
                  </p>
                </section>

                  <section id="legal-basis" className="space-y-3">
                    <h2 className="font-display text-xl font-bold text-(--text-primary)">3. Legal Basis for Data Processing</h2>
                    <p>Every processing activity on RailNova relies on a documented lawful basis under GDPR Article 6:</p>
                    <div className="overflow-x-auto rounded-xl border border-(--border-subtle) bg-(--bg-surface)">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-(--border-subtle) font-mono-tech text-(--text-primary)">
                          <tr>
                            <th className="p-3">Activity</th>
                            <th className="p-3">Data Categories</th>
                            <th className="p-3">Lawful Basis</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-(--border-subtle)">
                          {LEGAL_BASES.map((row) => (
                            <tr key={row.activity}>
                              <td className="p-3 font-medium text-(--text-primary)">{row.activity}</td>
                              <td className="p-3">{row.data}</td>
                              <td className="p-3 font-mono-tech text-(--accent-primary)">{row.basis}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section id="cookies" className="space-y-2">
                    <h2 className="font-display text-xl font-bold text-(--text-primary)">4. Cookie Consent &amp; Preference Controls</h2>
                    <p>
                      We separate cookies into three categories: (a) <strong>Strictly Necessary</strong> (<code className="font-mono-tech text-(--text-primary)">railnova_session</code> HTTP-only signed session cookie and consent state), (b) <strong>Analytics</strong> (anonymized route and page-view counts, disabled unless you consent), and (c) <strong>Marketing &amp; Alerts</strong> (optional corridor notifications, disabled by default). You may update or withdraw cookie consent at any time using{' '}
                      <CookieSettingsButton
                        label="Manage Cookie Preferences"
                        className="text-(--accent-primary) underline underline-offset-4 cursor-pointer"
                      />.
                    </p>
                  </section>

                    <section id="marketing" className="space-y-2">
                      <h2 className="font-display text-xl font-bold text-(--text-primary)">5. Marketing Consent</h2>
                      <p>
                        Marketing communications are strictly opt-in and unchecked by default during account registration. You can toggle or withdraw marketing consent at any time from your{' '}
                        <Link href="/dashboard" className="text-(--accent-primary) underline underline-offset-4">
                          Account &amp; GDPR Privacy panel
                        </Link>{' '}
                        or by emailing{' '}
                        <a href={`mailto:${RAILNOVA_CONTACT.grievanceEmail}`} className="text-(--accent-primary) underline underline-offset-4">
                          {RAILNOVA_CONTACT.grievanceEmail}
                        </a>.
                      </p>
                    </section>

                      <section id="gdpr-rights" className="space-y-2">
                        <h2 className="font-display text-xl font-bold text-(--text-primary)">6. GDPR &amp; Data Subject Rights</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                          <li><strong>Right of Access &amp; Portability (Art. 15 &amp; 20):</strong> Download a machine-readable JSON copy of your profile, saved passengers, and bookings anytime from <Link href="/dashboard" className="text-(--accent-primary) underline underline-offset-2">My Journeys</Link>.</li>
                          <li><strong>Right to Rectification (Art. 16):</strong> Update your profile or passenger details via your dashboard or support desk.</li>
                          <li><strong>Right to Erasure (Art. 17):</strong> Permanently delete your account and associated bookings in one click from your dashboard.</li>
                          <li><strong>Right to Restrict or Object (Art. 18 &amp; 21):</strong> Withdraw optional analytics/marketing consent via Cookie Settings or dashboard toggles.</li>
                          <li><strong>Right to Lodge a Complaint (Art. 77):</strong> You may contact your local EU supervisory authority or India&apos;s Data Protection Board if concerns remain unresolved.</li>
                        </ul>
                      </section>

                      <section id="deletion" className="space-y-2">
                        <h2 className="font-display text-xl font-bold text-(--text-primary)">7. Data Deletion Procedures</h2>
                        <p>
                          Signed-in users can trigger immediate self-service erasure under <strong>Account &amp; GDPR Privacy → Delete Account &amp; Erase All Data</strong> in the{' '}
                          <Link href="/dashboard" className="text-(--accent-primary) underline underline-offset-4">
                            Dashboard
                          </Link>. This removes your user profile, clears your session cookie, deletes your personal bookings and cancellation records, and redacts audit actor details. Requests sent to{' '}
                          <a href={`mailto:${RAILNOVA_CONTACT.grievanceEmail}`} className="text-(--accent-primary) underline underline-offset-4">
                            {RAILNOVA_CONTACT.grievanceEmail}
                          </a>{' '}
                          are completed within 30 calendar days.
                        </p>
                      </section>

                      <section id="retention" className="space-y-3">
                        <h2 className="font-display text-xl font-bold text-(--text-primary)">8. Data Retention Schedule</h2>
                        <div className="overflow-x-auto rounded-xl border border-(--border-subtle) bg-(--bg-surface)">
                          <table className="w-full text-left text-xs">
                            <thead className="border-b border-(--border-subtle) font-mono-tech text-(--text-primary)">
                              <tr>
                                <th className="p-3">Data Category</th>
                                <th className="p-3">Retention Period</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-(--border-subtle)">
                              {RETENTION_SCHEDULE.map((item) => (
                                <tr key={item.category}>
                                  <td className="p-3 font-medium text-(--text-primary)">{item.category}</td>
                                  <td className="p-3">{item.period}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </section>

                      <section id="dpa" className="space-y-2">
                        <h2 className="font-display text-xl font-bold text-(--text-primary)">9. Data Processing Agreements (DPA)</h2>
                        <p>
                          Where RailNova processes personal data on behalf of enterprise or travel-partner accounts, we execute a GDPR Article 28 Data Processing Agreement incorporating Standard Contractual Clauses (SCCs) for cross-border transfers and binding confidentiality, sub-processor oversight, and deletion obligations. Enterprise customers may request a countersigned DPA from{' '}
                          <a href={`mailto:${RAILNOVA_CONTACT.grievanceEmail}`} className="text-(--accent-primary) underline underline-offset-4">
                            {RAILNOVA_CONTACT.grievanceEmail}
                          </a>.
                        </p>
                      </section>

                      <section id="third-parties" className="space-y-3">
                        <h2 className="font-display text-xl font-bold text-(--text-primary)">10. Third-Party Disclosures</h2>
                        <p>We do not sell personal data. External services receive only the minimum technical data required:</p>
                        <div className="overflow-x-auto rounded-xl border border-(--border-subtle) bg-(--bg-surface)">
                          <table className="w-full text-left text-xs">
                            <thead className="border-b border-(--border-subtle) font-mono-tech text-(--text-primary)">
                              <tr>
                                <th className="p-3">Recipient / Service</th>
                                <th className="p-3">Purpose</th>
                                <th className="p-3">Safeguard</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-(--border-subtle)">
                              {THIRD_PARTIES.map((tp) => (
                                <tr key={tp.provider}>
                                  <td className="p-3 font-medium text-(--text-primary)">{tp.provider}</td>
                                  <td className="p-3">{tp.purpose}</td>
                                  <td className="p-3">{tp.safeguard}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </section>

                      <section id="security" className="space-y-2">
                        <h2 className="font-display text-xl font-bold text-(--text-primary)">11. Data Security Measures</h2>
                        <p>
                          RailNova implements defense-in-depth technical safeguards: per-user salted <code className="font-mono-tech text-(--text-primary)">scrypt</code> password hashing with constant-time verification, HMAC-SHA256 signed <code className="font-mono-tech text-(--text-primary)">HttpOnly</code> <code className="font-mono-tech text-(--text-primary)">SameSite=Lax</code> session cookies, strict HTTP security headers (<code className="font-mono-tech text-(--text-primary)">Strict-Transport-Security</code>, <code className="font-mono-tech text-(--text-primary)">X-Frame-Options: DENY</code>, <code className="font-mono-tech text-(--text-primary)">X-Content-Type-Options: nosniff</code>), Zod payload validation, honeypot bot traps, and sliding-window API rate limiting.
                        </p>
                      </section>

                      <section id="breach" className="space-y-2">
                        <h2 className="font-display text-xl font-bold text-(--text-primary)">12. Data Breach Notification Procedures</h2>
                        <p>
                          In the event of a confirmed personal data breach, our incident response team immediately revokes affected session secrets, isolates compromised endpoints, and performs forensic root-cause analysis. Where required under GDPR Article 33, we notify the relevant supervisory authority within <strong>72 hours</strong> of becoming aware of the breach, and notify affected users without undue delay under GDPR Article 34 when high risk is identified. Report suspected vulnerabilities to{' '}
                          <a href={`mailto:${RAILNOVA_CONTACT.grievanceEmail}`} className="text-(--accent-primary) underline underline-offset-4">
                            {RAILNOVA_CONTACT.grievanceEmail}
                          </a>.
                        </p>
                      </section>

                      <section id="contact" className="space-y-2">
                        <h2 className="font-display text-xl font-bold text-(--text-primary)">13. Contact &amp; Data Protection Officer</h2>
                        <p>
                          {RAILNOVA_CONTACT.companyName} · {RAILNOVA_CONTACT.addressLine1}, {RAILNOVA_CONTACT.addressLine2}. Email:{' '}
                          <a href={`mailto:${RAILNOVA_CONTACT.grievanceEmail}`} className="text-(--accent-primary) underline underline-offset-4">
                            {RAILNOVA_CONTACT.grievanceEmail}
                          </a>{' '}
                          · Helpline:{' '}
                          <a href={RAILNOVA_CONTACT.phoneHref} className="text-(--accent-primary) underline underline-offset-4">
                            {RAILNOVA_CONTACT.phoneDisplay}
                          </a>{' '}
                          ·{' '}
                          <Link href="/contact" className="text-(--accent-primary) underline underline-offset-4">
                            Contact Desk
                          </Link>.
                        </p>
                      </section>
                    </div>
                  </div>
                  );
}
