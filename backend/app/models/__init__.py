"""Registro de todos los modelos para que Base.metadata los conozca."""

from app.models.catalogo import Categoria, ImagenProducto, Marca, Producto
from app.models.pedido import Cupon, Direccion, Pedido, PedidoItem, Usuario

__all__ = [
    "Categoria",
    "ImagenProducto",
    "Marca",
    "Producto",
    "Cupon",
    "Direccion",
    "Pedido",
    "PedidoItem",
    "Usuario",
]
