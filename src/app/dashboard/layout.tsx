import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Journeys',
  description: 'Manage your RailNova bookings, saved passengers, favourite routes, and digital boarding passes.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
