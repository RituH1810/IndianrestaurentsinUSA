export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  street?: string | null;
  city: string;
  state: string;
  state_abbr?: string | null;
  metro?: string | null;
  zip?: string | null;
  county?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
  reviews?: number | null;
  price_level?: number | null;
  photo?: string | null;
  street_view?: string | null;
  working_hours?: string | null;
  business_status: string;
  description?: string | null;
  cuisine_tags?: string | null;
  dietary_tags?: string | null;
  is_hidden_gem: boolean;
  publish_priority: number;
  is_published: boolean;
  located_in?: string | null;
  reviews_tags?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ParsedHours {
  [day: string]: string[];
}

export interface RestaurantCardData {
  slug: string;
  name: string;
  city: string;
  state: string;
  rating?: number | null;
  reviews?: number | null;
  photo?: string | null;
  cuisine_tags?: string | null;
  dietary_tags?: string | null;
  is_hidden_gem: boolean;
  description?: string | null;
}
