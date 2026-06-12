import { Response, Request } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { cloudinary, deleteCloudinaryImage } from '../config/cloudinary';

const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export class TourController {
  // --- DESTINATIONS ---

  static async getDestinations(req: Request, res: Response) {
    try {
      let destinations = await prisma.tourDestination.findMany({ orderBy: { name: 'asc' } });
      
      // Auto-seed if empty
      if (destinations.length === 0) {
        const defaultDestinations = [
          "Colombo", "Negombo", "Kandy", "Nuwara Eliya", "Ella", "Galle", "Mirissa",
          "Yala", "Udawalawe", "Sigiriya", "Dambulla", "Polonnaruwa", "Anuradhapura",
          "Trincomalee", "Arugam Bay", "Jaffna", "Bentota", "Hikkaduwa", "Airport"
        ];
        await prisma.tourDestination.createMany({
          data: defaultDestinations.map(name => ({ name })),
          skipDuplicates: true
        });
        destinations = await prisma.tourDestination.findMany({ orderBy: { name: 'asc' } });
      }
      
      res.status(200).json(destinations);
    } catch (error) {
      console.error('Fetch destinations error:', error);
      res.status(500).json({ error: 'Failed to retrieve destinations.' });
    }
  }

  static async createDestination(req: AuthenticatedRequest, res: Response) {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Destination name is required.' });
    }
    try {
      const newDest = await prisma.tourDestination.create({
        data: { name: name.trim() }
      });
      res.status(201).json({ message: 'Destination created successfully!', destination: newDest });
    } catch (error: any) {
      console.error('Create destination error:', error);
      if (error.code === 'P2002') {
         return res.status(400).json({ error: 'Destination already exists.' });
      }
      res.status(500).json({ error: 'Failed to create destination.' });
    }
  }

  // --- PUBLIC ENDPOINTS ---

  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await prisma.tourCategory.findMany({ orderBy: { name: 'asc' } });
      res.status(200).json(categories);
    } catch (error) {
      console.error('Fetch categories error:', error);
      res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
  }

  static async getAllTours(req: Request, res: Response) {
    try {
      const tours = await prisma.tourPackage.findMany({
        where: { status: 'active' },
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(tours);
    } catch (error) {
      console.error('Fetch tours error:', error);
      res.status(500).json({ error: 'Failed to retrieve tours.' });
    }
  }

  static async getToursByCategory(req: Request, res: Response) {
    const { slug } = req.params;
    try {
      const category = await prisma.tourCategory.findUnique({
        where: { slug },
        include: {
          packages: {
            where: { status: 'active' },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      if (!category) {
        res.status(404).json({ error: 'Category not found.' });
        return;
      }
      res.status(200).json(category);
    } catch (error) {
      console.error('Fetch category error:', error);
      res.status(500).json({ error: 'Failed to retrieve category.' });
    }
  }

  static async getTourById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const tour = await prisma.tourPackage.findUnique({
        where: { id },
        include: {
          category: true,
          itinerary: { orderBy: { dayNumber: 'asc' } },
          inclusions: true,
          gallery: { orderBy: { order: 'asc' } }
        }
      });
      if (!tour) {
        res.status(404).json({ error: 'Tour not found.' });
        return;
      }
      res.status(200).json(tour);
    } catch (error) {
      console.error('Fetch tour by ID error:', error);
      res.status(500).json({ error: 'Failed to retrieve tour.' });
    }
  }

  static async getTourBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    try {
      const tour = await prisma.tourPackage.findUnique({
        where: { slug },
        include: {
          category: true,
          itinerary: { orderBy: { dayNumber: 'asc' } },
          inclusions: true,
          gallery: { orderBy: { order: 'asc' } }
        }
      });
      if (!tour) {
        res.status(404).json({ error: 'Tour not found.' });
        return;
      }
      res.status(200).json(tour);
    } catch (error) {
      console.error('Fetch tour by slug error:', error);
      res.status(500).json({ error: 'Failed to retrieve tour.' });
    }
  }

  // --- ADMIN ENDPOINTS ---

  static async getAdminTours(req: AuthenticatedRequest, res: Response) {
    try {
      const tours = await prisma.tourPackage.findMany({
        include: { 
          category: true,
          itinerary: { orderBy: { dayNumber: 'asc' } },
          inclusions: true,
          gallery: { orderBy: { order: 'asc' } }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(tours);
    } catch (error) {
      console.error('Fetch admin tours error:', error);
      res.status(500).json({ error: 'Failed to retrieve tours.' });
    }
  }

  static async createTour(req: AuthenticatedRequest, res: Response) {
    const {
      title, heroImage, heroImagePublicId, packageImage, packageImagePublicId,
      summary, price, discount, days, nights, status, categoryId, destinations,
      itinerary, inclusions, gallery
    } = req.body;

    try {
      const newTour = await prisma.tourPackage.create({
        data: {
          title, slug: generateSlug(title), heroImage, heroImagePublicId, packageImage, packageImagePublicId,
          summary, price: Number(price), discount: discount ? Number(discount) : null,
          days: Number(days), nights: Number(nights), status, categoryId, destinations,
          itinerary: {
            create: itinerary?.map((day: any) => ({
              dayNumber: Number(day.dayNumber),
              dayNumberEnd: day.dayNumberEnd ? Number(day.dayNumberEnd) : null,
              title: day.title,
              route: day.route,
              description: day.description,
              stay: day.stay,
              mealPlan: day.mealPlan
            })) || []
          },
          inclusions: {
            create: inclusions?.map((inc: any) => ({
              text: inc.text,
              isIncluded: inc.isIncluded
            })) || []
          },
          gallery: {
            create: gallery?.map((img: any) => ({
              url: img.url,
              publicId: img.publicId,
              order: Number(img.order)
            })) || []
          }
        },
        include: { category: true }
      });

      res.status(201).json({ message: 'Tour created successfully!', tour: newTour });
    } catch (error) {
      console.error('Create tour error:', error);
      res.status(500).json({ error: 'Failed to create tour.' });
    }
  }

  static async updateTour(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const {
      title, heroImage, heroImagePublicId, packageImage, packageImagePublicId,
      summary, price, discount, days, nights, status, categoryId, destinations,
      itinerary, inclusions, gallery
    } = req.body;

    try {
      // For simplicity in this demo, we'll delete related arrays and recreate them.
      // In a strict production system you might upsert by ID.
      await prisma.$transaction([
        prisma.itineraryDay.deleteMany({ where: { packageId: id } }),
        prisma.tourInclusion.deleteMany({ where: { packageId: id } }),
        prisma.galleryImage.deleteMany({ where: { packageId: id } })
      ]);

      const updatedTour = await prisma.tourPackage.update({
        where: { id },
        data: {
          title, slug: generateSlug(title), heroImage, heroImagePublicId, packageImage, packageImagePublicId,
          summary, price: Number(price), discount: discount ? Number(discount) : null,
          days: Number(days), nights: Number(nights), status, categoryId, destinations,
          itinerary: {
            create: itinerary?.map((day: any) => ({
              dayNumber: Number(day.dayNumber),
              dayNumberEnd: day.dayNumberEnd ? Number(day.dayNumberEnd) : null,
              title: day.title,
              route: day.route,
              description: day.description,
              stay: day.stay,
              mealPlan: day.mealPlan
            })) || []
          },
          inclusions: {
            create: inclusions?.map((inc: any) => ({
              text: inc.text,
              isIncluded: inc.isIncluded
            })) || []
          },
          gallery: {
            create: gallery?.map((img: any) => ({
              url: img.url,
              publicId: img.publicId,
              order: Number(img.order)
            })) || []
          }
        },
        include: { category: true, itinerary: true, inclusions: true, gallery: true }
      });

      res.status(200).json({ message: 'Tour updated successfully!', tour: updatedTour });
    } catch (error) {
      console.error('Update tour error:', error);
      res.status(500).json({ error: 'Failed to update tour.' });
    }
  }

  static async deleteTour(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
      const tour = await prisma.tourPackage.findUnique({
        where: { id },
        include: { gallery: true }
      });
      if (!tour) {
        res.status(404).json({ error: 'Tour not found.' });
        return;
      }

      // Delete images from Cloudinary
      const imagesToDelete = [
        tour.heroImagePublicId,
        tour.packageImagePublicId,
        tour.offerPosterPublicId,
        ...tour.gallery.map(g => g.publicId)
      ].filter(Boolean);

      Promise.all(imagesToDelete.map(id => deleteCloudinaryImage(id))).catch(console.error);

      await prisma.tourPackage.delete({ where: { id } });
      res.status(200).json({ message: 'Tour deleted successfully.' });
    } catch (error) {
      console.error('Delete tour error:', error);
      res.status(500).json({ error: 'Failed to delete tour.' });
    }
  }

  static async toggleStatus(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { status } = req.body; // 'active' or 'inactive'
    try {
      const updated = await prisma.tourPackage.update({
        where: { id },
        data: { status }
      });
      res.status(200).json(updated);
    } catch (error) {
      console.error('Toggle status error:', error);
      res.status(500).json({ error: 'Failed to update status.' });
    }
  }

  static async updateDiscount(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { discount, offerPoster, offerPosterPublicId } = req.body;
    try {
      const oldTour = await prisma.tourPackage.findUnique({ where: { id } });
      if (!oldTour) return res.status(404).json({ error: 'Tour not found' });
      
      if (oldTour.offerPosterPublicId && oldTour.offerPosterPublicId !== offerPosterPublicId) {
        deleteCloudinaryImage(oldTour.offerPosterPublicId).catch(console.error);
      }

      const package_ = await prisma.tourPackage.update({
        where: { id },
        data: { 
          discount: discount !== undefined ? (discount ? Number(discount) : null) : undefined,
          offerPoster: offerPoster !== undefined ? offerPoster : undefined,
          offerPosterPublicId: offerPosterPublicId !== undefined ? offerPosterPublicId : undefined
        }
      });
      res.status(200).json({ message: 'Discount updated successfully', package: package_ });
    } catch (error) {
      console.error('Update discount error:', error);
      res.status(500).json({ error: 'Failed to update discount.' });
    }
  }

  // --- OFFERS / PROMOTIONS ---
  static async getOffers(req: Request, res: Response) {
    try {
      const offers = await prisma.tourPackage.findMany({
        where: { 
          status: 'active',
          offerPoster: { not: null }
        },
        include: { category: true },
        orderBy: { updatedAt: 'desc' }
      });
      res.status(200).json(offers);
    } catch (error) {
      console.error('Fetch offers error:', error);
      res.status(500).json({ error: 'Failed to retrieve offers.' });
    }
  }

  // --- CATEGORY CRUD ---

  static async createCategory(req: AuthenticatedRequest, res: Response) {
    const { name, slug, heroImage, subtitle, icon, longDesc } = req.body;
    try {
      const category = await prisma.tourCategory.create({
        data: { name, slug, heroImage, subtitle, icon, longDesc }
      });
      res.status(201).json({ message: 'Category created successfully!', category });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ error: 'Failed to create category.' });
    }
  }

  static async updateCategory(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { name, slug, heroImage, subtitle, icon, longDesc } = req.body;
    try {
      const category = await prisma.tourCategory.update({
        where: { id },
        data: { name, slug, heroImage, subtitle, icon, longDesc }
      });
      res.status(200).json({ message: 'Category updated successfully!', category });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ error: 'Failed to update category.' });
    }
  }

  static async deleteCategory(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
      // Check if category has active packages
      const category = await prisma.tourCategory.findUnique({
        where: { id },
        include: { packages: true }
      });

      if (!category) {
        res.status(404).json({ error: 'Category not found.' });
        return;
      }

      if (category.packages && category.packages.length > 0) {
        res.status(400).json({ error: 'Cannot delete category because it contains active packages. Please delete or move the packages first.' });
        return;
      }

      await prisma.tourCategory.delete({ where: { id } });
      
      if (category.heroImage) {
        deleteCloudinaryImage(category.heroImage, true).catch(console.error);
      }

      res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({ error: 'Failed to delete category.' });
    }
  }
}
