import type { NextConfig } from "next";

/**
 * next.config.ts — Simplifly Finland Frontend Configuration
 *
 * Key settings:
 *  - API proxy: rewrites /api/* → backend at localhost:5000 (dev) or production URL
 *  - images: allows Cloudinary and Unsplash remote images to be served via
 *            the Next.js Image Optimization pipeline (auto WebP, lazy-load, responsive srcset)
 *  - compress: enables gzip/brotli compression on all server responses
 *  - poweredByHeader: removes the "X-Powered-By: Next.js" header (minor security hardening)
 */
const nextConfig: NextConfig = {
  // ------------------------------------------------------------------
  // Compression — gzip/brotli on all responses for faster transfer
  // ------------------------------------------------------------------
  compress: true,

  // ------------------------------------------------------------------
  // Remove the "X-Powered-By" header from HTTP responses
  // ------------------------------------------------------------------
  poweredByHeader: false,

  // ------------------------------------------------------------------
  // Remote image domains allowed by the Next.js <Image> optimizer.
  // Only hosts listed here can serve optimized images — this prevents
  // abuse of the image optimization pipeline by third parties.
  // ------------------------------------------------------------------
  images: {
    remotePatterns: [
      {
        // Cloudinary — used for all uploaded resort/tour/blog images
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        // Unsplash — used for hero/placeholder images in admin UI
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // Enable modern formats: Next.js will serve WebP/AVIF where supported
    formats: ["image/avif", "image/webp"],
  },

  // ------------------------------------------------------------------
  // API Proxy Rewrites — transparently forward /api/* requests to the
  // Express backend without exposing the backend port to the browser.
  // In production, change the destination to your deployed API URL.
  // ------------------------------------------------------------------
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
