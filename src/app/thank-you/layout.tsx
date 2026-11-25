import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Confirmed — Thank You',
  description:
    'Your RailNova demonstration railway ticket is confirmed. View your PNR, download your PDF boarding pass, or check live train status.',
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
