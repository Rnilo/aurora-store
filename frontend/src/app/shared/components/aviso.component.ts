import { Component, inject } from '@angular/core';

import { NotificacionService } from '../../core/services/notificacion.service';

@Component({
  selector: 'app-aviso',
  standalone: true,
  template: `
    @if (notificacion.aviso(); as aviso) {
      <div class="pointer-events-none fixed bottom-6 left-1/2 z-[60] w-full max-w-sm -translate-x-1/2 px-4">
        <div
          class="pointer-events-auto flex animate-aparecer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-flotante"
          [class.bg-tinta]="aviso.tipo !== 'error'"
          [class.text-white]="aviso.tipo !== 'error'"
          [class.bg-coral]="aviso.tipo === 'error'"
          [class.text-white]="aviso.tipo === 'error'"
          role="status"
        >
          <span class="text-base">
            {{ aviso.tipo === 'error' ? '⚠️' : aviso.tipo === 'info' ? 'ℹ️' : '✅' }}
          </span>
          <p class="flex-1">{{ aviso.texto }}</p>
          <button
            type="button"
            class="text-xs opacity-60 hover:opacity-100"
            (click)="notificacion.cerrar()"
            aria-label="Cerrar aviso"
          >
            ✕
          </button>
        </div>
      </div>
    }
  `,
})
export class AvisoComponent {
  readonly notificacion = inject(NotificacionService);
}
