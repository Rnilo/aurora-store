import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { Producto } from '../../core/modelos';
import { CatalogoService } from '../../core/services/catalogo.service';
import { SeccionProductosComponent } from '../../shared/components/seccion-productos.component';

interface Diapositiva {
  etiqueta: string;
  titulo: string;
  resaltado: string;
  texto: string;
  boton: string;
  categoria: string;
  fondo: string;
  imagenes: string[];
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, SeccionProductosComponent],
  template: `
    <!-- Accesos rapidos -->
    <div class="contenedor mt-5 flex gap-5 overflow-x-auto pb-2 sin-barra sm:justify-center sm:gap-10">
      @for (acceso of accesos; track acceso.nombre) {
        <a
          [routerLink]="['/catalogo']"
          [queryParams]="acceso.parametros"
          class="flex w-20 shrink-0 flex-col items-center gap-2 text-center sm:w-24"
        >
          <span
            class="grid h-16 w-16 place-items-center rounded-full bg-marca-700 text-2xl text-white shadow-sm transition hover:scale-105 hover:bg-marca-600"
            >{{ acceso.icono }}</span
          >
          <span class="text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-tinta/70">{{
            acceso.nombre
          }}</span>
        </a>
      }
    </div>

    <!-- Hero -->
    <section class="contenedor mt-3">
      <div class="relative overflow-hidden rounded-3xl bg-tinta text-white">
        <div class="absolute inset-0 bg-gradient-to-br" [class]="diapositiva().fondo"></div>
        <div class="absolute -left-24 top-10 h-64 w-64 rounded-full bg-lima/20 blur-3xl"></div>
        <div class="absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

        <div class="relative grid items-center gap-6 p-7 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:p-12">
          <div class="max-w-xl">
            <p class="etiqueta text-lima">{{ diapositiva().etiqueta }}</p>
            <h1 class="mt-2 text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              {{ diapositiva().titulo }}
              <span class="block text-lima">{{ diapositiva().resaltado }}</span>
            </h1>
            <p class="mt-4 max-w-md text-sm text-white/70 sm:text-base">{{ diapositiva().texto }}</p>
            <a
              [routerLink]="['/catalogo']"
              [queryParams]="{ categoria: diapositiva().categoria }"
              class="btn-lima mt-6"
              >{{ diapositiva().boton }}</a
            >
          </div>

          <div class="relative hidden h-64 lg:block xl:h-80">
            @for (imagen of diapositiva().imagenes; track imagen; let i = $index) {
              <img
                [src]="imagen"
                alt=""
                class="absolute rounded-2xl shadow-2xl ring-1 ring-white/20 transition"
                [class]="
                  i === 0
                    ? 'left-4 top-2 h-52 w-52 -rotate-6 object-cover xl:h-64 xl:w-64'
                    : 'right-2 bottom-0 h-44 w-44 rotate-6 object-cover xl:h-56 xl:w-56'
                "
              />
            }
          </div>
        </div>

        <div class="relative flex items-center justify-between px-7 pb-5 sm:px-10 lg:px-12">
          <div class="flex gap-1.5">
            @for (punto of diapositivas; track $index; let i = $index) {
              <button
                type="button"
                (click)="indice.set(i)"
                class="h-2 rounded-full transition-all"
                [class]="i === indice() ? 'w-6 bg-lima' : 'w-2 bg-white/40'"
                [attr.aria-label]="'Ir a la diapositiva ' + (i + 1)"
              ></button>
            }
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              (click)="anterior()"
              class="grid h-9 w-9 place-items-center rounded-full border border-white/30 text-sm hover:bg-white/10"
              aria-label="Anterior"
            >
              ←
            </button>
            <button
              type="button"
              (click)="siguiente()"
              class="grid h-9 w-9 place-items-center rounded-full border border-white/30 text-sm hover:bg-white/10"
              aria-label="Siguiente"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Beneficios -->
    <section class="contenedor mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      @for (beneficio of beneficios; track beneficio.titulo) {
        <div class="flex items-start gap-3 rounded-2xl border border-tinta/10 p-4">
          <span class="text-xl">{{ beneficio.icono }}</span>
          <div>
            <p class="text-sm font-semibold">{{ beneficio.titulo }}</p>
            <p class="text-xs text-tinta/50">{{ beneficio.detalle }}</p>
          </div>
        </div>
      }
    </section>

    <!-- Busca por mundos -->
    <section class="contenedor mt-14">
      <div class="flex items-end justify-between">
        <div>
          <p class="etiqueta text-marca-700">Inspiración</p>
          <h2 class="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Busca por mundos</h2>
        </div>
        <a routerLink="/catalogo" class="text-sm font-semibold text-marca-700 hover:underline"
          >Ver catálogo completo →</a
        >
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        @for (mundo of mundos; track mundo.categoria) {
          <a
            [routerLink]="['/catalogo']"
            [queryParams]="{ categoria: mundo.categoria }"
            class="group relative flex h-40 flex-col justify-end overflow-hidden rounded-2xl p-5 text-white"
            [class]="'bg-gradient-to-br ' + mundo.fondo"
          >
            <span class="absolute right-3 top-3 text-4xl opacity-70 transition group-hover:scale-110">{{
              mundo.icono
            }}</span>
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
              {{ mundo.etiqueta }}
            </p>
            <p class="text-lg font-bold leading-tight">{{ mundo.titulo }}</p>
            <span class="mt-2 text-xs font-semibold text-white/80 group-hover:text-white">Explorar →</span>
          </a>
        }
      </div>
    </section>

    <app-seccion-productos
      etiqueta="Ofertas del día"
      titulo="Precios que no duran"
      subtitulo="Descuentos reales en productos seleccionados."
      enlace="/catalogo"
      [parametros]="{ ofertas: 1 }"
      [productos]="ofertas()"
      [cargando]="cargando()"
    />

    <!-- Banners -->
    <section class="contenedor mt-14 grid gap-3 lg:grid-cols-2">
      <a
        routerLink="/catalogo"
        [queryParams]="{ categoria: 'tecnologia' }"
        class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white"
      >
        <p class="etiqueta text-lima">Aurora Tech</p>
        <h3 class="mt-2 max-w-sm text-2xl font-extrabold leading-tight sm:text-3xl">
          Hasta 40% en computación y audio
        </h3>
        <p class="mt-2 max-w-sm text-sm text-white/60">
          Notebooks, audífonos con cancelación de ruido y monitores para tu setup.
        </p>
        <span class="btn-lima mt-5">Ver tecnología</span>
        <span class="absolute -right-6 -top-6 text-[9rem] opacity-20">💻</span>
      </a>

      <a
        routerLink="/catalogo"
        [queryParams]="{ categoria: 'hogar' }"
        class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-100 to-orange-200 p-8 text-tinta"
      >
        <p class="etiqueta text-orange-800">Hogar</p>
        <h3 class="mt-2 max-w-sm text-2xl font-extrabold leading-tight sm:text-3xl">
          Renueva tu living con estilo
        </h3>
        <p class="mt-2 max-w-sm text-sm text-tinta/60">
          Muebles, iluminación y textiles para sentirte en casa.
        </p>
        <span class="btn-primario mt-5">Ver hogar</span>
        <span class="absolute -right-6 -top-6 text-[9rem] opacity-30">🛋️</span>
      </a>
    </section>

    <app-seccion-productos
      etiqueta="Lo más vendido"
      titulo="Los favoritos de la comunidad"
      subtitulo="Productos con las mejores calificaciones y más reseñas."
      enlace="/catalogo"
      [parametros]="{ destacados: 1 }"
      [productos]="destacados()"
      [cargando]="cargando()"
    />

    <section class="contenedor mt-14">
      <div class="overflow-hidden rounded-3xl bg-marca-800 p-8 text-white sm:p-10">
        <div class="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p class="etiqueta text-lima">Aurora Plus</p>
            <h2 class="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Envíos gratis desde $49.990 y retiro en tienda sin costo
            </h2>
            <p class="mt-2 max-w-xl text-sm text-white/70">
              Compra en todas las categorías y elige despacho a domicilio o retiro en cualquiera
              de nuestras tiendas. Sin letra chica.
            </p>
            <a routerLink="/catalogo" class="btn-lima mt-5">Empezar a comprar</a>
          </div>
          <div class="grid grid-cols-2 gap-3 text-center">
            <div class="rounded-2xl bg-white/10 p-4">
              <p class="text-2xl">🚚</p>
              <p class="mt-1 text-xs font-semibold">Despacho 24-48 h</p>
            </div>
            <div class="rounded-2xl bg-white/10 p-4">
              <p class="text-2xl">🏬</p>
              <p class="mt-1 text-xs font-semibold">Retiro en tienda</p>
            </div>
            <div class="rounded-2xl bg-white/10 p-4">
              <p class="text-2xl">🔄</p>
              <p class="mt-1 text-xs font-semibold">30 días de cambios</p>
            </div>
            <div class="rounded-2xl bg-white/10 p-4">
              <p class="text-2xl">🔒</p>
              <p class="mt-1 text-xs font-semibold">Pago seguro</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <app-seccion-productos
      etiqueta="Recién llegados"
      titulo="Novedades de la semana"
      subtitulo="Lo último que sumamos al catálogo."
      enlace="/catalogo"
      [parametros]="{ orden: 'novedad' }"
      [productos]="novedades()"
      [cargando]="cargando()"
    />
  `,
})
export class InicioComponent {
  private readonly catalogo = inject(CatalogoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly ofertas = signal<Producto[]>([]);
  readonly destacados = signal<Producto[]>([]);
  readonly novedades = signal<Producto[]>([]);
  readonly cargando = signal(true);
  readonly indice = signal(0);

  readonly diapositivas: Diapositiva[] = [
    {
      etiqueta: 'Ciber semana Aurora',
      titulo: 'Top 100',
      resaltado: 'tecnología 30% dcto.',
      texto: 'Notebooks, smartphones y audio con descuentos reales. Hasta agotar stock.',
      boton: 'Ir a tecnología',
      categoria: 'tecnologia',
      fondo: 'from-marca-900 via-marca-800 to-marca-600',
      imagenes: ['/img/productos/notebook-vertex-air-14.svg', '/img/productos/audifonos-lumen-air-anc.svg'],
    },
    {
      etiqueta: 'Semana del hogar',
      titulo: 'Tu casa',
      resaltado: 'hasta 40% menos',
      texto: 'Electrodomésticos, muebles y cocina para renovar cada rincón.',
      boton: 'Ver hogar',
      categoria: 'hogar',
      fondo: 'from-amber-900 via-orange-800 to-amber-600',
      imagenes: ['/img/productos/air-fryer-mistral-55l.svg', '/img/productos/sillon-aurora-oslo.svg'],
    },
    {
      etiqueta: 'Nueva temporada',
      titulo: 'Moda que',
      resaltado: 'se siente bien',
      texto: 'Prendas y calzado seleccionados para todos los días.',
      boton: 'Ir a moda',
      categoria: 'moda',
      fondo: 'from-rose-950 via-rose-800 to-pink-600',
      imagenes: ['/img/productos/vestido-midi-kaia.svg', '/img/productos/zapatillas-vertex-run.svg'],
    },
  ];

  readonly diapositiva = computed(() => this.diapositivas[this.indice()]);

  readonly accesos = [
    { nombre: 'Ofertas', icono: '🔥', parametros: { ofertas: 1 } },
    { nombre: 'Novedades', icono: '✨', parametros: { orden: 'novedad' } },
    { nombre: 'Tecnología', icono: '💻', parametros: { categoria: 'tecnologia' } },
    { nombre: 'Hogar', icono: '🛋️', parametros: { categoria: 'hogar' } },
    { nombre: 'Moda', icono: '👗', parametros: { categoria: 'moda' } },
    { nombre: 'Juguetes', icono: '🧸', parametros: { categoria: 'juguetes' } },
  ];

  readonly beneficios = [
    { icono: '🚚', titulo: 'Despacho a todo Chile', detalle: 'Gratis desde $49.990' },
    { icono: '🏬', titulo: 'Retiro en tienda', detalle: 'Sin costo, en 2 horas' },
    { icono: '🔄', titulo: 'Cambios fáciles', detalle: 'Hasta 30 días' },
    { icono: '🔒', titulo: 'Compra protegida', detalle: 'Pago encriptado' },
  ];

  readonly mundos = [
    {
      categoria: 'tecnologia',
      etiqueta: 'Mundo tech',
      titulo: 'Tu setup ideal',
      icono: '💻',
      fondo: 'from-slate-900 to-blue-800',
    },
    {
      categoria: 'hogar',
      etiqueta: 'Mundo hogar',
      titulo: 'Casa y deco',
      icono: '🛋️',
      fondo: 'from-amber-800 to-orange-600',
    },
    {
      categoria: 'moda',
      etiqueta: 'Mundo moda',
      titulo: 'Estilo diario',
      icono: '👗',
      fondo: 'from-rose-900 to-pink-600',
    },
    {
      categoria: 'belleza',
      etiqueta: 'Mundo belleza',
      titulo: 'Tu ritual',
      icono: '💄',
      fondo: 'from-fuchsia-900 to-purple-600',
    },
    {
      categoria: 'deportes',
      etiqueta: 'Mundo outdoor',
      titulo: 'Movimiento',
      icono: '🏃',
      fondo: 'from-emerald-900 to-lime-600',
    },
  ];

  constructor() {
    forkJoin({
      ofertas: this.catalogo
        .buscar({ ofertas: true, orden: 'descuento', tamano: 10 })
        .pipe(catchError(() => of(null))),
      destacados: this.catalogo
        .buscar({ destacados: true, tamano: 10 })
        .pipe(catchError(() => of(null))),
      novedades: this.catalogo
        .buscar({ orden: 'novedad', tamano: 10 })
        .pipe(catchError(() => of(null))),
    }).subscribe(({ ofertas, destacados, novedades }) => {
      this.ofertas.set(ofertas?.items ?? []);
      this.destacados.set(destacados?.items ?? []);
      this.novedades.set(novedades?.items ?? []);
      this.cargando.set(false);
    });

    const intervalo = setInterval(() => this.siguiente(), 6500);
    this.destroyRef.onDestroy(() => clearInterval(intervalo));
  }

  siguiente(): void {
    this.indice.set((this.indice() + 1) % this.diapositivas.length);
  }

  anterior(): void {
    this.indice.set(
      (this.indice() - 1 + this.diapositivas.length) % this.diapositivas.length,
    );
  }
}
