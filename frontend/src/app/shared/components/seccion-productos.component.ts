import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Producto } from '../../core/modelos';
import { TarjetaProductoComponent } from './tarjeta-producto.component';

@Component({
  selector: 'app-seccion-productos',
  standalone: true,
  imports: [RouterLink, TarjetaProductoComponent],
  template: `
    <section class="contenedor mt-14">
      <div class="flex items-end justify-between gap-4">
        <div>
          <p class="etiqueta text-marca-700">{{ etiqueta() }}</p>
          <h2 class="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{{ titulo() }}</h2>
          @if (subtitulo()) {
            <p class="mt-1 text-sm text-tinta/50">{{ subtitulo() }}</p>
          }
        </div>
        @if (enlace()) {
          <a
            [routerLink]="enlace()"
            [queryParams]="parametros()"
            class="hidden shrink-0 text-sm font-semibold text-marca-700 hover:underline sm:block"
            >Ver todo →</a
          >
        }
      </div>

      @if (cargando()) {
        <div class="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          @for (hueco of [1, 2, 3, 4, 5]; track hueco) {
            <div class="animate-pulse rounded-2xl border border-tinta/5 p-3">
              <div class="aspect-square rounded-xl bg-crema"></div>
              <div class="mt-3 h-3 w-1/3 rounded bg-crema"></div>
              <div class="mt-2 h-4 w-full rounded bg-crema"></div>
              <div class="mt-2 h-4 w-2/3 rounded bg-crema"></div>
            </div>
          }
        </div>
      } @else if (productos().length === 0) {
        <div class="mt-5 rounded-2xl border border-dashed border-tinta/15 p-10 text-center text-sm text-tinta/50">
          No encontramos productos en esta selección.
        </div>
      } @else {
        <div class="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          @for (producto of productos(); track producto.id) {
            <app-tarjeta-producto [producto]="producto" />
          }
        </div>
      }
    </section>
  `,
})
export class SeccionProductosComponent {
  readonly etiqueta = input('Destacados');
  readonly titulo = input.required<string>();
  readonly subtitulo = input('');
  readonly enlace = input<string | null>(null);
  readonly parametros = input<Record<string, string | number>>({});
  readonly productos = input<Producto[]>([]);
  readonly cargando = input(false);
}
