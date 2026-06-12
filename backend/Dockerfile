FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma:generate
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
# Copy the pre-generated Prisma client from the builder stage.
# This avoids needing the 'prisma' CLI (a devDependency) in production.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# Also copy prisma.config.ts so runtime can resolve datasource config
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
EXPOSE 5000
CMD ["npm", "run", "start"]
