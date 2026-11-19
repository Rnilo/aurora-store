# Aurora Store

Tienda online de productos al estilo retail departamental (tecnología, hogar, moda,
belleza y juguetes): catálogo con búsqueda y filtros, carrito persistente, cuentas de
cliente y checkout con historial de pedidos.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Angular 18 (standalone + signals) · Tailwind CSS 3.4 · TypeScript 5.5 |
| Backend | FastAPI · Pydantic v2 · SQLAlchemy 2.0 · Uvicorn (Python 3.12) |
| Base de datos | PostgreSQL 16 |
| Límite de tasa | Redis 7.2 (efímero, fail-open) |
| Entorno | Docker Compose (db, redis, backend, frontend) |

## Estructura

```
database/   Esquema y datos semilla de PostgreSQL (sin migraciones)
backend/    API REST FastAPI (app/ + tests/)
frontend/   Aplicación Angular
docs/spec/  Documentación viva (constitución, roadmap, stack, features)
.agents/    Skills del proyecto
.opencode/  Agentes y comandos SDD
```

## Puesta en marcha

Requisitos: Docker y Docker Compose.

```bash
# 1. Crea tu .env
cp .env.example .env        # Windows: copy .env.example .env

# 2. Levanta el stack completo
docker compose up -d
```

Servicios:

| Servicio | URL |
|---|---|
| Tienda (nginx) | http://localhost:8080 |
| Tienda (dev server) | http://localhost:4200 (`cd frontend && npm start`) |
| API + Swagger | http://localhost:8000/docs |
| PostgreSQL | `localhost:5433` (contenedor `aurora_db`) |
| Redis | `127.0.0.1:6380` (contenedor `aurora_redis`) |

En el **primer arranque con el volumen vacío**, PostgreSQL ejecuta en orden alfabético
`database/01_esquema.sql` (DDL de 9 tablas) y `database/02_datos_semilla.sql`
(categorías, marcas, 48 productos, cupones y usuario demo).

Reset de la base:

```bash
docker compose down -v
docker compose up -d
```

En Windows: `reset-db.cmd` o `.\reset-db.ps1`.

## Cuenta demo

| Correo | Contraseña |
|---|---|
| `cliente@aurora.cl` | `Demo1234` |

El carrito y los favoritos viven en el navegador (localStorage); el checkout crea
pedidos reales en PostgreSQL y exige sesión.

## Pruebas

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
pytest
```

La suite usa SQLite en memoria, sin necesidad del contenedor `db`.

Frontend:

```bash
cd frontend
npm install
npm run build        # verificación de tipos y build de producción
npm start            # dev server en :4200
```
