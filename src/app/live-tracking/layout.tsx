import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Train Tracking',
  description: 'Interactive railway map with simulated live train telemetry, station halts, and ETAs.',
};

export default function LiveTrackingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
