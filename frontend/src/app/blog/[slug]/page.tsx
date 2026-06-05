import { ArticlePageClient } from './ArticlePageClient';
import { blogApi } from '../../../lib/blogApi';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    const [post, allPosts] = await Promise.all([
      blogApi.getPostBySlug(slug),
      blogApi.getPosts({ status: 'Published' })
    ]);

    if (!post || post.error) {
      return notFound();
    }

    let related = allPosts.filter((p: any) => p.id !== post.id && p.category === post.category).slice(0, 3);
    if (related.length === 0) {
      related = allPosts.filter((p: any) => p.id !== post.id).slice(0, 3);
    }

    return <ArticlePageClient initialPost={post} initialRelated={related} />;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return notFound();
  }
}
