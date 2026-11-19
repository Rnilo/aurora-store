# Stack y arquitectura — Aurora Store

## 1. Componentes

```
Navegador
   │
   ├── Angular 18 (nginx :8081 / dev server :4200)
   │        └── /api/* ──proxy──▶ FastAPI :8001
   │                                ├── PostgreSQL 16 :5434
   │                                └── Redis 7.2 :6381 (límite de tasa)
   └── Imágenes SVG servidas desde frontend/public/img
```

## 2. Frontend

- Angular 18.2 standalone, sin `NgModule`, con `inject()`.
- Estado con `signal()` / `computed()`: carrito, favoritos, sesión, avisos.
- Tailwind CSS 3.4; prohibido `styles: []` y CSS quemado en templates.
- Rutas lazy (`loadComponent`) en `src/app/features/`.
- `proxy.conf.json` redirige `/api` a `http://localhost:8001` en desarrollo.
- Interceptor `tokenInterceptor` adjunta el Bearer desde `localStorage`.
- `sesionGuard` protege `/checkout` y `/mis-pedidos` y conserva el retorno.

## 3. Backend

- FastAPI + Uvicorn, Pydantic v2, SQLAlchemy 2.1 síncrono con psycopg2.
- Capas: `api/v1/endpoints` (HTTP) → `services` (negocio) → `models` (ORM).
- Toda ruta declara `response_model` y `status_code`.
- Autenticación: JWT HS256 (PyJWT), contraseñas PBKDF2-SHA256 (stdlib).
- Límite de tasa Redis `fail-open`, ventana fija por IP sobre `/api/v1/*`.
- `/health` para el healthcheck de Docker.

### Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/v1/catalogo/categorias` | — | Árbol de categorías activas |
| GET | `/api/v1/catalogo/marcas` | — | Marcas |
| GET | `/api/v1/catalogo/productos` | — | Búsqueda + filtros + paginación |
| GET | `/api/v1/catalogo/productos/{slug}` | — | Detalle con galería |
| GET | `/api/v1/catalogo/productos/{slug}/relacionados` | — | Sugerencias |
| POST | `/api/v1/auth/registro` | — | Crear cuenta (devuelve token) |
| POST | `/api/v1/auth/login` | — | Iniciar sesión |
| GET | `/api/v1/auth/yo` | Bearer | Perfil |
| GET/POST | `/api/v1/auth/direcciones` | Bearer | Direcciones |
| POST | `/api/v1/pedidos/cotizar` | — | Totales, envío y cupón |
| POST | `/api/v1/pedidos` | Bearer | Crear pedido |
| GET | `/api/v1/pedidos` | Bearer | Historial |
| GET | `/api/v1/pedidos/{id}` | Bearer | Detalle |

Filtros de `/productos`: `q`, `categoria` (incluye subcategorías), `marca`,
`precio_min`, `precio_max`, `ofertas`, `destacados`, `orden`
(`relevancia|precio_asc|precio_desc|descuento|novedad|calificacion`), `pagina`, `tamano`.

## 4. Base de datos

9 tablas, `snake_case`, precios `INTEGER` en CLP:

`categorias` · `marcas` · `productos` · `imagenes_producto` · `usuarios` ·
`direcciones` · `cupones` · `pedidos` · `pedido_items`

- `productos.categoria_id` apunta a la subcategoría; `categorias.categoria_padre_id`
  arma el árbol del mega menú.
- `pedido_items` guarda copia del nombre, imagen y precio al momento de la compra.
- El stock se descuenta dentro de la misma transacción que crea el pedido.

## 5. Reglas de negocio

- Envío gratis desde **$49.990**; si no, **$3.990** de despacho.
- Retiro en tienda sin costo.
- Cupones: `porcentaje`, `monto` o `envio`, con compra mínima y vigencia.
- Un pedido exige al menos un ítem, stock suficiente y dirección si es despacho.
- El pedido nace `pagado` (demo sin pasarela) y el número es `AUR-AAAAMMDD-####`.

## 6. Entornos

| Servicio | Local |
|---|---|
| Frontend dev | http://localhost:4200 |
| Frontend nginx | http://localhost:8081 |
| API / Swagger | http://localhost:8001/docs |
| PostgreSQL | localhost:5434 / `aurora_store` |
| Redis | 127.0.0.1:6381 |

La base se reconstruye con `docker compose down -v && docker compose up -d`.
