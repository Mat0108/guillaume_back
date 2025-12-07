#!/bin/bash
set -e

echo "Stopping containers..."
docker compose down

echo "Building images..."
docker compose -f docker-compose.yml build

echo "Starting containers..."
docker compose -f docker-compose.yml up -d

echo "Showing logs for 'server'..."
docker compose logs -f server
