# MEMORY.md — Aurora Store

## Estado actual (2026-11-19)

- Repo nuevo creado desde cero replicando el stack de CompuStock ERP.
- Feature 001 (vitrina + catálogo + carrito + checkout) implementada.
- Backend con 9 tablas, 40 productos semilla, JWT propio y límite de tasa Redis fail-open.
- Frontend Angular 18 standalone + Tailwind con home estilo retail, mega menú, catálogo
  con filtros, detalle, carrito persistente, favoritos, login/registro y mis pedidos.

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
- No confiar en `localhost` para Redis en Windows: publicar en `127.0.0.1:6380`.
- No editar `dist/` ni `node_modules/`.
