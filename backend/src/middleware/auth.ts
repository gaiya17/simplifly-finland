import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

// ── Security: Refuse to run without a proper secret ──────────────────────────
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    "FATAL: JWT_SECRET environment variable is not set. " +
    "Set it in your .env file before starting the server."
  );
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email:  string;
    role:   string;
    name:   string;
  };
}

/**
 * authenticateJWT — Verifies the Bearer token on every protected route.
 * Returns 401 if the header is missing, 403 if the token is invalid or expired.
 */
export function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. No authentication token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      userId: string;
      email:  string;
      role:   string;
      name:   string;
    };

    req.user = {
      userId: decoded.userId,
      email:  decoded.email,
      role:   decoded.role,
      name:   decoded.name,
    };

    next();
  } catch (error) {
    // Differentiate between expired and otherwise invalid tokens
    if (error instanceof jwt.TokenExpiredError) {
      res.status(403).json({ error: "Session expired. Please log in again." });
    } else {
      res.status(403).json({ error: "Invalid session token." });
    }
  }
}

/**
 * requireRole — Runs after authenticateJWT. Enforces role-based access control.
 * Only the specified role may proceed; all others receive 403 Forbidden.
 */
export function requireRole(allowedRole: "admin") {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    if (req.user.role !== allowedRole) {
      res
        .status(403)
        .json({ error: `Forbidden. This area is restricted to ${allowedRole} accounts.` });
      return;
    }

    next();
  };
}
