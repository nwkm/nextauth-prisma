FROM node:18-alpine AS base
# Enable Corepack
RUN corepack enable
COPY . /app
WORKDIR /app

# Create a new image for production dependencies
FROM base as prod-deps
# Install production dependencies
# use a cache if available
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Create build image for building the TypeScript code
FROM base AS build
# Install build dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Build the TypeScript
RUN pnpm run build

# Create an image base
FROM base

ENV NODE_ENV production
ENV NEXTAUTH_URL "http://localhost:3000"
ENV NEXTAUTH_SECRET "s3cr3T"

# Copy production dependencies from the prod-deps stage
COPY --from=prod-deps /app/node_modules /app/node_modules
# Copy the compiled TypeScript code from the build stage
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Expose incoming connections
EXPOSE 3000
# Start PNPM script
CMD [ "pnpm", "start" ]