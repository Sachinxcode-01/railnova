import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Destinations',
  description: 'Explore twelve iconic Indian destinations connected by high-speed and scenic railway corridors.',
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return children;
}
