import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { AuthController } from "../controllers/authController";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

// ── Rate Limiter: max 10 login attempts per IP per 15 minutes ────────────────
// After 10 failed attempts the IP receives a 429 response for 15 minutes.
// This makes automated brute-force attacks completely impractical.
const loginRateLimiter = rateLimit({
  windowMs:         15 * 60 * 1000, // 15 minutes
  max:              10,              // max 10 requests per window
  standardHeaders:  true,           // Return rate limit info in RateLimit-* headers
  legacyHeaders:    false,
  message: {
    error: "Too many login attempts from this IP address. Please try again after 15 minutes.",
  },
  // Skip successful requests — only count failed attempts toward the limit
  skipSuccessfulRequests: true,
});

// POST /api/auth/login  — rate-limited
router.post("/login", loginRateLimiter, AuthController.login);

// GET /api/auth/verify  — protected, used by the admin frontend on every page load
// to confirm the token is still valid server-side before rendering the UI.
router.get("/verify", authenticateJWT, AuthController.verify);

export default router;
