/**
 * sitemap.ts — Dynamic XML Sitemap
 *
 * Next.js automatically serves this as /sitemap.xml.
 * It fetches live data from the backend so every new tour, resort,
 * and blog post is automatically included the moment it is created.
 *
 * Priority guide:
 *  1.0 = Homepage
 *  0.9 = Individual product pages (tours, resorts, blogs)
 *  0.8 = Category listing pages
 *  0.7 = Static informational pages
 */

import type { MetadataRoute } from 'next';

const BASE_URL = 'https://simpliflyfinland.com';

// ── Internal API URL (server-side only) ──────────────────────────────────────
// Uses the Docker internal network URL when running server-side to avoid
// going through the public internet / Caddy reverse proxy.
const API_URL =
  process.env.INTERNAL_API_URL || 'http://backend:5000/api';

// ── Safe fetch helper ─────────────────────────────────────────────────────────
// Returns an empty array on failure so a single broken API call never
// prevents the rest of the sitemap from being generated.
async function safeFetch<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // regenerate sitemap at most once per hour
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── 1. Static pages ────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/sri-lanka-tours`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/sri-lanka-tours/all`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/maldives-resorts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/maldives-resorts/all`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/who-we-are`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // ── 2. Sri Lanka tour categories ───────────────────────────────────────────
  const tourCategories = await safeFetch<{ slug: string; updatedAt?: string }>(
    `${API_URL}/tours/categories`
  );
  const tourCategoryPages: MetadataRoute.Sitemap = tourCategories
    .filter((c) => c.slug)
    .map((cat) => ({
      url: `${BASE_URL}/sri-lanka-tours/${cat.slug}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // ── 3. Individual Sri Lanka tour packages ──────────────────────────────────
  const tours = await safeFetch<{
    slug: string;
    category?: { slug: string };
    updatedAt?: string;
    status?: string;
  }>(`${API_URL}/tours`);
  const tourPages: MetadataRoute.Sitemap = tours
    .filter((t) => t.slug && t.status !== 'inactive')
    .map((tour) => ({
      url: `${BASE_URL}/sri-lanka-tours/${tour.category?.slug || 'all'}/${tour.slug}`,
      lastModified: tour.updatedAt ? new Date(tour.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

  // ── 4. Maldives resort categories ─────────────────────────────────────────
  const resortCategories = await safeFetch<{ slug: string; updatedAt?: string }>(
    `${API_URL}/resorts/categories`
  );
  const resortCategoryPages: MetadataRoute.Sitemap = resortCategories
    .filter((c) => c.slug)
    .map((cat) => ({
      url: `${BASE_URL}/maldives-resorts/${cat.slug}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // ── 5. Individual Maldives resorts ─────────────────────────────────────────
  const resorts = await safeFetch<{
    slug: string;
    categories?: { slug: string }[];
    updatedAt?: string;
    status?: string;
  }>(`${API_URL}/resorts`);
  const resortPages: MetadataRoute.Sitemap = resorts
    .filter((r) => r.slug && r.status !== 'inactive')
    .map((resort) => ({
      url: `${BASE_URL}/maldives-resorts/${resort.categories?.[0]?.slug || 'all'}/${resort.slug}`,
      lastModified: resort.updatedAt ? new Date(resort.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

  // ── 6. Blog articles ──────────────────────────────────────────────────────
  const blogs = await safeFetch<{
    slug: string;
    status?: string;
    updatedAt?: string;
    createdAt?: string;
  }>(`${API_URL}/blogs?status=published`);
  const blogPages: MetadataRoute.Sitemap = blogs
    .filter((b) => b.slug && b.status === 'published')
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt
        ? new Date(post.updatedAt)
        : post.createdAt
        ? new Date(post.createdAt)
        : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // ── Combine all ────────────────────────────────────────────────────────────
  return [
    ...staticPages,
    ...tourCategoryPages,
    ...tourPages,
    ...resortCategoryPages,
    ...resortPages,
    ...blogPages,
  ];
}
