"""Contrato publico del catalogo."""

def test_arbol_de_categorias(cliente):
    respuesta = cliente.get("/api/v1/catalogo/categorias")
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert [categoria["slug"] for categoria in datos] == ["tecnologia", "hogar"]
    assert [hija["slug"] for hija in datos[0]["subcategorias"]] == ["celulares"]


def test_listado_paginado(cliente):
    respuesta = cliente.get("/api/v1/catalogo/productos", params={"tamano": 2})
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert datos["total"] == 4
    assert datos["paginas"] == 2
    assert len(datos["items"]) == 2
    assert datos["items"][0]["precio_efectivo"] > 0


def test_filtra_por_categoria_padre(cliente):
    respuesta = cliente.get("/api/v1/catalogo/productos", params={"categoria": "tecnologia"})
    assert respuesta.status_code == 200
    slugs = {item["slug"] for item in respuesta.json()["items"]}
    assert slugs == {"smartphone-nova-x6", "notebook-nova-pro"}


def test_busqueda_por_texto(cliente):
    respuesta = cliente.get("/api/v1/catalogo/productos", params={"q": "amoled"})
    assert respuesta.status_code == 200
    assert [item["slug"] for item in respuesta.json()["items"]] == ["smartphone-nova-x6"]


def test_filtros_combinados(cliente):
    respuesta = cliente.get(
        "/api/v1/catalogo/productos",
        params={"ofertas": True, "precio_max": 100000, "orden": "precio_asc"},
    )
    assert respuesta.status_code == 200
    items = respuesta.json()["items"]
    assert [item["slug"] for item in items] == ["lampara-vela-nordica"]


def test_detalle_con_galeria(cliente):
    respuesta = cliente.get("/api/v1/catalogo/productos/smartphone-nova-x6")
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert datos["porcentaje_descuento"] == 20
    assert datos["envio_gratis"] is True
    assert len(datos["imagenes"]) == 1
    assert datos["marca"]["nombre"] == "Nova"


def test_detalle_inexistente(cliente):
    respuesta = cliente.get("/api/v1/catalogo/productos/no-existe")
    assert respuesta.status_code == 404
    assert respuesta.json()["detail"] == "Producto no encontrado."


def test_marcas(cliente):
    respuesta = cliente.get("/api/v1/catalogo/marcas")
    assert respuesta.status_code == 200
    assert [marca["slug"] for marca in respuesta.json()] == ["nova", "vela"]
