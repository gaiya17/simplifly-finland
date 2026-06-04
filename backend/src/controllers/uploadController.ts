import { Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary';

export class UploadController {
  static async uploadImage(req: Request, res: Response) {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { path: url, filename: publicId } = req.file as any;

    res.json({
      success: true,
      url,
      publicId,
    });
  }

  static async deleteImage(req: Request, res: Response) {
    const { publicId } = req.body;
    if (!publicId) {
      res.status(400).json({ error: 'publicId required' });
      return;
    }

    try {
      await cloudinary.uploader.destroy(publicId);
      res.json({ success: true });
    } catch (err) {
      console.error('Delete image error:', err);
      res.status(500).json({ error: 'Failed to delete image' });
    }
  }
}
