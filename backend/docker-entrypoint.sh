#!/bin/sh
# Apply pending migrations, then hand off to the API.
#
# synchronize:false means the schema is never created automatically, so a fresh
# Postgres volume starts completely empty. Migrations have to run before the app
# serves its first request.
set -e

echo "[entrypoint] running migrations..."
node node_modules/typeorm/cli.js migration:run -d dist/data-source.js

echo "[entrypoint] starting api..."
# exec replaces this shell so node becomes PID 1 and receives SIGTERM directly,
# letting Docker stop the container gracefully.
exec node dist/main
