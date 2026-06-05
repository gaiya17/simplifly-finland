import { BlogPageClient } from './BlogPageClient';
import { blogApi } from '../../lib/blogApi';

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
