import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AutenticacionService } from '../services/autenticacion.service';

export const sesionGuard: CanActivateFn = (_ruta, estado) => {
  const autenticacion = inject(AutenticacionService);
  const router = inject(Router);

  if (autenticacion.autenticado()) {
    return true;
  }
  return router.createUrlTree(['/login'], { queryParams: { retorno: estado.url } });
};
