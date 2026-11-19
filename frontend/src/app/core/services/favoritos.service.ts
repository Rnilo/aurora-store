import { Injectable, computed, signal } from '@angular/core';

import { Producto } from '../modelos';

const CLAVE = 'aurora-favoritos';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly _productos = signal<Producto[]>(this.leer());

  readonly productos = this._productos.asReadonly();
  readonly cantidad = computed(() => this._productos().length);

  esFavorito(productoId: number): boolean {
    return this._productos().some((producto) => producto.id === productoId);
  }

  alternar(producto: Producto): void {
    if (this.esFavorito(producto.id)) {
      this._productos.set(this._productos().filter((item) => item.id !== producto.id));
    } else {
      this._productos.set([producto, ...this._productos()]);
    }
    this.persistir();
  }

  quitar(productoId: number): void {
    this._productos.set(this._productos().filter((producto) => producto.id !== productoId));
    this.persistir();
  }

  private persistir(): void {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(this._productos()));
    } catch {
      // Sin almacenamiento disponible.
    }
  }

  private leer(): Producto[] {
    try {
      const crudo = localStorage.getItem(CLAVE);
      const datos = crudo ? (JSON.parse(crudo) as Producto[]) : [];
      return Array.isArray(datos) ? datos : [];
    } catch {
      return [];
    }
  }
}
