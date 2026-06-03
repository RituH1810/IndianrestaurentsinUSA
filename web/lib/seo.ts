import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indianrestaurantsinusa.com';
const SITE_NAME = 'Indian Restaurants in USA';

export function restaurantMeta(
  name: string,
  city: string,
  state: string,
  description?: string | null,
): Metadata {
  const title = `${name} — Indian Restaurant in ${city}, ${state}`;
  const desc =
    description ||
    `${name} is an Indian restaurant in ${city}, ${state}. View hours, ratings, menu, and get directions.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, siteName: SITE_NAME, url: BASE_URL },
    alternates: { canonical: `${BASE_URL}/restaurants/${name.toLowerCase().replace(/\s+/g, '-')}-${city.toLowerCase().replace(/\s+/g, '-')}` },
  };
}

export function stateMeta(stateName: string, count: number): Metadata {
  const title = `Indian Restaurants in ${stateName}`;
  const description = `Discover ${count}+ Indian restaurants across ${stateName}. Filter by regional cuisine, dietary needs (Jain, vegan, halal), and city.`;
  return { title, description, openGraph: { title, description, siteName: SITE_NAME } };
}

export function cityMeta(city: string, stateName: string, count: number): Metadata {
  const title = `Indian Restaurants in ${city}, ${stateName}`;
  const description = `Find the best Indian restaurants in ${city}, ${stateName}. Browse ${count}+ listings with cuisine and dietary filters.`;
  return { title, description, openGraph: { title, description, siteName: SITE_NAME } };
}

export function cuisineMeta(cuisineLabel: string, count: number): Metadata {
  const title = `${cuisineLabel} Restaurants in the USA`;
  const description = `Browse ${count}+ ${cuisineLabel} restaurants across the United States. Find authentic ${cuisineLabel} cuisine near you.`;
  return { title, description, openGraph: { title, description, siteName: SITE_NAME } };
}

export function dietaryMeta(dietLabel: string, count: number): Metadata {
  const title = `${dietLabel} Indian Restaurants in the USA`;
  const description = `Find ${count}+ ${dietLabel} Indian restaurants across the USA. Discover authentic options that meet your dietary needs.`;
  return { title, description, openGraph: { title, description, siteName: SITE_NAME } };
}

export function guideMeta(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { title, description, siteName: SITE_NAME },
  };
}
