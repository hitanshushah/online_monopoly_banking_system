# Base image with Node.js 18 on Alpine
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Dependencies layer
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Build layer
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production runner
FROM base AS runner

# Add non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=9000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 9000
ENV PORT 9000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
