"""Fixtures de la suite: base SQLite en memoria y cliente HTTP."""

import os

os.environ["LIMITE_TASA_HABILITADO"] = "false"
os.environ["SECRETO_JWT"] = "secreto-de-pruebas"

from decimal import Decimal  # noqa: E402

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

from app.core.security import hashear_contrasena  # noqa: E402
from app.db.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402
from app.models.catalogo import Categoria, ImagenProducto, Marca, Producto  # noqa: E402
from app.models.pedido import Cupon, Direccion, Usuario  # noqa: E402


def _sembrar(db) -> None:
    tecnologia = Categoria(id=1, nombre="Tecnologia", slug="tecnologia", icono="MONITOR", orden=1)
    celulares = Categoria(
        id=2, nombre="Celulares", slug="celulares", icono="PHONE", categoria_padre_id=1, orden=1
    )
    hogar = Categoria(id=3, nombre="Hogar", slug="hogar", icono="SOFA", orden=2)
    db.add_all([tecnologia, celulares, hogar])

    nova = Marca(id=1, nombre="Nova", slug="nova")
    vela = Marca(id=2, nombre="Vela", slug="vela")
    db.add_all([nova, vela])

    productos = [
        Producto(
            id=1,
            categoria_id=2,
            marca_id=1,
            nombre="Smartphone Nova X6",
            slug="smartphone-nova-x6",
            descripcion="Pantalla AMOLED y 128 GB.",
            precio=499990,
            precio_oferta=399990,
            stock=10,
            sku="AUR-0001",
            imagen_url="/img/productos/smartphone-nova-x6.svg",
            calificacion=Decimal("4.7"),
            resenas=120,
            destacado=True,
        ),
        Producto(
            id=2,
            categoria_id=1,
            marca_id=1,
            nombre="Notebook Nova Pro",
            slug="notebook-nova-pro",
            descripcion="16 GB de RAM y SSD de 512 GB.",
            precio=999990,
            stock=3,
            sku="AUR-0002",
            imagen_url="/img/productos/notebook-nova-pro.svg",
            calificacion=Decimal("4.5"),
            resenas=40,
        ),
        Producto(
            id=3,
            categoria_id=3,
            marca_id=2,
            nombre="Lampara Vela Nordica",
            slug="lampara-vela-nordica",
            descripcion="Luz calida regulable.",
            precio=59990,
            precio_oferta=44990,
            stock=20,
            sku="AUR-0003",
            imagen_url="/img/productos/lampara-vela-nordica.svg",
            calificacion=Decimal("4.4"),
            resenas=18,
        ),
        Producto(
            id=4,
            categoria_id=3,
            marca_id=2,
            nombre="Sillon Aurora Oslo",
            slug="sillon-aurora-oslo",
            descripcion="Tapiz textil y patas de madera.",
            precio=249990,
            precio_oferta=199990,
            stock=0,
            sku="AUR-0004",
            imagen_url="/img/productos/sillon-aurora-oslo.svg",
            calificacion=Decimal("4.6"),
            resenas=9,
        ),
    ]
    for producto in productos:
        producto.imagenes.append(
            ImagenProducto(url=producto.imagen_url.replace(".svg", "-2.svg"), orden=1)
        )
    db.add_all(productos)

    cliente = Usuario(
        id=1,
        nombre="Cliente Demo",
        correo="cliente@aurora.cl",
        hash_contrasena=hashear_contrasena("Demo1234"),
        telefono="+56 9 1234 5678",
    )
    db.add(cliente)
    db.add(
        Direccion(
            id=1,
            usuario_id=1,
            alias="Casa",
            calle="Av. Providencia",
            numero="1234",
            comuna="Providencia",
            ciudad="Santiago",
            region="Metropolitana",
            predeterminada=True,
        )
    )
    db.add_all(
        [
            Cupon(codigo="BIENVENIDO10", tipo="porcentaje", valor=10, minimo_compra=0),
            Cupon(codigo="ENVIOGRATIS", tipo="envio", valor=0, minimo_compra=0),
            Cupon(codigo="INACTIVO", tipo="monto", valor=5000, minimo_compra=0, activo=False),
        ]
    )
    db.commit()


@pytest.fixture()
def sesion_bd():
    motor = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        future=True,
    )
    Base.metadata.create_all(motor)
    Sesion = sessionmaker(bind=motor, autoflush=False, autocommit=False, future=True)
    db = Sesion()
    _sembrar(db)
    yield db
    db.close()
    Base.metadata.drop_all(motor)


@pytest.fixture()
def cliente(sesion_bd):
    def _get_db():
        yield sesion_bd

    app.dependency_overrides[get_db] = _get_db
    with TestClient(app) as cliente_pruebas:
        yield cliente_pruebas
    app.dependency_overrides.clear()


@pytest.fixture()
def cliente_autenticado(cliente):
    respuesta = cliente.post(
        "/api/v1/auth/login",
        json={"correo": "cliente@aurora.cl", "contrasena": "Demo1234"},
    )
    assert respuesta.status_code == 200, respuesta.text
    cliente.headers.update({"Authorization": f"Bearer {respuesta.json()['access_token']}"})
    return cliente
