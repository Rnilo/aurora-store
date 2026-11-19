"""DTOs del catalogo."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CategoriaRespuesta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    slug: str
    icono: str
    subcategorias: list["CategoriaRespuesta"] = []


class MarcaRespuesta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    slug: str


class MarcaBreve(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str


class CategoriaBreve(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    slug: str


class ImagenRespuesta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    url: str
    orden: int


class ProductoResumen(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    slug: str
    precio: int
    precio_oferta: int | None
    precio_efectivo: int
    porcentaje_descuento: int
    imagen_url: str
    calificacion: float
    resenas: int
    stock: int
    destacado: bool
    envio_gratis: bool
    marca: MarcaBreve | None
    categoria: CategoriaBreve


class ProductoDetalle(ProductoResumen):
    descripcion: str
    sku: str
    imagenes: list[ImagenRespuesta]
    creado_en: datetime


class PaginaProductos(BaseModel):
    total: int
    pagina: int
    tamano: int
    paginas: int
    items: list[ProductoResumen]
