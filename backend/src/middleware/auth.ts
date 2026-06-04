import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "simplifly_finland_portal_secret_key_2026";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    name: string;
  };
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. Token is missing or invalid." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    };
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired session token." });
  }
}

export function requireRole(allowedRole: "admin") {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "User authentication required." });
      return;
    }

    if (req.user.role !== allowedRole) {
      res.status(403).json({ error: `Forbidden. This path is restricted to ${allowedRole} accounts.` });
      return;
    }

    next();
  };
}
