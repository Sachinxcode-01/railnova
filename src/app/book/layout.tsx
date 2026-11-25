import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Ticket',
  description: 'Complete passenger details, berth preferences, and simulated checkout for your RailNova ticket.',
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
