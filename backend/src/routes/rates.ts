import { Router } from 'express';
import { RatesController } from '../controllers/ratesController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// All rates routes are admin-only
router.use(authenticateJWT);
router.use(requireRole('admin'));

router.get('/:resortId',  RatesController.getRates);
router.put('/:resortId',  RatesController.upsertRates);

export default router;
