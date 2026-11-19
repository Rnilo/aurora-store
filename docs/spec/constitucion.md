# Constitución — Aurora Store

## 1. Propósito

Aurora Store existe para demostrar, de punta a punta, una tienda online real:
catálogo navegable, búsqueda y filtros, carrito persistente, cuentas de cliente,
checkout con cupones e historial de pedidos. El código se escribe para que otra
persona pueda levantarlo con `docker compose up -d` y entenderlo.

## 2. Principios

1. **La spec manda.** Ningún cambio en `backend/` o `frontend/` sin `spec.md` y
   `plan.md` aprobados en `docs/spec/features/NNN-nombre/`.
2. **Vertical slices.** Cada feature atraviesa base de datos, API y UI; no se
   entregan capas a medias.
3. **Verificación antes que promesa.** Un criterio de aceptación se marca solo con
   evidencia (test, respuesta HTTP o recorrido en el navegador).
4. **Datos reales en PostgreSQL.** El catálogo no vive hardcodeado en el frontend.
5. **Simple primero.** Sin dependencias nuevas si la librería estándar o el stack
   actual resuelven el problema.
6. **Español de dominio.** Identificadores, rutas de negocio y mensajes al usuario en
   español; lo estructural del framework se conserva.

## 3. Límites

- Dinero en pesos chilenos **enteros**; nada de floats para precios.
- El carrito y los favoritos son del navegador (localStorage). La verdad de una
  compra es el pedido en PostgreSQL.
- La autenticación es propia (JWT HS256); no se depende de servicios externos.
- Las imágenes del catálogo son SVG locales; la tienda no se rompe sin internet.
- La base se reconstruye (scripts SQL), no se migra.

## 4. Definición de terminado

1. `pytest` en verde.
2. `npm run build` sin errores.
3. Criterios de aceptación marcados con su evidencia.
4. `MEMORY.md` actualizado.
5. Recorrido funcional en `http://localhost:4200` (o `8081` tras reconstruir la imagen).
