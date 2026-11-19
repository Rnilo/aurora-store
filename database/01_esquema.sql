-- ============================================================
-- Aurora Store - Esquema de base de datos (PostgreSQL 16)
-- Se ejecuta una sola vez al crear el volumen (docker-entrypoint-initdb.d).
-- Para cambiar el esquema: editar este archivo y recrear el volumen
-- (docker compose down -v && docker compose up -d).
-- ============================================================

SET client_min_messages = warning;
SET timezone = 'America/Santiago';

-- ------------------------------------------------------------
-- Catalogo
-- ------------------------------------------------------------
CREATE TABLE categorias (
    id                  SERIAL PRIMARY KEY,
    nombre              VARCHAR(80)  NOT NULL,
    slug                VARCHAR(80)  NOT NULL UNIQUE,
    icono               VARCHAR(16)  NOT NULL DEFAULT '',
    categoria_padre_id  INTEGER      REFERENCES categorias (id) ON DELETE SET NULL,
    orden               INTEGER      NOT NULL DEFAULT 0,
    activa              BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE marcas (
    id      SERIAL PRIMARY KEY,
    nombre  VARCHAR(80) NOT NULL UNIQUE,
    slug    VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE productos (
    id              SERIAL PRIMARY KEY,
    categoria_id    INTEGER      NOT NULL REFERENCES categorias (id),
    marca_id        INTEGER      REFERENCES marcas (id) ON DELETE SET NULL,
    nombre          VARCHAR(180) NOT NULL,
    slug            VARCHAR(180) NOT NULL UNIQUE,
    descripcion     TEXT         NOT NULL DEFAULT '',
    precio          INTEGER      NOT NULL CHECK (precio > 0),
    precio_oferta   INTEGER      CHECK (precio_oferta IS NULL OR (precio_oferta > 0 AND precio_oferta < precio)),
    stock           INTEGER      NOT NULL DEFAULT 0 CHECK (stock >= 0),
    sku             VARCHAR(40)  NOT NULL UNIQUE,
    imagen_url      VARCHAR(255) NOT NULL DEFAULT '',
    calificacion    NUMERIC(2,1) NOT NULL DEFAULT 4.5 CHECK (calificacion BETWEEN 0 AND 5),
    resenas         INTEGER      NOT NULL DEFAULT 0,
    destacado       BOOLEAN      NOT NULL DEFAULT FALSE,
    activo          BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_productos_categoria ON productos (categoria_id);
CREATE INDEX idx_productos_marca     ON productos (marca_id);
CREATE INDEX idx_productos_destacado ON productos (destacado) WHERE activo;

CREATE TABLE imagenes_producto (
    id           SERIAL PRIMARY KEY,
    producto_id  INTEGER      NOT NULL REFERENCES productos (id) ON DELETE CASCADE,
    url          VARCHAR(255) NOT NULL,
    orden        INTEGER      NOT NULL DEFAULT 0
);

CREATE INDEX idx_imagenes_producto ON imagenes_producto (producto_id);

-- ------------------------------------------------------------
-- Clientes
-- ------------------------------------------------------------
CREATE TABLE usuarios (
    id                SERIAL PRIMARY KEY,
    nombre            VARCHAR(120) NOT NULL,
    correo            VARCHAR(160) NOT NULL UNIQUE,
    hash_contrasena   VARCHAR(255) NOT NULL,
    telefono          VARCHAR(30),
    creado_en         TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE direcciones (
    id             SERIAL PRIMARY KEY,
    usuario_id     INTEGER      NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
    alias          VARCHAR(60)  NOT NULL DEFAULT 'Casa',
    calle          VARCHAR(160) NOT NULL,
    numero         VARCHAR(20)  NOT NULL,
    departamento   VARCHAR(40),
    comuna         VARCHAR(80)  NOT NULL,
    ciudad         VARCHAR(80)  NOT NULL,
    region         VARCHAR(80)  NOT NULL,
    codigo_postal  VARCHAR(20),
    predeterminada BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_direcciones_usuario ON direcciones (usuario_id);

-- ------------------------------------------------------------
-- Pedidos
-- ------------------------------------------------------------
CREATE TABLE cupones (
    id            SERIAL PRIMARY KEY,
    codigo        VARCHAR(40) NOT NULL UNIQUE,
    tipo          VARCHAR(20) NOT NULL DEFAULT 'porcentaje'
                  CHECK (tipo IN ('porcentaje', 'monto', 'envio')),
    valor         INTEGER     NOT NULL DEFAULT 0 CHECK (valor >= 0),
    minimo_compra INTEGER     NOT NULL DEFAULT 0,
    activo        BOOLEAN     NOT NULL DEFAULT TRUE,
    vence_en      DATE
);

CREATE TABLE pedidos (
    id               SERIAL PRIMARY KEY,
    numero           VARCHAR(20) NOT NULL UNIQUE,
    usuario_id       INTEGER     NOT NULL REFERENCES usuarios (id),
    estado           VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                     CHECK (estado IN ('pendiente', 'pagado', 'preparando', 'enviado', 'entregado', 'cancelado')),
    tipo_entrega     VARCHAR(20) NOT NULL DEFAULT 'despacho'
                     CHECK (tipo_entrega IN ('despacho', 'retiro')),
    direccion_id     INTEGER     REFERENCES direcciones (id) ON DELETE SET NULL,
    direccion_texto  VARCHAR(255),
    subtotal         INTEGER     NOT NULL CHECK (subtotal >= 0),
    costo_envio      INTEGER     NOT NULL DEFAULT 0 CHECK (costo_envio >= 0),
    descuento        INTEGER     NOT NULL DEFAULT 0 CHECK (descuento >= 0),
    total            INTEGER     NOT NULL CHECK (total >= 0),
    cupon_codigo     VARCHAR(40),
    creado_en        TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pedidos_usuario ON pedidos (usuario_id, creado_en DESC);

CREATE TABLE pedido_items (
    id               SERIAL PRIMARY KEY,
    pedido_id        INTEGER      NOT NULL REFERENCES pedidos (id) ON DELETE CASCADE,
    producto_id      INTEGER      REFERENCES productos (id) ON DELETE SET NULL,
    nombre_producto  VARCHAR(180) NOT NULL,
    imagen_url       VARCHAR(255) NOT NULL DEFAULT '',
    precio_unitario  INTEGER      NOT NULL CHECK (precio_unitario > 0),
    cantidad         INTEGER      NOT NULL CHECK (cantidad > 0),
    subtotal         INTEGER      NOT NULL CHECK (subtotal > 0)
);

CREATE INDEX idx_pedido_items ON pedido_items (pedido_id);
