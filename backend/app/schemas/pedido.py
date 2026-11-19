"""DTOs de pedidos."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.auth import DireccionEntrada


class ItemPedidoEntrada(BaseModel):
    producto_id: int = Field(gt=0)
    cantidad: int = Field(gt=0, le=20)


class PedidoEntrada(BaseModel):
    items: list[ItemPedidoEntrada] = Field(min_length=1, max_length=40)
    tipo_entrega: str = Field(default="despacho", pattern="^(despacho|retiro)$")
    direccion_id: int | None = None
    direccion: DireccionEntrada | None = None
    cupon_codigo: str | None = Field(default=None, max_length=40)


class CotizacionEntrada(BaseModel):
    items: list[ItemPedidoEntrada] = Field(min_length=1, max_length=40)
    tipo_entrega: str = Field(default="despacho", pattern="^(despacho|retiro)$")
    cupon_codigo: str | None = Field(default=None, max_length=40)


class CotizacionRespuesta(BaseModel):
    subtotal: int
    costo_envio: int
    descuento: int
    total: int
    cupon_codigo: str | None
    monto_envio_gratis: int
    envio_gratis: bool


class ItemPedidoRespuesta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    producto_id: int | None
    nombre_producto: str
    imagen_url: str
    precio_unitario: int
    cantidad: int
    subtotal: int


class PedidoRespuesta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    numero: str
    estado: str
    tipo_entrega: str
    direccion_texto: str | None
    subtotal: int
    costo_envio: int
    descuento: int
    total: int
    cupon_codigo: str | None
    creado_en: datetime
    items: list[ItemPedidoRespuesta]
