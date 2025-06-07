#!/bin/bash
set -e

echo "🚀 Starting docker containers..."
cd ./db
docker-compose up -d

# Get container IDs by service name
TIMESCALE_CONTAINER=$(docker-compose ps -q timescaledb)
REDIS_CONTAINER=$(docker-compose ps -q redis)

echo "TimescaleDB container ID: $TIMESCALE_CONTAINER"
echo "Redis container ID: $REDIS_CONTAINER"

wait_for_healthy() {
  container_id=$1
  container_name=$(docker inspect --format='{{.Name}}' $container_id | sed 's/\///g')
  echo "Waiting for $container_name to become healthy..."

  max_retries=30
  retries=0

  while true; do
    health_status=$(docker inspect --format='{{.State.Health.Status}}' $container_id 2>/dev/null || echo "none")

    echo "$container_name health status: $health_status"

    if [ "$health_status" == "healthy" ]; then
      echo "$container_name is healthy!"
      break
    fi

    if [ $retries -ge $max_retries ]; then
      echo "Timeout waiting for $container_name health check!"
      exit 1
    fi

    retries=$((retries + 1))
    sleep 2
  done
}

wait_for_healthy $TIMESCALE_CONTAINER
wait_for_healthy $REDIS_CONTAINER

echo "✅ All containers are healthy!"

cd ./../

echo "🛠️ Setting up db-schema and refreshing materialized views..."
pm2 start ecosystem.config.js --only db-schema --wait-ready

echo "▶️ Starting backend services api..."
pm2 start ecosystem.config.js --only api --wait-ready

echo "▶️ Starting backend services ws..."
pm2 start ecosystem.config.js --only ws --wait-ready

echo "▶️ Starting backend services engine..."
pm2 start ecosystem.config.js --only engine --wait-ready

echo "▶️ Starting backend services mm..."
pm2 start ecosystem.config.js --only mm --wait-ready

echo "▶️ Starting backend services db-service..."
pm2 start ecosystem.config.js --only db-service --wait-ready

echo "▶️ Starting frontend"
pm2 start ecosystem.config.js --only frontend 

echo "✅ All services started in sequence!"
