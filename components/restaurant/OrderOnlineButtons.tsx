'use client';

// Affiliate config — add your tracking IDs here when you sign up:
//   DoorDash:  https://affiliates.doordash.com  (Impact network)
//   Uber Eats: https://www.uber.com/us/en/u/affiliate-program/ (Rakuten)
//   Grubhub:   https://www.grubhub.com/for-restaurants/affiliate (CJ Affiliate)
const AFFILIATE = {
  doordash: '',   // e.g. '?utm_source=affiliate&utm_medium=referral&utm_campaign=YOUR_ID'
  ubereats: '',   // e.g. '&utm_source=affiliate&referrer=YOUR_ID'
  grubhub:  '',   // e.g. '&utm_source=affiliate&referralId=YOUR_ID'
};

const PLATFORMS = [
  {
    id: 'doordash',
    label: 'DoorDash',
    bg: '#FF3008',
    hover: '#d42a07',
    getUrl: (name: string, city: string, state: string) =>
      `https://www.doordash.com/search/store/${encodeURIComponent(name)}/${AFFILIATE.doordash}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 4c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0 14c-2.761 0-5.236-1.238-6.924-3.2C6.277 15.15 9.012 14 12 14s5.723 1.15 6.924 2.8C17.236 18.762 14.761 20 12 20z"/>
      </svg>
    ),
  },
  {
    id: 'ubereats',
    label: 'Uber Eats',
    bg: '#06C167',
    hover: '#05a657',
    getUrl: (name: string, city: string, state: string) =>
      `https://www.ubereats.com/search?q=${encodeURIComponent(name)}+${encodeURIComponent(city)}${AFFILIATE.ubereats}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
      </svg>
    ),
  },
  {
    id: 'grubhub',
    label: 'Grubhub',
    bg: '#F63440',
    hover: '#d42030',
    getUrl: (name: string, city: string, state: string) =>
      `https://www.grubhub.com/search?queryText=${encodeURIComponent(name)}&location=${encodeURIComponent(`${city}, ${state}`)}${AFFILIATE.grubhub}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
    ),
  },
];

interface Props {
  name: string;
  city: string;
  state: string;
}

export function OrderOnlineButtons({ name, city, state }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">
        Order Online
      </h2>
      <div className="flex flex-col gap-2">
        {PLATFORMS.map(platform => (
          <a
            key={platform.id}
            href={platform.getUrl(name, city, state)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: platform.bg }}
          >
            {platform.icon}
            Order on {platform.label}
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white ml-auto opacity-70" aria-hidden="true">
              <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3 leading-relaxed">
        Links open the delivery app — search for this restaurant to order.
      </p>
    </div>
  );
}
