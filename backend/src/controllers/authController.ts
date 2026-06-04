import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { prisma } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "simplifly_finland_portal_secret_key_2026";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    try {
      // Find user by email in Supabase
      const user = await prisma.user.findUnique({
        where: { email }
      });

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

      // Sign JWT with payload items
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        message: "Login successful!",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error during login." });
    }
  }
}
