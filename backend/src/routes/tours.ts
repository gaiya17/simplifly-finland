import { Router } from 'express';
import { TourController } from '../controllers/tourController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/destinations', TourController.getDestinations);
router.post('/destinations', authenticate, TourController.createDestination);

router.get('/', TourController.getAllTours);
router.get('/categories', TourController.getCategories);
router.get('/category/:slug', TourController.getToursByCategory);
router.get('/offers', TourController.getOffers);
router.get('/slug/:slug', TourController.getTourBySlug);
router.get('/:id', TourController.getTourById);

export default router;
