import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AutenticacionService } from './core/services/autenticacion.service';
import { CatalogoService } from './core/services/catalogo.service';
import { AvisoComponent } from './shared/components/aviso.component';
import { CarritoDrawerComponent } from './shared/components/carrito-drawer.component';
import { FooterComponent } from './shared/components/footer.component';
import { HeaderComponent } from './shared/components/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CarritoDrawerComponent, AvisoComponent],
  template: `
    <app-header />
    <main class="min-h-[60vh]">
      <router-outlet />
    </main>
    <app-footer />
    <app-carrito-drawer />
    <app-aviso />
  `,
})
export class AppComponent {
  private readonly catalogo = inject(CatalogoService);
  private readonly autenticacion = inject(AutenticacionService);

  constructor() {
    this.catalogo.cargarCategorias();
    this.autenticacion.cargarPerfil();
  }
}
