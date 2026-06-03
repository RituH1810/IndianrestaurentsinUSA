const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indianrestaurantsinusa.com';

// ── Restaurant ──────────────────────────────────────────────────────────
interface RestaurantJsonLdProps {
  name: string;
  address: string;
  city: string;
  state: string;
  zip?: string | null;
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
  reviews?: number | null;
  photo?: string | null;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export function RestaurantJsonLd(props: RestaurantJsonLdProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: props.name,
    description: props.description,
    image: props.photo,
    telephone: props.phone,
    url: props.website,
    servesCuisine: 'Indian',
    address: {
      '@type': 'PostalAddress',
      streetAddress: props.address,
      addressLocality: props.city,
      addressRegion: props.state,
      postalCode: props.zip,
      addressCountry: 'US',
    },
  };
  if (props.latitude && props.longitude) {
    schema.geo = { '@type': 'GeoCoordinates', latitude: props.latitude, longitude: props.longitude };
  }
  if (props.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: props.rating,
      reviewCount: props.reviews ?? 1,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// ── Breadcrumb ──────────────────────────────────────────────────────────
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// ── Organization ────────────────────────────────────────────────────────
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Indian Restaurants in USA',
    url: `${BASE_URL}`,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// ── ItemList ────────────────────────────────────────────────────────────
export function ItemListJsonLd({
  items,
  name,
  description,
}: {
  items: { url: string; name: string }[];
  name: string;
  description?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// ── FAQPage ─────────────────────────────────────────────────────────────
export function FaqJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
