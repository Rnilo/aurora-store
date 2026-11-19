"""Creacion y consulta de pedidos."""

from datetime import datetime
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.constantes import COSTO_ENVIO, MONTO_ENVIO_GRATIS
from app.models.catalogo import Producto
from app.models.pedido import Cupon, Direccion, Pedido, PedidoItem, Usuario
from app.schemas.pedido import ItemPedidoEntrada, PedidoEntrada


class ErrorPedido(Exception):
    """Error de negocio del checkout, con codigo HTTP sugerido."""

    def __init__(self, mensaje: str, estado_http: int = 400) -> None:
        super().__init__(mensaje)
        self.mensaje = mensaje
        self.estado_http = estado_http


def _consolidar(items: list[ItemPedidoEntrada]) -> dict[int, int]:
    cantidades: dict[int, int] = {}
    for item in items:
        cantidades[item.producto_id] = cantidades.get(item.producto_id, 0) + item.cantidad
    return cantidades


def _buscar_productos(db: Session, cantidades: dict[int, int]) -> list[Producto]:
    productos = list(
        db.scalars(
            select(Producto).where(
                Producto.id.in_(cantidades.keys()), Producto.activo.is_(True)
            )
        )
        .unique()
        .all()
    )
    if len(productos) != len(cantidades):
        raise ErrorPedido("Uno o mas productos ya no estan disponibles.", 404)
    return productos


def _validar_cupon(db: Session, codigo: str | None, subtotal: int) -> Cupon | None:
    if not codigo:
        return None

    cupon = db.scalar(select(Cupon).where(Cupon.codigo == codigo.strip().upper()))
    if cupon is None or not cupon.activo:
        raise ErrorPedido("El cupon no existe o ya no esta vigente.")
    if cupon.vence_en and cupon.vence_en < datetime.now().date():
        raise ErrorPedido("El cupon esta vencido.")
    if subtotal < cupon.minimo_compra:
        raise ErrorPedido(
            f"El cupon requiere una compra minima de ${cupon.minimo_compra:,.0f}."
            .replace(",", ".")
        )
    return cupon


def calcular(
    db: Session,
    items: list[ItemPedidoEntrada],
    tipo_entrega: str,
    cupon_codigo: str | None,
) -> dict:
    """Calcula totales del carrito sin tocar la base (solo lectura)."""
    if not items:
        raise ErrorPedido("El carrito esta vacio.")

    cantidades = _consolidar(items)
    productos = _buscar_productos(db, cantidades)

    for producto in productos:
        if producto.stock < cantidades[producto.id]:
            raise ErrorPedido(
                f"Stock insuficiente para {producto.nombre}. Disponible: {producto.stock}.",
                409,
            )

    subtotal = sum(producto.precio_efectivo * cantidades[producto.id] for producto in productos)
    envio = 0 if tipo_entrega == "retiro" or subtotal >= MONTO_ENVIO_GRATIS else COSTO_ENVIO
    cupon = _validar_cupon(db, cupon_codigo, subtotal)

    descuento = 0
    if cupon is not None:
        if cupon.tipo == "porcentaje":
            descuento = round(subtotal * cupon.valor / 100)
        elif cupon.tipo == "monto":
            descuento = min(cupon.valor, subtotal)
        else:  # envio
            envio = 0

    total = max(subtotal + envio - descuento, 0)
    return {
        "productos": productos,
        "cantidades": cantidades,
        "subtotal": subtotal,
        "costo_envio": envio,
        "descuento": descuento,
        "total": total,
        "cupon": cupon,
    }


def crear_pedido(db: Session, usuario: Usuario, datos: PedidoEntrada) -> Pedido:
    calculo = calcular(db, datos.items, datos.tipo_entrega, datos.cupon_codigo)

    direccion_id = None
    direccion_texto = None
    if datos.tipo_entrega == "despacho":
        if datos.direccion_id is not None:
            direccion = db.scalar(
                select(Direccion).where(
                    Direccion.id == datos.direccion_id, Direccion.usuario_id == usuario.id
                )
            )
            if direccion is None:
                raise ErrorPedido("La direccion seleccionada no existe.")
        elif datos.direccion is not None:
            direccion = Direccion(usuario_id=usuario.id, **datos.direccion.model_dump())
            db.add(direccion)
            db.flush()
        else:
            raise ErrorPedido("Debes indicar una direccion de despacho.")

        direccion_id = direccion.id
        partes = [direccion.calle, direccion.numero]
        if direccion.departamento:
            partes.append(direccion.departamento)
        partes.extend([direccion.comuna, direccion.ciudad])
        direccion_texto = ", ".join(partes)

    pedido = Pedido(
        numero=f"TMP-{uuid4().hex[:12]}",
        usuario_id=usuario.id,
        estado="pagado",
        tipo_entrega=datos.tipo_entrega,
        direccion_id=direccion_id,
        direccion_texto=direccion_texto,
        subtotal=calculo["subtotal"],
        costo_envio=calculo["costo_envio"],
        descuento=calculo["descuento"],
        total=calculo["total"],
        cupon_codigo=calculo["cupon"].codigo if calculo["cupon"] else None,
    )
    db.add(pedido)
    db.flush()
    pedido.numero = f"AUR-{datetime.now():%Y%m%d}-{pedido.id:04d}"

    for producto in calculo["productos"]:
        cantidad = calculo["cantidades"][producto.id]
        producto.stock -= cantidad
        db.add(
            PedidoItem(
                pedido_id=pedido.id,
                producto_id=producto.id,
                nombre_producto=producto.nombre,
                imagen_url=producto.imagen_url,
                precio_unitario=producto.precio_efectivo,
                cantidad=cantidad,
                subtotal=producto.precio_efectivo * cantidad,
            )
        )

    db.commit()
    db.refresh(pedido)
    return pedido


def listar_pedidos(db: Session, usuario_id: int) -> list[Pedido]:
    return list(
        db.scalars(
            select(Pedido)
            .where(Pedido.usuario_id == usuario_id)
            .order_by(Pedido.creado_en.desc(), Pedido.id.desc())
        )
        .unique()
        .all()
    )


def obtener_pedido(db: Session, usuario_id: int, pedido_id: int) -> Pedido:
    pedido = db.scalar(
        select(Pedido).where(Pedido.id == pedido_id, Pedido.usuario_id == usuario_id)
    )
    if pedido is None:
        raise ErrorPedido("Pedido no encontrado.", 404)
    return pedido
