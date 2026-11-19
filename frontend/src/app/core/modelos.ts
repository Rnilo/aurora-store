export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  icono: string;
  subcategorias: Categoria[];
}

export interface Marca {
  id: number;
  nombre: string;
  slug: string;
}

export interface MarcaBreve {
  id: number;
  nombre: string;
}

export interface CategoriaBreve {
  id: number;
  nombre: string;
  slug: string;
}

export interface Imagen {
  url: string;
  orden: number;
}

export interface Producto {
  id: number;
  nombre: string;
  slug: string;
  precio: number;
  precio_oferta: number | null;
  precio_efectivo: number;
  porcentaje_descuento: number;
  imagen_url: string;
  calificacion: number;
  resenas: number;
  stock: number;
  destacado: boolean;
  envio_gratis: boolean;
  marca: MarcaBreve | null;
  categoria: CategoriaBreve;
  descripcion?: string;
  sku?: string;
  imagenes?: Imagen[];
  creado_en?: string;
}

export interface PaginaProductos {
  total: number;
  pagina: number;
  tamano: number;
  paginas: number;
  items: Producto[];
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  creado_en: string;
}

export interface SesionRespuesta {
  access_token: string;
  token_type: string;
  usuario: Usuario;
}

export interface Direccion {
  id: number;
  alias: string;
  calle: string;
  numero: string;
  departamento: string | null;
  comuna: string;
  ciudad: string;
  region: string;
  codigo_postal: string | null;
  predeterminada: boolean;
}

export interface DireccionEntrada {
  alias: string;
  calle: string;
  numero: string;
  departamento?: string | null;
  comuna: string;
  ciudad: string;
  region: string;
  codigo_postal?: string | null;
  predeterminada?: boolean;
}

export interface ItemPedidoEntrada {
  producto_id: number;
  cantidad: number;
}

export interface Cotizacion {
  subtotal: number;
  costo_envio: number;
  descuento: number;
  total: number;
  cupon_codigo: string | null;
  monto_envio_gratis: number;
  envio_gratis: boolean;
}

export interface ItemPedido {
  id: number;
  producto_id: number | null;
  nombre_producto: string;
  imagen_url: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  numero: string;
  estado: string;
  tipo_entrega: 'despacho' | 'retiro';
  direccion_texto: string | null;
  subtotal: number;
  costo_envio: number;
  descuento: number;
  total: number;
  cupon_codigo: string | null;
  creado_en: string;
  items: ItemPedido[];
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export interface FiltrosBusqueda {
  q?: string;
  categoria?: string;
  marca?: string;
  precio_min?: number;
  precio_max?: number;
  orden?: string;
  ofertas?: boolean;
  destacados?: boolean;
  pagina?: number;
  tamano?: number;
}
