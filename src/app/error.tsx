'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
      <div className="font-mono-tech text-xs uppercase tracking-widest text-[var(--error)]">
        Application Recovery
      </div>
      <h1 className="font-display text-3xl font-bold">Something interrupted this journey.</h1>
      <p className="text-sm text-[var(--text-secondary)] max-w-md">
        {error.message || 'An unexpected error occurred. You can retry or return home.'}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-on-primary)] cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[var(--border-subtle)] px-4 py-2.5 text-sm font-semibold"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
