import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Producto } from '../../core/modelos';
import { CarritoService } from '../../core/services/carrito.service';
import { CatalogoService } from '../../core/services/catalogo.service';
import { FavoritosService } from '../../core/services/favoritos.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { EstrellasComponent } from '../../shared/components/estrellas.component';
import { TarjetaProductoComponent } from '../../shared/components/tarjeta-producto.component';
import { formatearPrecio } from '../../shared/utils/formato';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [RouterLink, EstrellasComponent, TarjetaProductoComponent],
  template: `
    <div class="contenedor mt-6">
      @if (cargando()) {
        <div class="grid animate-pulse gap-8 lg:grid-cols-2">
          <div class="aspect-square rounded-3xl bg-crema"></div>
          <div class="space-y-4">
            <div class="h-4 w-24 rounded bg-crema"></div>
            <div class="h-8 w-3/4 rounded bg-crema"></div>
            <div class="h-5 w-40 rounded bg-crema"></div>
            <div class="h-20 w-1/2 rounded bg-crema"></div>
            <div class="h-12 w-full rounded-full bg-crema"></div>
          </div>
        </div>
      } @else if (error()) {
        <div class="rounded-3xl border border-dashed border-tinta/15 p-12 text-center">
          <p class="text-4xl">🫥</p>
          <p class="mt-3 text-lg font-semibold">Producto no encontrado</p>
          <p class="mt-1 text-sm text-tinta/50">Puede que ya no esté disponible.</p>
          <a routerLink="/catalogo" class="btn-primario mt-5">Volver al catálogo</a>
        </div>
      } @else {
        @let p = producto()!;
        <nav class="flex flex-wrap items-center gap-2 text-xs text-tinta/40">
          <a routerLink="/" class="hover:text-tinta">Inicio</a>
          <span>/</span>
          <a routerLink="/catalogo" class="hover:text-tinta">Catálogo</a>
          <span>/</span>
          <a
            routerLink="/catalogo"
            [queryParams]="{ categoria: p.categoria.slug }"
            class="hover:text-tinta"
            >{{ p.categoria.nombre }}</a
          >
          <span>/</span>
          <span class="linea-1 text-tinta/70">{{ p.nombre }}</span>
        </nav>

        <div class="mt-5 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <div class="overflow-hidden rounded-3xl border border-tinta/10 bg-crema">
              <img
                [src]="imagenActiva()"
                [alt]="p.nombre"
                class="aspect-square w-full object-cover"
              />
            </div>
            <div class="mt-3 flex gap-2">
              @for (vista of galeria(); track vista) {
                <button
                  type="button"
                  (click)="imagenActiva.set(vista)"
                  class="h-20 w-20 overflow-hidden rounded-xl border-2 transition"
                  [class.border-tinta]="imagenActiva() === vista"
                  [class.border-transparent]="imagenActiva() !== vista"
                  [attr.aria-label]="'Ver imagen ' + vista"
                >
                  <img [src]="vista" [alt]="p.nombre" class="h-full w-full object-cover" />
                </button>
              }
            </div>
          </div>

          <div>
            <p class="etiqueta text-tinta/40">{{ p.marca?.nombre ?? 'Aurora' }}</p>
            <h1 class="mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {{ p.nombre }}
            </h1>

            <div class="mt-3 flex flex-wrap items-center gap-3">
              <app-estrellas [valor]="p.calificacion" [resenas]="p.resenas" />
              <span class="text-xs text-tinta/40">SKU {{ p.sku }}</span>
            </div>

            <div class="mt-5 rounded-2xl bg-crema p-5">
              @if (p.precio_oferta) {
                <div class="flex items-center gap-3">
                  <span class="rounded-full bg-coral px-2.5 py-1 text-xs font-bold text-white"
                    >-{{ p.porcentaje_descuento }}%</span
                  >
                  <span class="text-sm text-tinta/40 line-through">{{ formatear(p.precio) }}</span>
                </div>
              }
              <p class="mt-1 text-4xl font-extrabold tracking-tight">
                {{ formatear(p.precio_efectivo) }}
              </p>
              <p class="mt-1 text-xs text-tinta/50">
                Hasta 12 cuotas sin interés de {{ formatear(redondear(p.precio_efectivo / 12)) }}
              </p>
            </div>

            <div class="mt-4 space-y-2 text-sm">
              <p class="flex items-center gap-2">
                <span>🚚</span>
                @if (p.envio_gratis) {
                  <span class="font-semibold text-marca-700">Envío gratis</span>
                  <span class="text-tinta/50">a todo Chile</span>
                } @else {
                  <span class="text-tinta/60">Envío calculado en el checkout</span>
                }
              </p>
              <p class="flex items-center gap-2">
                <span>🏬</span>
                <span class="text-tinta/60">Retiro en tienda disponible en 2 horas</span>
              </p>
              <p class="flex items-center gap-2">
                <span>📦</span>
                @if (p.stock > 0) {
                  <span class="text-marca-700">{{ p.stock }} unidades disponibles</span>
                } @else {
                  <span class="text-coral">Sin stock por ahora</span>
                }
              </p>
            </div>

            <div class="mt-5 flex flex-wrap items-center gap-3">
              <div class="flex items-center rounded-full border border-tinta/15">
                <button
                  type="button"
                  (click)="cambiarCantidad(-1)"
                  class="grid h-11 w-11 place-items-center rounded-full text-lg hover:bg-crema"
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span class="w-10 text-center font-semibold">{{ cantidad() }}</span>
                <button
                  type="button"
                  (click)="cambiarCantidad(1)"
                  class="grid h-11 w-11 place-items-center rounded-full text-lg hover:bg-crema"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                (click)="agregar()"
                [disabled]="p.stock === 0"
                class="btn-primario flex-1 disabled:bg-tinta/30"
              >
                Agregar al carrito
              </button>

              <button
                type="button"
                (click)="favoritos.alternar(p)"
                class="grid h-12 w-12 place-items-center rounded-full border border-tinta/15 transition hover:border-tinta"
                [attr.aria-label]="
                  favoritos.esFavorito(p.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-5 w-5"
                  [class.fill-coral]="favoritos.esFavorito(p.id)"
                  [class.text-coral]="favoritos.esFavorito(p.id)"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.7-7.8 1.1-1a5.5 5.5 0 0 0 0-7.8z"
                  />
                </svg>
              </button>
            </div>

            <button
              type="button"
              (click)="comprarAhora()"
              [disabled]="p.stock === 0"
              class="btn-lima mt-3 w-full"
            >
              Comprar ahora
            </button>

            <div class="mt-6 border-t border-tinta/10 pt-5">
              <h2 class="text-sm font-bold">Descripción</h2>
              <p class="mt-2 text-sm leading-relaxed text-tinta/60">{{ p.descripcion }}</p>
            </div>
          </div>
        </div>

        @if (relacionados().length > 0) {
          <section class="mt-16">
            <h2 class="text-2xl font-extrabold tracking-tight">También te puede gustar</h2>
            <div class="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
              @for (relacionado of relacionados(); track relacionado.id) {
                <app-tarjeta-producto [producto]="relacionado" />
              }
            </div>
          </section>
        }
      }
    </div>
  `,
})
export class ProductoComponent {
  private readonly ruta = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogo = inject(CatalogoService);
  private readonly avisos = inject(NotificacionService);
  private readonly destroyRef = inject(DestroyRef);

