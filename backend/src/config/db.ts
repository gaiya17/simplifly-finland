import { PrismaClient } from '@prisma/client';

// Prisma 7: datasource URL is configured in prisma.config.ts
// Standard PrismaClient (Rust engine) works without a driver adapter.
export const prisma = new PrismaClient();
