import { Injectable, computed, signal } from '@angular/core';

import { ItemCarrito, Producto } from '../modelos';

const CLAVE = 'aurora-carrito';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly _items = signal<ItemCarrito[]>(this.leer());
  private readonly _panelAbierto = signal(false);

  readonly items = this._items.asReadonly();
  readonly panelAbierto = this._panelAbierto.asReadonly();

  readonly cantidadTotal = computed(() =>
    this._items().reduce((total, item) => total + item.cantidad, 0),
  );

  readonly subtotal = computed(() =>
    this._items().reduce(
      (total, item) => total + item.producto.precio_efectivo * item.cantidad,
      0,
    ),
  );

  readonly ahorro = computed(() =>
    this._items().reduce((total, item) => {
      const descuento = (item.producto.precio - item.producto.precio_efectivo) * item.cantidad;
      return total + Math.max(descuento, 0);
    }, 0),
  );

  agregar(producto: Producto, cantidad = 1): void {
    const existente = this._items().find((item) => item.producto.id === producto.id);
    if (existente) {
      this.cambiarCantidad(producto.id, existente.cantidad + cantidad);
      return;
    }
    this._items.set([...this._items(), { producto, cantidad: Math.max(1, cantidad) }]);
    this.persistir();
  }

  cambiarCantidad(productoId: number, cantidad: number): void {
    const limite = Math.max(1, Math.min(cantidad, 20));
    this._items.set(
      this._items().map((item) =>
        item.producto.id === productoId ? { ...item, cantidad: limite } : item,
      ),
    );
    this.persistir();
  }

  quitar(productoId: number): void {
    this._items.set(this._items().filter((item) => item.producto.id !== productoId));
    this.persistir();
  }

  vaciar(): void {
    this._items.set([]);
    this.persistir();
  }

  abrirPanel(): void {
    this._panelAbierto.set(true);
  }

  cerrarPanel(): void {
    this._panelAbierto.set(false);
  }

  private persistir(): void {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(this._items()));
    } catch {
      // Sin almacenamiento disponible: el carrito vive solo en memoria.
    }
  }

  private leer(): ItemCarrito[] {
    try {
      const crudo = localStorage.getItem(CLAVE);
      const datos = crudo ? (JSON.parse(crudo) as ItemCarrito[]) : [];
      return Array.isArray(datos) ? datos : [];
    } catch {
      return [];
    }
  }
}
