import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AutenticacionService } from '../../core/services/autenticacion.service';
import { NotificacionService } from '../../core/services/notificacion.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="contenedor grid items-center gap-10 py-12 lg:grid-cols-2">
      <div class="mx-auto w-full max-w-md">
        <p class="etiqueta text-marca-700">Crear cuenta</p>
        <h1 class="mt-2 text-3xl font-extrabold tracking-tight">Únete a Aurora</h1>
        <p class="mt-2 text-sm text-tinta/50">
          Compra más rápido, guarda tus favoritos y sigue tus pedidos.
        </p>

        <form [formGroup]="formulario" (ngSubmit)="enviar()" class="mt-8 space-y-4">
          <label class="block">
            <span class="text-xs font-semibold text-tinta/60">Nombre completo</span>
            <input formControlName="nombre" class="campo mt-1" placeholder="Ana Pérez" autocomplete="name" />
            @if (formulario.controls.nombre.touched && formulario.controls.nombre.invalid) {
              <span class="mt-1 block text-xs text-coral">Ingresa tu nombre.</span>
            }
          </label>

          <label class="block">
            <span class="text-xs font-semibold text-tinta/60">Correo electrónico</span>
            <input type="email" formControlName="correo" class="campo mt-1" placeholder="tu@correo.cl" autocomplete="email" />
            @if (formulario.controls.correo.touched && formulario.controls.correo.invalid) {
              <span class="mt-1 block text-xs text-coral">Ingresa un correo válido.</span>
            }
          </label>

          <label class="block">
            <span class="text-xs font-semibold text-tinta/60">Teléfono (opcional)</span>
            <input formControlName="telefono" class="campo mt-1" placeholder="+56 9 1234 5678" autocomplete="tel" />
          </label>

          <label class="block">
            <span class="text-xs font-semibold text-tinta/60">Contraseña</span>
            <input type="password" formControlName="contrasena" class="campo mt-1" placeholder="Mínimo 8 caracteres" autocomplete="new-password" />
            @if (formulario.controls.contrasena.touched && formulario.controls.contrasena.invalid) {
              <span class="mt-1 block text-xs text-coral">Usa al menos 8 caracteres.</span>
            }
          </label>

          @if (error()) {
            <p class="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{{ error() }}</p>
          }

          <button type="submit" [disabled]="enviando()" class="btn-primario w-full">
            {{ enviando() ? 'Creando tu cuenta…' : 'Crear mi cuenta' }}
          </button>
        </form>

        <p class="mt-6 text-sm text-tinta/60">
          ¿Ya tienes cuenta?
          <a routerLink="/login" class="font-semibold text-marca-700 hover:underline">Inicia sesión</a>
        </p>
      </div>

      <div class="hidden rounded-3xl bg-crema p-10 lg:block">
        <p class="etiqueta text-marca-700">Beneficios</p>
        <h2 class="mt-3 text-3xl font-extrabold leading-tight">
          Más fácil, más rápido, más tuyo.
        </h2>
        <ul class="mt-8 space-y-4 text-sm text-tinta/70">
          <li class="flex gap-3"><span>✅</span> Checkout en segundos con tus datos guardados.</li>
          <li class="flex gap-3"><span>❤️</span> Tus favoritos sincronizados en este dispositivo.</li>
          <li class="flex gap-3"><span>📦</span> Historial y seguimiento de cada pedido.</li>
          <li class="flex gap-3"><span>🎁</span> Cupones de bienvenida y ofertas exclusivas.</li>
        </ul>
      </div>
    </div>
  `,
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly autenticacion = inject(AutenticacionService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  private readonly avisos = inject(NotificacionService);

  readonly enviando = signal(false);
  readonly error = signal('');

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: [''],
    contrasena: ['', [Validators.required, Validators.minLength(8)]],
  });

  enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set('');

    const { telefono, ...resto } = this.formulario.getRawValue();
    this.autenticacion
      .registrar({ ...resto, telefono: telefono || undefined })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.avisos.mostrar('¡Tu cuenta está lista!');
          const retorno = this.ruta.snapshot.queryParamMap.get('retorno') ?? '/';
          void this.router.navigateByUrl(retorno);
        },
        error: (respuesta) => {
          this.enviando.set(false);
          this.error.set(respuesta?.error?.detail ?? 'No pudimos crear tu cuenta.');
        },
      });
  }
}
