# Multi-stage Dockerfile for Astro SSR using Node adapter and pnpm

FROM node:lts-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9 --activate
ENV ASTRO_DATABASE_FILE=/app/.data/astro.db

# Install only production deps for runtime image
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Install full deps for building
FROM base AS build-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build the app
FROM build-deps AS build
COPY . .
RUN mkdir -p .data && pnpm build

# Runtime image
FROM node:lts-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ENV ASTRO_DATABASE_FILE=/app/.data/astro.db

# Copy production node_modules and built app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
RUN mkdir -p .data

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]


