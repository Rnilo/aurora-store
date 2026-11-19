import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-estrellas',
  standalone: true,
  template: `
    <div class="flex items-center gap-1" [attr.aria-label]="'Calificacion ' + valor() + ' de 5'">
      <div class="flex items-center gap-0.5 text-[13px] leading-none">
        @for (indice of estrellas; track indice) {
          <span [class]="indice <= llenas() ? 'text-amber-500' : 'text-tinta/20'"
            >★</span
          >
        }
      </div>
      <span class="text-[11px] text-tinta/50">{{ valor().toFixed(1) }}</span>
      @if (resenas() > 0) {
        <span class="text-[11px] text-tinta/40">({{ resenas() }})</span>
      }
    </div>
  `,
})
export class EstrellasComponent {
  readonly valor = input.required<number>();
  readonly resenas = input(0);
  readonly estrellas = [1, 2, 3, 4, 5];
  readonly llenas = computed(() => Math.round(this.valor()));
}
