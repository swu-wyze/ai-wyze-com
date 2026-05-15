FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN if [ -f pnpm-lock.yaml ]; then \
      npm install -g pnpm && pnpm install --frozen-lockfile; \
    else \
      npm ci; \
    fi

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time fingerprint so we can verify on the deployed container which
# commit is actually running. Coolify passes these as build args if configured;
# otherwise the .git fallback below catches it.
ARG BUILD_SHA=unknown
ARG BUILD_AT
ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_SHA=$BUILD_SHA
ENV BUILD_AT=$BUILD_AT
RUN if [ "$BUILD_SHA" = "unknown" ] && [ -d .git ]; then \
      export BUILD_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo unknown); \
      echo "BUILD_SHA=$BUILD_SHA" > .build-sha; \
    fi && \
    if [ -z "$BUILD_AT" ]; then \
      export BUILD_AT=$(date -u +%FT%TZ); \
    fi && \
    echo "Building $BUILD_SHA at $BUILD_AT" && \
    if [ -f pnpm-lock.yaml ]; then \
      npm install -g pnpm && pnpm build; \
    else \
      npm run build; \
    fi

FROM node:20-alpine AS runner
WORKDIR /app
ARG BUILD_SHA=unknown
ARG BUILD_AT
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_SHA=$BUILD_SHA
ENV BUILD_AT=$BUILD_AT
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
