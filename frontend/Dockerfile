########################################
# Stage 1: Build
########################################
FROM node:20-alpine AS builder
WORKDIR /app

# NEXT_PUBLIC_* vars must be set at BUILD TIME — they get baked into
# the JavaScript bundle. We use a relative path (/api) so client-side
# calls go through the Next.js rewrite proxy, which forwards to the
# backend container internally. This works on any domain.
ARG NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy dependency manifests and install
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

########################################
# Stage 2: Production runtime
########################################
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user/group for security.
# Running as root inside a container is a security risk.
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the minimal standalone output produced by `output: 'standalone'`
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js is the standalone entry point produced by Next.js
CMD ["node", "server.js"]
