import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { prisma } from "../config/db";

// ── Security: Hard-fail if JWT_SECRET is not set. Never fall back to a ──────
// ── hardcoded default in production. The server will refuse to start. ────────
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    "FATAL: JWT_SECRET environment variable is not set. " +
    "Set it in your .env file before starting the server."
  );
}

export class AuthController {
  // POST /api/auth/login
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    try {
      // Find user by email in database
      const user = await prisma.user.findUnique({
        where: { email }
      });

      // Use a single generic error for both "user not found" and "wrong password"
      // to prevent user enumeration attacks
      if (!user) {
        res.status(401).json({ error: "Invalid email or password." });
        return;
      }

      // Strictly compare hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({ error: "Invalid email or password." });
        return;
      }

      // Only admin role can access the portal
      if (user.role !== "admin") {
        res.status(403).json({ error: "Access denied. Only administrators may access this portal." });
        return;
      }

      // Sign JWT — 30-day session
      const token = jwt.sign(
        {
          userId: user.id,
          email:  user.email,
          role:   user.role,
          name:   user.name,
        },
        JWT_SECRET as string,
        { expiresIn: "30d" }
      );

      res.status(200).json({
        message: "Login successful!",
        token,
        user: {
          id:    user.id,
          name:  user.name,
          email: user.email,
          role:  user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error during login." });
    }
  }

  // GET /api/auth/verify
  // Lightweight endpoint — just verifying the token via authenticateJWT is enough.
  // The middleware will reject invalid/expired tokens before this handler runs.
  static verify(_req: Request, res: Response) {
    res.status(200).json({ valid: true });
  }
}
