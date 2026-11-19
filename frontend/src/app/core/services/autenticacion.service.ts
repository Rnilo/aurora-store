import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { Direccion, DireccionEntrada, SesionRespuesta, Usuario } from '../modelos';

const CLAVE_TOKEN = 'aurora-token';
const CLAVE_USUARIO = 'aurora-usuario';

@Injectable({ providedIn: 'root' })
export class AutenticacionService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(this.leerToken());
  private readonly _usuario = signal<Usuario | null>(this.leerUsuario());

  readonly usuario = this._usuario.asReadonly();
  readonly autenticado = computed(() => this._token() !== null);
  readonly inicial = computed(() => (this._usuario()?.nombre ?? '?').charAt(0).toUpperCase());

  iniciarSesion(datos: { correo: string; contrasena: string }): Observable<SesionRespuesta> {
    return this.http
      .post<SesionRespuesta>('/api/v1/auth/login', datos)
      .pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  registrar(datos: {
    nombre: string;
    correo: string;
    contrasena: string;
    telefono?: string;
  }): Observable<SesionRespuesta> {
    return this.http
      .post<SesionRespuesta>('/api/v1/auth/registro', datos)
      .pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  cargarPerfil(): void {
    if (!this._token()) {
      return;
    }
    this.http.get<Usuario>('/api/v1/auth/yo').subscribe({
      next: (usuario) => {
        this._usuario.set(usuario);
        localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
      },
      error: () => this.cerrarSesion(false),
    });
  }

  direcciones(): Observable<Direccion[]> {
    return this.http.get<Direccion[]>('/api/v1/auth/direcciones');
  }

  agregarDireccion(datos: DireccionEntrada): Observable<Direccion> {
    return this.http.post<Direccion>('/api/v1/auth/direcciones', datos);
  }

  cerrarSesion(navegar = true): void {
    this._token.set(null);
    this._usuario.set(null);
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    if (navegar) {
      void this.router.navigate(['/']);
    }
  }

  private guardarSesion(respuesta: SesionRespuesta): void {
    this._token.set(respuesta.access_token);
    this._usuario.set(respuesta.usuario);
    localStorage.setItem(CLAVE_TOKEN, respuesta.access_token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(respuesta.usuario));
  }

  private leerToken(): string | null {
    try {
      return localStorage.getItem(CLAVE_TOKEN);
    } catch {
      return null;
    }
  }

  private leerUsuario(): Usuario | null {
    try {
      const crudo = localStorage.getItem(CLAVE_USUARIO);
      return crudo ? (JSON.parse(crudo) as Usuario) : null;
    } catch {
      return null;
    }
  }
}
