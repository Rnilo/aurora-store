"""Punto de entrada de la API de Aurora Store."""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import ajustes
from app.middleware.limite_tasa import LimiteTasaMiddleware

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s"
)

app = FastAPI(
    title=ajustes.nombre_app,
    version=ajustes.version,
    description=(
        "API de la tienda Aurora Store: catalogo, cuentas de cliente, checkout y "
        "historial de pedidos. Precios en pesos chilenos enteros."
    ),
)

# El limite de tasa se agrega primero para que CORS quede como capa externa
# y las respuestas 429 tambien lleven cabeceras CORS.
app.add_middleware(LimiteTasaMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ajustes.origenes_permitidos,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["Salud"], summary="Estado del servicio")
def salud() -> dict:
    return {"estado": "ok", "servicio": ajustes.nombre_app, "version": ajustes.version}
