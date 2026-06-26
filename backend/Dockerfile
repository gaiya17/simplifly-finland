########################################
# Stage 1: Build
########################################
FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm prisma:generate
RUN pnpm build

########################################
# Stage 2: Production runtime
########################################
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user/group for security.
# Running as root inside a container is a security risk.
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy compiled output and Prisma schema from builder
COPY --from=builder --chown=expressjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=expressjs:nodejs /app/dist ./dist

# Generate Prisma client in production stage
RUN npx prisma@6 generate

# Create the uploads directory that documentController needs at startup.
# Must be done as root (before USER switch) so we can also chown it.
# Using a named Docker volume (see docker-compose.yml) ensures uploaded
# files persist across container rebuilds.
RUN mkdir -p /app/uploads/docs && \
    chown -R expressjs:nodejs /app/uploads

# Switch to non-root user
USER expressjs

EXPOSE 5000
CMD ["node", "dist/server.js"]
