# Roadmap — Aurora Store

| # | Feature | Estado | Alcance |
|---|---|---|---|
| 001 | Tienda y catálogo | ✅ Cerrada | Vitrina, mega menú, búsqueda, filtros, detalle, carrito, favoritos, cuentas, cupones, checkout e historial |
| 002 | Panel de administración | ⏳ Pendiente | CRUD de productos, stock y pedidos; rol administrador |
| 003 | Reseñas de clientes | ⏳ Pendiente | Calificar productos comprados y moderar reseñas |
| 004 | Búsqueda avanzada | ⏳ Pendiente | Sugerencias, sinónimos y filtros múltiples de marca |
| 005 | Pagos reales | ⏳ Pendiente | Integración Webpay / Mercado Pago y estados de pago |

## Cómo se cierra una feature

1. `tasks.md` con todas las tareas marcadas.
2. Cada AC de `spec.md` con evidencia.
3. `pytest` en verde y `npm run build` sin errores.
4. Recorrido manual del flujo completo (catálogo → carrito → checkout → pedido).
