import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-encontrado',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="contenedor flex flex-col items-center py-24 text-center">
      <p class="text-7xl font-black tracking-tight text-marca-600">404</p>
      <h1 class="mt-3 text-2xl font-extrabold">Esta página no existe</h1>
      <p class="mt-2 max-w-md text-sm text-tinta/50">
        Puede que el enlace esté mal escrito o que el producto ya no esté disponible.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <a routerLink="/" class="btn-primario">Volver al inicio</a>
        <a routerLink="/catalogo" class="btn-claro">Ver catálogo</a>
      </div>
    </div>
  `,
})
export class NoEncontradoComponent {}
