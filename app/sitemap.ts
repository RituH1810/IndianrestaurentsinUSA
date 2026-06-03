import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { CUISINES, DIETARY } from '@/lib/taxonomy';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indianrestaurantsinusa.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/best-indian-restaurants`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/map`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/usa`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/indian-food`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/indian-restaurants`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about/our-data`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const cuisine_pages: MetadataRoute.Sitemap = CUISINES.map(c => ({
    url: `${BASE}/indian-food/${c.tag}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  }));

  const dietary_pages: MetadataRoute.Sitemap = DIETARY.map(d => ({
    url: `${BASE}/indian-restaurants/${d.tag}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  }));

  let restaurant_pages: MetadataRoute.Sitemap = [];
  let state_pages: MetadataRoute.Sitemap = [];
  let city_pages: MetadataRoute.Sitemap = [];

  try {
    const [restaurants, states, cities] = await Promise.all([
      prisma.restaurant.findMany({
        where: { is_published: true },
        select: { slug: true, updated_at: true },
      }),
      prisma.restaurant.groupBy({
        by: ['state'],
        where: { is_published: true },
      }),
      prisma.restaurant.findMany({
        where: { is_published: true },
        select: { state: true, city: true },
        distinct: ['state', 'city'],
      }),
    ]);

    restaurant_pages = restaurants.map(r => ({
      url: `${BASE}/restaurants/${r.slug}`,
      lastModified: r.updated_at,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    state_pages = states.map(({ state }) => ({
      url: `${BASE}/usa/${state.toLowerCase().replace(/\s+/g, '-')}/indian-restaurants`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    city_pages = cities.map(({ state, city }) => ({
      url: `${BASE}/usa/${state.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}/indian-restaurants`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  } catch { /* DB not ready — omit dynamic pages */ }

  return [...static_pages, ...cuisine_pages, ...dietary_pages, ...state_pages, ...city_pages, ...restaurant_pages];
}
