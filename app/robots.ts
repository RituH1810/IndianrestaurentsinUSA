import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indianrestaurantsinusa.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/search', '/restaurants/near-me', '/qr-code'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
