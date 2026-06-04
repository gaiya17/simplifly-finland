import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { cloudinary, deleteCloudinaryImage } from '../config/cloudinary';

export class GalleryController {
  // Get all assets
  static async getAssets(req: Request, res: Response) {
    try {
      const { category } = req.query;
      const filter = category && category !== 'All' ? { category: String(category) } : {};
      
      const assets = await prisma.mediaAsset.findMany({
        where: filter,
        orderBy: { createdAt: 'desc' },
      });
      
      res.json(assets);
    } catch (error) {
      console.error('Error fetching gallery assets:', error);
      res.status(500).json({ error: 'Failed to fetch gallery assets' });
    }
  }

  // Create an asset
  static async createAsset(req: Request, res: Response) {
    try {
      const { title, category, url, publicId, size, format } = req.body;
      
      if (!url || !publicId || !title || !category) {
        res.status(400).json({ error: 'Missing required fields (title, category, url, publicId)' });
        return;
      }

      const newAsset = await prisma.mediaAsset.create({
        data: {
          title,
          category,
          url,
          publicId,
          size,
          format,
        },
      });

      res.status(201).json(newAsset);
    } catch (error) {
      console.error('Error creating gallery asset:', error);
      res.status(500).json({ error: 'Failed to create gallery asset' });
    }
  }

  // Delete an asset
  static async deleteAsset(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const asset = await prisma.mediaAsset.findUnique({
        where: { id },
      });

      if (!asset) {
        res.status(404).json({ error: 'Asset not found' });
        return;
      }

      // Delete from Cloudinary
      if (asset.publicId) {
        deleteCloudinaryImage(asset.publicId).catch(console.error);
      }

      // Delete from DB
      await prisma.mediaAsset.delete({
        where: { id },
      });

      res.json({ success: true, message: 'Asset deleted successfully' });
    } catch (error) {
      console.error('Error deleting gallery asset:', error);
      res.status(500).json({ error: 'Failed to delete gallery asset' });
    }
  }
}
