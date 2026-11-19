@echo off
REM Recrea la base de datos de Aurora Store (borra el volumen y vuelve a sembrar).
cd /d "%~dp0"
docker compose down -v
docker compose up -d
