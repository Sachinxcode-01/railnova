'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not create account.');
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Network error while creating account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen grid grid-cols-1 lg:grid-cols-12">
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[var(--accent-primary)]">
              Create Account
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Join RailNova.
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Create a demonstration traveller profile with saved passengers and instant boarding passes.
            </p>
          </div>

          {error && (
            <div role="alert" className="rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 p-3 text-xs text-[var(--error)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="block text-xs text-[var(--text-secondary)] mb-1.5">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ananya Rao"
                className="w-full h-11 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 text-sm"
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="block text-xs text-[var(--text-secondary)] mb-1.5">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya@domain.com"
                className="w-full h-11 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 text-sm"
              />
            </div>
            <div>
              <label htmlFor="reg-phone" className="block text-xs text-[var(--text-secondary)] mb-1.5">
                Mobile Number (Optional)
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full h-11 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 text-sm"
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-xs text-[var(--text-secondary)] mb-1.5">
                Password (min 8 characters)
              </label>
              <input
                id="reg-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] text-sm font-semibold text-[var(--accent-on-primary)] cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-xs text-center text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-[var(--accent-primary)] font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-6 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1527684651001-731c474bbb5a?auto=format&fit=crop&w=1400&q=80"
          alt="Express passenger train at golden hour"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(12,13,16,0.25) 0%, rgba(12,13,16,0.92) 100%)',
          }}
        />
        <div className="relative z-10 h-full p-12 flex flex-col justify-end text-[#F8F9FC] space-y-3">
          <div className="font-mono-tech text-xs text-[#D4FF3F] uppercase tracking-widest">
            RailNova Membership
          </div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Built for effortless rail journeys across India.
          </h2>
        </div>
      </div>
    </div>
  );
}
