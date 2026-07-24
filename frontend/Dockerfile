# ---------- Stage 1: build ----------
# Node is a BUILD-time tool only. It does not ship in the final image.
FROM node:22 AS builder
WORKDIR /app

# Manifests first — cached until deps change.
COPY package*.json ./
RUN npm ci

# Volatile layer: source.
COPY . .

# ng build (production is the default configuration) -> dist/task-manager/browser
RUN npm run build

# ---------- Stage 2: serve ----------
# nginx serves the compiled static files. No Node, no node_modules, no source.
FROM nginx:1.27-alpine AS runtime

# SPA routing + /api reverse proxy.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Only the compiled output crosses the stage boundary.
COPY --from=builder /app/dist/task-manager/browser /usr/share/nginx/html

EXPOSE 80

# Run in the foreground — a container dies when PID 1 exits, and nginx
# daemonizes by default.
CMD ["nginx", "-g", "daemon off;"]
