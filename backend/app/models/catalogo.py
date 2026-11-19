"""Modelos ORM del catalogo."""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Categoria(Base):
    __tablename__ = "categorias"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(80), nullable=False)
    slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    icono: Mapped[str] = mapped_column(String(16), default="")
    categoria_padre_id: Mapped[int | None] = mapped_column(
        ForeignKey("categorias.id", ondelete="SET NULL"), nullable=True
    )
    orden: Mapped[int] = mapped_column(Integer, default=0)
    activa: Mapped[bool] = mapped_column(Boolean, default=True)

    padre: Mapped["Categoria | None"] = relationship(
        "Categoria", back_populates="subcategorias", remote_side=[id]
    )
    subcategorias: Mapped[list["Categoria"]] = relationship(
        "Categoria", back_populates="padre", order_by="Categoria.orden"
    )


class Marca(Base):
    __tablename__ = "marcas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)


class Producto(Base):
    __tablename__ = "productos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    categoria_id: Mapped[int] = mapped_column(ForeignKey("categorias.id"), nullable=False)
    marca_id: Mapped[int | None] = mapped_column(
        ForeignKey("marcas.id", ondelete="SET NULL"), nullable=True
    )
    nombre: Mapped[str] = mapped_column(String(180), nullable=False)
    slug: Mapped[str] = mapped_column(String(180), unique=True, nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, default="")
    precio: Mapped[int] = mapped_column(Integer, nullable=False)
    precio_oferta: Mapped[int | None] = mapped_column(Integer, nullable=True)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    sku: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    imagen_url: Mapped[str] = mapped_column(String(255), default="")
    calificacion: Mapped[Decimal] = mapped_column(Numeric(2, 1), default=Decimal("4.5"))
    resenas: Mapped[int] = mapped_column(Integer, default=0)
    destacado: Mapped[bool] = mapped_column(Boolean, default=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    creado_en: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    categoria: Mapped[Categoria] = relationship(lazy="joined")
    marca: Mapped[Marca | None] = relationship(lazy="joined")
    imagenes: Mapped[list["ImagenProducto"]] = relationship(
        back_populates="producto",
        order_by="ImagenProducto.orden",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    @property
    def precio_efectivo(self) -> int:
        return self.precio_oferta or self.precio

    @property
    def porcentaje_descuento(self) -> int:
        if not self.precio_oferta:
            return 0
        return round((1 - self.precio_oferta / self.precio) * 100)

    @property
    def envio_gratis(self) -> bool:
        from app.core.constantes import MONTO_ENVIO_GRATIS

        return self.precio_efectivo >= MONTO_ENVIO_GRATIS


class ImagenProducto(Base):
    __tablename__ = "imagenes_producto"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    producto_id: Mapped[int] = mapped_column(
        ForeignKey("productos.id", ondelete="CASCADE"), nullable=False
    )
    url: Mapped[str] = mapped_column(String(255), nullable=False)
    orden: Mapped[int] = mapped_column(Integer, default=0)

    producto: Mapped[Producto] = relationship(back_populates="imagenes")
