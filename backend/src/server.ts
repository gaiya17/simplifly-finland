import * as dotenv from "dotenv";
// Load env before importing other configuration modules
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import toursRoutes from "./routes/tours";
import resortRoutes from "./routes/resortRoutes";
import uploadRoutes from "./routes/upload";
import galleryRoutes from "./routes/gallery";
import blogRoutes from "./routes/blog";
import chatbotRoutes from "./routes/chatbotRoutes";
import homepageRoutes from "./routes/homepageRoutes";
import adminHomepageRoutes from "./routes/adminHomepageRoutes";
import inquiryRoutes from "./routes/inquiryRoutes";
import siteAssetRoutes from "./routes/siteAssetRoutes";
import documentRoutes from "./routes/documents";
import ratesRoutes    from "./routes/rates";
import path from "path";

import { prisma } from "./config/db";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Trust the first proxy hop (Caddy) ────────────────────────────────────────
// MUST be set before any middleware that uses req.ip (e.g. express-rate-limit).
// Without this, Express sees the Docker-internal IP instead of the real client
// IP, which breaks rate limiting and IP-based logic.
app.set("trust proxy", 1);

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow requests from:
//   - Our production domain (browser → Caddy → Next.js → here)
//   - The frontend Docker container (Next.js SSR rewrites → here, no Origin header)
//   - localhost for local development
//
// ALLOWED_ORIGIN is set in the backend .env on the VPS.
// Multiple origins can be separated by commas: "https://a.com,https://b.com"
const allowedOrigins = (process.env.ALLOWED_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests (Next.js SSR/RSC have no Origin header)
    // and any explicitly whitelisted origin.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Use callback(null, false) — NOT callback(new Error(...))
      // Throwing here triggers Express's default HTML error handler → HTML 500.
      // callback(null, false) keeps the response JSON-safe and lets the browser
      // enforce the CORS policy with a proper network error.
      callback(null, false);
    }
  },
  credentials: true,
}));

app.use(express.json());

// Serve uploaded PDF documents under /api/docs — accessible via the same
// Caddy reverse proxy that handles all /api/* traffic.
app.use('/api/docs', express.static(path.join(process.cwd(), 'uploads', 'docs')));

// Mount Portal API Routes
app.use("/api/auth",           authRoutes);
app.use("/api/admin",          adminRoutes);
app.use("/api/tours",          toursRoutes);
app.use("/api/resorts",        resortRoutes);
app.use("/api/upload",         uploadRoutes);
app.use("/api/gallery",        galleryRoutes);
app.use("/api/blogs",          blogRoutes);
app.use("/api/chatbot",        chatbotRoutes);
app.use("/api/homepage",       homepageRoutes);
app.use("/api/admin/homepage", adminHomepageRoutes);
app.use("/api/inquiries",      inquiryRoutes);
app.use("/api/assets",         siteAssetRoutes);
app.use("/api/documents",      documentRoutes);
app.use("/api/rates",          ratesRoutes);


// General Health Check
app.get("/api/health", async (req, res) => {
  try {
    // Basic ping test to confirm Supabase connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "healthy", database: "connected (Supabase PostgreSQL)" });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", error: "Database connection failed" });
  }
});

// ── Global JSON Error Handler ─────────────────────────────────────────────────
// MUST be the LAST middleware. Catches any error passed via next(err) from any
// route or middleware (e.g. CORS, rate limiter, body parser, route handlers).
// Without this, Express's built-in handler returns HTML which breaks JSON clients.
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`[ERROR] ${status} — ${message}`, err.stack || "");
  res.status(status).json({ error: message });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Simplifly Finland Travel Portal API     `);
  console.log(` Running on port: ${PORT}                `);
  console.log(`=========================================`);
});
