import { Router } from 'express';
import { TourController } from '../controllers/tourController';

const router = Router();

router.get('/', TourController.getAllTours);
router.get('/categories', TourController.getCategories);
router.get('/category/:slug', TourController.getToursByCategory);
router.get('/offers', TourController.getOffers);
router.get('/slug/:slug', TourController.getTourBySlug);
router.get('/:id', TourController.getTourById);

export default router;
