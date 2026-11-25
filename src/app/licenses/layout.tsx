import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Open-Source Licences',
  description:
    'Open-source software licences, font attributions, and third-party library notices used in RailNova.',
};

export default function LicensesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
