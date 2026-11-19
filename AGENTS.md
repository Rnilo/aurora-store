# AGENTS.md — Aurora Store

## 1. Misión y Propósito

Aurora Store es una tienda online de retail departamental (tecnología, hogar, moda,
belleza y juguetes). El objetivo del repositorio es un e-commerce completo y desplegable:
catálogo navegable, búsqueda y filtros, carrito persistente, cuentas de cliente, checkout
y seguimiento de pedidos.

El trabajo de un agente en este repo es **implementar features verificables**, no generar
código suelto: cada cambio en `backend/` o `frontend/` nace de una spec en
`docs/spec/features/NNN-nombre-feature/`.

## 2. Actores del Sistema

- **Visitante**: navega el catálogo, busca, filtra, arma carrito y favoritos sin cuenta.
- **Cliente**: se registra o inicia sesión, compra y consulta su historial de pedidos.
- **Administrador de tienda** (roadmap): gestiona catálogo, stock y pedidos desde un panel.

## 3. Stack Tecnológico

- **Frontend**: Angular 18.2 (Standalone Components, Signals, TypeScript 5.5, Tailwind CSS 3.4).
- **Backend**: FastAPI 0.142 + Uvicorn (Python 3.12, Pydantic v2, SQLAlchemy 2.1 con
  psycopg2 — síncrono, pydantic-settings).
- **Base de Datos**: PostgreSQL 16 (Docker Compose, puerto local 5433; base `aurora_store`).
- **Límite de tasa**: Redis 7.2-alpine efímero, ventana fija de 60 s y 120 peticiones por
  IP sobre `/api/v1/*`, **fail-open**. Config en `backend/app/core/config.py`.
- **Autenticación**: JWT HS256 emitido por el propio backend con PyJWT; contraseñas con
  PBKDF2-SHA256 (stdlib, sin dependencias extra). El token viaja como `Bearer` y Angular lo
  guarda en `localStorage`.
- **Entorno local**: Docker Compose levanta `db`, `redis`, `backend` (8000) y `frontend` (8080).

## 4. Estructura del Espacio de Trabajo

Rutas relativas a la raíz del repo:

- `docs/spec/` — fuente de verdad: `constitucion.md`, `roadmap.md`, `stack.md` y
  `features/NNN-nombre-feature/{spec,plan,tasks}.md`.
- `backend/` — API FastAPI: `app/main.py`, `app/core/` (`config.py`, `security.py`),
  `app/db/database.py`, `app/models/`, `app/schemas/`, `app/services/` (lógica de negocio),
  `app/api/v1/endpoints/` (catalogo, auth, pedidos, salud) y `tests/` (pytest).
- `frontend/` — Angular: `src/app/core/` (services, interceptors, guards),
  `src/app/shared/` (componentes de UI e interfaces) y `src/app/features/` (inicio,
  catalogo, producto, carrito, checkout, auth, mis-pedidos, favoritos).
- `database/` — `01_esquema.sql` (DDL) y `02_datos_semilla.sql` (datos QA). Sin migraciones.
- `.agents/skills/` — skills del proyecto (ver §8).
- `.opencode/` — agentes y comandos SDD.

## 5. Comandos de Operación

- Levantar todo: `docker compose up -d`
- Reset de base: `docker compose down -v` y `docker compose up -d` (`reset-db.cmd`/`.ps1`)
- Backend dev: `cd backend && uvicorn app.main:app --reload --port 8000`
- Frontend dev: `cd frontend && npm start` (puerto 4200, con proxy a `:8000`)
- Backend tests: `cd backend && pytest` (SQLite en memoria, no requiere Docker)
- Frontend build de verificación: `cd frontend && npm run build` (es la verificación de
  tipos y de plantillas; el proyecto no tiene tests unitarios de frontend)

**Dos puertos del frontend, y no son lo mismo.** `4200` es el dev server y siempre sirve el
código actual. `8080` es el contenedor nginx con un **build congelado en la imagen**: para
ver cambios hay que reconstruir (`docker compose build frontend` + `up -d frontend`).
El backend sí se actualiza solo (volumen montado + `--reload`).

