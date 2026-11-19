import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CarritoService } from '../../core/services/carrito.service';
import { formatearPrecio } from '../utils/formato';

@Component({
  selector: 'app-carrito-drawer',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (carrito.panelAbierto()) {
      <div class="fixed inset-0 z-50 flex justify-end">
        <button
          type="button"
          class="absolute inset-0 bg-tinta/50 backdrop-blur-[1px]"
          (click)="carrito.cerrarPanel()"
          aria-label="Cerrar carrito"
        ></button>

        <aside class="relative flex h-full w-full max-w-md animate-deslizar flex-col bg-white shadow-flotante">
          <header class="flex items-center justify-between border-b border-tinta/10 px-5 py-4">
            <div>
              <p class="etiqueta text-tinta/40">Tu compra</p>
              <h2 class="text-xl font-bold">Carrito ({{ carrito.cantidadTotal() }})</h2>
            </div>
            <button
              type="button"
              (click)="carrito.cerrarPanel()"
              class="grid h-9 w-9 place-items-center rounded-full hover:bg-crema"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </header>

          @if (carrito.items().length === 0) {
            <div class="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <span class="grid h-20 w-20 place-items-center rounded-full bg-crema text-3xl">🛒</span>
              <p class="text-lg font-semibold">Tu carrito está vacío</p>
              <p class="text-sm text-tinta/50">
                Recorre el catálogo y agrega esos productos que te gustaron.
              </p>
              <a routerLink="/catalogo" (click)="carrito.cerrarPanel()" class="btn-primario mt-2">
                Ir al catálogo
              </a>
            </div>
          } @else {
            <div class="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              @for (item of carrito.items(); track item.producto.id) {
                <div class="flex gap-3 border-b border-tinta/10 pb-4">
                  <img
                    [src]="item.producto.imagen_url"
                    [alt]="item.producto.nombre"
                    class="h-20 w-20 shrink-0 rounded-xl bg-crema object-cover"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="linea-2 text-sm font-medium">{{ item.producto.nombre }}</p>
                    <p class="mt-0.5 text-xs text-tinta/40">{{ item.producto.marca?.nombre }}</p>
                    <div class="mt-2 flex items-center justify-between">
                      <div class="flex items-center rounded-full border border-tinta/15">
                        <button
                          type="button"
                          (click)="carrito.cambiarCantidad(item.producto.id, item.cantidad - 1)"
                          class="grid h-7 w-7 place-items-center rounded-full text-sm hover:bg-crema"
                          aria-label="Quitar una unidad"
                        >
                          −
                        </button>
                        <span class="w-7 text-center text-sm font-semibold">{{ item.cantidad }}</span>
                        <button
                          type="button"
                          (click)="carrito.cambiarCantidad(item.producto.id, item.cantidad + 1)"
                          class="grid h-7 w-7 place-items-center rounded-full text-sm hover:bg-crema"
                          aria-label="Agregar una unidad"
                        >
                          +
                        </button>
                      </div>
                      <p class="text-sm font-bold">
                        {{ formatear(item.producto.precio_efectivo * item.cantidad) }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    (click)="carrito.quitar(item.producto.id)"
                    class="self-start text-xs text-tinta/40 hover:text-coral"
                    aria-label="Quitar producto"
                  >
                    ✕
                  </button>
                </div>
              }
            </div>

            <footer class="border-t border-tinta/10 px-5 py-5">
              <div class="flex items-center justify-between text-sm">
                <span class="text-tinta/50">Subtotal</span>
                <span class="text-lg font-bold">{{ formatear(carrito.subtotal()) }}</span>
              </div>
              @if (carrito.ahorro() > 0) {
                <p class="mt-1 text-xs font-semibold text-marca-700">
                  Estás ahorrando {{ formatear(carrito.ahorro()) }}
                </p>
              }
              <p class="mt-2 text-xs text-tinta/40">
                Envío gratis desde $49.990. El costo final se calcula en el checkout.
              </p>
              <div class="mt-4 grid gap-2">
                <a routerLink="/checkout" (click)="carrito.cerrarPanel()" class="btn-primario w-full">
                  Ir a pagar
                </a>
                <a routerLink="/carrito" (click)="carrito.cerrarPanel()" class="btn-claro w-full">
                  Ver carrito completo
                </a>
              </div>
            </footer>
          }
        </aside>
      </div>
    }
  `,
})
export class CarritoDrawerComponent {
  readonly carrito = inject(CarritoService);
  protected readonly formatear = formatearPrecio;
}
