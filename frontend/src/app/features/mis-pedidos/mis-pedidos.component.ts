import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Pedido } from '../../core/modelos';
import { PedidosService } from '../../core/services/pedidos.service';
import { formatearFecha, formatearPrecio, nombreEstado } from '../../shared/utils/formato';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="contenedor mt-8">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="etiqueta text-marca-700">Mi cuenta</p>
          <h1 class="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Mis pedidos</h1>
          <p class="mt-1 text-sm text-tinta/50">Revisa el estado y el detalle de tus compras.</p>
        </div>
        <a routerLink="/catalogo" class="btn-claro !px-4 !py-2 text-xs">Seguir comprando</a>
      </div>

      @if (cargando()) {
        <div class="mt-8 space-y-3">
          @for (hueco of [1, 2, 3]; track hueco) {
            <div class="h-28 animate-pulse rounded-2xl bg-crema"></div>
          }
        </div>
      } @else if (pedidos().length === 0) {
        <div class="mt-8 rounded-3xl border border-dashed border-tinta/15 p-12 text-center">
          <p class="text-5xl">📦</p>
          <p class="mt-4 text-lg font-semibold">Todavía no tienes pedidos</p>
          <p class="mt-1 text-sm text-tinta/50">Cuando compres, tus pedidos aparecerán aquí.</p>
          <a routerLink="/catalogo" class="btn-primario mt-6">Descubrir productos</a>
        </div>
      } @else {
        <div class="mt-6 space-y-3">
          @for (pedido of pedidos(); track pedido.id) {
            <article class="rounded-2xl border border-tinta/10">
              <button
                type="button"
                (click)="alternar(pedido.id)"
                class="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left"
              >
                <div>
                  <p class="text-sm font-bold">{{ pedido.numero }}</p>
                  <p class="mt-0.5 text-xs text-tinta/40">{{ formatearFecha(pedido.creado_en) }}</p>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                  <span
                    class="rounded-full px-3 py-1 text-[11px] font-semibold"
                    [class]="claseEstado(pedido.estado)"
                    >{{ nombreEstado(pedido.estado) }}</span
                  >
                  <span class="text-sm font-bold">{{ formatear(pedido.total) }}</span>
                  <span class="text-tinta/30">{{ abierto() === pedido.id ? '▲' : '▼' }}</span>
                </div>
              </button>

              @if (abierto() === pedido.id) {
                <div class="border-t border-tinta/10 p-5">
                  <div class="grid gap-4 sm:grid-cols-2">
                    <div class="space-y-3">
                      @for (item of pedido.items; track item.id) {
                        <div class="flex items-center gap-3">
                          <img
                            [src]="item.imagen_url"
                            [alt]="item.nombre_producto"
                            class="h-14 w-14 rounded-lg bg-crema object-cover"
                          />
                          <div class="min-w-0 flex-1">
                            <p class="linea-1 text-sm font-medium">{{ item.nombre_producto }}</p>
                            <p class="text-xs text-tinta/40">
                              {{ item.cantidad }} × {{ formatear(item.precio_unitario) }}
                            </p>
                          </div>
                          <p class="text-sm font-semibold">{{ formatear(item.subtotal) }}</p>
                        </div>
                      }
                    </div>

                    <div class="rounded-xl bg-crema p-4 text-sm">
                      <p class="font-semibold">
                        {{ pedido.tipo_entrega === 'despacho' ? 'Despacho a domicilio' : 'Retiro en tienda' }}
                      </p>
                      <p class="mt-1 text-xs text-tinta/60">
                        {{ pedido.direccion_texto ?? 'Aurora Store Providencia, Av. Providencia 1234' }}
                      </p>
                      <dl class="mt-3 space-y-1 text-xs text-tinta/60">
                        <div class="flex justify-between">
                          <dt>Subtotal</dt>
                          <dd>{{ formatear(pedido.subtotal) }}</dd>
                        </div>
                        <div class="flex justify-between">
                          <dt>Envío</dt>
                          <dd>{{ pedido.costo_envio === 0 ? 'Gratis' : formatear(pedido.costo_envio) }}</dd>
                        </div>
                        @if (pedido.descuento > 0) {
                          <div class="flex justify-between text-marca-700">
                            <dt>Descuento {{ pedido.cupon_codigo }}</dt>
                            <dd>-{{ formatear(pedido.descuento) }}</dd>
                          </div>
                        }
                        <div class="flex justify-between border-t border-tinta/10 pt-2 text-sm font-bold text-tinta">
                          <dt>Total</dt>
                          <dd>{{ formatear(pedido.total) }}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              }
            </article>
          }
        </div>
      }
    </div>
  `,
})
export class MisPedidosComponent {
  private readonly servicio = inject(PedidosService);

  readonly pedidos = signal<Pedido[]>([]);
  readonly cargando = signal(true);
  readonly abierto = signal<number | null>(null);

  protected readonly formatear = formatearPrecio;
  protected readonly formatearFecha = formatearFecha;
  protected readonly nombreEstado = nombreEstado;

  constructor() {
    this.servicio.listar().subscribe({
      next: (pedidos) => {
        this.pedidos.set(pedidos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  alternar(id: number): void {
    this.abierto.set(this.abierto() === id ? null : id);
  }

  claseEstado(estado: string): string {
    const clases: Record<string, string> = {
      pagado: 'bg-marca-100 text-marca-800',
      preparando: 'bg-amber-100 text-amber-800',
      enviado: 'bg-sky-100 text-sky-800',
      entregado: 'bg-slate-200 text-slate-700',
      cancelado: 'bg-coral/10 text-coral',
      pendiente: 'bg-amber-100 text-amber-800',
    };
    return clases[estado] ?? 'bg-crema text-tinta/60';
  }
}
