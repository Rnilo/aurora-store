import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  let token: string | null = null;
  try {
    token = localStorage.getItem('aurora-token');
  } catch {
    token = null;
  }

  if (token && peticion.url.startsWith('/api')) {
    return siguiente(
      peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } }),
    );
  }
  return siguiente(peticion);
};
