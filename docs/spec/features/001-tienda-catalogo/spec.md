# Feature 001 — Tienda y catálogo

**Estado:** cerrada · **Release:** 1.0

## 1. Objetivo

Entregar una tienda online funcional donde un visitante pueda descubrir productos,
armar un carrito, crear una cuenta y completar una compra que quede registrada en
PostgreSQL, con una interfaz inspirada en el retail departamental chileno.

## 2. Historias de usuario

- **HU-1** Como visitante quiero navegar categorías y buscar productos para encontrar
  lo que necesito.
- **HU-2** Como visitante quiero filtrar por categoría, marca y precio para acotar la
  oferta.
- **HU-3** Como visitante quiero agregar productos al carrito y ajustar cantidades sin
  perderlas al recargar.
- **HU-4** Como visitante quiero guardar favoritos para volver a ellos después.
- **HU-5** Como cliente quiero crear una cuenta e iniciar sesión para comprar.
- **HU-6** Como cliente quiero pagar con despacho o retiro, aplicar un cupón y recibir
  un número de pedido.
- **HU-7** Como cliente quiero revisar mi historial de pedidos y su estado.

## 3. Fuera de alcance

Panel de administración, pagos reales, reseñas de clientes, multi-idioma y correos
transaccionales.

## 4. Criterios de aceptación

| ID | Criterio | Evidencia |
|---|---|---|
| AC-1 | La API expone el árbol de 8 categorías raíz con 24 subcategorías | `GET /api/v1/catalogo/categorias` |
| AC-2 | El catálogo pagina y filtra por texto, categoría padre, marca, precio y oferta | `tests/test_catalogo.py` |
| AC-3 | El detalle incluye descripción, SKU, galería y productos relacionados | `GET /api/v1/catalogo/productos/{slug}` |
| AC-4 | El carrito persiste en localStorage y sobrevive a recargas | `CarritoService` + recorrido manual |
| AC-5 | El registro devuelve token y rechaza correos duplicados con 409 | `tests/test_auth.py` |
| AC-6 | Sin token, el checkout responde 401 | `tests/test_pedidos.py` |
| AC-7 | La cotización aplica cupón de porcentaje, monto y envío | `tests/test_pedidos.py` |
| AC-8 | Crear un pedido descuenta stock y aparece en el historial | `tests/test_pedidos.py` |
| AC-9 | El total respeta envío gratis desde $49.990 y retiro sin costo | `tests/test_pedidos.py` |
| AC-10 | La UI es usable en móvil (menú, grillas y drawer de carrito) | Recorrido responsive |

## 5. Decisiones

- **Precios enteros (CLP)**: evita redondeos; el formato se resuelve en el cliente.
- **Carrito y favoritos locales**: no exigen cuenta; el pedido se materializa en el
  checkout.
- **JWT propio**: el proyecto funciona sin claves de terceros.
- **Imágenes SVG generadas**: catálogo reproducible y sin dependencia de red.
- **`/pedidos/cotizar` público**: el resumen se calcula en el servidor, no en el cliente.
