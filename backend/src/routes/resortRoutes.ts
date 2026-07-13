import { Router } from 'express';
import { ResortController } from '../controllers/resortController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', ResortController.getPublicResorts);
router.get('/categories', ResortController.getCategories);
router.get('/category/:slug', ResortController.getCategoryBySlug);
router.get('/options/transfers', ResortController.getTransferOptions);
router.get('/options/facilities', ResortController.getFacilityOptions);
router.get('/options/offers', ResortController.getOfferOptions);
router.get('/options/villas', ResortController.getVillaOptions);
router.get('/offers', ResortController.getOffers);
router.get('/slug/:slug', ResortController.getResortBySlug);
// Move /admin route up here with explicit middleware to avoid being swallowed by /:id
router.get('/admin', authenticateJWT, requireRole('admin'), ResortController.getAdminResorts);

router.get('/:id', ResortController.getResortById);

// Protected admin routes (applies to all routes below)
router.use(authenticateJWT);
router.use(requireRole('admin'));

router.post('/options/transfers', ResortController.createTransferOption);
router.post('/options/facilities', ResortController.createFacilityOption);
router.post('/options/offers', ResortController.createOfferOption);

router.post('/', ResortController.createResort);
router.put('/:id', ResortController.updateResort);
router.delete('/:id', ResortController.deleteResort);
router.patch('/:id/status', ResortController.toggleStatus);
router.patch('/:id/discount', ResortController.updateDiscount);

// Admin Category Routes
router.post('/categories', ResortController.createCategory);
router.put('/categories/:id', ResortController.updateCategory);
router.delete('/categories/:id', ResortController.deleteCategory);

export default router;
