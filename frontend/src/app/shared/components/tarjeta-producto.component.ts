import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Producto } from '../../core/modelos';
import { CarritoService } from '../../core/services/carrito.service';
import { FavoritosService } from '../../core/services/favoritos.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { formatearPrecio } from '../utils/formato';
import { EstrellasComponent } from './estrellas.component';

@Component({
  selector: 'app-tarjeta-producto',
  standalone: true,
  imports: [RouterLink, EstrellasComponent],
  template: `
    <article
      class="group relative flex h-full flex-col rounded-2xl border border-tinta/10 bg-white p-3 transition duration-300 hover:-translate-y-0.5 hover:border-tinta/20 hover:shadow-tarjeta"
    >
      <div class="relative overflow-hidden rounded-xl bg-crema">
        <a [routerLink]="['/producto', producto().slug]" [attr.aria-label]="producto().nombre">
          <img
            [src]="producto().imagen_url"
            [alt]="producto().nombre"
            loading="lazy"
            class="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </a>

        @if (producto().porcentaje_descuento > 0) {
          <span
            class="absolute left-2 top-2 rounded-full bg-coral px-2.5 py-1 text-[11px] font-bold text-white"
            >-{{ producto().porcentaje_descuento }}%</span
          >
        }

        <button
          type="button"
          (click)="favoritos.alternar(producto())"
          class="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-tinta shadow-sm transition hover:scale-105"
          [attr.aria-label]="
            favoritos.esFavorito(producto().id) ? 'Quitar de favoritos' : 'Agregar a favoritos'
          "
        >
          <svg
            viewBox="0 0 24 24"
            class="h-4 w-4 transition"
            [class.fill-coral]="favoritos.esFavorito(producto().id)"
            [class.text-coral]="favoritos.esFavorito(producto().id)"
            [class.text-tinta]="!favoritos.esFavorito(producto().id)"
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

      <div class="mt-3 flex flex-1 flex-col">
        <p class="etiqueta text-tinta/40">
          {{ producto().marca?.nombre ?? producto().categoria.nombre }}
        </p>
        <a
          [routerLink]="['/producto', producto().slug]"
          class="linea-2 mt-1 text-sm font-medium leading-snug text-tinta hover:underline"
          >{{ producto().nombre }}</a
        >

        <app-estrellas
          class="mt-2"
          [valor]="producto().calificacion"
          [resenas]="producto().resenas"
        />

        <div class="mt-auto pt-3">
          @if (producto().precio_oferta) {
            <p class="text-xs text-tinta/40 line-through">
              {{ formatear(producto().precio) }}
            </p>
          }
          <p class="text-lg font-bold tracking-tight text-tinta">
            {{ formatear(producto().precio_efectivo) }}
          </p>
          @if (producto().envio_gratis) {
            <p class="mt-1 text-[11px] font-semibold text-marca-700">Envío gratis</p>
          }
        </div>

        <button
          type="button"
          (click)="agregar()"
          [disabled]="producto().stock === 0"
          class="mt-3 w-full rounded-full bg-tinta py-2.5 text-xs font-semibold text-white transition hover:bg-marca-700 disabled:cursor-not-allowed disabled:bg-tinta/30"
        >
          {{ producto().stock === 0 ? 'Sin stock' : 'Agregar al carrito' }}
        </button>
      </div>
    </article>
  `,
})
export class TarjetaProductoComponent {
  readonly producto = input.required<Producto>();
  readonly carrito = inject(CarritoService);
  readonly favoritos = inject(FavoritosService);
  private readonly avisos = inject(NotificacionService);

  protected readonly formatear = formatearPrecio;

  agregar(): void {
    this.carrito.agregar(this.producto());
    this.avisos.mostrar(`"${this.producto().nombre}" se agregó al carrito.`);
  }
}
