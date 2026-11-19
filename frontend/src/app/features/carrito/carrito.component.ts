import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CarritoService } from '../../core/services/carrito.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { formatearPrecio } from '../../shared/utils/formato';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="contenedor mt-8">
      <h1 class="text-2xl font-extrabold tracking-tight sm:text-3xl">
        Carrito de compras
        <span class="text-tinta/30">({{ carrito.cantidadTotal() }})</span>
      </h1>

      @if (carrito.items().length === 0) {
        <div class="mt-8 rounded-3xl border border-dashed border-tinta/15 p-12 text-center">
          <p class="text-5xl">🛒</p>
          <p class="mt-4 text-lg font-semibold">Tu carrito está vacío</p>
          <p class="mt-1 text-sm text-tinta/50">
            Explora el catálogo y encuentra algo que te guste.
          </p>
          <a routerLink="/catalogo" class="btn-primario mt-6">Ir al catálogo</a>
        </div>
      } @else {
        <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <section class="space-y-3">
            @for (item of carrito.items(); track item.producto.id) {
              <article class="flex gap-4 rounded-2xl border border-tinta/10 p-4">
                <a [routerLink]="['/producto', item.producto.slug]" class="shrink-0">
                  <img
                    [src]="item.producto.imagen_url"
                    [alt]="item.producto.nombre"
                    class="h-28 w-28 rounded-xl bg-crema object-cover sm:h-32 sm:w-32"
                  />
                </a>

                <div class="flex min-w-0 flex-1 flex-col">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="etiqueta text-tinta/40">{{ item.producto.marca?.nombre }}</p>
                      <a
                        [routerLink]="['/producto', item.producto.slug]"
                        class="linea-2 mt-1 block text-sm font-semibold hover:underline sm:text-base"
                        >{{ item.producto.nombre }}</a
                      >
                      <p class="mt-1 text-xs text-tinta/40">{{ item.producto.categoria.nombre }}</p>
                    </div>
                    <button
                      type="button"
                      (click)="quitar(item.producto.id)"
                      class="shrink-0 text-xs text-tinta/40 hover:text-coral"
                    >
                      Quitar
                    </button>
                  </div>

                  <div class="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                    <div class="flex items-center rounded-full border border-tinta/15">
                      <button
                        type="button"
                        (click)="cambiarCantidad(item.producto.id, item.cantidad - 1)"
                        class="grid h-9 w-9 place-items-center rounded-full hover:bg-crema"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span class="w-8 text-center text-sm font-semibold">{{ item.cantidad }}</span>
                      <button
                        type="button"
                        (click)="cambiarCantidad(item.producto.id, item.cantidad + 1)"
                        class="grid h-9 w-9 place-items-center rounded-full hover:bg-crema"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    <div class="text-right">
                      @if (item.producto.precio_oferta) {
                        <p class="text-xs text-tinta/40 line-through">
                          {{ formatear(item.producto.precio * item.cantidad) }}
                        </p>
                      }
                      <p class="text-lg font-bold">
                        {{ formatear(item.producto.precio_efectivo * item.cantidad) }}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            }

            <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a routerLink="/catalogo" class="text-sm font-semibold text-marca-700 hover:underline"
                >← Seguir comprando</a
              >
              <button
                type="button"
                (click)="carrito.vaciar()"
                class="text-xs text-tinta/40 hover:text-coral"
              >
                Vaciar carrito
              </button>
            </div>
          </section>

          <aside class="lg:sticky lg:top-28 lg:self-start">
            <div class="rounded-2xl border border-tinta/10 p-5">
              <h2 class="text-lg font-bold">Resumen de compra</h2>

              <dl class="mt-4 space-y-2 text-sm">
                <div class="flex justify-between">
                  <dt class="text-tinta/60">Subtotal</dt>
                  <dd class="font-semibold">{{ formatear(carrito.subtotal()) }}</dd>
                </div>
                @if (carrito.ahorro() > 0) {
                  <div class="flex justify-between text-marca-700">
                    <dt>Ahorro por ofertas</dt>
                    <dd class="font-semibold">-{{ formatear(carrito.ahorro()) }}</dd>
                  </div>
                }
                <div class="flex justify-between">
                  <dt class="text-tinta/60">Envío estimado</dt>
                  <dd class="font-semibold">{{ envio() === 0 ? 'Gratis' : formatear(envio()) }}</dd>
                </div>
              </dl>

              <div class="mt-4 flex items-end justify-between border-t border-tinta/10 pt-4">
                <span class="text-sm text-tinta/60">Total estimado</span>
                <span class="text-2xl font-extrabold">{{ formatear(total()) }}</span>
              </div>

              @if (carrito.subtotal() < 49990) {
                <p class="mt-2 rounded-xl bg-crema p-3 text-xs text-tinta/60">
                  Te faltan <strong>{{ formatear(49990 - carrito.subtotal()) }}</strong> para
                  obtener envío gratis.
                </p>
              }

              <a routerLink="/checkout" class="btn-primario mt-5 w-full">Ir a pagar</a>
              <p class="mt-3 text-center text-[11px] text-tinta/40">
                El cupón de descuento se aplica en el checkout.
              </p>
            </div>
          </aside>
        </div>
      }
    </div>
  `,
})
export class CarritoComponent {
  readonly carrito = inject(CarritoService);
  private readonly avisos = inject(NotificacionService);

  protected readonly formatear = formatearPrecio;

  readonly envio = computed(() => (this.carrito.subtotal() >= 49990 ? 0 : 3990));
  readonly total = computed(() => this.carrito.subtotal() + this.envio());

  cambiarCantidad(productoId: number, cantidad: number): void {
    this.carrito.cambiarCantidad(productoId, cantidad);
  }

  quitar(productoId: number): void {
    this.carrito.quitar(productoId);
    this.avisos.mostrar('Producto eliminado del carrito.', 'info');
  }
}
