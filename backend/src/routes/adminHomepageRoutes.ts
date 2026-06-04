import { Router } from "express";
import { HomepageController } from "../controllers/homepageController";
import { authenticateJWT, requireRole } from "../middleware/auth";

const router = Router();

// Secure all admin routes
router.use(authenticateJWT);
router.use(requireRole("admin"));

// Admin endpoints for managing homepage layout
router.get("/settings", HomepageController.getSettings);
router.put("/settings", HomepageController.updateSettings);

export default router;
