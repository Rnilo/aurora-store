import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FiltrosBusqueda, Marca, PaginaProductos } from '../../core/modelos';
import { CatalogoService } from '../../core/services/catalogo.service';
import { TarjetaProductoComponent } from '../../shared/components/tarjeta-producto.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink, TarjetaProductoComponent, NgTemplateOutlet],
  template: `
    <div class="contenedor mt-6">
      <nav class="flex items-center gap-2 text-xs text-tinta/40">
        <a routerLink="/" class="hover:text-tinta">Inicio</a>
        <span>/</span>
        <span class="text-tinta/70">Catálogo</span>
        @if (filtros().categoria) {
          <span>/</span>
          <span class="text-tinta/70">{{ titulo() }}</span>
        }
      </nav>

      <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight sm:text-3xl">{{ titulo() }}</h1>
          <p class="mt-1 text-sm text-tinta/50">
            @if (resultados(); as pagina) {
              {{ pagina.total }} productos encontrados
            } @else {
              Cargando productos…
            }
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="panelFiltros.set(!panelFiltros())"
            class="btn-claro !px-4 !py-2 text-xs lg:hidden"
          >
            Filtros {{ filtrosActivos() > 0 ? '(' + filtrosActivos() + ')' : '' }}
          </button>
          <label class="flex items-center gap-2 text-xs text-tinta/50">
            Ordenar por
            <select
              [value]="filtros().orden ?? 'relevancia'"
              (change)="ordenar($any($event.target).value)"
              class="rounded-xl border border-tinta/15 bg-white px-3 py-2 text-xs font-medium text-tinta"
            >
              <option value="relevancia">Relevancia</option>
              <option value="precio_asc">Menor precio</option>
              <option value="precio_desc">Mayor precio</option>
              <option value="descuento">Mayor descuento</option>
              <option value="novedad">Novedades</option>
              <option value="calificacion">Mejor calificados</option>
            </select>
          </label>
        </div>
      </div>

      <div class="mt-6 grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside class="hidden lg:block">
          <ng-container *ngTemplateOutlet="plantillaFiltros" />
        </aside>

        @if (panelFiltros()) {
          <div class="rounded-2xl border border-tinta/10 p-4 lg:hidden">
            <ng-container *ngTemplateOutlet="plantillaFiltros" />
          </div>
        }

        <section>
          @if (cargando()) {
            <div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              @for (hueco of [1, 2, 3, 4, 5, 6, 7, 8]; track hueco) {
                <div class="animate-pulse rounded-2xl border border-tinta/5 p-3">
                  <div class="aspect-square rounded-xl bg-crema"></div>
                  <div class="mt-3 h-3 w-1/3 rounded bg-crema"></div>
                  <div class="mt-2 h-4 w-full rounded bg-crema"></div>
                  <div class="mt-2 h-4 w-2/3 rounded bg-crema"></div>
                </div>
              }
            </div>
          } @else if (!resultados() || resultados()!.items.length === 0) {
            <div class="rounded-3xl border border-dashed border-tinta/15 p-12 text-center">
              <p class="text-4xl">🔎</p>
              <p class="mt-3 text-lg font-semibold">No encontramos productos</p>
              <p class="mt-1 text-sm text-tinta/50">
                Prueba con otras palabras o quita algunos filtros.
              </p>
              <button type="button" (click)="limpiar()" class="btn-primario mt-5">
                Ver todo el catálogo
              </button>
            </div>
          } @else {
            <div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              @for (producto of resultados()!.items; track producto.id) {
                <app-tarjeta-producto [producto]="producto" />
              }
            </div>

            @if (resultados()!.paginas > 1) {
              <nav class="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación">
                <button
                  type="button"
                  class="rounded-full border border-tinta/15 px-4 py-2 text-xs font-semibold disabled:opacity-40"
                  [disabled]="resultados()!.pagina <= 1"
                  (click)="irAPagina(resultados()!.pagina - 1)"
                >
                  ← Anterior
                </button>
                @for (numero of paginas(); track numero) {
                  <button
                    type="button"
                    class="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold"
                    [class]="
                      numero === resultados()!.pagina
                        ? 'bg-tinta text-white'
                        : 'border border-tinta/15'
                    "
                    (click)="irAPagina(numero)"
                  >
                    {{ numero }}
                  </button>
                }
                <button
                  type="button"
                  class="rounded-full border border-tinta/15 px-4 py-2 text-xs font-semibold disabled:opacity-40"
                  [disabled]="resultados()!.pagina >= resultados()!.paginas"
                  (click)="irAPagina(resultados()!.pagina + 1)"
                >
                  Siguiente →
                </button>
              </nav>
            }
          }
        </section>
      </div>
    </div>

    <ng-template #plantillaFiltros>
      <div class="space-y-6">
        <div>
          <div class="flex items-center justify-between">
            <p class="text-sm font-bold">Categorías</p>
            <button type="button" (click)="limpiar()" class="text-[11px] text-marca-700 hover:underline">
              Limpiar
            </button>
          </div>
          <div class="mt-3 space-y-1">
            <button
              type="button"
              (click)="aplicar({ categoria: null })"
              class="block w-full rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-crema"
              [class.font-semibold]="!filtros().categoria"
              [class.text-marca-700]="!filtros().categoria"
            >
              Todas las categorías
            </button>
            @for (categoria of catalogo.categorias(); track categoria.id) {
              <button
                type="button"
                (click)="aplicar({ categoria: categoria.slug })"
                class="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-crema"
                [class.font-semibold]="filtros().categoria === categoria.slug"
                [class.text-marca-700]="filtros().categoria === categoria.slug"
              >
                <span>{{ categoria.nombre }}</span>
                <span class="text-tinta/30">›</span>
              </button>
              @if (filtros().categoria === categoria.slug || estaEnHija(categoria.slug)) {
                <div class="ml-2 border-l border-tinta/10 pl-2">
                  @for (hija of categoria.subcategorias; track hija.id) {
                    <button
                      type="button"
                      (click)="aplicar({ categoria: hija.slug })"
                      class="block w-full rounded-lg px-2 py-1 text-left text-xs text-tinta/60 hover:bg-crema"
                      [class.font-semibold]="filtros().categoria === hija.slug"
                      [class.text-marca-700]="filtros().categoria === hija.slug"
                    >
                      {{ hija.nombre }}
                    </button>
                  }
                </div>
              }
            }
          </div>
        </div>

        <div class="border-t border-tinta/10 pt-5">
          <p class="text-sm font-bold">Precio</p>
          <div class="mt-3 space-y-1">
            @for (rango of rangos; track rango.etiqueta) {
              <button
                type="button"
                (click)="aplicar({ precio_min: rango.min, precio_max: rango.max })"
                class="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-tinta/70 hover:bg-crema"
              >
                {{ rango.etiqueta }}
              </button>
            }
          </div>
        </div>

        <div class="border-t border-tinta/10 pt-5">
          <p class="text-sm font-bold">Marca</p>
          <div class="mt-3 max-h-56 space-y-1 overflow-y-auto pr-1">
            @for (marca of marcas(); track marca.id) {
              <button
                type="button"
                (click)="aplicar({ marca: marca.slug })"
                class="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-tinta/70 hover:bg-crema"
                [class.font-semibold]="filtros().marca === marca.slug"
                [class.text-marca-700]="filtros().marca === marca.slug"
              >
                {{ marca.nombre }}
              </button>
            }
          </div>
        </div>

        <div class="border-t border-tinta/10 pt-5">
          <label class="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              [checked]="filtros().ofertas === true"
              (change)="aplicar({ ofertas: filtros().ofertas ? null : 1 })"
              class="h-4 w-4 rounded border-tinta/30 text-marca-600"
            />
            Solo productos en oferta
          </label>
        </div>
      </div>
    </ng-template>
  `,
})
export class CatalogoComponent {
  readonly catalogo = inject(CatalogoService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  readonly resultados = signal<PaginaProductos | null>(null);
  readonly marcas = signal<Marca[]>([]);
  readonly cargando = signal(true);
  readonly filtros = signal<FiltrosBusqueda>({});
  readonly panelFiltros = signal(false);

  readonly rangos = [
    { etiqueta: 'Hasta $50.000', min: null, max: 50_000 },
    { etiqueta: '$50.000 - $150.000', min: 50_000, max: 150_000 },
    { etiqueta: '$150.000 - $500.000', min: 150_000, max: 500_000 },
    { etiqueta: 'Más de $500.000', min: 500_000, max: null },
  ];

  readonly titulo = computed(() => {
    const filtros = this.filtros();
    if (filtros.q) {
      return `Resultados para “${filtros.q}”`;
    }
    if (filtros.categoria) {
      return this.nombreCategoria(filtros.categoria) ?? 'Catálogo';
    }
    if (filtros.ofertas) {
      return 'Ofertas';
    }
    if (filtros.destacados) {
      return 'Lo más vendido';
    }
    return 'Todo el catálogo';
  });

  readonly filtrosActivos = computed(() => {
    const filtros = this.filtros();
    let total = 0;
    if (filtros.categoria) total += 1;
    if (filtros.marca) total += 1;
    if (filtros.precio_min !== undefined || filtros.precio_max !== undefined) total += 1;
    if (filtros.ofertas) total += 1;
    return total;
  });

  readonly paginas = computed(() => {
    const pagina = this.resultados();
    if (!pagina) {
      return [];
    }
    const total = pagina.paginas;
    const actual = pagina.pagina;
    const inicio = Math.max(1, Math.min(actual - 2, total - 4));
    const fin = Math.min(total, inicio + 4);
    const numeros: number[] = [];
    for (let numero = inicio; numero <= fin; numero += 1) {
      numeros.push(numero);
    }
    return numeros;
  });

  constructor() {
    this.ruta.queryParamMap.pipe(takeUntilDestroyed()).subscribe((parametros) => {
      const filtros: FiltrosBusqueda = {
        q: parametros.get('q') ?? undefined,
        categoria: parametros.get('categoria') ?? undefined,
        marca: parametros.get('marca') ?? undefined,
        precio_min: this.numero(parametros.get('precio_min')),
        precio_max: this.numero(parametros.get('precio_max')),
        orden: parametros.get('orden') ?? 'relevancia',
        ofertas: parametros.get('ofertas') === '1',
        destacados: parametros.get('destacados') === '1',
        pagina: this.numero(parametros.get('pagina')) ?? 1,
        tamano: 12,
      };
      this.filtros.set(filtros);
      this.cargar(filtros);
      this.panelFiltros.set(false);
    });

    this.catalogo.marcas().subscribe({
      next: (marcas) => this.marcas.set(marcas),
      error: () => this.marcas.set([]),
    });
  }

  aplicar(cambios: Record<string, string | number | null | undefined>): void {
    const parametros: Record<string, string | number> = {
      ...(this.ruta.snapshot.queryParams as Record<string, string>),
    };
    for (const [clave, valor] of Object.entries(cambios)) {
      if (valor === null || valor === undefined || valor === '') {
        delete parametros[clave];
      } else {
        parametros[clave] = valor;
      }
    }
    delete parametros['pagina'];
    void this.router.navigate(['/catalogo'], { queryParams: parametros });
  }

  ordenar(valor: string): void {
    this.aplicar({ orden: valor === 'relevancia' ? null : valor });
  }

  irAPagina(pagina: number): void {
    void this.router.navigate(['/catalogo'], {
      queryParams: { ...this.ruta.snapshot.queryParams, pagina },
    });
  }

  limpiar(): void {
    void this.router.navigate(['/catalogo']);
  }

  estaEnHija(slugPadre: string): boolean {
    const categoria = this.catalogo
      .categorias()
      .find((raiz) => raiz.slug === slugPadre);
    if (!categoria) {
      return false;
    }
    return categoria.subcategorias.some((hija) => hija.slug === this.filtros().categoria);
  }

  private cargar(filtros: FiltrosBusqueda): void {
    this.cargando.set(true);
    this.catalogo.buscar(filtros).subscribe({
      next: (pagina) => {
        this.resultados.set(pagina);
        this.cargando.set(false);
      },
      error: () => {
        this.resultados.set(null);
        this.cargando.set(false);
      },
    });
  }

  private nombreCategoria(slug: string): string | null {
    for (const categoria of this.catalogo.categorias()) {
      if (categoria.slug === slug) {
        return categoria.nombre;
      }
      const hija = categoria.subcategorias.find((subcategoria) => subcategoria.slug === slug);
      if (hija) {
        return hija.nombre;
      }
    }
    return null;
  }

  private numero(valor: string | null): number | undefined {
    if (!valor) {
      return undefined;
    }
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : undefined;
  }
}
