import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Compass, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 — Track Not Found',
  description: 'The requested RailNova page or corridor could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-24 text-center space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-(--border-subtle) bg-(--bg-surface) px-3.5 py-1.5 text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
        Signal 404 · Route Not Found
      </div>
      <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight max-w-xl">
        This track leads beyond our network.
      </h1>
      <p className="text-sm sm:text-base text-(--text-secondary) max-w-md leading-relaxed">
        The page you requested may have moved or does not exist. Return to the main concourse or search active railway corridors.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-(--accent-primary) px-5 py-3 text-sm font-semibold text-(--accent-on-primary)"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/trains"
          className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-5 py-3 text-sm font-semibold hover:border-(--accent-primary)"
        >
          <Search className="h-4 w-4 text-(--accent-primary)" />
          <span>Search Trains</span>
        </Link>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-5 py-3 text-sm font-semibold hover:border-(--accent-primary)"
        >
          <Compass className="h-4 w-4 text-(--accent-lavender)" />
          <span>Discover</span>
        </Link>
      </div>
    </div>
  );
}
