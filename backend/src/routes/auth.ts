import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();

// POST /api/auth/login
router.post("/login", AuthController.login);

export default router;
