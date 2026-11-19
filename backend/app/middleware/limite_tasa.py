"""Limite de tasa distribuido (Redis, fail-open) para /api/v1/*."""

import logging
import time

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.core.config import ajustes

logger = logging.getLogger(__name__)

_cliente = None
_ultimo_aviso = 0.0


def _obtener_cliente():
    global _cliente
    if _cliente is None:
        import redis.asyncio as redis

        _cliente = redis.from_url(
            ajustes.redis_url,
            decode_responses=True,
            socket_connect_timeout=0.25,
            socket_timeout=0.25,
        )
    return _cliente


class LimiteTasaMiddleware(BaseHTTPMiddleware):
    """Ventana fija por IP. Si Redis no responde, la peticion pasa (fail-open)."""

    async def dispatch(self, request: Request, call_next):
        global _ultimo_aviso

        if (
            not ajustes.limite_tasa_habilitado
            or request.method == "OPTIONS"
            or not request.url.path.startswith("/api/v1")
        ):
            return await call_next(request)

        reenviada = request.headers.get("x-forwarded-for", "")
        ip = reenviada.split(",")[0].strip() or (
            request.client.host if request.client else "desconocida"
        )
        ventana = max(ajustes.limite_tasa_ventana_segundos, 1)
        marca_tiempo = int(time.time()) // ventana
        clave = f"aurora:limite:{ip}:{marca_tiempo}"

        try:
            cliente = _obtener_cliente()
            total = await cliente.incr(clave)
            if total == 1:
                await cliente.expire(clave, ventana)
            if total > ajustes.limite_tasa_max_peticiones:
                return JSONResponse(
                    status_code=429,
                    content={
                        "detail": "Demasiadas solicitudes. Intenta nuevamente en unos segundos."
                    },
                )
        except Exception as error:  # noqa: BLE001 - fail-open deliberado
            ahora = time.monotonic()
            if ahora - _ultimo_aviso > 10:
                _ultimo_aviso = ahora
                logger.warning("Limite de tasa sin Redis, se continua: %s", error)

        return await call_next(request)
