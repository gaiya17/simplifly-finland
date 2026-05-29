// ============================================================
//  src/config/env.ts — Environment Variable Loader
//
//  WHAT IS THIS?
//  All your secret values (passwords, API keys) live in a
//  file called ".env". This file reads them and makes them
//  available to the rest of your app safely.
//
//  WHY NOT JUST USE process.env DIRECTLY?
//  Because if a variable is missing, your app will crash
//  at runtime with a confusing error. This file catches
//  missing variables at STARTUP with clear error messages.
// ============================================================

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(
      `❌ Missing required environment variable: ${key}\n` +
      `   Add it to your .env file. See .env.example for reference.`
    );
  }
  return value;
}

export const env = {
  // ── Server ────────────────────────────────────────────────
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: parseInt(getEnv('PORT', '5000'), 10),

  // ── Database ──────────────────────────────────────────────
  DATABASE_URL: getEnv('DATABASE_URL'),

  // ── JWT Authentication ────────────────────────────────────
  // This secret is used to SIGN tokens. Like a stamp that proves
  // the token came from your server. Keep it SECRET!
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),   // Token lasts 7 days

  // ── Redis Cache ───────────────────────────────────────────
  REDIS_URL: getEnv('REDIS_URL'),

  // ── Cloudinary (Image Storage) ────────────────────────────
  CLOUDINARY_CLOUD_NAME: getEnv('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: getEnv('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnv('CLOUDINARY_API_SECRET'),

  // ── Resend (Email Service) ────────────────────────────────
  RESEND_API_KEY: getEnv('RESEND_API_KEY'),
  EMAIL_FROM: getEnv('EMAIL_FROM', 'SimpliFly <no-reply@simpliflyfinland.fi>'),

  // ── Security ──────────────────────────────────────────────
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:3000'),

  // ── Helpers ───────────────────────────────────────────────
  isDev: () => process.env.NODE_ENV !== 'production',
  isProd: () => process.env.NODE_ENV === 'production',
};
