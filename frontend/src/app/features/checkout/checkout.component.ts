import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Cotizacion, Direccion, Pedido } from '../../core/modelos';
import { AutenticacionService } from '../../core/services/autenticacion.service';
import { CarritoService } from '../../core/services/carrito.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { formatearPrecio } from '../../shared/utils/formato';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="contenedor mt-8">
      @if (pedidoCreado(); as pedido) {
        <div class="mx-auto max-w-2xl py-10 text-center">
          <span class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-marca-100 text-4xl"
            >✅</span
          >
          <h1 class="mt-5 text-3xl font-extrabold tracking-tight">¡Gracias por tu compra!</h1>
          <p class="mt-2 text-sm text-tinta/50">
            Tu pedido <strong class="text-tinta">{{ pedido.numero }}</strong> quedó registrado.
          </p>

          <div class="mt-8 rounded-2xl border border-tinta/10 p-6 text-left">
            <div class="flex items-center justify-between">
              <p class="text-sm text-tinta/50">Total pagado</p>
              <p class="text-2xl font-extrabold">{{ formatear(pedido.total) }}</p>
            </div>
            <div class="mt-4 space-y-3">
              @for (item of pedido.items; track item.id) {
                <div class="flex items-center gap-3">
                  <img [src]="item.imagen_url" [alt]="item.nombre_producto" class="h-14 w-14 rounded-lg bg-crema object-cover" />
                  <div class="min-w-0 flex-1">
                    <p class="linea-1 text-sm font-medium">{{ item.nombre_producto }}</p>
                    <p class="text-xs text-tinta/40">{{ item.cantidad }} × {{ formatear(item.precio_unitario) }}</p>
                  </div>
                  <p class="text-sm font-semibold">{{ formatear(item.subtotal) }}</p>
                </div>
              }
            </div>
            <div class="mt-5 border-t border-tinta/10 pt-4 text-sm text-tinta/60">
              @if (pedido.tipo_entrega === 'despacho') {
                <p>🚚 Despacho a: {{ pedido.direccion_texto }}</p>
              } @else {
                <p>🏬 Retiro en tienda Aurora Providencia.</p>
              }
              <p class="mt-1">Te avisaremos por correo cuando salga el pedido.</p>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <a routerLink="/mis-pedidos" class="btn-primario">Ver mis pedidos</a>
            <a routerLink="/catalogo" class="btn-claro">Seguir comprando</a>
          </div>
        </div>
      } @else if (carrito.items().length === 0) {
        <div class="rounded-3xl border border-dashed border-tinta/15 p-12 text-center">
          <p class="text-5xl">🛒</p>
          <p class="mt-4 text-lg font-semibold">No hay productos para pagar</p>
          <p class="mt-1 text-sm text-tinta/50">Agrega algo al carrito y vuelve al checkout.</p>
          <a routerLink="/catalogo" class="btn-primario mt-6">Ir al catálogo</a>
        </div>
      } @else {
        <h1 class="text-2xl font-extrabold tracking-tight sm:text-3xl">Finalizar compra</h1>
        <p class="mt-1 text-sm text-tinta/50">Revisa tus datos y confirma el pedido.</p>

        <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
          <div class="space-y-4">
            <!-- Entrega -->
            <section class="rounded-2xl border border-tinta/10 p-5">
              <h2 class="flex items-center gap-2 text-lg font-bold">
                <span class="grid h-6 w-6 place-items-center rounded-full bg-tinta text-xs text-white">1</span>
                Entrega
              </h2>
              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <label
                  class="cursor-pointer rounded-xl border p-4 transition"
                  [class]="tipoEntrega() === 'despacho' ? 'border-tinta' : 'border-tinta/15'"
                >
                  <input
                    type="radio"
                    name="entrega"
                    class="mr-2"
                    [checked]="tipoEntrega() === 'despacho'"
                    (change)="cambiarEntrega('despacho')"
                  />
                  <span class="text-sm font-semibold">Despacho a domicilio</span>
                  <p class="mt-1 pl-6 text-xs text-tinta/50">24 a 48 horas hábiles.</p>
                </label>
                <label
                  class="cursor-pointer rounded-xl border p-4 transition"
                  [class]="tipoEntrega() === 'retiro' ? 'border-tinta' : 'border-tinta/15'"
                >
                  <input
                    type="radio"
                    name="entrega"
                    class="mr-2"
                    [checked]="tipoEntrega() === 'retiro'"
                    (change)="cambiarEntrega('retiro')"
                  />
                  <span class="text-sm font-semibold">Retiro en tienda</span>
                  <p class="mt-1 pl-6 text-xs text-tinta/50">Disponible en 2 horas. Sin costo.</p>
                </label>
              </div>
            </section>

            <!-- Dirección -->
            @if (tipoEntrega() === 'despacho') {
              <section class="rounded-2xl border border-tinta/10 p-5">
                <h2 class="flex items-center gap-2 text-lg font-bold">
                  <span class="grid h-6 w-6 place-items-center rounded-full bg-tinta text-xs text-white">2</span>
                  Dirección de despacho
                </h2>

                <div class="mt-4 space-y-2">
                  @for (direccion of direcciones(); track direccion.id) {
                    <label
                      class="flex cursor-pointer items-start gap-3 rounded-xl border p-4"
                      [class]="direccionId() === direccion.id ? 'border-tinta' : 'border-tinta/15'"
                    >
                      <input
                        type="radio"
                        name="direccion"
                        class="mt-1"
                        [checked]="direccionId() === direccion.id"
                        (change)="seleccionarDireccion(direccion.id)"
                      />
                      <span>
                        <span class="text-sm font-semibold">{{ direccion.alias }}</span>
                        @if (direccion.predeterminada) {
                          <span class="ml-2 rounded-full bg-marca-100 px-2 py-0.5 text-[10px] font-semibold text-marca-800">Principal</span>
                        }
                        <span class="mt-1 block text-xs text-tinta/50">
                          {{ direccion.calle }} {{ direccion.numero }}
                          @if (direccion.departamento) {
                            , {{ direccion.departamento }}
                          }
                          · {{ direccion.comuna }}, {{ direccion.ciudad }}
                        </span>
                      </span>
                    </label>
                  }
                </div>

                <button
                  type="button"
                  (click)="nuevaDireccion.set(!nuevaDireccion())"
                  class="mt-3 text-sm font-semibold text-marca-700 hover:underline"
                >
                  {{ nuevaDireccion() ? 'Cancelar nueva dirección' : '+ Usar otra dirección' }}
                </button>

                @if (nuevaDireccion()) {
                  <form [formGroup]="formularioDireccion" class="mt-4 grid gap-3 sm:grid-cols-2">
                    <label class="block sm:col-span-2">
                      <span class="text-xs font-semibold text-tinta/60">Calle</span>
                      <input formControlName="calle" class="campo mt-1" placeholder="Av. Providencia" />
                    </label>
                    <label class="block">
                      <span class="text-xs font-semibold text-tinta/60">Número</span>
                      <input formControlName="numero" class="campo mt-1" placeholder="1234" />
                    </label>
                    <label class="block">
                      <span class="text-xs font-semibold text-tinta/60">Depto / oficina</span>
                      <input formControlName="departamento" class="campo mt-1" placeholder="Depto 56" />
                    </label>
                    <label class="block">
                      <span class="text-xs font-semibold text-tinta/60">Comuna</span>
                      <input formControlName="comuna" class="campo mt-1" placeholder="Providencia" />
                    </label>
                    <label class="block">
                      <span class="text-xs font-semibold text-tinta/60">Ciudad</span>
                      <input formControlName="ciudad" class="campo mt-1" placeholder="Santiago" />
                    </label>
                    <label class="block sm:col-span-2">
                      <span class="text-xs font-semibold text-tinta/60">Región</span>
                      <input formControlName="region" class="campo mt-1" placeholder="Metropolitana" />
                    </label>
                  </form>
                }
              </section>
            } @else {
              <section class="rounded-2xl border border-tinta/10 p-5">
                <h2 class="flex items-center gap-2 text-lg font-bold">
                  <span class="grid h-6 w-6 place-items-center rounded-full bg-tinta text-xs text-white">2</span>
                  Punto de retiro
                </h2>
                <div class="mt-3 rounded-xl bg-crema p-4 text-sm">
                  <p class="font-semibold">Aurora Store Providencia</p>
                  <p class="mt-1 text-xs text-tinta/60">Av. Providencia 1234, Santiago · Lunes a domingo 10:00 a 21:00</p>
                  <p class="mt-2 text-xs text-marca-700">Listo para retirar en 2 horas hábiles.</p>
                </div>
              </section>
            }

            <!-- Pago -->
            <section class="rounded-2xl border border-tinta/10 p-5">
              <h2 class="flex items-center gap-2 text-lg font-bold">
                <span class="grid h-6 w-6 place-items-center rounded-full bg-tinta text-xs text-white">3</span>
                Medio de pago
              </h2>
              <div class="mt-4 space-y-2">
                @for (metodo of metodosPago; track metodo.valor) {
                  <label
                    class="flex cursor-pointer items-center gap-3 rounded-xl border p-4"
                    [class]="metodoPago() === metodo.valor ? 'border-tinta' : 'border-tinta/15'"
                  >
                    <input
                      type="radio"
                      name="pago"
                      [checked]="metodoPago() === metodo.valor"
                      (change)="metodoPago.set(metodo.valor)"
                    />
                    <span class="text-lg">{{ metodo.icono }}</span>
                    <span class="text-sm font-semibold">{{ metodo.nombre }}</span>
                  </label>
                }
              </div>
              <p class="mt-3 text-xs text-tinta/40">
                Demo: no se procesa ningún cobro real; el pedido se registra como pagado.
              </p>
            </section>

            <!-- Cupón -->
            <section class="rounded-2xl border border-tinta/10 p-5">
              <h2 class="text-lg font-bold">¿Tienes un cupón?</h2>
              <div class="mt-3 flex gap-2">
                <input
                  [value]="codigoCupon()"
                  (input)="codigoCupon.set($any($event.target).value)"
                  class="campo"
                  placeholder="Ej: BIENVENIDO10"
                  aria-label="Código de cupón"
                />
                <button type="button" (click)="aplicarCupon()" class="btn-claro shrink-0">Aplicar</button>
              </div>
              @if (mensajeCupon()) {
                <p class="mt-2 text-xs" [class.text-marca-700]="cuponAplicado()" [class.text-coral]="!cuponAplicado()">
                  {{ mensajeCupon() }}
                </p>
              }
              <p class="mt-2 text-[11px] text-tinta/40">
                Prueba BIENVENIDO10 (10% en tu primera compra) o ENVIOGRATIS.
              </p>
            </section>

            @if (mensajeError()) {
              <p class="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{{ mensajeError() }}</p>
            }
          </div>

          <!-- Resumen -->
          <aside class="lg:sticky lg:top-28 lg:self-start">
            <div class="rounded-2xl border border-tinta/10 p-5">
              <h2 class="text-lg font-bold">Tu pedido</h2>

              <div class="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                @for (item of carrito.items(); track item.producto.id) {
                  <div class="flex items-center gap-3">
                    <img [src]="item.producto.imagen_url" [alt]="item.producto.nombre" class="h-14 w-14 rounded-lg bg-crema object-cover" />
                    <div class="min-w-0 flex-1">
                      <p class="linea-1 text-xs font-medium">{{ item.producto.nombre }}</p>
                      <p class="text-[11px] text-tinta/40">Cantidad: {{ item.cantidad }}</p>
                    </div>
                    <p class="text-xs font-semibold">{{ formatear(item.producto.precio_efectivo * item.cantidad) }}</p>
                  </div>
                }
              </div>

              <dl class="mt-4 space-y-2 border-t border-tinta/10 pt-4 text-sm">
                <div class="flex justify-between">
                  <dt class="text-tinta/60">Subtotal</dt>
                  <dd class="font-semibold">{{ formatear(resumen().subtotal) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-tinta/60">Envío</dt>
                  <dd class="font-semibold">
                    {{ resumen().costo_envio === 0 ? 'Gratis' : formatear(resumen().costo_envio) }}
                  </dd>
                </div>
                @if (resumen().descuento > 0) {
                  <div class="flex justify-between text-marca-700">
                    <dt>Descuento {{ resumen().cupon_codigo }}</dt>
                    <dd class="font-semibold">-{{ formatear(resumen().descuento) }}</dd>
                  </div>
                }
              </dl>

              <div class="mt-4 flex items-end justify-between border-t border-tinta/10 pt-4">
                <span class="text-sm text-tinta/60">Total</span>
                <span class="text-2xl font-extrabold">{{ formatear(resumen().total) }}</span>
              </div>

              <button
                type="button"
                (click)="confirmar()"
                [disabled]="procesando()"
                class="btn-primario mt-5 w-full"
              >
                {{ procesando() ? 'Procesando…' : 'Confirmar pedido' }}
              </button>
              <p class="mt-3 text-center text-[11px] text-tinta/40">
                Al confirmar aceptas los términos y la política de privacidad.
              </p>
            </div>
          </aside>
        </div>
      }
    </div>
  `,
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pedidos = inject(PedidosService);
  private readonly autenticacion = inject(AutenticacionService);
  private readonly avisos = inject(NotificacionService);

  readonly carrito = inject(CarritoService);

  readonly tipoEntrega = signal<'despacho' | 'retiro'>('despacho');
  readonly direcciones = signal<Direccion[]>([]);
  readonly direccionId = signal<number | null>(null);
  readonly nuevaDireccion = signal(false);
  readonly metodoPago = signal('tarjeta');
  readonly codigoCupon = signal('');
  readonly cuponAplicado = signal(false);
  readonly mensajeCupon = signal('');
  readonly cotizacion = signal<Cotizacion | null>(null);
  readonly procesando = signal(false);
  readonly mensajeError = signal('');
  readonly pedidoCreado = signal<Pedido | null>(null);

  protected readonly formatear = formatearPrecio;

  readonly metodosPago = [
    { valor: 'tarjeta', nombre: 'Tarjeta de crédito o débito', icono: '💳' },
    { valor: 'webpay', nombre: 'Webpay Plus', icono: '🏦' },
    { valor: 'transferencia', nombre: 'Transferencia bancaria', icono: '📱' },
  ];

  readonly formularioDireccion = this.fb.nonNullable.group({
    calle: ['', [Validators.required, Validators.minLength(3)]],
    numero: ['', Validators.required],
    departamento: [''],
    comuna: ['', Validators.required],
    ciudad: ['', Validators.required],
    region: ['', Validators.required],
  });

  readonly resumen = computed<Cotizacion>(() => {
    const cotizacion = this.cotizacion();
    if (cotizacion) {
      return cotizacion;
    }
    const subtotal = this.carrito.subtotal();
    const envio = this.tipoEntrega() === 'retiro' || subtotal >= 49990 ? 0 : 3990;
    return {
      subtotal,
      costo_envio: envio,
      descuento: 0,
      total: subtotal + envio,
      cupon_codigo: null,
      monto_envio_gratis: 49990,
      envio_gratis: envio === 0,
    };
  });

  constructor() {
    this.cargarDirecciones();
    this.cotizar();
  }

  cambiarEntrega(tipo: 'despacho' | 'retiro'): void {
    this.tipoEntrega.set(tipo);
    this.cotizar();
  }

  seleccionarDireccion(id: number): void {
    this.direccionId.set(id);
    this.nuevaDireccion.set(false);
  }

  aplicarCupon(): void {
    const codigo = this.codigoCupon().trim();
    if (!codigo) {
      return;
    }
    this.cuponAplicado.set(true);
    this.mensajeCupon.set('');
    this.cotizar();
  }

  confirmar(): void {
    if (this.procesando()) {
      return;
    }
    this.mensajeError.set('');

    if (this.tipoEntrega() === 'despacho' && !this.direccionId() && !this.nuevaDireccion()) {
      this.mensajeError.set('Selecciona o agrega una dirección de despacho.');
      return;
    }
    if (this.tipoEntrega() === 'despacho' && this.nuevaDireccion() && this.formularioDireccion.invalid) {
      this.formularioDireccion.markAllAsTouched();
      this.mensajeError.set('Completa los datos de la nueva dirección.');
      return;
    }

    this.procesando.set(true);
    const items = this.carrito.items().map((item) => ({
      producto_id: item.producto.id,
      cantidad: item.cantidad,
    }));

    this.pedidos
      .crear({
        items,
        tipo_entrega: this.tipoEntrega(),
        direccion_id: this.tipoEntrega() === 'despacho' ? this.direccionId() : null,
        direccion:
          this.tipoEntrega() === 'despacho' && this.nuevaDireccion()
            ? {
                alias: 'Nueva',
                calle: this.formularioDireccion.getRawValue().calle,
                numero: this.formularioDireccion.getRawValue().numero,
                departamento: this.formularioDireccion.getRawValue().departamento || null,
                comuna: this.formularioDireccion.getRawValue().comuna,
                ciudad: this.formularioDireccion.getRawValue().ciudad,
                region: this.formularioDireccion.getRawValue().region,
                predeterminada: false,
              }
            : null,
        cupon_codigo: this.cuponAplicado() ? this.codigoCupon().trim().toUpperCase() : null,
      })
      .subscribe({
        next: (pedido) => {
          this.procesando.set(false);
          this.pedidoCreado.set(pedido);
          this.carrito.vaciar();
          this.avisos.mostrar('Pedido confirmado. ¡Gracias por comprar en Aurora!');
          void this.autenticacion.cargarPerfil();
        },
        error: (respuesta) => {
          this.procesando.set(false);
          this.mensajeError.set(
            respuesta?.error?.detail ?? 'No pudimos crear tu pedido. Intenta nuevamente.',
          );
        },
      });
  }

  private cargarDirecciones(): void {
    this.autenticacion.direcciones().subscribe({
      next: (direcciones) => {
        this.direcciones.set(direcciones);
        const principal = direcciones.find((direccion) => direccion.predeterminada) ?? direcciones[0];
        if (principal) {
          this.direccionId.set(principal.id);
        } else {
          this.nuevaDireccion.set(true);
        }
      },
      error: () => this.nuevaDireccion.set(true),
    });
  }

  private cotizar(): void {
    if (this.carrito.items().length === 0) {
      return;
    }
    const items = this.carrito.items().map((item) => ({
      producto_id: item.producto.id,
      cantidad: item.cantidad,
    }));
    const codigo = this.cuponAplicado() ? this.codigoCupon().trim().toUpperCase() : null;

    this.pedidos
      .cotizar({ items, tipo_entrega: this.tipoEntrega(), cupon_codigo: codigo })
      .subscribe({
        next: (cotizacion) => {
          this.cotizacion.set(cotizacion);
          if (codigo) {
            this.mensajeCupon.set(
              `Cupón aplicado: ${cotizacion.cupon_codigo} (${this.formatear(cotizacion.descuento)} de descuento).`,
            );
          }
        },
        error: (respuesta) => {
          if (codigo) {
            this.cuponAplicado.set(false);
            this.mensajeCupon.set(respuesta?.error?.detail ?? 'El cupón no es válido.');
          }
        },
      });
  }
}
