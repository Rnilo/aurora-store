"""Modelos ORM de clientes y pedidos."""

from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    correo: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    hash_contrasena: Mapped[str] = mapped_column(String(255), nullable=False)
    telefono: Mapped[str | None] = mapped_column(String(30), nullable=True)
    creado_en: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    direcciones: Mapped[list["Direccion"]] = relationship(
        back_populates="usuario", cascade="all, delete-orphan", lazy="selectin"
    )
    pedidos: Mapped[list["Pedido"]] = relationship(back_populates="usuario")


class Direccion(Base):
    __tablename__ = "direcciones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    usuario_id: Mapped[int] = mapped_column(
        ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False
    )
    alias: Mapped[str] = mapped_column(String(60), default="Casa")
    calle: Mapped[str] = mapped_column(String(160), nullable=False)
    numero: Mapped[str] = mapped_column(String(20), nullable=False)
    departamento: Mapped[str | None] = mapped_column(String(40), nullable=True)
    comuna: Mapped[str] = mapped_column(String(80), nullable=False)
    ciudad: Mapped[str] = mapped_column(String(80), nullable=False)
    region: Mapped[str] = mapped_column(String(80), nullable=False)
    codigo_postal: Mapped[str | None] = mapped_column(String(20), nullable=True)
    predeterminada: Mapped[bool] = mapped_column(Boolean, default=False)

    usuario: Mapped[Usuario] = relationship(back_populates="direcciones")


class Cupon(Base):
    __tablename__ = "cupones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    codigo: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    tipo: Mapped[str] = mapped_column(String(20), default="porcentaje")
    valor: Mapped[int] = mapped_column(Integer, default=0)
    minimo_compra: Mapped[int] = mapped_column(Integer, default=0)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    vence_en: Mapped[date | None] = mapped_column(Date, nullable=True)


class Pedido(Base):
    __tablename__ = "pedidos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    numero: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)
    estado: Mapped[str] = mapped_column(String(20), default="pendiente")
    tipo_entrega: Mapped[str] = mapped_column(String(20), default="despacho")
    direccion_id: Mapped[int | None] = mapped_column(
        ForeignKey("direcciones.id", ondelete="SET NULL"), nullable=True
    )
    direccion_texto: Mapped[str | None] = mapped_column(String(255), nullable=True)
    subtotal: Mapped[int] = mapped_column(Integer, nullable=False)
    costo_envio: Mapped[int] = mapped_column(Integer, default=0)
    descuento: Mapped[int] = mapped_column(Integer, default=0)
    total: Mapped[int] = mapped_column(Integer, nullable=False)
    cupon_codigo: Mapped[str | None] = mapped_column(String(40), nullable=True)
    creado_en: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    usuario: Mapped[Usuario] = relationship(back_populates="pedidos")
    items: Mapped[list["PedidoItem"]] = relationship(
        back_populates="pedido", cascade="all, delete-orphan", lazy="selectin"
    )


class PedidoItem(Base):
    __tablename__ = "pedido_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    pedido_id: Mapped[int] = mapped_column(
        ForeignKey("pedidos.id", ondelete="CASCADE"), nullable=False
    )
    producto_id: Mapped[int | None] = mapped_column(
        ForeignKey("productos.id", ondelete="SET NULL"), nullable=True
    )
    nombre_producto: Mapped[str] = mapped_column(String(180), nullable=False)
    imagen_url: Mapped[str] = mapped_column(String(255), default="")
    precio_unitario: Mapped[int] = mapped_column(Integer, nullable=False)
    cantidad: Mapped[int] = mapped_column(Integer, nullable=False)
    subtotal: Mapped[int] = mapped_column(Integer, nullable=False)

    pedido: Mapped[Pedido] = relationship(back_populates="items")
