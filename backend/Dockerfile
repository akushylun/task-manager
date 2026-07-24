# ---------- Stage 1: build ----------
# Full node image — has the toolchain to compile native modules (bcrypt).
FROM node:22 AS builder
WORKDIR /app

# Copy manifests first. This layer is cached until package*.json changes,
# so `npm ci` is skipped on every build where deps didn't change.
COPY package*.json ./
RUN npm ci

# Now the volatile layer: source code changes constantly.
COPY . .

# Compile TypeScript -> dist/  (nest build)
RUN npm run build

# Drop devDependencies in place. bcrypt's already-compiled binary survives.
RUN npm prune --omit=dev

# ---------- Stage 2: runtime ----------
# Slim image — no build toolchain, smaller, smaller attack surface.
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy only what's needed to RUN, from the builder stage.
# node_modules carries bcrypt's linux binary, compiled above in node:22.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Runs migrations, then execs the API. chmod because a checkout on Windows (or
# a lost permission bit) would otherwise produce a non-executable script.
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Don't run as root. The `node` image ships a non-root `node` user (uid 1000).
# The app only reads these files, so it needs no write access.
USER node

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
