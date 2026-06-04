import { Router } from 'express';
import { upload } from '../config/cloudinary';
import { UploadController } from '../controllers/uploadController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('admin'));

router.post('/image', upload.single('image'), UploadController.uploadImage);
router.delete('/image', UploadController.deleteImage);

export default router;
