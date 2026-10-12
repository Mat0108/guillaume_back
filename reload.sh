#!/bin/bash
set -e

mkdir -p ~/docker-logs/guillaume/
docker compose logs -t --no-color > ~/docker-logs/guillaume/$(date +%F_%H%M%S).log

echo "Stopping containers..."
docker compose down


echo "Starting containers..."
docker compose -f docker-compose.yml up -d --build

echo "Showing logs for 'server'..."
docker compose logs -f server

