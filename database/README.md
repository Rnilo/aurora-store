# Base de datos — Aurora Store

Dos scripts, sin migraciones. PostgreSQL los ejecuta **en orden alfabético** al crear
el volumen, porque `docker-compose.yml` monta esta carpeta en
`/docker-entrypoint-initdb.d`.

| Script | Contenido |
|---|---|
| `01_esquema.sql` | DDL de 9 tablas, índices y restricciones |
| `02_datos_semilla.sql` | Categorías, marcas, 48 productos, galería, cupones, cliente demo y un pedido de ejemplo |

## Modelo

- `categorias`: árbol de dos niveles (`categoria_padre_id`).
- `marcas`: catálogo de marcas.
- `productos`: precio y `precio_oferta` en CLP entero; `stock`, `sku`, `destacado`.
- `imagenes_producto`: vistas adicionales (2 por producto).
- `usuarios` / `direcciones`: cuentas y despacho.
- `cupones`: tipo `porcentaje`, `monto` o `envio`, con mínimo y vigencia.
- `pedidos` / `pedido_items`: cabecera y copia histórica de nombre, imagen y precio.

## Recrear la base

```bash
docker compose down -v
docker compose up -d
```

El volumen se reconstruye desde cero. **No** se reejecuta la semilla sobre una base
existente: no es idempotente a propósito.

## Cliente demo

| Correo | Contraseña |
|---|---|
| `cliente@aurora.cl` | `Demo1234` |

La contraseña se guarda como `pbkdf2_sha256$210000$<sal>$<hash>`, generada con la
misma función que usa el backend (`app/core/security.py`).
