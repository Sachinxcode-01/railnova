import type { Metadata } from 'next';
import { Space_Grotesk, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { RailTransitionBar } from '@/components/RailTransitionBar';
import { NovaAI } from '@/components/NovaAI';
import { CookieBanner } from '@/components/CookieBanner';
import { Analytics } from '@/components/Analytics';
import { StickyMobileCTA } from '@/components/StickyMobileCTA';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['500', '600', '700'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://railnova.demo'),
  title: {
    default: 'RailNova — Beyond the Destination | Next-Generation Indian Railway Booking',
    template: '%s | RailNova',
  },
  description:
    'Experience Indian railway journeys redefined. Search Vande Bharat & Rajdhani trains, visualise coaches, track trains, and book demonstration tickets.',
  openGraph: {
    title: 'RailNova — Beyond the Destination',
    description: 'Next-generation Indian railway ticket booking and journey discovery platform.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RailNova — Beyond the Destination',
    description: 'Next-generation Indian railway ticket booking and journey discovery platform.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased selection:bg-(--accent-primary) selection:text-(--accent-on-primary)">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-120 focus:rounded-md focus:bg-(--accent-primary) focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-(--accent-on-primary)"
          >
            Skip to main content
          </a>
          <RailTransitionBar />
          <CustomCursor />
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <StickyMobileCTA />
          <NovaAI />
          <CookieBanner />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
