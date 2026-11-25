import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Trains',
  description: 'Search Vande Bharat, Rajdhani, Shatabdi, and Express trains across India with live fares and coach availability.',
};

export default function TrainsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
