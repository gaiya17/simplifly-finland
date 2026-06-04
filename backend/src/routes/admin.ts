import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { TourController } from "../controllers/tourController";
import { authenticateJWT, requireRole } from "../middleware/auth";

const router = Router();

// Secure all admin routes behind token validation and Administrator role requirements
router.use(authenticateJWT);
router.use(requireRole("admin"));

// GET /api/admin/dashboard-stats
router.get("/dashboard-stats", AdminController.getDashboardStats);

// GET /api/admin/users
router.get("/users", AdminController.getUsers);

// POST /api/admin/users
router.post("/users", AdminController.createUser);

// DELETE /api/admin/users/:id
router.delete("/users/:id", AdminController.deleteUser);

// --- TOUR PACKAGES ---
router.get("/tours", TourController.getAdminTours);
router.post("/tours", TourController.createTour);
router.put("/tours/:id", TourController.updateTour);
router.delete("/tours/:id", TourController.deleteTour);

// --- TOUR CATEGORIES ---
router.post("/tours/categories", TourController.createCategory);
router.put("/tours/categories/:id", TourController.updateCategory);
router.delete("/tours/categories/:id", TourController.deleteCategory);
router.patch("/tours/:id/status", TourController.toggleStatus);
router.patch("/tours/:id/discount", TourController.updateDiscount);

export default router;
