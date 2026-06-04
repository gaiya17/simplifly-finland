import { Router } from 'express';
import { ChatbotController } from '../controllers/chatbotController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// Public route to fetch the active chatbot flow
router.get('/', ChatbotController.getNodes);

// Admin routes for managing chatbot flow
router.get('/admin', authenticateJWT, requireRole('admin'), ChatbotController.getNodesArray);
router.post('/', authenticateJWT, requireRole('admin'), ChatbotController.createNode);
router.put('/:id', authenticateJWT, requireRole('admin'), ChatbotController.updateNode);
router.delete('/:id', authenticateJWT, requireRole('admin'), ChatbotController.deleteNode);

export default router;
