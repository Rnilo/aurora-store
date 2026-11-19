"""Hash de contrasenas (PBKDF2-SHA256) y emision/validacion de JWT."""

import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone

import jwt

from app.core.config import ajustes

ALGORITMO_HASH = "pbkdf2_sha256"
ITERACIONES = 210_000


def hashear_contrasena(contrasena: str) -> str:
    sal = os.urandom(16)
    resumen = hashlib.pbkdf2_hmac("sha256", contrasena.encode("utf-8"), sal, ITERACIONES)
    return f"{ALGORITMO_HASH}${ITERACIONES}${sal.hex()}${resumen.hex()}"


def verificar_contrasena(contrasena: str, valor_guardado: str) -> bool:
    try:
        algoritmo, iteraciones, sal_hex, resumen_hex = valor_guardado.split("$")
        if algoritmo != ALGORITMO_HASH:
            return False
        resumen = hashlib.pbkdf2_hmac(
            "sha256", contrasena.encode("utf-8"), bytes.fromhex(sal_hex), int(iteraciones)
        )
        return hmac.compare_digest(resumen.hex(), resumen_hex)
    except (ValueError, TypeError):
        return False


def crear_token_acceso(usuario_id: int, correo: str) -> str:
    expira = datetime.now(timezone.utc) + timedelta(minutes=ajustes.token_expira_minutos)
    return jwt.encode(
        {"sub": str(usuario_id), "correo": correo, "exp": expira},
        ajustes.secreto_jwt,
        algorithm=ajustes.algoritmo_jwt,
    )


def decodificar_token(token: str) -> dict:
    return jwt.decode(token, ajustes.secreto_jwt, algorithms=[ajustes.algoritmo_jwt])
