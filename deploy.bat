@echo off
docker build --pull --rm -f "Dockerfile" -t mat0108/po-api:prod "."  
docker push mat0108/po-api:prod