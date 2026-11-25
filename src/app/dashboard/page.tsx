'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Ticket,
  Users,
  Bell,
  Settings,
  LogOut,
  Trash2,
  Plus,
  ArrowUpRight,
  XCircle,
  Download,
  Mail,
} from 'lucide-react';
import { BookingRecord, PassengerInput } from '@/lib/types';
import { DigitalTicket } from '@/components/DigitalTicket';

interface DashboardUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  savedPassengers: PassengerInput[];
  favouriteRoutes: { fromCode: string; toCode: string }[];
  favouriteDestinations: string[];
  recentSearches: { fromCode: string; toCode: string; date: string }[];
  notifications: { id: string; title: string; message: string; read: boolean; createdAt: string }[];
  marketingConsent?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<BookingRecord | null>(null);

  const [newPaxName, setNewPaxName] = useState('');
  const [newPaxAge, setNewPaxAge] = useState(28);
  const [paxError, setPaxError] = useState<string | null>(null);
  const [addingPax, setAddingPax] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meData.user) {
        router.push('/auth/signin');
        return;
      }
      setUser(meData.user);

      const bRes = await fetch('/api/bookings');
      if (bRes.ok) {
        const bData = await bRes.json();
        setBookings(bData.bookings || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const handleCancelBooking = async (bookingId: string) => {
    setActionError(null);
    try {
      const res = await fetch('/api/cancellations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, reason: 'User requested cancellation' }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setActionError(d.error || 'Could not cancel booking right now.');
        return;
      }
      setStatusMsg('Booking cancelled and demo refund processed.');
      loadData();
    } catch {
      setActionError('Network error while cancelling booking.');
    }
  };

  const handleAddPassenger = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaxError(null);
    if (newPaxName.trim().length < 2) {
      setPaxError('Enter a passenger name (at least 2 characters).');
      return;
    }
    if (!Number.isFinite(newPaxAge) || newPaxAge < 1 || newPaxAge > 120) {
      setPaxError('Enter a valid age between 1 and 120.');
      return;
    }
    setAddingPax(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addPassenger: {
            id: `pax_${Date.now()}`,
            fullName: newPaxName.trim(),
            age: newPaxAge,
            gender: 'Male',
            berthPreference: 'LOWER',
            concession: 'NONE',
          },
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setPaxError(d.error || 'Failed to save passenger.');
        return;
      }
      setNewPaxName('');
      loadData();
    } catch {
      setPaxError('Network error while saving passenger.');
    } finally {
      setAddingPax(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Permanently delete your RailNova account and erase your bookings?')) return;
    await fetch('/api/auth/me', { method: 'DELETE' });
    router.push('/');
    router.refresh();
  };

  const handleToggleMarketing = async () => {
    if (!user) return;
    const nextVal = !user.marketingConsent;
    setActionError(null);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketingConsent: nextVal }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setActionError(d.error || 'Could not update marketing consent right now.');
        return;
      }
      setUser((prev) => (prev ? { ...prev, marketingConsent: nextVal } : prev));
      setStatusMsg(
        nextVal
          ? 'Marketing communications consent enabled.'
          : 'Marketing communications consent withdrawn.'
      );
    } catch {
      setActionError('Network error while updating marketing consent.');
    }
  };

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading your journeys"
        className="pt-28 pb-20 mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="h-12 w-64 rounded-lg bg-(--bg-surface) animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {[1, 2].map((i) => (
                <div key={i} className="h-36 rounded-xl border border-(--border-subtle) bg-(--bg-surface) animate-pulse" />
            ))}
          </div>
          <div className="lg:col-span-4 h-64 rounded-xl border border-(--border-subtle) bg-(--bg-surface) animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
      <div className="pt-24 pb-20 mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-(--border-subtle)">
            <div className="space-y-1">
                <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
                  Traveller Workspace
                </span>
                <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
                  {user.name}
                </h1>
                <p className="text-sm font-mono-tech text-(--text-secondary)">{user.email}</p>
            </div>

            <div className="flex items-center gap-3">
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-(--accent-lavender) px-4 py-2 text-xs font-semibold text-(--accent-lavender)"
                >
                  <span>Admin Console</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-4 py-2 text-xs font-semibold hover:border-(--error) cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {statusMsg && (
              <div role="status" className="rounded-xl border border-(--success)/40 bg-(--success)/10 p-4 text-sm text-(--success)">
                {statusMsg}
              </div>
        )}

              {actionError && (
                  <div role="alert" className="rounded-xl border border-(--error)/40 bg-(--error)/10 p-4 text-sm text-(--error)">
                    {actionError}
                  </div>
        )}

                  {/* Selected Digital Ticket Preview */}
                  {selectedTicket && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h2 className="font-display text-xl font-bold">Boarding Pass · PNR {selectedTicket.pnr}</h2>
                        <button
                          type="button"
                          onClick={() => setSelectedTicket(null)}
                          className="text-xs text-(--text-secondary) hover:text-(--text-primary) cursor-pointer"
                        >
                          Close Preview
                        </button>
                      </div>
                      <DigitalTicket booking={selectedTicket} />
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Bookings List */}
                    <div className="lg:col-span-8 space-y-5">
                      <div className="flex items-center justify-between">
                        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                          <Ticket className="h-5 w-5 text-(--accent-primary)" />
                          <span>Journeys & Bookings</span>
                        </h2>
                          <Link href="/trains" className="text-xs font-semibold text-(--accent-primary)">
                            + Book New Journey
                          </Link>
                      </div>

                      {bookings.length === 0 ? (
                          <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-8 text-center space-y-3">
                            <p className="text-sm text-(--text-secondary)">No bookings yet in this account.</p>
                            <Link
                              href="/trains"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-(--accent-primary) px-4 py-2 text-xs font-semibold text-(--accent-on-primary)"
                            >
                              Search Trains
                            </Link>
                          </div>
                          ) : (
                          <div className="space-y-4">
                            {bookings.map((b) => (
                              <div
                                key={b.id}
                                className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-5 space-y-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                      <div className="font-mono-tech text-xs text-(--accent-primary)">
                                        PNR {b.pnr} · {b.trainNumber} · {b.journeyDate}
                                      </div>
                                      <h3 className="font-display text-lg font-bold mt-0.5">{b.trainName}</h3>
                                        <div className="text-xs font-mono-tech text-(--text-secondary)">
                                          {b.fromCode} ({b.departureTime}) → {b.toCode} ({b.arrivalTime}) · Class {b.classCode}
                                        </div>
                                      </div>
                                      <span
                                        className={`rounded-full px-3 py-1 text-xs font-mono-tech font-semibold ${b.bookingStatus === 'CANCELLED'
                                            ? 'bg-(--error)/15 text-(--error)'
                                            : 'bg-(--success)/15 text-(--success)'
                                          }`}
                                      >
                                        {b.bookingStatus}
                                      </span>
                                    </div>

                                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-(--border-subtle)">
                                        <span className="font-mono-tech text-sm font-semibold">₹{b.totalAmount} (Demo)</span>
                                        <div className="flex items-center gap-2.5">
                                          <button
                                            type="button"
                                            onClick={() => setSelectedTicket(b)}
                                            className="rounded-lg bg-(--accent-primary) px-3.5 py-1.5 text-xs font-semibold text-(--accent-on-primary) cursor-pointer"
                                          >
                                            View Ticket & PDF
                                          </button>
                                          {b.bookingStatus !== 'CANCELLED' && (
                                            <button
                                              type="button"
                                              onClick={() => handleCancelBooking(b.id)}
                                              className="inline-flex items-center gap-1 rounded-lg border border-(--border-subtle) px-3 py-1.5 text-xs text-(--error) hover:border-(--error) cursor-pointer"
                                            >
                                              <XCircle className="h-3.5 w-3.5" />
                                              <span>Cancel</span>
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                ))}
                                  </div>
            )}
                                </div>

                                {/* Right Column: Saved Passengers, Notifications & Settings */}
                                <div className="lg:col-span-4 space-y-6">
                                  {/* Saved Passengers */}
                                    <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-5 space-y-4">
                                      <h2 className="font-display text-lg font-bold flex items-center gap-2">
                                        <Users className="h-4 w-4 text-(--accent-primary)" />
                                        <span>Saved Passengers</span>
                                      </h2>
                                      <div className="space-y-2">
                                        {user.savedPassengers.map((sp) => (
                                          <div
                                            key={sp.id}
                                            className="flex items-center justify-between rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-3 py-2 text-xs"
                                          >
                                            <span>
                                              <strong>{sp.fullName}</strong> ({sp.age})
                                            </span>
                                            <span className="font-mono-tech text-(--text-secondary)">{sp.berthPreference}</span>
                                          </div>
                                        ))}
                                      </div>
                                      <form onSubmit={handleAddPassenger} noValidate className="space-y-2">
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={newPaxName}
                                            aria-label="New passenger full name"
                                            aria-invalid={Boolean(paxError)}
                                            onChange={(e) => {
                                              setNewPaxName(e.target.value);
                                              if (paxError) setPaxError(null);
                                            }}
                                            placeholder="Add passenger name"
                    className={`flex-1 h-9 rounded-lg border bg-(--bg-primary) px-2.5 text-xs ${paxError ? 'border-(--error)' : 'border-(--border-subtle)'
                                              }`}
                                          />
                                          <input
                                            type="number"
                                            min={1}
                                            max={120}
                                            aria-label="New passenger age"
                                            value={newPaxAge}
                                            onChange={(e) => {
                                              setNewPaxAge(Number(e.target.value));
                                              if (paxError) setPaxError(null);
                                            }}
                                            className="w-14 h-9 rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-2 text-xs"
                                          />
                                          <button
                                            type="submit"
                                            disabled={addingPax}
                                            aria-label="Add saved passenger"
                                            className="h-9 px-2.5 rounded-lg bg-(--accent-primary) text-(--accent-on-primary) cursor-pointer disabled:opacity-50"
                                          >
                                            <Plus className="h-4 w-4" />
                                          </button>
                                        </div>
                                        {paxError && (
                                            <p role="alert" className="text-[11px] text-(--error)">
                                              {paxError}
                                            </p>
                )}
                                          </form>
            </div>

                                    {/* Notifications */}
                                      <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-5 space-y-3">
                                        <h2 className="font-display text-lg font-bold flex items-center gap-2">
                                          <Bell className="h-4 w-4 text-(--accent-lavender)" />
                                          <span>Notifications</span>
                                        </h2>
                                        {user.notifications.map((n) => (
                                            <div key={n.id} className="rounded-lg bg-(--bg-primary) p-3 text-xs space-y-1">
                                              <div className="font-semibold">{n.title}</div>
                                              <div className="text-(--text-secondary)">{n.message}</div>
                                            </div>
              ))}
                                          </div>

            {/* Account & GDPR Privacy Controls */ }
                                          <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-5 space-y-4">
                                            <h2 className="font-display text-lg font-bold flex items-center gap-2">
                                              <Settings className="h-4 w-4 text-(--text-secondary)" />
                                              <span>Account &amp; GDPR Privacy</span>
                                            </h2>

                                              <label className="flex items-start justify-between gap-3 rounded-lg border border-(--border-subtle) bg-(--bg-primary) p-3 text-xs cursor-pointer">
                                                <span className="flex items-start gap-2">
                                                  <Mail className="h-3.5 w-3.5 text-(--accent-primary) mt-0.5 shrink-0" />
                                                  <span>
                                                    <strong className="block text-(--text-primary)">Marketing Updates</strong>
                                                    <span className="text-(--text-secondary)">Optional route &amp; fare alerts</span>
                                                  </span>
                                                </span>
                                                <input
                                                  type="checkbox"
                                                  checked={Boolean(user.marketingConsent)}
                                                  onChange={handleToggleMarketing}
                                                  className="mt-0.5 h-4 w-4 accent-(--accent-primary)"
                                                />
                                              </label>

                                              <div className="flex flex-col gap-2 pt-1">
                                                <a
                                                  href="/api/auth/me/export"
                                                  download="railnova-personal-data.json"
                                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--accent-primary) hover:underline"
                                                >
                                                  <Download className="h-3.5 w-3.5" />
                                                  <span>Export My Personal Data (JSON)</span>
                                                </a>
                                                <button
                                                  type="button"
                                                  onClick={handleDeleteAccount}
                                                  className="inline-flex items-center gap-1.5 text-xs text-(--error) hover:underline cursor-pointer text-left"
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                  <span>Delete Account &amp; Erase All Data</span>
                                                </button>
                                              </div>
                                          </div>
          </div>
                                    </div>
                                  </div>
                                  );
  }
