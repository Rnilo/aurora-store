import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NotificacionService } from '../../core/services/notificacion.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <footer class="mt-16 bg-tinta text-white">
      <div class="contenedor grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div class="lg:col-span-2">
          <p class="text-3xl font-black tracking-tight">
            aurora<span class="text-lima">.</span>
          </p>
          <p class="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
            Tecnología, hogar, moda y mucho más. Despachamos a todo Chile y tenemos retiro
            en tienda para que compres como quieras.
          </p>

          <form (ngSubmit)="suscribir()" class="mt-6 flex max-w-sm gap-2">
            <input
              type="email"
              name="correo"
              [(ngModel)]="correo"
              required
              class="w-full rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40"
              placeholder="Tu correo para novedades"
              aria-label="Correo para novedades"
            />
            <button type="submit" class="btn-lima shrink-0 !px-5 !py-2.5">Suscribirme</button>
          </form>

          <div class="mt-6 flex gap-3 text-xs text-white/50">
            <span class="rounded-full border border-white/15 px-3 py-1">Instagram</span>
            <span class="rounded-full border border-white/15 px-3 py-1">TikTok</span>
            <span class="rounded-full border border-white/15 px-3 py-1">YouTube</span>
          </div>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-lima">Ayuda</p>
          <ul class="mt-4 space-y-2 text-sm text-white/60">
            <li><a routerLink="/catalogo" class="hover:text-white">Centro de ayuda</a></li>
            <li><a routerLink="/mis-pedidos" class="hover:text-white">Seguimiento de pedidos</a></li>
            <li><a routerLink="/catalogo" class="hover:text-white">Cambios y devoluciones</a></li>
            <li><a routerLink="/catalogo" class="hover:text-white">Medios de pago</a></li>
          </ul>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-lima">Categorías</p>
          <ul class="mt-4 space-y-2 text-sm text-white/60">
            <li><a routerLink="/catalogo" [queryParams]="{ categoria: 'tecnologia' }" class="hover:text-white">Tecnología</a></li>
            <li><a routerLink="/catalogo" [queryParams]="{ categoria: 'electrohogar' }" class="hover:text-white">Electrohogar</a></li>
            <li><a routerLink="/catalogo" [queryParams]="{ categoria: 'moda' }" class="hover:text-white">Moda</a></li>
            <li><a routerLink="/catalogo" [queryParams]="{ categoria: 'hogar' }" class="hover:text-white">Hogar y muebles</a></li>
            <li><a routerLink="/catalogo" [queryParams]="{ categoria: 'juguetes' }" class="hover:text-white">Juguetes</a></li>
          </ul>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-lima">Aurora</p>
          <ul class="mt-4 space-y-2 text-sm text-white/60">
            <li><a routerLink="/catalogo" class="hover:text-white">Sobre nosotros</a></li>
            <li><a routerLink="/catalogo" class="hover:text-white">Trabaja con nosotros</a></li>
            <li><a routerLink="/catalogo" class="hover:text-white">Vende en Aurora</a></li>
            <li><a routerLink="/catalogo" class="hover:text-white">Términos y privacidad</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10">
        <div
          class="contenedor flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/40 sm:flex-row"
        >
          <p>© 2026 Aurora Store. Demo construida con Angular, FastAPI y PostgreSQL.</p>
          <p class="flex items-center gap-2">
            <span class="rounded border border-white/15 px-2 py-1">Webpay</span>
            <span class="rounded border border-white/15 px-2 py-1">Mercado Pago</span>
            <span class="rounded border border-white/15 px-2 py-1">Transferencia</span>
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  private readonly avisos = inject(NotificacionService);
  readonly correo = signal('');

  suscribir(): void {
    const correo = this.correo().trim();
    if (!correo) {
      return;
    }
    this.avisos.mostrar('¡Gracias! Te enviaremos nuestras mejores ofertas.');
    this.correo.set('');
  }
}
