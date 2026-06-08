import { Request, Response } from 'express';
import { prisma } from '../config/db';

export class HomepageController {
  
  // Admin: Get current raw settings
  static async getSettings(req: Request, res: Response) {
    try {
      let config = await prisma.homepageConfig.findUnique({
        where: { id: 'default' }
      });
      
      if (!config) {
        config = await prisma.homepageConfig.create({
          data: {
            id: 'default',
            featuredTours: [],
            featuredResorts: [],
            galleryImages: [],
            featuredBlogs: []
          }
        });
      }
      
      res.status(200).json(config);
    } catch (error) {
      console.error('Fetch homepage settings error:', error);
      res.status(500).json({ error: 'Failed to fetch homepage settings' });
    }
  }

  // Admin: Update settings
  static async updateSettings(req: Request, res: Response) {
    try {
      const { featuredTours, featuredResorts, galleryImages, featuredBlogs } = req.body;
      
      const config = await prisma.homepageConfig.upsert({
        where: { id: 'default' },
        update: {
          featuredTours,
          featuredResorts,
          galleryImages,
          featuredBlogs
        },
        create: {
          id: 'default',
          featuredTours,
          featuredResorts,
          galleryImages,
          featuredBlogs
        }
      });
      
      res.status(200).json(config);
    } catch (error) {
      console.error('Update homepage settings error:', error);
      res.status(500).json({ error: 'Failed to update homepage settings' });
    }
  }

  // Public: Get populated data for homepage
  static async getHomepageData(req: Request, res: Response) {
    try {
      const config = await prisma.homepageConfig.findUnique({
        where: { id: 'default' }
      });

      if (!config) {
        res.status(200).json({ tours: [], resorts: [], gallery: [], blogs: [] });
        return;
      }

      // Fetch Tours
      const tours = await prisma.tourPackage.findMany({
        where: {
          id: { in: config.featuredTours },
          status: 'active'
        },
        include: { category: true }
      });

      // Sort tours based on the order in featuredTours array
      const sortedTours = config.featuredTours
        .map(id => tours.find(t => t.id === id))
        .filter(t => t !== undefined);

      // Fetch Resorts
      const resorts = await prisma.resort.findMany({
        where: {
          id: { in: config.featuredResorts },
          status: 'active'
        },
        include: { categories: true }
      });

      const sortedResorts = config.featuredResorts
        .map(id => resorts.find(r => r.id === id))
        .filter(r => r !== undefined);

      // Fetch Blogs
      const blogs = await prisma.blogPost.findMany({
        where: {
          id: { in: config.featuredBlogs },
          status: 'Published'
        }
      });

      const sortedBlogs = config.featuredBlogs
        .map(id => blogs.find(b => b.id === id))
        .filter(b => b !== undefined);

      // Fetch Gallery (MediaAsset)
      const gallery = await prisma.mediaAsset.findMany({
        where: {
          id: { in: config.galleryImages }
        }
      });

      const sortedGallery = config.galleryImages
        .map(id => gallery.find(g => g.id === id))
        .filter(g => g !== undefined);

      res.status(200).json({
        tours: sortedTours,
        resorts: sortedResorts,
        gallery: sortedGallery,
        blogs: sortedBlogs
      });
    } catch (error) {
      console.error('Fetch homepage data error:', error);
      res.status(500).json({ error: 'Failed to fetch homepage data' });
    }
  }
}
