import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://railnova.demo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/trains', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/discover', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/pnr', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/live-tracking', priority: 0.8, changeFrequency: 'hourly' as const },
    { path: '/auth/signin', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/auth/register', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  return routes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
