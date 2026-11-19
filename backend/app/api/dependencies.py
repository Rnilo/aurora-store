"""Dependencias compartidas: sesion de base y autenticacion."""

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decodificar_token
from app.db.database import get_db
from app.models.pedido import Usuario

esquema_portador = HTTPBearer(auto_error=False)

CREDENCIALES_INVALIDAS = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Sesion invalida o expirada.",
    headers={"WWW-Authenticate": "Bearer"},
)


def _usuario_desde_credenciales(
    credenciales: HTTPAuthorizationCredentials | None, db: Session
) -> Usuario | None:
    if credenciales is None:
        return None
    try:
        datos = decodificar_token(credenciales.credentials)
        usuario_id = int(datos.get("sub", 0))
    except (jwt.PyJWTError, ValueError, TypeError):
        raise CREDENCIALES_INVALIDAS

    if usuario_id <= 0:
        raise CREDENCIALES_INVALIDAS
    return db.get(Usuario, usuario_id)


def obtener_usuario_actual(
    credenciales: HTTPAuthorizationCredentials | None = Depends(esquema_portador),
    db: Session = Depends(get_db),
) -> Usuario:
    usuario = _usuario_desde_credenciales(credenciales, db)
    if usuario is None:
        raise CREDENCIALES_INVALIDAS
    return usuario


def obtener_usuario_opcional(
    credenciales: HTTPAuthorizationCredentials | None = Depends(esquema_portador),
    db: Session = Depends(get_db),
) -> Usuario | None:
    return _usuario_desde_credenciales(credenciales, db)
