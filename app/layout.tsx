import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.indianrestaurantsinusa.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Indian Restaurants in USA | Find Indian Food Near You",
    template: "%s | Indian Restaurants in USA",
  },
  description:
    "Discover the best Indian restaurants across the United States. Filter by regional cuisine (North Indian, South Indian, Hyderabadi Biryani), dietary needs (Jain, Vegan, Halal), and location.",
  keywords: [
    "Indian restaurants",
    "Indian food near me",
    "best Indian restaurants USA",
    "Jain restaurant",
    "halal Indian food",
    "vegetarian Indian restaurant",
  ],
  openGraph: {
    siteName: "Indian Restaurants in USA",
    locale: "en_US",
    type: "website",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Indian Restaurants in USA | Find Indian Food Near You",
    description:
      "Discover the best Indian restaurants across the United States. Filter by regional cuisine, dietary needs, and location.",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable} font-sans antialiased bg-white text-gray-900`}>
        <OrganizationJsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-spice text-white px-4 py-2 rounded z-50"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <CookieBanner />
        <GoogleAnalytics />
        {/* YouTube floating button — visible on all screen sizes */}
        <a
          href="https://www.youtube.com/@indianrestaurentsinusa/shorts"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch us on YouTube"
          className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 w-13 h-13 p-3 rounded-full shadow-xl bg-red-600 text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        {/* Mobile Instagram floating button */}
        <a
          href="https://www.instagram.com/indianrestaurentsinusa/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Instagram"
          className="lg:hidden fixed bottom-5 right-4 z-50 w-13 h-13 p-3 rounded-full shadow-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
          </svg>
        </a>
      </body>
    </html>
  );
}
