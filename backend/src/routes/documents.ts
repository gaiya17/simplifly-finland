import { Router } from 'express';
import { authenticateJWT, requireRole } from '../middleware/auth';
import { pdfUpload, DocumentController } from '../controllers/documentController';

const router = Router();

// Only admins can upload / delete
router.use(authenticateJWT);
router.use(requireRole('admin'));

router.post('/upload', pdfUpload.single('pdf'), DocumentController.uploadDocument);
router.delete('/upload', DocumentController.deleteDocument);

export default router;
