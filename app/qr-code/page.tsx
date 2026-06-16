import QRCode from 'qrcode';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code — Indian Restaurants in USA',
  description: 'Scan this QR code to visit IndianRestaurantsInUSA.com on your phone.',
  robots: { index: false, follow: false },
};

const SITE_URL = 'https://www.indianrestaurentsinusa.com';

export default async function QrCodePage() {
  const qrDataUrl = await QRCode.toDataURL(SITE_URL, {
    width: 400,
    margin: 2,
    color: {
      dark: '#1E3A8A',   // maroon (brand color)
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'H',
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-sm w-full text-center">

        {/* Header */}
        <h1 className="text-xl font-bold text-maroon mb-1">Indian Restaurants in USA</h1>
        <p className="text-sm text-gray-400 mb-6">Scan to find Indian restaurants near you</p>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-xl border-2 border-blue-100 inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt={`QR code for ${SITE_URL}`}
              width={280}
              height={280}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* URL label */}
        <p className="text-xs text-gray-400 mb-6 break-all font-mono">{SITE_URL}</p>

        {/* Download button */}
        <a
          href={qrDataUrl}
          download="indianrestaurentsinusa-qr.png"
          className="inline-flex items-center gap-2 px-6 py-3 bg-spice text-white rounded-full font-semibold text-sm hover:bg-maroon transition-colors w-full justify-center"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z"/>
          </svg>
          Download PNG
        </a>

        <p className="text-xs text-gray-400 mt-5 leading-relaxed">
          Print and place at your restaurant, event, or flyer.<br/>
          Scan with any smartphone camera.
        </p>
      </div>
    </div>
  );
}
