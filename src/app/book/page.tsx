'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Plus,
  Trash2,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { TRAINS, QUOTA_LABELS } from '@/lib/railway-data';
import {
  BerthPreference,
  BookingQuotaCode,
  BookingRecord,
  PassengerInput,
  TravelClassCode,
} from '@/lib/types';
import { CoachVisualisation } from '@/components/CoachVisualisation';
import { DigitalTicket } from '@/components/DigitalTicket';
import { trackAnalyticsEvent } from '@/components/Analytics';

const STEPS = [
  'Train',
  'Class',
  'Passengers',
  'Preferences',
  'Review',
  'Payment',
  'Ticket',
];

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTrainNo = searchParams.get('trainNumber') || TRAINS[0].number;
  const initialClass = (searchParams.get('classCode') || '3A') as TravelClassCode;
  const initialQuota = (searchParams.get('quota') || 'GN') as BookingQuotaCode;
  const initialDate =
    searchParams.get('date') || new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [step, setStep] = useState(3); // Start at Passengers when train & class are preselected, user can step back to 1 or 2
  const [selectedTrainNumber, setSelectedTrainNumber] = useState(initialTrainNo);
  const train = useMemo(
    () => TRAINS.find((t) => t.number === selectedTrainNumber) || TRAINS[0],
    [selectedTrainNumber]
  );

  const [classCode, setClassCode] = useState<TravelClassCode>(() =>
    train.classes.some((c) => c.classCode === initialClass)
      ? initialClass
      : train.classes[0].classCode
  );
  const [quota, setQuota] = useState<BookingQuotaCode>(
    train.applicableQuotas.includes(initialQuota) ? initialQuota : 'GN'
  );
  const [journeyDate, setJourneyDate] = useState(initialDate);

  const [passengers, setPassengers] = useState<PassengerInput[]>([
    {
      id: 'pax_1',
      fullName: '',
      age: 28,
      gender: 'Male',
      berthPreference: 'LOWER',
      concession: 'NONE',
    },
  ]);
  const [savedProfiles, setSavedProfiles] = useState<PassengerInput[]>([]);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'WALLET'>('UPI');
  const [simulateOutcome, setSimulateOutcome] = useState<'SUCCESS' | 'FAILURE'>('SUCCESS');
  const [idempotencyKey, setIdempotencyKey] = useState(() => `idem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setContactEmail((prev) => prev || d.user.email || '');
          setContactPhone((prev) => prev || d.user.phone || '+91 90000 00001');
          setSavedProfiles(d.user.savedPassengers || []);
        }
      })
      .catch(() => {});
  }, []);

  const classInfo =
    train.classes.find((c) => c.classCode === classCode) || train.classes[0];

  const fareSummary = useMemo(() => {
    const quotaMult = quota === 'TQ' ? 1.25 : quota === 'PT' ? 1.45 : 1;
    let base = 0;
    for (const p of passengers) {
      let f = Math.round(classInfo.fare * quotaMult);
      if (p.concession === 'SENIOR_CITIZEN') f = Math.round(f * 0.6);
      if (p.concession === 'STUDENT') f = Math.round(f * 0.75);
      if (p.concession === 'DIVYANGJAN') f = Math.round(f * 0.5);
      base += f;
    }
    const isAC = ['1A', '2A', '3A', '3E', 'CC', 'EC'].includes(classInfo.classCode);
    const taxes = isAC ? Math.round(base * 0.05) : 0;
    const fee = isAC ? 35 : 18;
    return { base, taxes, fee, total: base + taxes + fee };
  }, [passengers, classInfo, quota]);

  const addPassenger = () => {
    if (passengers.length >= 6) return;
    setPassengers((prev) => [
      ...prev,
      {
        id: `pax_${Date.now()}`,
        fullName: '',
        age: 26,
        gender: 'Female',
        berthPreference: 'NO_PREF',
        concession: 'NONE',
      },
    ]);
  };

  const updatePassenger = (idx: number, patch: Partial<PassengerInput>) => {
    setPassengers((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const removePassenger = (idx: number) => {
    if (passengers.length <= 1) return;
    setPassengers((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateStep3 = () => {
    const nextErrors: Record<string, string> = {};
    let summaryError: string | null = null;

    for (let i = 0; i < passengers.length; i++) {
      if (passengers[i].fullName.trim().length < 2) {
        nextErrors[`pax_name_${i}`] = 'Enter full name (min 2 chars).';
        summaryError ||= `Please enter a valid full name for Passenger ${i + 1}.`;
      }
      if (!Number.isFinite(passengers[i].age) || passengers[i].age < 1 || passengers[i].age > 120) {
        nextErrors[`pax_age_${i}`] = 'Age must be 1–120.';
        summaryError ||= `Please enter a valid age for Passenger ${i + 1}.`;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      nextErrors.contactEmail = 'Enter a valid email address.';
      summaryError ||= 'Please enter a valid contact email address.';
    }
    if (!/^[+\d\s()-]{8,16}$/.test(contactPhone.trim())) {
      nextErrors.contactPhone = 'Enter a valid mobile number (8–16 digits).';
      summaryError ||= 'Please enter a valid contact phone number.';
    }

    setFieldErrors(nextErrors);
    setError(summaryError);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCompletePayment = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey,
          trainNumber: train.number,
          fromCode: train.fromCode,
          toCode: train.toCode,
          journeyDate,
          classCode: classInfo.classCode,
          quota,
          contactEmail,
          contactPhone,
          paymentMethod,
          simulatePaymentOutcome: simulateOutcome,
          passengers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Generate a fresh idempotency key for safe retry on payment failure
        setIdempotencyKey(`idem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
        setError(data.error || 'Payment failed. Please retry.');
        return;
      }

      setConfirmedBooking(data.booking);
      trackAnalyticsEvent('booking_confirmed', {
        pnr: data.booking.pnr,
        trainNumber: train.number,
      });
      router.push(`/thank-you?pnr=${encodeURIComponent(data.booking.pnr)}`);
    } catch {
      setError('Network error while confirming booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 mx-auto max-w-290 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* 7-Step Railway Station Progress Bar */}
      <div className="space-y-3 no-print">
        <div className="flex items-center justify-between text-xs font-mono-tech text-(--text-secondary)">
          <span>STEP {step} OF 7</span>
          <span>{train.number} · {train.fromCode} → {train.toCode}</span>
        </div>
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-(--border-subtle) -z-10" />
          <motion.div
            className="absolute left-0 top-3.5 h-0.5 bg-(--accent-primary) -z-10 origin-left"
            animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.35 }}
          />
          {STEPS.map((label, idx) => {
            const num = idx + 1;
            const active = num === step;
            const done = num < step;
            return (
              <button
                key={label}
                type="button"
                disabled={num > step || step === 7}
                onClick={() => num < step && setStep(num)}
                className={`flex flex-col items-center gap-1.5 ${
                  num > step || step === 7 ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono-tech font-bold border transition-colors ${
                    done || active
                      ? 'border-(--accent-primary) bg-(--accent-primary) text-(--accent-on-primary)'
                      : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary)'
                  }`}
                >
                  {done ? '✓' : num}
                </span>
                <span className="hidden sm:inline text-[11px] font-medium text-(--text-secondary)">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-(--error)/40 bg-(--error)/10 p-4 text-sm text-(--error)"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Select Train */}
      {step === 1 && (
        <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-4">
          <h1 className="font-display text-2xl font-bold">Step 1 · Select Train</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TRAINS.slice(0, 8).map((t) => (
              <button
                key={t.number}
                type="button"
                onClick={() => {
                  setSelectedTrainNumber(t.number);
                  setClassCode(t.classes[0].classCode);
                }}
                className={`rounded-lg border p-4 text-left transition-colors cursor-pointer ${
                  t.number === train.number
                    ? 'border-(--accent-primary) bg-(--accent-primary)/10'
                    : 'border-(--border-subtle) bg-(--bg-primary)'
                }`}
              >
                <div className="font-mono-tech text-xs text-(--accent-primary)">{t.number} · {t.category}</div>
                <div className="font-display font-bold mt-0.5">{t.name}</div>
                <div className="text-xs font-mono-tech text-(--text-secondary) mt-1">
                  {t.fromCode} ({t.departureTime}) → {t.toCode} ({t.arrivalTime})
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-lg bg-(--accent-primary) px-5 py-2.5 text-sm font-semibold text-(--accent-on-primary) cursor-pointer"
            >
              <span>Continue to Class</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Class & Quota */}
      {step === 2 && (
        <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-6">
          <h1 className="font-display text-2xl font-bold">Step 2 · Travel Class & Quota</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {train.classes.map((c) => (
              <button
                key={c.classCode}
                type="button"
                onClick={() => setClassCode(c.classCode)}
                className={`rounded-lg border p-4 text-left cursor-pointer ${
                  classInfo.classCode === c.classCode
                    ? 'border-(--accent-primary) bg-(--accent-primary)/10'
                    : 'border-(--border-subtle) bg-(--bg-primary)'
                }`}
              >
                <div className="font-mono-tech text-sm font-bold">{c.classCode}</div>
                <div className="text-xs text-(--text-secondary)">{c.className}</div>
                <div className="mt-2 font-mono-tech text-base font-bold">₹{c.fare}</div>
                <div className="text-xs font-mono-tech text-(--success)">{c.statusText}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-tech uppercase text-(--text-secondary) mb-1.5">
                Booking Quota
              </label>
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value as BookingQuotaCode)}
                className="w-full h-11 rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm"
              >
                {train.applicableQuotas.map((q) => (
                  <option key={q} value={q}>
                    {QUOTA_LABELS[q].name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono-tech uppercase text-(--text-secondary) mb-1.5">
                Journey Date
              </label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full h-11 rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) px-4 py-2.5 text-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 rounded-lg bg-(--accent-primary) px-5 py-2.5 text-sm font-semibold text-(--accent-on-primary) cursor-pointer"
            >
              <span>Continue to Passengers</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Passenger Information */}
      {step === 3 && (
        <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold">Step 3 · Passenger Details</h1>
              <p className="text-xs text-(--text-secondary) mt-1">
                {train.number} {train.name} · {classInfo.className} ({classInfo.classCode}) · {journeyDate}
              </p>
            </div>
            {savedProfiles.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-(--text-secondary)">Quick-fill saved:</span>
                {savedProfiles.map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => updatePassenger(0, { ...sp, id: passengers[0].id })}
                    className="rounded-md border border-(--border-subtle) bg-(--bg-primary) px-2.5 py-1 text-xs hover:border-(--accent-primary) cursor-pointer"
                  >
                    {sp.fullName}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {passengers.map((p, idx) => (
              <div
                key={p.id}
                className="rounded-lg border border-(--border-subtle) bg-(--bg-primary) p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-(--accent-primary)">
                    PASSENGER 0{idx + 1}
                  </span>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePassenger(idx)}
                      aria-label={`Remove passenger ${idx + 1}`}
                      className="text-xs text-(--error) inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5">
                    <label className="block text-xs text-(--text-secondary) mb-1">Full Name</label>
                    <input
                      type="text"
                      value={p.fullName}
                      aria-invalid={Boolean(fieldErrors[`pax_name_${idx}`])}
                      onChange={(e) => {
                        updatePassenger(idx, { fullName: e.target.value });
                        if (fieldErrors[`pax_name_${idx}`]) {
                          setFieldErrors((prev) => ({ ...prev, [`pax_name_${idx}`]: '' }));
                        }
                      }}
                      placeholder="As on government ID"
                      className={`w-full h-11 rounded-lg border bg-(--bg-surface) px-3 text-sm ${
                        fieldErrors[`pax_name_${idx}`] ? 'border-(--error)' : 'border-(--border-subtle)'
                      }`}
                    />
                    {fieldErrors[`pax_name_${idx}`] && (
                      <p className="mt-1 text-[11px] text-(--error)">{fieldErrors[`pax_name_${idx}`]}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-(--text-secondary) mb-1">Age</label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={p.age}
                      aria-invalid={Boolean(fieldErrors[`pax_age_${idx}`])}
                      onChange={(e) => {
                        updatePassenger(idx, { age: Number(e.target.value) });
                        if (fieldErrors[`pax_age_${idx}`]) {
                          setFieldErrors((prev) => ({ ...prev, [`pax_age_${idx}`]: '' }));
                        }
                      }}
                      className={`w-full h-11 rounded-lg border bg-(--bg-surface) px-3 text-sm ${
                        fieldErrors[`pax_age_${idx}`] ? 'border-(--error)' : 'border-(--border-subtle)'
                      }`}
                    />
                    {fieldErrors[`pax_age_${idx}`] && (
                      <p className="mt-1 text-[11px] text-(--error)">{fieldErrors[`pax_age_${idx}`]}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-(--text-secondary) mb-1">Gender</label>
                    <select
                      value={p.gender}
                      onChange={(e) => updatePassenger(idx, { gender: e.target.value as PassengerInput['gender'] })}
                      className="w-full h-11 rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-2.5 text-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs text-(--text-secondary) mb-1">Concession</label>
                    <select
                      value={p.concession}
                      onChange={(e) =>
                        updatePassenger(idx, { concession: e.target.value as PassengerInput['concession'] })
                      }
                      className="w-full h-11 rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-2.5 text-sm"
                    >
                      <option value="NONE">None</option>
                      <option value="SENIOR_CITIZEN">Senior Citizen</option>
                      <option value="STUDENT">Student</option>
                      <option value="DIVYANGJAN">Divyangjan</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {passengers.length < 6 && (
              <button
                type="button"
                onClick={addPassenger}
                className="inline-flex items-center gap-2 rounded-lg border border-dashed border-(--border-subtle) px-4 py-2.5 text-xs font-semibold text-(--accent-primary) hover:border-(--accent-primary) cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Passenger (Max 6)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-(--border-subtle)">
            <div>
              <label className="block text-xs text-(--text-secondary) mb-1">Contact Email (for ticket)</label>
              <input
                type="email"
                value={contactEmail}
                aria-invalid={Boolean(fieldErrors.contactEmail)}
                onChange={(e) => {
                  setContactEmail(e.target.value);
                  if (fieldErrors.contactEmail) setFieldErrors((prev) => ({ ...prev, contactEmail: '' }));
                }}
                placeholder="you@domain.com"
                className={`w-full h-11 rounded-lg border bg-(--bg-primary) px-3 text-sm ${
                  fieldErrors.contactEmail ? 'border-(--error)' : 'border-(--border-subtle)'
                }`}
              />
              {fieldErrors.contactEmail && (
                <p className="mt-1 text-[11px] text-(--error)">{fieldErrors.contactEmail}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-(--text-secondary) mb-1">Mobile Number</label>
              <input
                type="tel"
                value={contactPhone}
                aria-invalid={Boolean(fieldErrors.contactPhone)}
                onChange={(e) => {
                  setContactPhone(e.target.value);
                  if (fieldErrors.contactPhone) setFieldErrors((prev) => ({ ...prev, contactPhone: '' }));
                }}
                placeholder="+91 98765 43210"
                className={`w-full h-11 rounded-lg border bg-(--bg-primary) px-3 text-sm ${
                  fieldErrors.contactPhone ? 'border-(--error)' : 'border-(--border-subtle)'
                }`}
              />
              {fieldErrors.contactPhone && (
                <p className="mt-1 text-[11px] text-(--error)">{fieldErrors.contactPhone}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) px-4 py-2.5 text-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Change Class</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (validateStep3()) setStep(4);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-(--accent-primary) px-5 py-2.5 text-sm font-semibold text-(--accent-on-primary) cursor-pointer"
            >
              <span>Coach & Preferences</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Preferences & Interactive Coach Visualisation */}
      {step === 4 && (
        <div className="space-y-6">
          <CoachVisualisation
            classCode={classInfo.classCode}
            berthPreference={passengers[0].berthPreference}
            selectedSeat={passengers[0].demoSelectedSeat}
            onChangePreference={(pref: BerthPreference) =>
              updatePassenger(0, { berthPreference: pref })
            }
            onSelectDemoSeat={(seatNum) =>
              updatePassenger(0, { demoSelectedSeat: seatNum })
            }
          />

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) px-4 py-2.5 text-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-2 rounded-lg bg-(--accent-primary) px-5 py-2.5 text-sm font-semibold text-(--accent-on-primary) cursor-pointer"
            >
              <span>Review Journey & Fare</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Review Journey & Fare */}
      {step === 5 && (
        <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-6">
          <h1 className="font-display text-2xl font-bold">Step 5 · Review Journey & Fare</h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-4">
              <div className="rounded-lg border border-(--border-subtle) bg-(--bg-primary) p-4 space-y-2">
                <div className="font-mono-tech text-xs text-(--accent-primary)">
                  {train.number} · {train.category}
                </div>
                <div className="font-display text-lg font-bold">{train.name}</div>
                <div className="text-sm font-mono-tech text-(--text-secondary)">
                  {train.fromCode} ({train.departureTime}) → {train.toCode} ({train.arrivalTime}) · {journeyDate}
                </div>
                <div className="text-xs font-mono-tech text-(--text-secondary)">
                  Class: {classInfo.className} ({classInfo.classCode}) · Quota: {quota}
                </div>
              </div>

              <div className="rounded-lg border border-(--border-subtle) bg-(--bg-primary) p-4 space-y-2">
                <div className="text-xs font-mono-tech uppercase text-(--text-secondary)">Travellers</div>
                {passengers.map((p, i) => (
                  <div key={p.id} className="flex justify-between text-sm">
                    <span>
                      {i + 1}. {p.fullName} ({p.age}/{p.gender})
                    </span>
                    <span className="font-mono-tech text-xs text-(--text-secondary)">
                      Pref: {p.berthPreference} {p.demoSelectedSeat ? `· Demo Seat ${p.demoSelectedSeat}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-5 rounded-lg border border-(--border-subtle) bg-(--bg-primary) p-5 space-y-3">
              <div className="text-xs font-mono-tech uppercase text-(--text-secondary)">
                Fare Breakdown
              </div>
              <div className="flex justify-between text-sm">
                <span>Base Fare ({passengers.length} pax)</span>
                <span className="font-mono-tech">₹{fareSummary.base}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST (5% AC)</span>
                <span className="font-mono-tech">₹{fareSummary.taxes}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>RailNova Convenience Fee</span>
                <span className="font-mono-tech">₹{fareSummary.fee}</span>
              </div>
              <div className="pt-3 border-t border-(--border-subtle) flex justify-between font-display text-lg font-bold">
                <span>Total Payable</span>
                <span className="font-mono-tech text-(--accent-primary)">₹{fareSummary.total}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) px-4 py-2.5 text-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(6)}
              className="inline-flex items-center gap-2 rounded-lg bg-(--accent-primary) px-5 py-2.5 text-sm font-semibold text-(--accent-on-primary) cursor-pointer"
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Test-Mode Payment System */}
      {step === 6 && (
        <div className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold">Step 6 · Test-Mode Checkout</h1>
              <p className="text-xs text-(--text-secondary) mt-1">
                Razorpay-style test checkout. No real card numbers are collected or stored.
              </p>
            </div>
            <div className="font-mono-tech text-xl font-bold text-(--accent-primary)">
              ₹{fareSummary.total}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                { id: 'UPI', label: 'UPI (GPay / PhonePe)' },
                { id: 'CARD', label: 'Debit / Credit Card' },
                { id: 'NETBANKING', label: 'Net Banking' },
                { id: 'WALLET', label: 'Digital Wallets' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                className={`rounded-lg border p-3.5 text-left text-xs font-semibold cursor-pointer transition-colors ${
                  paymentMethod === m.id
                    ? 'border-(--accent-primary) bg-(--accent-primary)/10 text-(--text-primary)'
                    : 'border-(--border-subtle) bg-(--bg-primary) text-(--text-secondary)'
                }`}
              >
                <CreditCard className="h-4 w-4 mb-2 text-(--accent-primary)" />
                {m.label}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-(--border-subtle) bg-(--bg-primary) p-4 space-y-3">
            <div className="text-xs font-mono-tech uppercase text-(--text-secondary)">
              Test-Mode Gateway Outcome Simulator
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="outcome"
                  checked={simulateOutcome === 'SUCCESS'}
                  onChange={() => setSimulateOutcome('SUCCESS')}
                  className="accent-(--accent-primary)"
                />
                <span>Authorize Test Payment (Success)</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="outcome"
                  checked={simulateOutcome === 'FAILURE'}
                  onChange={() => setSimulateOutcome('FAILURE')}
                  className="accent-(--error)"
                />
                <span>Simulate Bank Decline (Test Retry Flow)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-(--text-secondary)">
            <ShieldCheck className="h-4 w-4 text-(--success)" />
            <span>Server-side fare & inventory verification active. Duplicate-submission protection enabled.</span>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-2 rounded-lg border border-(--border-subtle) px-4 py-2.5 text-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleCompletePayment}
              className="inline-flex items-center gap-2 rounded-lg bg-(--accent-primary) px-6 py-3 text-sm font-semibold text-(--accent-on-primary) disabled:opacity-50 cursor-pointer"
            >
              <span>{submitting ? 'Verifying & Issuing...' : `Pay ₹${fareSummary.total} (Demo)`}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 7: Confirmation & Digital Ticket */}
      {step === 7 && confirmedBooking && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-7 w-7 text-(--success)" />
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                Booking Confirmed (Demonstration)
              </h1>
              <p className="text-xs text-(--text-secondary)">
                Your digital boarding pass has been issued and saved to your RailNova session.
              </p>
            </div>
          </div>
          <DigitalTicket booking={confirmedBooking} />
        </div>
      )}
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-28 pb-20 mx-auto max-w-290 px-4 text-sm font-mono-tech text-(--text-secondary)">
          Loading booking flow...
        </div>
      }
    >
      <BookContent />
    </Suspense>
  );
}
