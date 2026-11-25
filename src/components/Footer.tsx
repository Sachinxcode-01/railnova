import Link from 'next/link';
import { RailNovaLogo } from './Navbar';
import { RAILNOVA_CONTACT } from '@/lib/contact';

export function Footer() {
  return (
    <footer className="border-t border-(--border-subtle) bg-(--bg-primary) pt-14 pb-24 md:pb-14 no-print">
      <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4 space-y-4">
            <RailNovaLogo />
            <p className="text-sm text-(--text-secondary) max-w-sm leading-relaxed">
              Beyond the Destination. A next-generation Indian railway travel &amp; booking demonstration platform built with precision engineering and editorial craft.
            </p>
            <p className="text-xs font-mono-tech text-(--text-secondary)">
              DEMO PLATFORM — Schedules, PNRs, live telemetry, and payments are simulated for demonstration and are not valid for official IRCTC travel.
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">Travel</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/trains" className="text-(--text-primary) hover:text-(--accent-primary) transition-colors">Search Trains</Link></li>
              <li><Link href="/discover" className="text-(--text-primary) hover:text-(--accent-primary) transition-colors">Destinations</Link></li>
              <li><Link href="/pnr" className="text-(--text-primary) hover:text-(--accent-primary) transition-colors">PNR Status</Link></li>
              <li><Link href="/live-tracking" className="text-(--text-primary) hover:text-(--accent-primary) transition-colors">Live Tracking</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">Account</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/dashboard" className="text-(--text-primary) hover:text-(--accent-primary) transition-colors">My Journeys</Link></li>
              <li><Link href="/auth/signin" className="text-(--text-primary) hover:text-(--accent-primary) transition-colors">Sign In</Link></li>
              <li><Link href="/auth/register" className="text-(--text-primary) hover:text-(--accent-primary) transition-colors">Register</Link></li>
              <li><Link href="/admin" className="text-(--text-primary) hover:text-(--accent-primary) transition-colors">Admin Console</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">Contact &amp; Support</h3>
              <div className="text-xs space-y-1 text-(--text-secondary)">
                <div className="font-semibold text-(--text-primary)">{RAILNOVA_CONTACT.companyName}</div>
                <div>
                  Email:{' '}
                  <a href={`mailto:${RAILNOVA_CONTACT.email}`} className="text-(--accent-primary) hover:underline">
                    {RAILNOVA_CONTACT.email}
                  </a>
                </div>
                <div>
                  Helpline:{' '}
                  <a href={RAILNOVA_CONTACT.phoneHref} className="font-mono-tech text-(--text-primary) hover:text-(--accent-primary)">
                    {RAILNOVA_CONTACT.phoneDisplay}
                  </a>{' '}
                  ({RAILNOVA_CONTACT.hours})
                </div>
                <div>{RAILNOVA_CONTACT.addressLine1}, {RAILNOVA_CONTACT.addressLine2}</div>
                <div className="pt-1">
                  <Link href="/contact" className="text-(--accent-primary) font-semibold hover:underline">
                    Open Contact Desk →
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-(--border-subtle) bg-(--bg-surface) p-3 text-xs font-mono-tech space-y-1 text-(--text-secondary)">
              <div className="text-[10px] uppercase tracking-wider text-(--text-primary)">Demo Credentials</div>
              <div>Traveller: traveler@railnova.demo · Pass: Travel@RailNova2026</div>
              <div>Demo PNR: 8429104521</div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-(--border-subtle) flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-(--text-secondary)">
          <span>© {new Date().getFullYear()} {RAILNOVA_CONTACT.companyName}</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/contact" className="hover:text-(--accent-primary) transition-colors">
              Contact Us
            </Link>
            <Link href="/privacy" className="hover:text-(--accent-primary) transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-(--accent-primary) transition-colors">
              Terms of Service
            </Link>
            <span>Photography via Unsplash (licensed editorial stand-ins).</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
