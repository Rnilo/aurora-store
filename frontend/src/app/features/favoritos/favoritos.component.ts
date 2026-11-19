import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FavoritosService } from '../../core/services/favoritos.service';
import { TarjetaProductoComponent } from '../../shared/components/tarjeta-producto.component';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterLink, TarjetaProductoComponent],
  template: `
    <div class="contenedor mt-8">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="etiqueta text-marca-700">Mi cuenta</p>
          <h1 class="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Mis favoritos
            @if (favoritos.cantidad() > 0) {
              <span class="text-tinta/30">({{ favoritos.cantidad() }})</span>
            }
          </h1>
          <p class="mt-1 text-sm text-tinta/50">Guardamos tus productos en este dispositivo.</p>
        </div>
      </div>

      @if (favoritos.productos().length === 0) {
        <div class="mt-8 rounded-3xl border border-dashed border-tinta/15 p-12 text-center">
          <p class="text-5xl">💚</p>
          <p class="mt-4 text-lg font-semibold">Aún no tienes favoritos</p>
          <p class="mt-1 text-sm text-tinta/50">
            Toca el corazón en cualquier producto para guardarlo aquí.
          </p>
          <a routerLink="/catalogo" class="btn-primario mt-6">Explorar catálogo</a>
        </div>
      } @else {
        <div class="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          @for (producto of favoritos.productos(); track producto.id) {
            <app-tarjeta-producto [producto]="producto" />
          }
        </div>
      }
    </div>
  `,
})
export class FavoritosComponent {
  readonly favoritos = inject(FavoritosService);
}
