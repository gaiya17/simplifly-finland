// ============================================================
//  src/index.ts — Express Application Entry Point
//
//  WHAT IS THIS?
//  This is the "main" file. When you type "npm run dev",
//  Node.js starts here. Think of it as the front entrance
//  of your backend building.
//
//  IT DOES:
//  1. Creates the Express app
//  2. Applies all security middleware
//  3. Registers all API routes
//  4. Starts listening on port 5000
// ============================================================

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';

import { env } from './config/env';

// Import route files (we'll create these in Sprint 2)
// import { authRouter } from './routes/auth.routes';
// import { packagesRouter } from './routes/packages.routes';
// import { bookingsRouter } from './routes/bookings.routes';
// import { adminRouter } from './routes/admin.routes';
// import { blogRouter } from './routes/blog.routes';

const app = express();

// ── 1. SECURITY MIDDLEWARE ────────────────────────────────────
// Helmet adds ~15 security headers automatically.
// Example: it tells browsers "never load this site in an iframe"
// (prevents clickjacking attacks)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Needed for Cloudinary images
}));

// CORS — Cross-Origin Resource Sharing
// Only allow requests from your frontend URL.
// Any other website trying to call your API gets blocked.
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,    // Allow cookies to be sent (needed for JWT)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

// ── 2. PARSING MIDDLEWARE ─────────────────────────────────────
// These parse incoming request data so you can use it in code
app.use(express.json({ limit: '10mb' }));           // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));    // Parse form data
app.use(cookieParser());                            // Parse cookies (for JWT)

// ── 3. PERFORMANCE MIDDLEWARE ──────────────────────────────────
// Gzip compress responses — makes API responses 70% smaller
app.use(compression());

// ── 4. LOGGING ────────────────────────────────────────────────
// Morgan logs every request: "GET /api/packages 200 45ms"
// Only in development (production logs go to a file)
if (env.isDev()) {
  app.use(morgan('dev'));
}

// ── 5. HEALTH CHECK ENDPOINT ──────────────────────────────────
// This is what GitHub Actions calls to verify deployment worked.
// curl https://simpliflyfinland.fi/api/health → { status: "ok" }
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '1.0.0',
  });
});

// ── 6. API ROUTES ─────────────────────────────────────────────
// All your routes will be mounted here (added in Sprint 2)
// app.use('/api/auth', authRouter);
// app.use('/api/packages', packagesRouter);
// app.use('/api/bookings', bookingsRouter);
// app.use('/api/admin', adminRouter);
// app.use('/api/blog', blogRouter);

// ── 7. 404 HANDLER ────────────────────────────────────────────
// If none of the routes above matched, return a clean error
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The endpoint you requested does not exist.',
  });
});

// ── 8. GLOBAL ERROR HANDLER ───────────────────────────────────
// If ANY route throws an error, this catches it.
// Prevents Express from showing scary stack traces to users.
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Unhandled error:', err.message);

  res.status(500).json({
    error: 'Internal Server Error',
    message: env.isDev() ? err.message : 'Something went wrong. Please try again.',
  });
});

// ── 9. START THE SERVER ────────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`
  ✈️  SimpliFly Backend is running!
  ─────────────────────────────────
  🌐 URL:         http://localhost:${env.PORT}
  ❤️  Health:     http://localhost:${env.PORT}/api/health
  🔧 Environment: ${env.NODE_ENV}
  `);
});

export default app;
