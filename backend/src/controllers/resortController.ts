import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { deleteCloudinaryImage } from '../config/cloudinary';

const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export class ResortController {

  // Get all Resort Categories
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await prisma.resortCategory.findMany({
        orderBy: { name: 'asc' }
      });
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch resort categories' });
    }
  }

  // Get a specific Resort Category by Slug
  static async getCategoryBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const category = await prisma.resortCategory.findUnique({
        where: { slug }
      });
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.status(200).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch category by slug' });
    }
  }

  // Get Public Resorts by Category Slug
  static async getPublicResorts(req: Request, res: Response) {
    try {
      const { categorySlug } = req.query;
      const whereClause: any = { status: 'active' };
      
      if (categorySlug && typeof categorySlug === 'string') {
        whereClause.category = { slug: categorySlug };
      }

      const resorts = await prisma.resort.findMany({
        where: whereClause,
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(resorts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch public resorts' });
    }
  }

  // Get Admin Resorts (list view)
  static async getAdminResorts(req: AuthenticatedRequest, res: Response) {
    try {
      const resorts = await prisma.resort.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(resorts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch admin resorts' });
    }
  }

  // Get single resort by ID
  static async getResortById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resort = await prisma.resort.findUnique({
        where: { id },
        include: {
          category: true,
          gallery: { orderBy: { order: 'asc' } },
          villas: {
            include: { images: { orderBy: { order: 'asc' } } }
          },
          restaurants: {
            include: { schedules: true }
          },
          factSheets: true
        }
      });
      
      if (!resort) {
        return res.status(404).json({ error: 'Resort not found' });
      }
      
      res.status(200).json(resort);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch resort' });
    }
  }

  // Get single resort by Slug
  static async getResortBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const resort = await prisma.resort.findUnique({
        where: { slug },
        include: {
          category: true,
          gallery: { orderBy: { order: 'asc' } },
          villas: {
            include: { images: { orderBy: { order: 'asc' } } }
          },
          restaurants: {
            include: { schedules: true }
          },
          factSheets: true
        }
      });
      
      if (!resort) {
        return res.status(404).json({ error: 'Resort not found' });
      }
      
      res.status(200).json(resort);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch resort by slug' });
    }
  }

  // Create new resort
  static async createResort(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        title, summary, location, transfer, price, status,
        tripAdvisorRating, tripAdvisorReviews, bookingScore, bookingReviews,
        heroImage, heroImagePublicId, packageImage, packageImagePublicId,
        categoryId, facilities, offers,
        gallery, villas, restaurants, factSheets
      } = req.body;

      const newResort = await prisma.resort.create({
        data: {
          title, slug: generateSlug(title), summary, location, transfer, status,
          price: Number(price) || 0,
          tripAdvisorRating: Number(tripAdvisorRating) || null,
          tripAdvisorReviews: Number(tripAdvisorReviews) || null,
          bookingScore: Number(bookingScore) || null,
          bookingReviews: Number(bookingReviews) || null,
          heroImage, heroImagePublicId, packageImage, packageImagePublicId,
          categoryId,
          facilities: facilities || [],
          offers: offers || [],
          gallery: {
            create: (gallery || []).map((g: any, index: number) => ({
              url: g.url || g.src,
              publicId: g.publicId || '',
              order: index
            }))
          },
          villas: {
            create: (villas || []).map((v: any) => ({
              title: v.title,
              description: v.description,
              size: v.size,
              capacity: v.capacity,
              bedType: v.bedType,
              features: v.features || [],
              images: {
                create: (v.images || []).map((img: any, index: number) => ({
                  url: img.url || img.src,
                  publicId: img.publicId || '',
                  order: index
                }))
              }
            }))
          },
          restaurants: {
            create: (restaurants || []).map((r: any) => ({
              title: r.title,
              description: r.description,
              image: r.image,
              imagePublicId: r.imagePublicId,
              schedules: {
                create: (r.schedules || []).map((s: any) => ({
                  meal: s.meal,
                  time: s.time
                }))
              }
            }))
          },
          factSheets: {
            create: (factSheets || []).map((f: any) => ({
              name: f.name,
              url: f.url,
              publicId: f.publicId
            }))
          }
        }
      });

      res.status(201).json(newResort);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create resort' });
    }
  }

  // Update existing resort
  static async updateResort(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const {
        title, summary, location, transfer, price, status,
        tripAdvisorRating, tripAdvisorReviews, bookingScore, bookingReviews,
        heroImage, heroImagePublicId, packageImage, packageImagePublicId,
        categoryId, facilities, offers,
        gallery, villas, restaurants, factSheets
      } = req.body;

      // For a full update of nested relations, we delete the old nested relations and recreate them.
      // This is simpler than matching IDs and updating individually.
      
      await prisma.$transaction([
        prisma.resortGalleryImage.deleteMany({ where: { resortId: id } }),
        prisma.resortVilla.deleteMany({ where: { resortId: id } }),
        prisma.resortRestaurant.deleteMany({ where: { resortId: id } }),
        prisma.resortFactSheet.deleteMany({ where: { resortId: id } })
      ]);

      const updatedResort = await prisma.resort.update({
        where: { id },
        data: {
          title, slug: generateSlug(title), summary, location, transfer, status,
          price: Number(price) || 0,
          tripAdvisorRating: Number(tripAdvisorRating) || null,
          tripAdvisorReviews: Number(tripAdvisorReviews) || null,
          bookingScore: Number(bookingScore) || null,
          bookingReviews: Number(bookingReviews) || null,
          heroImage, heroImagePublicId, packageImage, packageImagePublicId,
          categoryId,
          facilities: facilities || [],
          offers: offers || [],
          gallery: {
            create: (gallery || []).map((g: any, index: number) => ({
              url: g.url || g.src,
              publicId: g.publicId || '',
              order: index
            }))
          },
          villas: {
            create: (villas || []).map((v: any) => ({
              title: v.title,
              description: v.description,
              size: v.size,
              capacity: v.capacity,
              bedType: v.bedType,
              features: v.features || [],
              images: {
                create: (v.images || []).map((img: any, index: number) => ({
                  url: img.url || img.src,
                  publicId: img.publicId || '',
                  order: index
                }))
              }
            }))
          },
          restaurants: {
            create: (restaurants || []).map((r: any) => ({
              title: r.title,
              description: r.description,
              image: r.image,
              imagePublicId: r.imagePublicId,
              schedules: {
                create: (r.schedules || []).map((s: any) => ({
                  meal: s.meal,
                  time: s.time
                }))
              }
            }))
          },
          factSheets: {
            create: (factSheets || []).map((f: any) => ({
              name: f.name,
              url: f.url,
              publicId: f.publicId
            }))
          }
        }
      });

      res.status(200).json(updatedResort);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update resort' });
    }
  }

  // Delete a resort
  static async deleteResort(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      
      const resort = await prisma.resort.findUnique({
        where: { id },
        include: { gallery: true, villas: { include: { images: true } }, restaurants: true, factSheets: true }
      });
      
      if (!resort) return res.status(404).json({ error: 'Resort not found' });

      // Cascade delete handles nested records
      await prisma.resort.delete({
        where: { id }
      });
      
      // Fire and forget Cloudinary deletions
      const imagesToDelete = [
        resort.heroImagePublicId,
        resort.packageImagePublicId,
        resort.offerPosterPublicId,
        ...resort.gallery.map(g => g.publicId),
        ...resort.villas.flatMap(v => v.images.map(img => img.publicId)),
        ...resort.restaurants.map(r => r.imagePublicId),
        ...resort.factSheets.map(f => f.publicId)
      ].filter(Boolean);

      Promise.all(imagesToDelete.map(id => deleteCloudinaryImage(id))).catch(console.error);
      
      res.status(200).json({ message: 'Resort deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete resort' });
    }
  }

  // Toggle resort status
  static async toggleStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const updated = await prisma.resort.update({
        where: { id },
        data: { status }
      });
      
      res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  }

  // --- CATEGORY CRUD ---

  static async createCategory(req: AuthenticatedRequest, res: Response) {
    const { name, slug, heroImage, subtitle, icon, desc, longDesc } = req.body;
    try {
      const category = await prisma.resortCategory.create({
        data: { name, slug, heroImage, subtitle, icon, desc, longDesc }
      });
      res.status(201).json({ message: 'Category created successfully!', category });
    } catch (error) {
      console.error('Create resort category error:', error);
      res.status(500).json({ error: 'Failed to create resort category.' });
    }
  }

  static async updateCategory(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { name, slug, heroImage, subtitle, icon, desc, longDesc } = req.body;
    try {
      const category = await prisma.resortCategory.update({
        where: { id },
        data: { name, slug, heroImage, subtitle, icon, desc, longDesc }
      });
      res.status(200).json({ message: 'Category updated successfully!', category });
    } catch (error) {
      console.error('Update resort category error:', error);
      res.status(500).json({ error: 'Failed to update resort category.' });
    }
  }

  static async deleteCategory(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
      // Check if category has active resorts
      const category = await prisma.resortCategory.findUnique({
        where: { id },
        include: { resorts: true }
      });

      if (!category) {
        res.status(404).json({ error: 'Category not found.' });
        return;
      }

      if (category.resorts && category.resorts.length > 0) {
        res.status(400).json({ error: 'Cannot delete category because it contains active resorts. Please delete or move the resorts first.' });
        return;
      }

      await prisma.resortCategory.delete({ where: { id } });
      
      if (category.heroImage) {
        deleteCloudinaryImage(category.heroImage, true).catch(console.error);
      }

      res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
      console.error('Delete resort category error:', error);
      res.status(500).json({ error: 'Failed to delete resort category.' });
    }
  }

  // Update Resort Discount and Offer Poster
  static async updateDiscount(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { discount, offerPoster, offerPosterPublicId } = req.body;

      const resort = await prisma.resort.findUnique({ where: { id } });
      if (!resort) return res.status(404).json({ error: 'Resort not found' });

      if (resort.offerPosterPublicId && resort.offerPosterPublicId !== offerPosterPublicId) {
        deleteCloudinaryImage(resort.offerPosterPublicId).catch(console.error);
      }

      const updated = await prisma.resort.update({
        where: { id },
        data: {
          discount: discount ? Number(discount) : null,
          offerPoster: offerPoster || null,
          offerPosterPublicId: offerPosterPublicId || null,
        }
      });
      res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update resort discount' });
    }
  }

  // Get all active offers (resorts with offerPoster)
  static async getOffers(req: Request, res: Response) {
    try {
      const offers = await prisma.resort.findMany({
        where: {
          status: 'active',
          offerPoster: { not: null }
        },
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(offers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch resort offers' });
    }
  }

}
