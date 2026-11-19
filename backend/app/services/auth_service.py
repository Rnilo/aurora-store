"""Registro, inicio de sesion y direcciones del cliente."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import crear_token_acceso, hashear_contrasena, verificar_contrasena
from app.models.pedido import Direccion, Usuario
from app.schemas.auth import (
    DireccionEntrada,
    RegistroEntrada,
    SesionEntrada,
    TokenRespuesta,
    UsuarioRespuesta,
)


class ErrorAutenticacion(Exception):
    """Error de negocio con mensaje presentable al cliente."""


def registrar(db: Session, datos: RegistroEntrada) -> TokenRespuesta:
    correo = datos.correo.lower().strip()
    if db.scalar(select(Usuario).where(Usuario.correo == correo)):
        raise ErrorAutenticacion("Ya existe una cuenta con ese correo.")

    usuario = Usuario(
        nombre=datos.nombre.strip(),
        correo=correo,
        hash_contrasena=hashear_contrasena(datos.contrasena),
        telefono=datos.telefono,
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return _crear_sesion(usuario)


def iniciar_sesion(db: Session, datos: SesionEntrada) -> TokenRespuesta:
    correo = datos.correo.lower().strip()
    usuario = db.scalar(select(Usuario).where(Usuario.correo == correo))
    if usuario is None or not verificar_contrasena(datos.contrasena, usuario.hash_contrasena):
        raise ErrorAutenticacion("Correo o contrasena incorrectos.")
    return _crear_sesion(usuario)


def _crear_sesion(usuario: Usuario) -> TokenRespuesta:
    return TokenRespuesta(
        access_token=crear_token_acceso(usuario.id, usuario.correo),
        usuario=UsuarioRespuesta.model_validate(usuario),
    )


def listar_direcciones(db: Session, usuario_id: int) -> list[Direccion]:
    return list(
        db.scalars(
            select(Direccion)
            .where(Direccion.usuario_id == usuario_id)
            .order_by(Direccion.predeterminada.desc(), Direccion.id)
        ).all()
    )


def crear_direccion(db: Session, usuario_id: int, datos: DireccionEntrada) -> Direccion:
    es_primera = not listar_direcciones(db, usuario_id)
    if datos.predeterminada or es_primera:
        for direccion in listar_direcciones(db, usuario_id):
            direccion.predeterminada = False

    direccion = Direccion(
        usuario_id=usuario_id,
        alias=datos.alias,
        calle=datos.calle,
        numero=datos.numero,
        departamento=datos.departamento,
        comuna=datos.comuna,
        ciudad=datos.ciudad,
        region=datos.region,
        codigo_postal=datos.codigo_postal,
        predeterminada=datos.predeterminada or es_primera,
    )
    db.add(direccion)
    db.commit()
    db.refresh(direccion)
    return direccion
