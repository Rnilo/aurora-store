export function formatearPrecio(valor: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(fecha);
}

export function nombreEstado(estado: string): string {
  const estados: Record<string, string> = {
    pendiente: 'Pendiente de pago',
    pagado: 'Pagado',
    preparando: 'Preparando',
    enviado: 'En camino',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  };
  return estados[estado] ?? estado;
}
