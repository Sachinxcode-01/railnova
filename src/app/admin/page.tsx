'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, TrainFront, Users, Receipt, Activity, RefreshCw } from 'lucide-react';
import { AuditLog, BookingRecord, Station, Train } from '@/lib/types';

interface AdminPayload {
  metrics: {
    totalUsers: number;
    totalTrains: number;
    totalStations: number;
    totalBookings: number;
    totalRevenue: number;
    pendingCancellations: number;
    systemHealth: string;
  };
  users: { id: string; name: string; email: string; role: string; createdAt: string }[];
  trains: Train[];
  stations: Station[];
  bookings: BookingRecord[];
  auditLogs: AuditLog[];
}

export default function AdminPage() {
  const [data, setData] = useState<AdminPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'BOOKINGS' | 'TRAINS' | 'USERS' | 'AUDIT'>('BOOKINGS');

  const fetchAdmin = async () => {
    setError(null);
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin');
      if (res.status === 403 || res.status === 401) {
        setError('Administrator sign-in required. Use admin@railnova.demo on the Sign In page.');
        return;
      }
      if (!res.ok) {
        setError('Failed to load admin console.');
        return;
      }
      setData(await res.json());
    } catch {
      setError('Network error while loading admin console.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  const toggleChart = async (pnr: string) => {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'TOGGLE_CHART', pnr }),
    });
    fetchAdmin();
  };

  if (error) {
    return (
      <div className="pt-28 pb-20 mx-auto max-w-xl px-4 text-center space-y-4">
        <Shield className="h-10 w-10 mx-auto text-[var(--accent-lavender)]" />
        <h1 className="font-display text-2xl font-bold">Admin Console Access</h1>
        <p className="text-sm text-[var(--text-secondary)]">{error}</p>
        <Link
          href="/auth/signin"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-on-primary)]"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        role="status"
        aria-label="Loading admin telemetry"
        className="pt-28 pb-20 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="h-12 w-72 rounded-lg bg-[var(--bg-surface)] animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] animate-pulse" />
          ))}
        </div>
        <div className="h-72 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono-tech uppercase tracking-widest text-[var(--accent-lavender)]">
            Operations & Governance
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            RailNova Admin Console
          </h1>
        </div>
        <button
          type="button"
          disabled={refreshing}
          onClick={fetchAdmin}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-semibold cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Demo Revenue', value: `₹${data.metrics.totalRevenue}`, icon: Receipt },
          { label: 'Bookings', value: String(data.metrics.totalBookings), icon: Activity },
          { label: 'Trains', value: String(data.metrics.totalTrains), icon: TrainFront },
          { label: 'Users', value: String(data.metrics.totalUsers), icon: Users },
          { label: 'System Health', value: data.metrics.systemHealth, icon: Shield },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-2"
          >
            <m.icon className="h-4 w-4 text-[var(--accent-primary)]" />
            <div className="font-mono-tech text-2xl font-bold">{m.value}</div>
            <div className="text-xs text-[var(--text-secondary)]">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-3">
        {(['BOOKINGS', 'TRAINS', 'USERS', 'AUDIT'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-xs font-mono-tech font-semibold cursor-pointer ${tab === t
                ? 'bg-[var(--accent-primary)] text-[var(--accent-on-primary)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)]'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'BOOKINGS' && (
        <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border-subtle)] font-mono-tech text-[var(--text-secondary)]">
              <tr>
                <th className="p-3.5">PNR</th>
                <th className="p-3.5">Train</th>
                <th className="p-3.5">Route</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Chart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {data.bookings.map((b) => (
                <tr key={b.id}>
                  <td className="p-3.5 font-mono-tech font-semibold">{b.pnr}</td>
                  <td className="p-3.5">{b.trainNumber} · {b.classCode}</td>
                  <td className="p-3.5 font-mono-tech">{b.fromCode}→{b.toCode}</td>
                  <td className="p-3.5 font-mono-tech">{b.bookingStatus}</td>
                  <td className="p-3.5 font-mono-tech">₹{b.totalAmount}</td>
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => toggleChart(b.pnr)}
                      className="rounded border border-[var(--border-subtle)] px-2.5 py-1 font-mono-tech hover:border-[var(--accent-primary)] cursor-pointer"
                    >
                      {b.chartPrepared ? 'Prepared' : 'Mark Prepared'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'TRAINS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.trains.map((t) => (
            <div key={t.number} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-1.5">
              <div className="font-mono-tech text-xs text-[var(--accent-primary)]">{t.number} · {t.category}</div>
              <div className="font-display font-bold">{t.name}</div>
              <div className="text-xs font-mono-tech text-[var(--text-secondary)]">
                {t.fromCode} ({t.departureTime}) → {t.toCode} ({t.arrivalTime})
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'USERS' && (
        <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border-subtle)] font-mono-tech text-[var(--text-secondary)]">
              <tr>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {data.users.map((u) => (
                <tr key={u.id}>
                  <td className="p-3.5 font-semibold">{u.name}</td>
                  <td className="p-3.5 font-mono-tech">{u.email}</td>
                  <td className="p-3.5 font-mono-tech uppercase">{u.role}</td>
                  <td className="p-3.5 font-mono-tech text-[var(--text-secondary)]">{u.createdAt.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'AUDIT' && (
        <div className="space-y-2">
          {data.auditLogs.map((log) => (
            <div
              key={log.id}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs"
            >
              <div>
                <span className="font-mono-tech text-[var(--accent-primary)] mr-2">{log.action}</span>
                <span className="text-[var(--text-primary)]">{log.details}</span>
              </div>
              <div className="font-mono-tech text-[var(--text-secondary)]">
                {log.actorEmail} · {log.timestamp.slice(0, 19).replace('T', ' ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
