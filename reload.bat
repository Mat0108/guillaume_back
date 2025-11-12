@echo off
docker compose down -v        # stoppe tout + supprime volumes si besoin
docker compose -f docker-compose.dev.yml build
docker compose -f docker-compose.dev.yml up