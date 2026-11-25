'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, KeyRound, Smartphone, Mail } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'credentials' | 'otp-demo'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91 90000 00001');
  const [otp, setOtp] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload =
        mode === 'credentials'
          ? { mode: 'credentials', email, password }
          : { mode: 'otp-demo', phone, otp };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Sign in failed.');
        return;
      }
      router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
      router.refresh();
    } catch {
      setError('Network error while signing in.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'google-demo' }),
      });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen grid grid-cols-1 lg:grid-cols-12">
      {/* Left: Form */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[var(--accent-primary)]">
              RailNova Access
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Welcome back.
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Sign in to manage bookings, saved passengers, and digital boarding passes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1">
            <button
              type="button"
              onClick={() => setMode('credentials')}
              className={`flex items-center justify-center gap-2 rounded-md py-2 text-xs font-semibold cursor-pointer ${
                mode === 'credentials'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-on-primary)]'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Email & Password</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('otp-demo')}
              className={`flex items-center justify-center gap-2 rounded-md py-2 text-xs font-semibold cursor-pointer ${
                mode === 'otp-demo'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-on-primary)]'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile OTP (Demo)</span>
            </button>
          </div>

          {error && (
            <div role="alert" className="rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 p-3 text-xs text-[var(--error)]">
              {error}
            </div>
          )}

          {resetSent && (
            <div className="rounded-lg border border-[var(--success)]/40 bg-[var(--success)]/10 p-3 text-xs text-[var(--success)]">
              Password reset link simulated for {email || 'your account'}.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {mode === 'credentials' ? (
              <>
                <div>
                  <label htmlFor="signin-email" className="block text-xs text-[var(--text-secondary)] mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="signin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="traveler@railnova.demo"
                    className="w-full h-11 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 text-sm"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label htmlFor="signin-password" className="text-xs text-[var(--text-secondary)]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setResetSent(true)}
                      className="text-xs text-[var(--accent-primary)] cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="signin-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 text-sm"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="signin-phone" className="block text-xs text-[var(--text-secondary)] mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    id="signin-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="signin-otp" className="block text-xs text-[var(--text-secondary)] mb-1.5">
                    6-Digit OTP (Use 123456 for demo)
                  </label>
                  <input
                    id="signin-otp"
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full h-11 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 font-mono-tech text-sm tracking-widest"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] text-sm font-semibold text-[var(--accent-on-primary)] cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogleDemo}
            disabled={loading}
            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm font-medium hover:border-[var(--accent-primary)] cursor-pointer"
          >
            <KeyRound className="h-4 w-4 text-[var(--accent-lavender)]" />
            <span>Continue with Google (Demo Account)</span>
          </button>

          {/* Quick Demo Fillers */}
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 space-y-2 text-xs">
            <div className="font-mono-tech text-[var(--text-secondary)] uppercase">Quick Demo Fill</div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode('credentials');
                  setEmail('traveler@railnova.demo');
                  setPassword('Travel@RailNova2026');
                }}
                className="rounded border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 hover:border-[var(--accent-primary)] cursor-pointer"
              >
                Fill Traveller
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('credentials');
                  setEmail('admin@railnova.demo');
                  setPassword('Admin@RailNova2026');
                }}
                className="rounded border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 hover:border-[var(--accent-lavender)] cursor-pointer"
              >
                Fill Admin
              </button>
            </div>
          </div>

          <p className="text-xs text-center text-[var(--text-secondary)]">
            New to RailNova?{' '}
            <Link href="/auth/register" className="text-[var(--accent-primary)] font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Split-screen railway imagery */}
      <div className="hidden lg:block lg:col-span-6 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=1400&q=80"
          alt="Train travelling through misty green mountain landscape"
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
            Beyond the Destination
          </div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Your saved travellers, routes, and digital boarding passes in one place.
          </h2>
        </div>
      </div>
    </div>
  );
}
