import * as dotenv from "dotenv";
// Load env before importing other configuration modules
dotenv.config();

import express from "express";
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
import path from "path";
import { prisma } from "./config/db";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors({
  origin: true, // Allow all origins during local integration
  credentials: true
}));
app.use(express.json());

// Serve uploaded PDF documents under /api/docs — accessible via the same
// Caddy reverse proxy that handles all /api/* traffic.
app.use('/api/docs', express.static(path.join(process.cwd(), 'uploads', 'docs')));

// Mount Portal API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tours", toursRoutes);
app.use("/api/resorts", resortRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/admin/homepage", adminHomepageRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/assets", siteAssetRoutes);
app.use("/api/documents", documentRoutes);

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

// Start Express Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Simplifly Finland Travel Portal API     `);
  console.log(` Running on port: ${PORT}                `);
  console.log(`=========================================`);
});
