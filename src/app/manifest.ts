import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RailNova — Next-Generation Indian Railway Booking',
    short_name: 'RailNova',
    description:
      'Search Vande Bharat & Rajdhani trains, visualise coaches, track live trains, and book demonstration tickets.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0C0D10',
    theme_color: '#0C0D10',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
