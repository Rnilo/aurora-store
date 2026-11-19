"""Registro, login y direcciones del cliente."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, obtener_usuario_actual
from app.models.pedido import Usuario
from app.schemas.auth import (
    DireccionEntrada,
    DireccionRespuesta,
    RegistroEntrada,
    SesionEntrada,
    TokenRespuesta,
    UsuarioRespuesta,
)
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Cuenta"])


@router.post(
    "/registro",
    response_model=TokenRespuesta,
    status_code=status.HTTP_201_CREATED,
    summary="Crear una cuenta de cliente",
)
def registrar(datos: RegistroEntrada, db: Session = Depends(get_db)):
    try:
        return auth_service.registrar(db, datos)
    except auth_service.ErrorAutenticacion as error:
        raise HTTPException(status_code=409, detail=str(error))


@router.post(
    "/login",
    response_model=TokenRespuesta,
    status_code=status.HTTP_200_OK,
    summary="Iniciar sesion y obtener un token Bearer",
)
def iniciar_sesion(datos: SesionEntrada, db: Session = Depends(get_db)):
    try:
        return auth_service.iniciar_sesion(db, datos)
    except auth_service.ErrorAutenticacion as error:
        raise HTTPException(status_code=401, detail=str(error))


@router.get(
    "/yo",
    response_model=UsuarioRespuesta,
    status_code=status.HTTP_200_OK,
    summary="Perfil del cliente autenticado",
)
def obtener_perfil(usuario: Usuario = Depends(obtener_usuario_actual)):
    return usuario


@router.get(
    "/direcciones",
    response_model=list[DireccionRespuesta],
    status_code=status.HTTP_200_OK,
    summary="Direcciones del cliente autenticado",
)
def listar_direcciones(
    usuario: Usuario = Depends(obtener_usuario_actual), db: Session = Depends(get_db)
):
    return auth_service.listar_direcciones(db, usuario.id)


@router.post(
    "/direcciones",
    response_model=DireccionRespuesta,
    status_code=status.HTTP_201_CREATED,
    summary="Agregar una direccion de despacho",
)
def crear_direccion(
    datos: DireccionEntrada,
    usuario: Usuario = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    return auth_service.crear_direccion(db, usuario.id, datos)
