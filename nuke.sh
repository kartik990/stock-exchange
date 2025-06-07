#!/bin/bash
set -e

echo "🛑 Stopping and removing all Docker containers..."
docker container stop $(docker container ls -aq) 2>/dev/null || true
docker container rm $(docker container ls -aq) 2>/dev/null || true

echo "🧹 Removing all Docker volumes..."
docker volume rm $(docker volume ls -q) 2>/dev/null || true

echo "❌ Deleting all PM2 processes..."
pm2 delete all || true

echo "✅ Cleanup complete!"
