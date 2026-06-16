import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Indian Restaurants in USA — Find the best Indian food near you';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indianrestaurentsinusa.com';

export default async function Image() {
  const logoUrl = `${SITE_URL}/logo.png`;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1d4ed8 0%, #2563EB 45%, #4338ca 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '60px',
        }}
      >
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          width={110}
          height={110}
          style={{
            borderRadius: '50%',
            border: '5px solid #E08A1E',
            marginBottom: '28px',
            objectFit: 'cover',
          }}
          alt=""
        />

        {/* Site name */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '18px',
            letterSpacing: '-1px',
          }}
        >
          Indian Restaurants in USA
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            marginBottom: '36px',
            fontWeight: 400,
          }}
        >
          Find the best Indian food near you — by cuisine &amp; dietary preference
        </div>

        {/* Domain pill */}
        <div
          style={{
            background: '#E08A1E',
            color: '#ffffff',
            padding: '12px 36px',
            borderRadius: '100px',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.5px',
          }}
        >
          indianrestaurentsinusa.com
        </div>
      </div>
    ),
    { ...size },
  );
}
