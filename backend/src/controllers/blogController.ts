import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { cloudinary, deleteCloudinaryImage } from '../config/cloudinary';
import { Prisma } from '@prisma/client';

export class BlogController {
  // Get all blogs (or filter by status/category)
  static async getBlogs(req: Request, res: Response) {
    try {
      const { category, status } = req.query;
      
      const where: any = {};
      if (category && category !== 'All') where.category = String(category);
      if (status) where.status = String(status);

      const blogs = await prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          category: true,
          readTime: true,
          image: true,
          imagePublicId: true,
          featured: true,
          author: true,
          authorRole: true,
          authorAvatar: true,
          authorAvatarPublicId: true,
          tags: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      
      res.json(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  }

  // Get a single blog by slug or ID
  static async getBlogBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      
      // Attempt to find by slug first, then by ID
      let blog = await prisma.blogPost.findUnique({ where: { slug } });
      if (!blog) {
        blog = await prisma.blogPost.findUnique({ where: { id: slug } });
      }

      if (!blog) {
        res.status(404).json({ error: 'Blog not found' });
        return;
      }
      
      res.json(blog);
    } catch (error) {
      console.error('Error fetching blog:', error);
      res.status(500).json({ error: 'Failed to fetch blog' });
    }
  }

  // Create a new blog
  static async createBlog(req: Request, res: Response) {
    try {
      const {
        title,
        excerpt,
        category,
        readTime,
        image,
        imagePublicId,
        featured,
        author,
        authorRole,
        authorAvatar,
        authorAvatarPublicId,
        tags,
        content,
        status,
      } = req.body;

      if (!title || !category || !author) {
        res.status(400).json({ error: 'Missing required fields (title, category, author)' });
        return;
      }

      // Generate a basic slug if one doesn't exist (handle duplicates with UUID append in real world, or just simple replace)
      let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const existing = await prisma.blogPost.findUnique({ where: { slug: baseSlug } });
      if (existing) {
        baseSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
      }

      const newBlog = await prisma.blogPost.create({
        data: {
          title,
          slug: baseSlug,
          excerpt: excerpt || '',
          category,
          readTime,
          image,
          imagePublicId,
          featured: featured || false,
          author,
          authorRole,
          authorAvatar,
          authorAvatarPublicId,
          tags: tags || [],
          content: content ? (content as Prisma.JsonArray) : [],
          status: status || 'Draft',
        },
      });

      res.status(201).json(newBlog);
    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({ error: 'Failed to create blog' });
    }
  }

  // Update a blog
  static async updateBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        title,
        slug,
        excerpt,
        category,
        readTime,
        image,
        imagePublicId,
        featured,
        author,
        authorRole,
        authorAvatar,
        authorAvatarPublicId,
        tags,
        content,
        status,
      } = req.body;

      const existing = await prisma.blogPost.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ error: 'Blog not found' });
        return;
      }

      const updatedBlog = await prisma.blogPost.update({
        where: { id },
        data: {
          title,
          slug: slug || existing.slug,
          excerpt,
          category,
          readTime,
          image,
          imagePublicId,
          featured,
          author,
          authorRole,
          authorAvatar,
          authorAvatarPublicId,
          tags,
          content: content ? content : (existing.content as any),
          status,
        },
      });

      res.json(updatedBlog);
    } catch (error) {
      console.error('Error updating blog:', error);
      res.status(500).json({ error: 'Failed to update blog' });
    }
  }

  // Delete a blog
  static async deleteBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const blog = await prisma.blogPost.findUnique({ where: { id } });
      if (!blog) {
        res.status(404).json({ error: 'Blog not found' });
        return;
      }

      // Delete images from Cloudinary without blocking the DB transaction
      const imagesToDelete = [
        blog.imagePublicId,
        blog.authorAvatarPublicId
      ];

      if (Array.isArray(blog.content)) {
        const blocks = blog.content as any[];
        for (const block of blocks) {
          if (block.type === 'image' && block.publicId) {
            imagesToDelete.push(block.publicId);
          }
        }
      }

      Promise.all(imagesToDelete.filter(Boolean).map(id => deleteCloudinaryImage(id))).catch(console.error);

      await prisma.blogPost.delete({ where: { id } });

      res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({ error: 'Failed to delete blog' });
    }
  }
}
