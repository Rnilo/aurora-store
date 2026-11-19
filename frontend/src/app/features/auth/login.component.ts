import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

import { AutenticacionService } from '../../core/services/autenticacion.service';
import { NotificacionService } from '../../core/services/notificacion.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="contenedor grid items-center gap-10 py-12 lg:grid-cols-2">
      <div class="mx-auto w-full max-w-md">
        <p class="etiqueta text-marca-700">Mi cuenta</p>
        <h1 class="mt-2 text-3xl font-extrabold tracking-tight">Hola de nuevo</h1>
        <p class="mt-2 text-sm text-tinta/50">
          Ingresa para completar tu compra y revisar tus pedidos.
        </p>

        <form [formGroup]="formulario" (ngSubmit)="enviar()" class="mt-8 space-y-4">
          <label class="block">
            <span class="text-xs font-semibold text-tinta/60">Correo electrónico</span>
            <input type="email" formControlName="correo" class="campo mt-1" placeholder="tu@correo.cl" autocomplete="email" />
            @if (formulario.controls.correo.touched && formulario.controls.correo.invalid) {
              <span class="mt-1 block text-xs text-coral">Ingresa un correo válido.</span>
            }
          </label>

          <label class="block">
            <span class="text-xs font-semibold text-tinta/60">Contraseña</span>
            <input type="password" formControlName="contrasena" class="campo mt-1" placeholder="••••••••" autocomplete="current-password" />
            @if (formulario.controls.contrasena.touched && formulario.controls.contrasena.invalid) {
              <span class="mt-1 block text-xs text-coral">Ingresa tu contraseña.</span>
            }
          </label>

          @if (error()) {
            <p class="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{{ error() }}</p>
          }

          <button type="submit" [disabled]="enviando()" class="btn-primario w-full">
            {{ enviando() ? 'Ingresando…' : 'Iniciar sesión' }}
          </button>
        </form>

        <p class="mt-6 text-sm text-tinta/60">
          ¿No tienes cuenta?
          <a routerLink="/registro" class="font-semibold text-marca-700 hover:underline">Regístrate gratis</a>
        </p>

        <div class="mt-8 rounded-2xl border border-dashed border-tinta/15 p-4 text-xs text-tinta/50">
          <p class="font-semibold text-tinta/70">Cuenta demo</p>
          <p class="mt-1">cliente&#64;aurora.cl · Demo1234</p>
        </div>
      </div>

      <div class="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-marca-900 via-marca-800 to-marca-600 p-10 text-white lg:block">
        <p class="etiqueta text-lima">Aurora Store</p>
        <h2 class="mt-3 max-w-sm text-3xl font-extrabold leading-tight">
          Tus productos favoritos, a un clic de tu puerta.
        </h2>
        <p class="mt-3 max-w-sm text-sm text-white/70">
          Guarda tu carrito, sigue tus pedidos y recibe ofertas exclusivas.
        </p>
        <div class="mt-10 grid grid-cols-2 gap-3">
          <img src="/img/productos/audifonos-lumen-air-anc.svg" alt="" class="rounded-2xl ring-1 ring-white/20" />
          <img src="/img/productos/zapatillas-vertex-run.svg" alt="" class="rounded-2xl ring-1 ring-white/20" />
          <img src="/img/productos/air-fryer-mistral-55l.svg" alt="" class="rounded-2xl ring-1 ring-white/20" />
          <img src="/img/productos/smartphone-nova-x6-5g-128gb.svg" alt="" class="rounded-2xl ring-1 ring-white/20" />
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly autenticacion = inject(AutenticacionService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  private readonly avisos = inject(NotificacionService);

  readonly enviando = signal(false);
  readonly error = signal('');

  readonly formulario = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]],
  });

  enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    this.autenticacion.iniciarSesion(this.formulario.getRawValue()).subscribe({
      next: () => {
        this.enviando.set(false);
        this.avisos.mostrar('¡Bienvenido de vuelta!');
        const retorno = this.ruta.snapshot.queryParamMap.get('retorno') ?? '/';
        void this.router.navigateByUrl(retorno);
      },
      error: (respuesta) => {
        this.enviando.set(false);
        this.error.set(respuesta?.error?.detail ?? 'No pudimos iniciar sesión. Intenta nuevamente.');
      },
    });
  }
}
