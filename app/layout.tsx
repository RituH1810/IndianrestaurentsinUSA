import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

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
      </body>
    </html>
  );
}
