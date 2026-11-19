# MEMORY.md — Aurora Store

## Estado actual (2026-11-19)

- Repo nuevo creado desde cero replicando el stack de CompuStock ERP.
- Feature 001 (vitrina + catálogo + carrito + checkout) implementada.
- Backend con 9 tablas, 48 productos semilla, JWT propio y límite de tasa Redis fail-open.
- Frontend Angular 18 standalone + Tailwind con home estilo retail, mega menú, catálogo
  con filtros, detalle, carrito persistente, favoritos, login/registro y mis pedidos.
- `pytest`: 25 passed. `npm run build`: en verde (2026-11-19).
- Docker Compose verificado el 2026-11-19: API `:8001`, tienda `:8081`, PostgreSQL
  `:5434`, Redis `:6381` (se movieron para no chocar con CompuStock ERP). Recorrido
  completo home → catálogo → detalle → carrito → login → cupón `BIENVENIDO10` →
  pedido creado → historial, sin errores de consola.

## Decisiones

- **Precios en CLP enteros**: evita errores de redondeo; el formato `$ 599.990` se resuelve
  en el frontend.
- **Carrito y favoritos en localStorage**: no exigen sesión; el pedido se materializa en
  PostgreSQL recién en el checkout.
- **JWT propio (PyJWT) en vez de Clerk**: el repo debe funcionar sin claves externas.
  Contraseñas con PBKDF2-SHA256 de la stdlib para no añadir dependencias.
- **Imágenes SVG locales**: el catálogo no depende de servicios externos ni de red.
- **Base reconstruible**: `database/01_esquema.sql` + `02_datos_semilla.sql`, sin migraciones.

## Errores a evitar

- No usar `Numeric` para precios: el contrato usa enteros.
- No escribir `[class.text-tinta/20]` en templates: la `/` rompe el parser de Angular.
  Usar `[class]="cond ? 'a/b' : 'c'"`.
- No escribir `@` literal en un template (correos): usar `&#64;`.
- No declarar `#ref` con el mismo nombre que una señal de la clase (ej. `#filtros`).
- No confiar en `localhost` para Redis en Windows: publicar en `127.0.0.1:6381`.
- No reutilizar los puertos de CompuStock ERP: Aurora usa `8081`, `8001`, `5434` y `6381`.
- No editar `dist/` ni `node_modules/`.
