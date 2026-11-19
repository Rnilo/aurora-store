import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AutenticacionService } from '../../core/services/autenticacion.service';
import { CarritoService } from '../../core/services/carrito.service';
import { CatalogoService } from '../../core/services/catalogo.service';
import { FavoritosService } from '../../core/services/favoritos.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { MegaMenuComponent } from './mega-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FormsModule, MegaMenuComponent],
  template: `
    <div class="hidden bg-tinta text-white md:block">
      <div class="contenedor flex h-8 items-center justify-between text-[11px]">
        <p class="flex items-center gap-2 text-white/70">
          <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          Despacho a todo Chile · Retiro en tienda
        </p>
        <nav class="flex items-center gap-5 text-white/70">
          <a routerLink="/catalogo" class="hover:text-white">Venta Empresas</a>
          <a routerLink="/catalogo" class="hover:text-white">Vende en Aurora</a>
          <a routerLink="/mis-pedidos" class="hover:text-white">Mis pedidos</a>
          <a routerLink="/catalogo" class="hover:text-white">Ayuda</a>
        </nav>
      </div>
    </div>

    <header class="sticky top-0 z-40 border-b border-tinta/10 bg-white/95 backdrop-blur">
      <div class="contenedor flex h-20 items-center gap-3 sm:gap-5">
        <button
          type="button"
          class="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-crema lg:hidden"
          (click)="menuAbierto.set(true)"
          aria-label="Abrir menú"
        >
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <a routerLink="/" class="shrink-0" aria-label="Aurora Store, ir al inicio">
          <span class="text-3xl font-black tracking-tight text-marca-600">aurora</span>
          <span class="text-3xl font-black tracking-tight text-lima">.</span>
          <span class="ml-1 hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-tinta/40 sm:inline"
            >store</span
          >
        </a>

        <form (ngSubmit)="buscar()" class="hidden flex-1 items-center md:flex" role="search">
          <div class="relative w-full max-w-2xl">
            <input
              type="search"
              name="q"
              [(ngModel)]="texto"
              class="w-full rounded-full border border-tinta/25 bg-white py-3 pl-5 pr-14 text-sm placeholder:text-tinta/40 focus:border-tinta"
              placeholder="Buscar en aurora.com"
              aria-label="Buscar productos"
            />
            <button
              type="submit"
              class="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-tinta text-white transition hover:bg-marca-700"
              aria-label="Buscar"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </div>
        </form>

        <div class="ml-auto flex items-center gap-1 sm:gap-3">
          <div class="relative hidden sm:block">
            @if (autenticacion.autenticado()) {
              <button
                type="button"
                (click)="menuCuenta.set(!menuCuenta())"
                class="flex items-center gap-2 rounded-full px-2 py-1.5 text-left hover:bg-crema"
              >
                <span class="grid h-9 w-9 place-items-center rounded-full bg-marca-600 text-sm font-bold text-white">
                  {{ autenticacion.inicial() }}
                </span>
                <span class="hidden text-xs leading-tight lg:block">
                  <span class="block text-tinta/50">Hola, {{ autenticacion.usuario()?.nombre?.split(' ')?.[0] }}</span>
                  <span class="block font-semibold">Mi cuenta</span>
                </span>
              </button>
            } @else {
              <a
                routerLink="/login"
                class="flex items-center gap-2 rounded-full px-2 py-1.5 text-left hover:bg-crema"
              >
                <span class="grid h-9 w-9 place-items-center rounded-full bg-crema text-tinta">
                  <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 20a7 7 0 0 1 14 0" />
                  </svg>
                </span>
                <span class="hidden text-xs leading-tight lg:block">
                  <span class="block text-tinta/50">Hola,</span>
                  <span class="block font-semibold">Inicia sesión</span>
                </span>
              </a>
            }

            @if (menuCuenta()) {
              <div class="absolute right-0 top-full mt-2 w-56 animate-aparecer rounded-2xl border border-tinta/10 bg-white p-2 shadow-flotante">
                <p class="px-3 py-2 text-xs text-tinta/50">{{ autenticacion.usuario()?.correo }}</p>
                <a routerLink="/mis-pedidos" (click)="menuCuenta.set(false)" class="block rounded-xl px-3 py-2 text-sm hover:bg-crema">
                  Mis pedidos
                </a>
                <a routerLink="/favoritos" (click)="menuCuenta.set(false)" class="block rounded-xl px-3 py-2 text-sm hover:bg-crema">
                  Mis favoritos
                </a>
                <button
                  type="button"
                  (click)="salir()"
                  class="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-coral hover:bg-coral/5"
                >
                  Cerrar sesión
                </button>
              </div>
            }
          </div>

          <a
            routerLink="/favoritos"
            class="relative grid h-10 w-10 place-items-center rounded-full hover:bg-crema"
            aria-label="Mis favoritos"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.7-7.8 1.1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            @if (favoritos.cantidad() > 0) {
              <span class="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
                {{ favoritos.cantidad() }}
              </span>
            }
          </a>

          <button
            type="button"
            (click)="carrito.abrirPanel()"
            class="relative grid h-10 w-10 place-items-center rounded-full hover:bg-crema"
            aria-label="Abrir carrito"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6" />
              <circle cx="10" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
            </svg>
            @if (carrito.cantidadTotal() > 0) {
              <span class="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-lima px-1 text-[10px] font-bold text-tinta">
                {{ carrito.cantidadTotal() }}
              </span>
            }
          </button>
        </div>
      </div>

      <form (ngSubmit)="buscar()" class="contenedor pb-3 md:hidden" role="search">
        <div class="relative">
          <input
            type="search"
            name="qMovil"
            [(ngModel)]="texto"
            class="w-full rounded-full border border-tinta/20 py-2.5 pl-4 pr-12 text-sm"
            placeholder="Buscar en aurora.com"
            aria-label="Buscar productos"
          />
          <button type="submit" class="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-tinta text-white" aria-label="Buscar">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </div>
      </form>

      <div class="hidden border-t border-tinta/10 lg:block">
        <div class="contenedor flex h-12 items-center gap-6 text-sm">
          <button
            type="button"
            (click)="menuAbierto.set(true)"
            class="flex items-center gap-2 font-semibold hover:text-marca-700"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            Menú
          </button>
          <span class="h-5 w-px bg-tinta/10"></span>
          <a routerLink="/catalogo" [queryParams]="{ ofertas: 1 }" class="font-semibold text-coral">Ofertas</a>
          @for (categoria of catalogo.categorias(); track categoria.id) {
            <a
              [routerLink]="['/catalogo']"
              [queryParams]="{ categoria: categoria.slug }"
              class="text-tinta/70 transition hover:text-tinta"
              >{{ categoria.nombre }}</a
            >
          }
          <a routerLink="/catalogo" class="ml-auto text-xs font-semibold text-marca-700">Vende en Aurora →</a>
        </div>
      </div>
    </header>

    <app-mega-menu [abierto]="menuAbierto()" (cerrar)="menuAbierto.set(false)" />
  `,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly avisos = inject(NotificacionService);
  readonly catalogo = inject(CatalogoService);
  readonly carrito = inject(CarritoService);
  readonly favoritos = inject(FavoritosService);
  readonly autenticacion = inject(AutenticacionService);

  readonly texto = signal('');
  readonly menuAbierto = signal(false);
  readonly menuCuenta = signal(false);

  @HostListener('document:keydown.escape')
  cerrarPaneles(): void {
    this.menuAbierto.set(false);
    this.menuCuenta.set(false);
  }

  buscar(): void {
    const termino = this.texto().trim();
    void this.router.navigate(['/catalogo'], { queryParams: termino ? { q: termino } : {} });
    this.menuAbierto.set(false);
  }

  salir(): void {
    this.autenticacion.cerrarSesion();
    this.menuCuenta.set(false);
    this.avisos.mostrar('Sesión cerrada.', 'info');
  }
}
