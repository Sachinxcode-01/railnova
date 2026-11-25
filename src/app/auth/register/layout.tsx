import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Register a RailNova demonstration traveller account for faster railway bookings.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
