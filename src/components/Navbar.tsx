'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ArrowUpRight, User } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const NAV_ITEMS = [
  { label: 'Discover', href: '/discover' },
  { label: 'Book Tickets', href: '/trains' },
  { label: 'PNR Status', href: '/pnr' },
  { label: 'Live Tracking', href: '/live-tracking' },
  { label: 'My Journeys', href: '/dashboard' },
];

export function RailNovaLogo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="24" height="24" rx="6" className="stroke-[var(--border-subtle)] fill-[var(--bg-surface)]" strokeWidth="1.5" />
        <path d="M7 18.5L13.5 9.5H21L14.5 18.5H7Z" className="fill-[var(--accent-primary)]" />
        <path d="M6 21.5H22" className="stroke-[var(--text-primary)]" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)]">
        Rail<span className="text-[var(--accent-primary)]">Nova</span>
      </span>
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isHome = pathname === '/';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 no-print ${
          scrolled || !isHome
            ? 'bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="cursor-pointer focus-visible:outline-2" aria-label="RailNova Home">
            <RailNovaLogo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary Navigation">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-rail"
                      className="absolute bottom-0.5 left-3.5 right-3.5 h-[2px] bg-[var(--accent-primary)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {user ? (
              <Link
                href={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
              >
                <User className="h-4 w-4 text-[var(--accent-primary)]" />
                <span>{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="hidden sm:inline-flex items-center px-3.5 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/trains"
              className="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--accent-on-primary)] transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Find My Train</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              className="flex lg:hidden h-11 w-11 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] cursor-pointer"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[var(--bg-primary)] pt-20 px-6 pb-8 flex flex-col justify-between lg:hidden"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between py-4 border-b border-[var(--border-subtle)] font-display text-2xl font-semibold text-[var(--text-primary)]"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-5 w-5 text-[var(--accent-primary)]" />
                </Link>
              ))}
              {user && user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center justify-between py-4 border-b border-[var(--border-subtle)] font-display text-2xl font-semibold text-[var(--accent-lavender)]"
                >
                  <span>Admin Console</span>
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              )}
            </nav>

            <div className="flex flex-col gap-3">
              <Link
                href={user ? '/dashboard' : '/auth/signin'}
                className="flex h-12 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm font-semibold text-[var(--text-primary)]"
              >
                {user ? `Signed in as ${user.name}` : 'Sign In / Create Account'}
              </Link>
              <Link
                href="/trains"
                className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] text-sm font-semibold text-[var(--accent-on-primary)]"
              >
                <span>Find My Train</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
