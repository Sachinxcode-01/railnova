import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Console',
  description: 'RailNova platform telemetry, bookings, chart preparation, and database backup console.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
