import express from 'express';
import { submitInquiry } from '../controllers/inquiryController';

const router = express.Router();

// POST /api/inquiries
router.post('/', submitInquiry);

export default router;
