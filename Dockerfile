# Install dependencies only when needed
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Install production dependencies only when needed
FROM node:18-alpine AS rundeps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
COPY --from=rundeps /app/node_modules ./node_modules

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/build ./build
COPY --from=builder --chown=nodejs:nodejs /app/public ./public
COPY --from=builder /app/package.json ./package.json

USER nodejs

EXPOSE 3000
ENV PORT 3000

CMD ["./node_modules/.bin/remix-serve", "build"]