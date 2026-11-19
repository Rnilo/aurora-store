import { Injectable, signal } from '@angular/core';

export type TipoAviso = 'exito' | 'error' | 'info';

interface Aviso {
  texto: string;
  tipo: TipoAviso;
}

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private readonly _aviso = signal<Aviso | null>(null);
  private temporizador: ReturnType<typeof setTimeout> | null = null;

  readonly aviso = this._aviso.asReadonly();

  mostrar(texto: string, tipo: TipoAviso = 'exito'): void {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }
    this._aviso.set({ texto, tipo });
    this.temporizador = setTimeout(() => this._aviso.set(null), 3200);
  }

  cerrar(): void {
    this._aviso.set(null);
  }
}
