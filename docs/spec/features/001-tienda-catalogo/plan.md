# Plan técnico — Feature 001

## 1. Base de datos

`database/01_esquema.sql` crea 9 tablas; `02_datos_semilla.sql` siembra 8 categorías
raíz, 24 subcategorías, 12 marcas, 48 productos (3 imágenes cada uno), 3 cupones y un
cliente demo con un pedido de ejemplo.

Índices: categoría, marca, destacados activos, imágenes por producto, pedidos por
usuario y fecha, ítems por pedido.

## 2. Backend

| Archivo | Responsabilidad |
|---|---|
| `app/core/{config,security,constantes}.py` | Settings, JWT/PBKDF2, reglas de envío |
| `app/db/database.py` | Motor, `SessionLocal`, `Base`, `get_db` |
| `app/models/{catalogo,pedido}.py` | ORM (productos, pedidos, usuarios) |
| `app/schemas/*` | DTOs Pydantic v2 |
| `app/services/catalogo_service.py` | Árbol, búsqueda, filtros, relacionados |
| `app/services/auth_service.py` | Registro, login, direcciones |
| `app/services/pedido_service.py` | Cotización, creación transaccional, historial |
| `app/middleware/limite_tasa.py` | Ventana fija con Redis, fail-open |

Decisiones de implementación:

- El filtro por categoría resuelve la raíz y sus hijas en una sola consulta de ids.
- El orden por descuento se calcula en SQL con la razón `(precio - efectivo) / precio`.
- La creación del pedido consolida ítems repetidos, valida stock, descuenta stock y
  genera el número correlativo dentro de la misma transacción.
- Los tests usan SQLite en memoria y sobreescriben `get_db`.

## 3. Frontend

| Ruta | Componente | Contenido |
|---|---|---|
| `/` | `InicioComponent` | Hero rotativo, accesos, mundos, ofertas, banners, destacados |
| `/catalogo` | `CatalogoComponent` | Filtros laterales, orden, grilla y paginación |
| `/producto/:slug` | `ProductoComponent` | Galería, precio, stock, carrito, relacionados |
| `/carrito` | `CarritoComponent` | Edición de cantidades y resumen |
| `/checkout` | `CheckoutComponent` | Entrega, dirección, pago demo, cupón, confirmación |
| `/login`, `/registro` | Auth | Formularios reactivos y cuenta demo |
| `/mis-pedidos` | `MisPedidosComponent` | Historial desplegable |
| `/favoritos` | `FavoritosComponent` | Grilla local |

Estado en servicios con signals: `CarritoService`, `FavoritosService`,
`AutenticacionService`, `NotificacionService`. Componentes compartidos en
`shared/components` (`header`, `mega-menu`, `tarjeta-producto`, `carrito-drawer`,
`seccion-productos`, `estrellas`, `aviso`).

## 4. Verificación

1. `cd backend && pytest` (25 tests).
2. `cd frontend && npm run build`.
3. `docker compose up -d` y recorrido: home → categoría → producto → carrito →
   login demo → checkout con cupón → pedido en `/mis-pedidos`.
