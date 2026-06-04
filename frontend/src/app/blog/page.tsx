import { BlogPageClient } from './BlogPageClient';
import { blogApi } from '../../lib/blogApi';

export default async function BlogPage() {
  try {
    const allPosts = await blogApi.getPosts({ status: 'Published' });
    return <BlogPageClient initialPosts={allPosts} />;
  } catch (error) {
    console.error("Failed to load blogs:", error);
    return <BlogPageClient initialPosts={[]} />;
  }
}
