export function createSlug(name: string, city: string): string {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/'/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  return `${clean(name)}-${clean(city)}`;
}

export function parseTags(tags?: string | null): string[] {
  if (!tags) return [];
  return tags.split('|').filter(Boolean);
}

export function formatRating(rating?: number | null): string {
  if (rating == null) return 'N/A';
  return rating.toFixed(1);
}

export function formatReviews(reviews?: number | null): string {
  if (reviews == null) return '';
  if (reviews >= 1000) return `${(reviews / 1000).toFixed(1)}k`;
  return reviews.toString();
}

export function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function stateNameToSlug(state: string): string {
  return state.toLowerCase().replace(/\s+/g, '-');
}

export function cityNameToSlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, '-');
}

export function parseHours(hoursStr?: string | null): Record<string, string[]> | null {
  if (!hoursStr) return null;
  try {
    return JSON.parse(hoursStr);
  } catch {
    return null;
  }
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
}

export const STATE_ABBREVIATIONS: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR',
  California: 'CA', Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE',
  Florida: 'FL', Georgia: 'GA', Hawaii: 'HI', Idaho: 'ID',
  Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS',
  Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS',
  Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK',
  Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT',
  Vermont: 'VT', Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV',
  Wisconsin: 'WI', Wyoming: 'WY', 'District of Columbia': 'DC',
};

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
