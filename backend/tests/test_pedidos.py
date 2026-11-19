"""Checkout: cotizacion, creacion de pedido e historial."""

ITEMS = [{"producto_id": 1, "cantidad": 1}]


def test_cotizacion_aplica_cupon(cliente):
    respuesta = cliente.post(
        "/api/v1/pedidos/cotizar",
        json={"items": ITEMS, "tipo_entrega": "despacho", "cupon_codigo": "bienvenido10"},
    )
    assert respuesta.status_code == 200, respuesta.text
    datos = respuesta.json()
    assert datos["subtotal"] == 399990
    assert datos["costo_envio"] == 0
    assert datos["descuento"] == 39999
    assert datos["total"] == 359991
    assert datos["cupon_codigo"] == "BIENVENIDO10"


def test_cotizacion_cobra_envio_bajo_el_minimo(cliente):
    respuesta = cliente.post(
        "/api/v1/pedidos/cotizar",
        json={"items": [{"producto_id": 3, "cantidad": 1}], "tipo_entrega": "despacho"},
    )
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert datos["costo_envio"] == 3990
    assert datos["envio_gratis"] is False


def test_cotizacion_retiro_no_cobra_envio(cliente):
    respuesta = cliente.post(
        "/api/v1/pedidos/cotizar",
        json={"items": [{"producto_id": 3, "cantidad": 1}], "tipo_entrega": "retiro"},
    )
    assert respuesta.status_code == 200
    assert respuesta.json()["costo_envio"] == 0


def test_cupon_inactivo_es_rechazado(cliente):
    respuesta = cliente.post(
        "/api/v1/pedidos/cotizar",
        json={"items": ITEMS, "tipo_entrega": "despacho", "cupon_codigo": "INACTIVO"},
    )
    assert respuesta.status_code == 400
    assert "no existe" in respuesta.json()["detail"]


def test_pedido_exige_sesion(cliente):
    respuesta = cliente.post(
        "/api/v1/pedidos",
        json={"items": ITEMS, "tipo_entrega": "despacho", "direccion_id": 1},
    )
    assert respuesta.status_code == 401


def test_pedido_despacho_sin_direccion(cliente_autenticado):
    respuesta = cliente_autenticado.post(
        "/api/v1/pedidos",
        json={"items": ITEMS, "tipo_entrega": "despacho"},
    )
    assert respuesta.status_code == 400
    assert "direccion" in respuesta.json()["detail"]


def test_pedido_descuenta_stock_y_aparece_en_historial(cliente_autenticado, sesion_bd):
    from app.models.catalogo import Producto

    respuesta = cliente_autenticado.post(
        "/api/v1/pedidos",
        json={
            "items": [{"producto_id": 1, "cantidad": 2}],
            "tipo_entrega": "despacho",
            "direccion_id": 1,
        },
    )
    assert respuesta.status_code == 201, respuesta.text
    pedido = respuesta.json()
    assert pedido["numero"].startswith("AUR-")
    assert pedido["subtotal"] == 799980
    assert pedido["total"] == 799980
    assert len(pedido["items"]) == 1
    assert pedido["items"][0]["cantidad"] == 2

    sesion_bd.expire_all()
    assert sesion_bd.get(Producto, 1).stock == 8

    historial = cliente_autenticado.get("/api/v1/pedidos")
    assert historial.status_code == 200
    assert len(historial.json()) == 1

    detalle = cliente_autenticado.get(f"/api/v1/pedidos/{pedido['id']}")
    assert detalle.status_code == 200
    assert detalle.json()["numero"] == pedido["numero"]


def test_pedido_sin_stock(cliente_autenticado):
    respuesta = cliente_autenticado.post(
        "/api/v1/pedidos",
        json={
            "items": [{"producto_id": 4, "cantidad": 1}],
            "tipo_entrega": "retiro",
        },
    )
    assert respuesta.status_code == 409
    assert "Stock insuficiente" in respuesta.json()["detail"]


def test_pedido_ajeno_no_es_visible(cliente_autenticado):
    assert cliente_autenticado.get("/api/v1/pedidos/999").status_code == 404
