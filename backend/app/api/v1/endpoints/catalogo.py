"""Endpoints publicos del catalogo."""

from math import ceil

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.schemas.catalogo import (
    CategoriaRespuesta,
    MarcaRespuesta,
    PaginaProductos,
    ProductoDetalle,
    ProductoResumen,
)
from app.services import catalogo_service

router = APIRouter(prefix="/catalogo", tags=["Catalogo"])


@router.get(
    "/categorias",
    response_model=list[CategoriaRespuesta],
    status_code=status.HTTP_200_OK,
    summary="Arbol de categorias activas",
)
def listar_categorias(db: Session = Depends(get_db)):
    return catalogo_service.listar_categorias(db)


@router.get(
    "/marcas",
    response_model=list[MarcaRespuesta],
    status_code=status.HTTP_200_OK,
    summary="Marcas disponibles",
)
def listar_marcas(db: Session = Depends(get_db)):
    return catalogo_service.listar_marcas(db)


@router.get(
    "/productos",
    response_model=PaginaProductos,
    status_code=status.HTTP_200_OK,
    summary="Buscar productos con filtros y paginacion",
)
def listar_productos(
    q: str | None = Query(None, max_length=80, description="Texto a buscar en nombre y descripcion"),
    categoria: str | None = Query(None, description="Slug de la categoria (incluye sus subcategorias)"),
    marca: str | None = Query(None, description="Slug de la marca"),
    precio_min: int | None = Query(None, ge=0),
    precio_max: int | None = Query(None, ge=0),
    orden: str = Query(
        "relevancia",
        pattern="^(relevancia|precio_asc|precio_desc|descuento|novedad|calificacion)$",
    ),
    ofertas: bool = Query(False, description="Solo productos con precio de oferta"),
    destacados: bool = Query(False, description="Solo productos destacados"),
    pagina: int = Query(1, ge=1),
    tamano: int = Query(12, ge=1, le=48),
    db: Session = Depends(get_db),
):
    total, items = catalogo_service.listar_productos(
        db,
        q=q,
        categoria=categoria,
        marca=marca,
        precio_min=precio_min,
        precio_max=precio_max,
        orden=orden,
        solo_ofertas=ofertas,
        solo_destacados=destacados,
        pagina=pagina,
        tamano=tamano,
    )
    return PaginaProductos(
        total=total,
        pagina=pagina,
        tamano=tamano,
        paginas=max(ceil(total / tamano), 1),
        items=items,
    )


@router.get(
    "/productos/{slug}",
    response_model=ProductoDetalle,
    status_code=status.HTTP_200_OK,
    summary="Detalle de un producto por slug",
)
def obtener_producto(slug: str, db: Session = Depends(get_db)):
    producto = catalogo_service.obtener_por_slug(db, slug)
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")
    return producto


@router.get(
    "/productos/{slug}/relacionados",
    response_model=list[ProductoResumen],
    status_code=status.HTTP_200_OK,
    summary="Productos de la misma categoria",
)
def productos_relacionados(slug: str, db: Session = Depends(get_db)):
    producto = catalogo_service.obtener_por_slug(db, slug)
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")
    return catalogo_service.productos_relacionados(db, producto)
