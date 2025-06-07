#!/bin/sh

set -e

/app/wait-for-it.sh timescaledb:5432 -- echo "TimescaleDB is ready!"

echo "Running db seed script..."
npm run seed:db

echo "Starting refresh:views in the background..."
npm run refresh:views & 

echo "Starting db main application..."
exec npm start 