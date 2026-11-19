"""Registro, login y perfil del cliente."""


def test_registro_crea_cuenta_y_devuelve_token(cliente):
    respuesta = cliente.post(
        "/api/v1/auth/registro",
        json={
            "nombre": "Ana Perez",
            "correo": "ana@correo.cl",
            "contrasena": "Secreta123",
            "telefono": "+56 9 5555 5555",
        },
    )
    assert respuesta.status_code == 201, respuesta.text
    datos = respuesta.json()
    assert datos["token_type"] == "bearer"
    assert datos["usuario"]["correo"] == "ana@correo.cl"
    assert "contrasena" not in datos["usuario"]


def test_registro_duplicado(cliente):
    respuesta = cliente.post(
        "/api/v1/auth/registro",
        json={
            "nombre": "Otro Cliente",
            "correo": "cliente@aurora.cl",
            "contrasena": "Secreta123",
        },
    )
    assert respuesta.status_code == 409


def test_login_correcto(cliente):
    respuesta = cliente.post(
        "/api/v1/auth/login",
        json={"correo": "cliente@aurora.cl", "contrasena": "Demo1234"},
    )
    assert respuesta.status_code == 200
    assert respuesta.json()["usuario"]["nombre"] == "Cliente Demo"


def test_login_incorrecto(cliente):
    respuesta = cliente.post(
        "/api/v1/auth/login",
        json={"correo": "cliente@aurora.cl", "contrasena": "incorrecta"},
    )
    assert respuesta.status_code == 401


def test_perfil_sin_token(cliente):
    assert cliente.get("/api/v1/auth/yo").status_code == 401


def test_perfil_con_token(cliente_autenticado):
    respuesta = cliente_autenticado.get("/api/v1/auth/yo")
    assert respuesta.status_code == 200
    assert respuesta.json()["correo"] == "cliente@aurora.cl"


def test_direcciones_del_cliente(cliente_autenticado):
    respuesta = cliente_autenticado.get("/api/v1/auth/direcciones")
    assert respuesta.status_code == 200
    assert [direccion["comuna"] for direccion in respuesta.json()] == ["Providencia"]


def test_crear_direccion_nueva(cliente_autenticado):
    respuesta = cliente_autenticado.post(
        "/api/v1/auth/direcciones",
        json={
            "alias": "Trabajo",
            "calle": "Av. Apoquindo",
            "numero": "4501",
            "comuna": "Las Condes",
            "ciudad": "Santiago",
            "region": "Metropolitana",
        },
    )
    assert respuesta.status_code == 201
    assert respuesta.json()["alias"] == "Trabajo"
