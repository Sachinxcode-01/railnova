'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, CheckCircle2, AlertCircle, Send, Loader2 } from 'lucide-react';
import { RAILNOVA_CONTACT } from '@/lib/contact';
import { trackAnalyticsEvent } from '@/components/Analytics';

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Booking & PNR Support');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (name.trim().length < 2) {
      errs.name = 'Please enter your full name (at least 2 characters).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (subject.trim().length < 3) {
      errs.subject = 'Please select or enter a subject.';
    }
    if (message.trim().length < 10) {
      errs.message = 'Please include at least 10 characters describing your enquiry.';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 350));
    trackAnalyticsEvent('contact_submitted', { subject });
    setSubmitting(false);
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="pt-28 pb-20 mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
          Passenger Concierge &amp; Desk
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          Contact RailNova
        </h1>
        <p className="text-sm sm:text-base text-(--text-secondary) leading-relaxed">
          Reach our Bengaluru passenger support team for assistance with demonstration bookings, PNR lookup, accessibility requests, or privacy inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Direct Contact Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-5">
            <h2 className="font-display text-xl font-bold">{RAILNOVA_CONTACT.companyName}</h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-(--accent-primary) mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs font-mono-tech uppercase text-(--text-secondary)">Support Email</div>
                  <a
                    href={`mailto:${RAILNOVA_CONTACT.email}`}
                    className="font-medium text-(--text-primary) hover:text-(--accent-primary) underline underline-offset-4"
                  >
                    {RAILNOVA_CONTACT.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-(--accent-primary) mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs font-mono-tech uppercase text-(--text-secondary)">Passenger Helpline</div>
                  <a
                    href={RAILNOVA_CONTACT.phoneHref}
                    className="font-mono-tech font-medium text-(--text-primary) hover:text-(--accent-primary)"
                  >
                    {RAILNOVA_CONTACT.phoneDisplay}
                  </a>
                  <p className="text-xs text-(--text-secondary) mt-0.5">
                    Official Indian Railways emergency/enquiry: {RAILNOVA_CONTACT.emergencyDisplay}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-(--accent-lavender) mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs font-mono-tech uppercase text-(--text-secondary)">Operating Hours</div>
                  <div className="text-(--text-primary)">{RAILNOVA_CONTACT.hours}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-(--accent-lavender) mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs font-mono-tech uppercase text-(--text-secondary)">Registered Office</div>
                  <address className="not-italic text-(--text-primary) leading-relaxed">
                    {RAILNOVA_CONTACT.addressLine1}
                    <br />
                    {RAILNOVA_CONTACT.addressLine2}
                  </address>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-(--border-subtle) text-xs text-(--text-secondary) flex flex-wrap gap-4">
              <Link href="/privacy" className="hover:text-(--accent-primary) underline underline-offset-2">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-(--accent-primary) underline underline-offset-2">
                Terms of Service
              </Link>
              <Link href="/pnr" className="hover:text-(--accent-primary) underline underline-offset-2">
                PNR Enquiry
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 rounded-2xl border border-(--border-subtle) bg-(--bg-surface) p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold">Send a Message</h2>
            <p className="text-xs text-(--text-secondary)">
              All fields are validated before submission. Typical response within 1 business day.
            </p>
          </div>

          {submitted && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-xl border border-(--success)/40 bg-(--success)/10 p-4 text-sm text-(--success)"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <div className="font-semibold">Enquiry received</div>
                <p className="text-xs opacity-90 mt-0.5">
                  Thank you for contacting RailNova. Our support desk will respond to your email shortly.
                </p>
              </div>
            </div>
          )}

          {Object.keys(fieldErrors).length > 0 && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-(--error)/40 bg-(--error)/10 px-4 py-2.5 text-xs text-(--error)"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Please review the highlighted fields below.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs text-(--text-secondary) mb-1.5">
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
                  }}
                  placeholder="Ananya Rao"
                  className={`w-full h-11 rounded-lg border bg-(--bg-primary) px-3.5 text-sm focus:outline-none ${
                    fieldErrors.name
                      ? 'border-(--error) focus:border-(--error)'
                      : 'border-(--border-subtle) focus:border-(--accent-primary)'
                  }`}
                />
                {fieldErrors.name && (
                  <p id="contact-name-error" className="mt-1 text-xs text-(--error)">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs text-(--text-secondary) mb-1.5">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="you@domain.com"
                  className={`w-full h-11 rounded-lg border bg-(--bg-primary) px-3.5 text-sm focus:outline-none ${
                    fieldErrors.email
                      ? 'border-(--error) focus:border-(--error)'
                      : 'border-(--border-subtle) focus:border-(--accent-primary)'
                  }`}
                />
                {fieldErrors.email && (
                  <p id="contact-email-error" className="mt-1 text-xs text-(--error)">
                    {fieldErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-xs text-(--text-secondary) mb-1.5">
                Topic
              </label>
              <select
                id="contact-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-11 rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm focus:border-(--accent-primary) focus:outline-none"
              >
                <option value="Booking & PNR Support">Booking &amp; PNR Support</option>
                <option value="Cancellations & Demo Refunds">Cancellations &amp; Demo Refunds</option>
                <option value="Accessibility & Berth Assistance">Accessibility &amp; Berth Assistance</option>
                <option value="Privacy & Data Request">Privacy &amp; Data Request</option>
                <option value="General Enquiry">General Enquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs text-(--text-secondary) mb-1.5">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={message}
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (fieldErrors.message) setFieldErrors((p) => ({ ...p, message: undefined }));
                }}
                placeholder="Include your 10-digit PNR (if applicable) and how we can help..."
                className={`w-full rounded-lg border bg-(--bg-primary) p-3.5 text-sm focus:outline-none ${
                  fieldErrors.message
                    ? 'border-(--error) focus:border-(--error)'
                    : 'border-(--border-subtle) focus:border-(--accent-primary)'
                }`}
              />
              {fieldErrors.message && (
                <p id="contact-message-error" className="mt-1 text-xs text-(--error)">
                  {fieldErrors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-(--accent-primary) px-6 text-sm font-semibold text-(--accent-on-primary) disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
