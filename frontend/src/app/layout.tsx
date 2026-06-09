/**
 * layout.tsx — Root Application Layout
 *
 * This is the outermost shell that wraps every page in the application.
 * It runs on the SERVER by default (Next.js App Router).
 *
 * Responsibilities:
 *  1. Load the Poppins font via next/font/google (zero layout shift, self-hosted by Next.js)
 *  2. Export SEO metadata used by Next.js to generate <head> tags on every page
 *  3. Render the <Toaster> for global toast notifications (sonner)
 *  4. Delegate layout switching (public vs admin portal) to ClientLayout
 */
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { ClientLayout } from "../components/layout/ClientLayout";
import "./globals.css";

import { SiteAssetsProvider } from '../components/providers/SiteAssetsProvider';

// ─── Font Loading ──────────────────────────────────────────────────────────────
// next/font automatically downloads and self-hosts Poppins at build time.
// This avoids an extra network round-trip to Google Fonts and prevents
// the FOUT (flash of unstyled text) / layout shift that a <link> tag causes.
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  // Expose the font as a CSS variable so Tailwind can use it via font-sans
  variable: "--font-poppins",
  // display=swap ensures text remains visible while the font loads
  display: "swap",
});

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
// Next.js reads this object and generates the appropriate <meta> tags.
// Individual pages can override any of these values by exporting their
// own `metadata` constant.
export const metadata: Metadata = {
  title: {
    // The %s placeholder is filled by child pages that export metadata.title
    template: "%s | Simplifly Finland",
    default: "Simplifly Finland — Luxury Travel to Sri Lanka & Maldives",
  },
  description:
    "Discover curated luxury tour packages to Sri Lanka and Maldives. Simplifly Finland — your premium travel partner for unforgettable experiences.",
  keywords: [
    "Sri Lanka tours",
    "Maldives resorts",
    "luxury travel",
    "Finland travel agency",
    "Simplifly Finland",
  ],
  authors: [{ name: "Simplifly Finland" }],
  // Open Graph — controls how links look when shared on social media
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Simplifly Finland",
    title: "Simplifly Finland — Luxury Travel to Sri Lanka & Maldives",
    description:
      "Premium curated travel packages to Sri Lanka and the Maldives.",
  },
  // Robots — tell search engine crawlers how to index the site
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// ─── Root Layout Component ────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden w-full max-w-[100vw]">
      <body
        suppressHydrationWarning
        className={`${poppins.variable} font-sans min-h-full flex flex-col antialiased overflow-x-hidden w-full max-w-[100vw]`}
      >
        <SiteAssetsProvider>
          {/*
           * Toaster — global toast notification system (sonner library).
           * Rendered here so toasts are available across all pages, including
           * admin and public routes without needing to re-mount the provider.
           */}
          <Toaster position="top-center" richColors />

          {/*
           * ClientLayout — detects whether the current route is an admin portal
           * page (/admin, /login) or a public page and renders the appropriate
           * shell (Header + Footer vs. bare main).
           */}
          <ClientLayout>{children}</ClientLayout>
        </SiteAssetsProvider>
      </body>
    </html>
  );
}
