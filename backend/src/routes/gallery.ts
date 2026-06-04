import { Router } from 'express';
import { GalleryController } from '../controllers/galleryController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// Public route to fetch assets
router.get('/', GalleryController.getAssets);

// Admin-only routes for creating/deleting
router.use(authenticateJWT);
router.use(requireRole('admin'));

router.post('/', GalleryController.createAsset);
router.delete('/:id', GalleryController.deleteAsset);

export default router;
