import { BlogPageClient } from './BlogPageClient';
import { blogApi } from '../../lib/blogApi';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Blog',
  description: 'Discover insider travel guides, tips and inspiration for Sri Lanka and the Maldives from the Simplifly Finland team.',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPage() {
  try {
    const allPosts = await blogApi.getPosts({ status: 'Published' });
    return <BlogPageClient initialPosts={allPosts} />;
  } catch (error) {
    console.error("Failed to load blogs:", error);
    return <BlogPageClient initialPosts={[]} />;
  }
}