## 6. Convenciones de Código

- **Idioma**: identificadores (variables, funciones, clases, campos) en **español**. Se
  conservan los nombres de APIs de terceros y los sufijos estructurales de Angular
  (`Component`, `Service`, `Guard`, `Interceptor`, `Pipe`, `Routes`).
- **Backend**:
  - `snake_case`; toda ruta declara `response_model`, `status_code` y documentación OpenAPI.
  - La lógica vive en `app/services/`; los endpoints solo orquestan.
  - Solo Pydantic v2 (`model_config = ConfigDict(...)`, `model_validate()`).
  - La `Session` se inyecta con `Depends(get_db)`.
  - Sin SQL raw: SQLAlchemy ORM/Core tipado.
  - Precios en **pesos chilenos enteros** (CLP), nunca floats.
- **Frontend**:
  - Archivos en `kebab-case.ts`; 100% standalone con `inject()`; estado con `signal()` y
    `computed()`.
  - Solo clases de Tailwind: nada de `styles: []` ni CSS quemado en templates.
  - Los servicios no formatean dinero: existe `formatearPrecio()` en `shared/utils`.
- **Base de Datos**:
  - Tablas y columnas en `snake_case` español; PK `SERIAL PRIMARY KEY`.
  - La base se **reconstruye**, no se migra: cambiar `01_`/`02_` y recrear el volumen.

## 7. Prohibiciones Estrictas

- No escribas código en `backend/` o `frontend/` sin `spec.md` y `plan.md` aprobados.
- No instales paquetes sin analizar la dependencia y justificarla en `docs/spec/stack.md`.
- No subas secretos, `.env` ni credenciales.
- No metas lógica de negocio en los endpoints ni SQL raw.
- No uses `any` para callar al compilador: tipa las respuestas del API en
  `frontend/src/app/core/modelos.ts`.

## 8. Skills y Agentes

Skills en `.agents/skills/` (cargar la correspondiente **antes** de escribir):

| Skill | Se activa cuando... |
|---|---|
| `sdd-workflow` | al iniciar cualquier implementación o retomar un `tasks.md` |
| `angular-standalone` | al crear o editar archivos bajo `frontend/src/` |
| `fastapi-pydantic-v2` | al crear o editar `.py` bajo `backend/` |
| `tdd` | al escribir tests |
| `frontend-design` | al crear una vista o componente nuevo |
| `web-design-guidelines` | al auditar accesibilidad y responsive |
| `grill-me` | antes de aprobar un plan que quieras estresar |
| `systematic-debugging` | al depurar un bug o test rojo difícil |

Agentes SDD (`.opencode/agents/`): `coordinator` (primary, dirige), `planner` (solo
`docs/spec/**`), `implementer` (una tarea con tests primero), `reviewer` (valida AC sin
editar). Comandos `/sdd-*` en `.opencode/commands/`.

## 9. Flujo de Trabajo (Spec-Driven Development)

1. Leer `docs/spec/constitucion.md`, `roadmap.md` y `stack.md` antes de cada tarea.
2. Cada feature vive en `docs/spec/features/NNN-nombre-feature/`.
3. Ciclo: `spec.md` → `plan.md` → `tasks.md` → código verificado con pruebas.
4. Si la certeza de una decisión es < 80 %, preguntar en lugar de asumir.
5. Cierre de feature = `tasks.md` marcado, AC con evidencia, `pytest` en verde y
   recorrido funcional en 4200.
6. Mover o borrar archivos obliga a revisar los `.md` que los citan.

## 10. Memoria

- Leer `MEMORY.md` al empezar; actualizarlo al terminar cada tarea (máx. ~50 líneas).
- Nunca guardar datos sensibles.

## 11. Límites

✅ Siempre: mantener `pytest` en verde, tipar el contrato con `/openapi.json`, actualizar
`MEMORY.md`.
🚫 Nunca: romper el esquema sin recrear la base, dejar el carrito sin persistencia, subir
`.env`.
