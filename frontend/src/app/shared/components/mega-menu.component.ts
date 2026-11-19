import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Categoria } from '../../core/modelos';
import { CatalogoService } from '../../core/services/catalogo.service';

@Component({
  selector: 'app-mega-menu',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (abierto()) {
      <div class="fixed inset-0 z-50">
        <button
          type="button"
          class="absolute inset-0 bg-tinta/50 backdrop-blur-[1px]"
          (click)="cerrar.emit()"
          aria-label="Cerrar menú"
        ></button>

        <div class="absolute inset-y-0 left-0 flex w-full max-w-4xl animate-aparecer bg-white shadow-flotante">
          <aside class="flex w-64 shrink-0 flex-col border-r border-tinta/10 bg-crema/60">
            <div class="flex items-center justify-between px-5 py-5">
              <p class="text-lg font-bold">Menú</p>
              <button
                type="button"
                (click)="cerrar.emit()"
                class="grid h-8 w-8 place-items-center rounded-full hover:bg-tinta/10"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <nav class="flex-1 overflow-y-auto px-2 pb-4">
              @for (categoria of categorias(); track categoria.id) {
                <button
                  type="button"
                  (mouseenter)="activa.set(categoria.id)"
                  (click)="activa.set(categoria.id)"
                  class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition"
                  [class.bg-white]="activa() === categoria.id"
                  [class.text-marca-700]="activa() === categoria.id"
                  [class.shadow-sm]="activa() === categoria.id"
                >
                  <span class="text-base">{{ icono(categoria.icono) }}</span>
                  <span class="flex-1">{{ categoria.nombre }}</span>
                  <span class="text-tinta/30">›</span>
                </button>
              }
            </nav>
            <div class="m-3 rounded-xl bg-tinta p-4 text-white">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-lima">Aurora Plus</p>
              <p class="mt-1 text-sm font-medium">Envíos gratis desde $49.990 en todo Chile.</p>
            </div>
          </aside>

          <section class="flex-1 overflow-y-auto p-6 sm:p-8">
            @if (seleccionada(); as categoria) {
              <div class="flex items-center gap-3">
                <span class="grid h-11 w-11 place-items-center rounded-full bg-marca-100 text-xl">
                  {{ icono(categoria.icono) }}
                </span>
                <div>
                  <p class="etiqueta text-marca-700">Categoría</p>
                  <h2 class="text-2xl font-bold tracking-tight">{{ categoria.nombre }}</h2>
                </div>
              </div>

              <div class="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                <a
                  [routerLink]="['/catalogo']"
                  [queryParams]="{ categoria: categoria.slug }"
                  (click)="cerrar.emit()"
                  class="border-b border-tinta/10 py-2 text-sm font-semibold text-tinta hover:text-marca-700"
                  >Ver todo {{ categoria.nombre }}</a
                >
                @for (hija of categoria.subcategorias; track hija.id) {
                  <a
                    [routerLink]="['/catalogo']"
                    [queryParams]="{ categoria: hija.slug }"
                    (click)="cerrar.emit()"
                    class="border-b border-tinta/10 py-2 text-sm text-tinta/70 hover:text-marca-700"
                    >{{ hija.nombre }}</a
                  >
                }
              </div>

              <div class="mt-8 grid gap-3 sm:grid-cols-2">
                <a
                  [routerLink]="['/catalogo']"
                  [queryParams]="{ ofertas: 1 }"
                  (click)="cerrar.emit()"
                  class="rounded-2xl bg-gradient-to-br from-coral to-rose-700 p-5 text-white"
                >
                  <p class="etiqueta text-white/70">Oportunidades</p>
                  <p class="mt-1 text-xl font-bold">Ofertas de la semana</p>
                  <p class="mt-1 text-sm text-white/80">Hasta 50% de descuento</p>
                </a>
                <a
                  [routerLink]="['/catalogo']"
                  [queryParams]="{ destacados: 1 }"
                  (click)="cerrar.emit()"
                  class="rounded-2xl bg-gradient-to-br from-marca-600 to-marca-900 p-5 text-white"
                >
                  <p class="etiqueta text-lima">Favoritos</p>
                  <p class="mt-1 text-xl font-bold">Lo más vendido</p>
                  <p class="mt-1 text-sm text-white/80">Elegidos por nuestros clientes</p>
                </a>
              </div>
            }
          </section>
        </div>
      </div>
    }
  `,
})
export class MegaMenuComponent {
  readonly abierto = input(false);
  readonly cerrar = output<void>();

  private readonly catalogo = inject(CatalogoService);
  readonly categorias = this.catalogo.categorias;
  readonly activa = signal<number | null>(null);

  seleccionada(): Categoria | null {
    const lista = this.categorias();
    return lista.find((categoria) => categoria.id === this.activa()) ?? lista[0] ?? null;
  }

  icono(nombre: string): string {
    const iconos: Record<string, string> = {
      MONITOR: '💻',
      PLUG: '🔌',
      SHIRT: '👕',
      SHOE: '👟',
      SPARK: '✨',
      SOFA: '🛋️',
      TOY: '🧸',
      BALL: '🏀',
      PHONE: '📱',
      LAPTOP: '💻',
      HEADPHONES: '🎧',
      TV: '📺',
      SNOW: '❄️',
      PAN: '🍳',
      WASH: '🧺',
      WIND: '🌬️',
      DRESS: '👗',
      TIE: '👔',
      BAG: '👜',
      SNEAKER: '👟',
      BOOT: '🥾',
      FLOWER: '🌸',
      LIPSTICK: '💄',
      CREAM: '🧴',
      LAMP: '🪔',
      PLATE: '🍽️',
      PUZZLE: '🧩',
      DOLL: '🪆',
      BRICK: '🧱',
      DUMBBELL: '🏋️',
      TENT: '⛺',
    };
    return iconos[nombre] ?? '🛍️';
  }
}
