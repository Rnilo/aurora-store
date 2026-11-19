# Recrea la base de datos de Aurora Store (borra el volumen y vuelve a sembrar).
Set-Location $PSScriptRoot
docker compose down -v
docker compose up -d
