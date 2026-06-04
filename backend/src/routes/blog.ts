import { Router } from 'express';
import { BlogController } from '../controllers/blogController';

const router = Router();

// Routes
router.get('/', BlogController.getBlogs);
router.get('/:slug', BlogController.getBlogBySlug);
router.post('/', BlogController.createBlog);
router.put('/:id', BlogController.updateBlog);
router.delete('/:id', BlogController.deleteBlog);

export default router;
