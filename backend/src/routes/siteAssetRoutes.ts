import { Router } from 'express';
import { getAssets, getAssetsArray, updateAsset } from '../controllers/siteAssetController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAssets);
router.get('/array', getAssetsArray);

// Admin routes
router.put('/', authenticateJWT, requireRole('admin'), updateAsset);

export default router;
