import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Cotizacion, DireccionEntrada, ItemPedidoEntrada, Pedido } from '../modelos';

export interface DatosPedido {
  items: ItemPedidoEntrada[];
  tipo_entrega: 'despacho' | 'retiro';
  direccion_id?: number | null;
  direccion?: DireccionEntrada | null;
  cupon_codigo?: string | null;
}

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/v1/pedidos';

  cotizar(datos: {
    items: ItemPedidoEntrada[];
    tipo_entrega: 'despacho' | 'retiro';
    cupon_codigo?: string | null;
  }): Observable<Cotizacion> {
    return this.http.post<Cotizacion>(`${this.url}/cotizar`, datos);
  }

  crear(datos: DatosPedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.url, datos);
  }

  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.url);
  }

  obtener(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.url}/${id}`);
  }
}