  readonly carrito = inject(CarritoService);
  readonly favoritos = inject(FavoritosService);

  readonly producto = signal<Producto | null>(null);
  readonly relacionados = signal<Producto[]>([]);
  readonly cargando = signal(true);
  readonly error = signal(false);
  readonly cantidad = signal(1);
  readonly imagenActiva = signal('');

  readonly galeria = computed(() => {
    const p = this.producto();
    if (!p) {
      return [];
    }
    const vistas = [p.imagen_url, ...(p.imagenes ?? []).map((imagen) => imagen.url)];
    return vistas.filter((vista, indice) => vistas.indexOf(vista) === indice);
  });

  protected readonly formatear = formatearPrecio;

  constructor() {
    this.ruta.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((parametros) => {
      const slug = parametros.get('slug');
      if (slug) {
        this.cargar(slug);
      }
    });
  }

  cambiarCantidad(delta: number): void {
    const stock = this.producto()?.stock ?? 1;
    const siguiente = this.cantidad() + delta;
    this.cantidad.set(Math.max(1, Math.min(siguiente, Math.max(stock, 1), 20)));
  }

  agregar(): void {
    const producto = this.producto();
    if (!producto) {
      return;
    }
    this.carrito.agregar(producto, this.cantidad());
    this.avisos.mostrar(`"${producto.nombre}" se agregó al carrito.`);
  }

  comprarAhora(): void {
    const producto = this.producto();
    if (!producto || producto.stock === 0) {
      return;
    }
    this.carrito.agregar(producto, this.cantidad());
    void this.router.navigate(['/checkout']);
  }

  redondear(valor: number): number {
    return Math.round(valor);
  }

  private cargar(slug: string): void {
    this.cargando.set(true);
    this.error.set(false);
    this.catalogo.obtener(slug).subscribe({
      next: (producto) => {
        this.producto.set(producto);
        this.imagenActiva.set(producto.imagen_url);
        this.cantidad.set(1);
        this.cargando.set(false);
        this.catalogo.relacionados(slug).subscribe({
          next: (relacionados) => this.relacionados.set(relacionados),
          error: () => this.relacionados.set([]),
        });
      },
      error: () => {
        this.producto.set(null);
        this.cargando.set(false);
        this.error.set(true);
      },
    });
  }
}
