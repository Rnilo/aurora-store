"""Consultas de catalogo: categorias, marcas y productos."""

from sqlalchemy import Float, Select, func, or_, select
from sqlalchemy.orm import Session

from app.core.constantes import TAMANO_PAGINA_MAXIMO
from app.models.catalogo import Categoria, Marca, Producto

ORDENES_VALIDOS = {
    "relevancia",
    "precio_asc",
    "precio_desc",
    "descuento",
    "novedad",
    "calificacion",
}


def listar_categorias(db: Session) -> list[Categoria]:
    """Arbol de categorias activas (raices con sus hijas activas)."""
    raices = db.scalars(
        select(Categoria)
        .where(Categoria.categoria_padre_id.is_(None), Categoria.activa.is_(True))
        .order_by(Categoria.orden)
    ).all()
    for raiz in raices:
        raiz.subcategorias = [hija for hija in raiz.subcategorias if hija.activa]
    return list(raices)


def listar_marcas(db: Session) -> list[Marca]:
    return list(db.scalars(select(Marca).order_by(Marca.nombre)).all())


def _ids_de_categoria(db: Session, slug: str) -> list[int] | None:
    categoria = db.scalar(select(Categoria).where(Categoria.slug == slug))
    if categoria is None:
        return None
    ids = [categoria.id] + [hija.id for hija in categoria.subcategorias]
    return ids


def _aplicar_filtros(
    db: Session,
    consulta: Select,
    *,
    q: str | None,
    categoria: str | None,
    marca: str | None,
    precio_min: int | None,
    precio_max: int | None,
    solo_ofertas: bool,
    solo_destacados: bool,
) -> Select:
    precio_efectivo = func.coalesce(Producto.precio_oferta, Producto.precio)

    if q:
        patron = f"%{q.strip()}%"
        consulta = consulta.where(
            or_(Producto.nombre.ilike(patron), Producto.descripcion.ilike(patron))
        )
    if categoria:
        ids = _ids_de_categoria(db, categoria)
        if ids is None:
            return consulta.where(Producto.id == -1)
        consulta = consulta.where(Producto.categoria_id.in_(ids))
    if marca:
        consulta = consulta.join(Marca).where(Marca.slug == marca)
    if precio_min is not None:
        consulta = consulta.where(precio_efectivo >= precio_min)
    if precio_max is not None:
        consulta = consulta.where(precio_efectivo <= precio_max)
    if solo_ofertas:
        consulta = consulta.where(Producto.precio_oferta.is_not(None))
    if solo_destacados:
        consulta = consulta.where(Producto.destacado.is_(True))
    return consulta


def listar_productos(
    db: Session,
    *,
    q: str | None = None,
    categoria: str | None = None,
    marca: str | None = None,
    precio_min: int | None = None,
    precio_max: int | None = None,
    orden: str = "relevancia",
    solo_ofertas: bool = False,
    solo_destacados: bool = False,
    pagina: int = 1,
    tamano: int = 12,
) -> tuple[int, list[Producto]]:
    pagina = max(pagina, 1)
    tamano = min(max(tamano, 1), TAMANO_PAGINA_MAXIMO)
    orden = orden if orden in ORDENES_VALIDOS else "relevancia"

    base = select(Producto).where(Producto.activo.is_(True))
    base = _aplicar_filtros(
        db,
        base,
        q=q,
        categoria=categoria,
        marca=marca,
        precio_min=precio_min,
        precio_max=precio_max,
        solo_ofertas=solo_ofertas,
        solo_destacados=solo_destacados,
    )

    total = db.scalar(select(func.count()).select_from(base.order_by(None).subquery())) or 0

    precio_efectivo = func.coalesce(Producto.precio_oferta, Producto.precio)
    descuento_sql = (Producto.precio - precio_efectivo).cast(Float) / Producto.precio
    ordenamientos = {
        "relevancia": (Producto.destacado.desc(), Producto.resenas.desc(), Producto.id.asc()),
        "precio_asc": (precio_efectivo.asc(), Producto.id.asc()),
        "precio_desc": (precio_efectivo.desc(), Producto.id.asc()),
        "descuento": (descuento_sql.desc(), Producto.id.asc()),
        "novedad": (Producto.creado_en.desc(), Producto.id.desc()),
        "calificacion": (Producto.calificacion.desc(), Producto.resenas.desc()),
    }

    consulta = base.order_by(*ordenamientos[orden]).offset((pagina - 1) * tamano).limit(tamano)
    return total, list(db.scalars(consulta).unique().all())


def obtener_por_slug(db: Session, slug: str) -> Producto | None:
    return db.scalar(
        select(Producto).where(Producto.slug == slug, Producto.activo.is_(True))
    )


def productos_relacionados(db: Session, producto: Producto, limite: int = 8) -> list[Producto]:
    return list(
        db.scalars(
            select(Producto)
            .where(
                Producto.activo.is_(True),
                Producto.categoria_id == producto.categoria_id,
                Producto.id != producto.id,
            )
            .order_by(Producto.destacado.desc(), Producto.resenas.desc())
            .limit(limite)
        )
        .unique()
        .all()
    )
