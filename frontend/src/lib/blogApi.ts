const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type Category = 'All' | 'Destinations' | 'Travel Tips' | 'Guides' | 'Food' | 'Experiences';

export const categoryColors: Record<string, string> = {
  'Destinations': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Travel Tips': 'text-purple-700 bg-purple-50 border-purple-200',
  'Guides': 'text-blue-700 bg-blue-50 border-blue-200',
  'Food': 'text-orange-700 bg-orange-50 border-orange-200',
  'Experiences': 'text-rose-700 bg-rose-50 border-rose-200',
};

export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'quote' | 'tip' | 'list' | 'image';
  text?: string;
  items?: string[];
  url?: string;
  caption?: string;
  publicId?: string;
}

export interface BlogPostData {
  id?: string;
  slug?: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  imagePublicId?: string;
  featured: boolean;
  author: string;
  authorRole: string;
  authorAvatar: string;
  authorAvatarPublicId?: string;
  tags: string[];
  content: ContentBlock[];
  status: string;
  createdAt?: string;
}

export const blogApi = {
  async getPosts(params?: { category?: string; status?: string }) {
    const url = new URL(`${API_URL}/blogs`);
    if (params?.category) url.searchParams.append('category', params.category);
    if (params?.status) url.searchParams.append('status', params.status);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  },

  async getPostBySlug(slug: string) {
    const res = await fetch(`${API_URL}/blogs/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch blog');
    return res.json();
  },

  async createPost(data: Partial<BlogPostData>) {
    const res = await fetch(`${API_URL}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create blog');
    return res.json();
  },

  async updatePost(id: string, data: Partial<BlogPostData>) {
    const res = await fetch(`${API_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update blog');
    return res.json();
  },

  async deletePost(id: string) {
    const res = await fetch(`${API_URL}/blogs/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete blog');
    return res.json();
  }
};
