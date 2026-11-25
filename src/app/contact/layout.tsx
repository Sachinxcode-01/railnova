import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Support',
  description:
    'Reach RailNova passenger support by email, phone, or our Bengaluru office, or send an enquiry about bookings, PNR status, or accessibility.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
