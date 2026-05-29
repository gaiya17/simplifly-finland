# ============================================================
#  backend/Dockerfile — Production Container for Node.js API
#
#  WHAT IS A DOCKERFILE?
#  A recipe for building a Docker container.
#  Like a shopping list + cooking instructions.
#
#  MULTI-STAGE BUILD EXPLAINED:
#  Stage 1 (builder): Install dependencies + compile TypeScript
#  Stage 2 (production): Copy only the compiled code
#  Result: A SMALL container (no dev dependencies, no TypeScript source)
#
#  WHY SMALL? Smaller container = faster startup, less memory,
#  harder for attackers to exploit unused tools.
# ============================================================

# ─── Stage 1: BUILD ──────────────────────────────────────────
# Use the official Node.js 20 image (Alpine = tiny Linux)
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files FIRST (Docker caches this layer)
# If package.json hasn't changed, Docker skips the slow npm install
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including dev — needed for TypeScript)
RUN npm ci

# Generate Prisma client (TypeScript types for the database)
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Compile TypeScript → JavaScript (output goes to /app/dist)
RUN npm run build

# ─── Stage 2: PRODUCTION ─────────────────────────────────────
# Fresh, clean image — only what we need to RUN the app
FROM node:20-alpine AS production

# Create a non-root user (security: never run apps as root)
RUN addgroup -S simplifly && adduser -S simplifly -G simplifly

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies (no TypeScript, no dev tools)
RUN npm ci --only=production && npm cache clean --force

# Copy Prisma schema and generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy compiled JavaScript from the builder stage
COPY --from=builder /app/dist ./dist

# Switch to non-root user
USER simplifly

# Document which port this app uses
EXPOSE 5000

# Health check — Docker will restart the container if this fails
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the app
CMD ["node", "dist/index.js"]
