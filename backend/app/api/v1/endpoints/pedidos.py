"""Checkout e historial de pedidos."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, obtener_usuario_actual
from app.core.constantes import MONTO_ENVIO_GRATIS
from app.models.pedido import Usuario
from app.schemas.pedido import (
    CotizacionEntrada,
    CotizacionRespuesta,
    PedidoEntrada,
    PedidoRespuesta,
)
from app.services import pedido_service

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


def _respuesta_cotizacion(calculo: dict) -> CotizacionRespuesta:
    return CotizacionRespuesta(
        subtotal=calculo["subtotal"],
        costo_envio=calculo["costo_envio"],
        descuento=calculo["descuento"],
        total=calculo["total"],
        cupon_codigo=calculo["cupon"].codigo if calculo["cupon"] else None,
        monto_envio_gratis=MONTO_ENVIO_GRATIS,
        envio_gratis=calculo["costo_envio"] == 0,
    )


@router.post(
    "/cotizar",
    response_model=CotizacionRespuesta,
    status_code=status.HTTP_200_OK,
    summary="Calcular totales del carrito (envio y cupon)",
)
def cotizar(datos: CotizacionEntrada, db: Session = Depends(get_db)):
    try:
        calculo = pedido_service.calcular(
            db, datos.items, datos.tipo_entrega, datos.cupon_codigo
        )
    except pedido_service.ErrorPedido as error:
        raise HTTPException(status_code=error.estado_http, detail=error.mensaje)
    return _respuesta_cotizacion(calculo)


@router.post(
    "",
    response_model=PedidoRespuesta,
    status_code=status.HTTP_201_CREATED,
    summary="Confirmar la compra y crear el pedido",
)
def crear_pedido(
    datos: PedidoEntrada,
    usuario: Usuario = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    try:
        return pedido_service.crear_pedido(db, usuario, datos)
    except pedido_service.ErrorPedido as error:
        raise HTTPException(status_code=error.estado_http, detail=error.mensaje)


@router.get(
    "",
    response_model=list[PedidoRespuesta],
    status_code=status.HTTP_200_OK,
    summary="Historial de pedidos del cliente",
)
def listar_pedidos(
    usuario: Usuario = Depends(obtener_usuario_actual), db: Session = Depends(get_db)
):
    return pedido_service.listar_pedidos(db, usuario.id)


@router.get(
    "/{pedido_id}",
    response_model=PedidoRespuesta,
    status_code=status.HTTP_200_OK,
    summary="Detalle de un pedido propio",
)
def obtener_pedido(
    pedido_id: int,
    usuario: Usuario = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    try:
        return pedido_service.obtener_pedido(db, usuario.id, pedido_id)
    except pedido_service.ErrorPedido as error:
        raise HTTPException(status_code=error.estado_http, detail=error.mensaje)
