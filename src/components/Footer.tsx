import Link from 'next/link';
import { RailNovaLogo } from './Navbar';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] py-14 no-print">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <RailNovaLogo />
            <p className="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Beyond the Destination. A next-generation Indian railway travel & booking demonstration platform built with precision engineering and editorial craft.
            </p>
            <p className="text-xs font-mono-tech text-[var(--text-secondary)]/80">
              DEMO PLATFORM — Schedules, PNRs, live telemetry, and payments are simulated for demonstration and are not valid for official IRCTC travel.
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Travel</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/trains" className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">Search Trains</Link></li>
              <li><Link href="/discover" className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">Destinations</Link></li>
              <li><Link href="/pnr" className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">PNR Status</Link></li>
              <li><Link href="/live-tracking" className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">Live Tracking</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Account</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/dashboard" className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">My Journeys</Link></li>
              <li><Link href="/auth/signin" className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">Sign In</Link></li>
              <li><Link href="/auth/register" className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">Register</Link></li>
              <li><Link href="/admin" className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">Admin Console</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Demo Credentials</h3>
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 text-xs font-mono-tech space-y-1.5 text-[var(--text-secondary)]">
              <div>Traveller: traveler@railnova.demo</div>
              <div>Pass: Travel@RailNova2026</div>
              <div className="pt-1 border-t border-[var(--border-subtle)]">Demo PNR: 8429104521</div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <span>© {new Date().getFullYear()} RailNova Demonstration Platform.</span>
          <span>Photography via Unsplash (licensed editorial stand-ins).</span>
        </div>
      </div>
    </footer>
  );
}
