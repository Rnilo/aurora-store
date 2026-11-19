import { Routes } from '@angular/router';

import { sesionGuard } from './core/guards/sesion.guard';

export const appRoutes: Routes = [
  {
    path: '',
    title: 'Aurora Store | Tecnología, hogar, moda y más',
    loadComponent: () => import('./features/inicio/inicio.component').then((m) => m.InicioComponent),
  },
  {
    path: 'catalogo',
    title: 'Catálogo | Aurora Store',
    loadComponent: () =>
      import('./features/catalogo/catalogo.component').then((m) => m.CatalogoComponent),
  },
  {
    path: 'producto/:slug',
    title: 'Producto | Aurora Store',
    loadComponent: () =>
      import('./features/producto/producto.component').then((m) => m.ProductoComponent),
  },
  {
    path: 'carrito',
    title: 'Carrito | Aurora Store',
    loadComponent: () =>
      import('./features/carrito/carrito.component').then((m) => m.CarritoComponent),
  },
  {
    path: 'checkout',
    title: 'Checkout | Aurora Store',
    canActivate: [sesionGuard],
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'login',
    title: 'Iniciar sesión | Aurora Store',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    title: 'Crear cuenta | Aurora Store',
    loadComponent: () => import('./features/auth/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: 'favoritos',
    title: 'Favoritos | Aurora Store',
    loadComponent: () =>
      import('./features/favoritos/favoritos.component').then((m) => m.FavoritosComponent),
  },
  {
    path: 'mis-pedidos',
    title: 'Mis pedidos | Aurora Store',
    canActivate: [sesionGuard],
    loadComponent: () =>
      import('./features/mis-pedidos/mis-pedidos.component').then((m) => m.MisPedidosComponent),
  },
  {
    path: '**',
    title: 'Página no encontrada | Aurora Store',
    loadComponent: () =>
      import('./features/no-encontrado/no-encontrado.component').then((m) => m.NoEncontradoComponent),
  },
];
