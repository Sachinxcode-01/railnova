import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PNR Status Enquiry',
  description: 'Check 10-digit PNR confirmation status, coach allocation, and chart preparation for RailNova bookings.',
};

export default function PnrLayout({ children }: { children: React.ReactNode }) {
  return children;
}
