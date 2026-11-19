import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Categoria,
  FiltrosBusqueda,
  Marca,
  PaginaProductos,
  Producto,
} from '../modelos';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/v1/catalogo';
  private readonly _categorias = signal<Categoria[]>([]);

  readonly categorias = this._categorias.asReadonly();

  cargarCategorias(): void {
    if (this._categorias().length > 0) {
      return;
    }
    this.http.get<Categoria[]>(`${this.url}/categorias`).subscribe({
      next: (categorias) => this._categorias.set(categorias),
      error: () => this._categorias.set([]),
    });
  }

  buscar(filtros: FiltrosBusqueda): Observable<PaginaProductos> {
    let params = new HttpParams();
    const agregar = (clave: string, valor: string | number | boolean | undefined): void => {
      if (valor !== undefined && valor !== null && valor !== '') {
        params = params.set(clave, String(valor));
      }
    };

    agregar('q', filtros.q);
    agregar('categoria', filtros.categoria);
    agregar('marca', filtros.marca);
    agregar('precio_min', filtros.precio_min);
    agregar('precio_max', filtros.precio_max);
    agregar('orden', filtros.orden);
    if (filtros.ofertas) {
      params = params.set('ofertas', 'true');
    }
    if (filtros.destacados) {
      params = params.set('destacados', 'true');
    }
    agregar('pagina', filtros.pagina);
    agregar('tamano', filtros.tamano);

    return this.http.get<PaginaProductos>(`${this.url}/productos`, { params });
  }

  obtener(slug: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/productos/${slug}`);
  }

  relacionados(slug: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}/productos/${slug}/relacionados`);
  }

  marcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.url}/marcas`);
  }
}
