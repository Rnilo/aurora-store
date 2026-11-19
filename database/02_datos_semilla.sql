-- ============================================================
-- Aurora Store - Datos semilla (QA)
-- Se ejecuta despues de 01_esquema.sql, en el primer arranque.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- Categorias (8 raices + 24 subcategorias)
-- ------------------------------------------------------------
INSERT INTO categorias (id, nombre, slug, icono, categoria_padre_id, orden) VALUES
  (1, 'Tecnología', 'tecnologia', 'MONITOR', NULL, 1),
  (2, 'Electrohogar', 'electrohogar', 'PLUG', NULL, 2),
  (3, 'Moda', 'moda', 'SHIRT', NULL, 3),
  (4, 'Calzado', 'calzado', 'SHOE', NULL, 4),
  (5, 'Belleza', 'belleza', 'SPARK', NULL, 5),
  (6, 'Hogar y Muebles', 'hogar', 'SOFA', NULL, 6),
  (7, 'Juguetes', 'juguetes', 'TOY', NULL, 7),
  (8, 'Deportes', 'deportes', 'BALL', NULL, 8),

  (9,  'Celulares', 'celulares', 'PHONE', 1, 1),
  (10, 'Computación', 'computacion', 'LAPTOP', 1, 2),
  (11, 'Audio', 'audio', 'HEADPHONES', 1, 3),
  (12, 'TV y Video', 'tv', 'TV', 1, 4),
  (13, 'Refrigeración', 'refrigeracion', 'SNOW', 2, 1),
  (14, 'Cocina', 'cocina', 'PAN', 2, 2),
  (15, 'Lavado', 'lavado', 'WASH', 2, 3),
  (16, 'Climatización', 'climatizacion', 'WIND', 2, 4),
  (17, 'Mujer', 'mujer', 'DRESS', 3, 1),
  (18, 'Hombre', 'hombre', 'TIE', 3, 2),
  (19, 'Accesorios', 'accesorios', 'BAG', 3, 3),
  (20, 'Zapatillas', 'zapatillas', 'SNEAKER', 4, 1),
  (21, 'Botas', 'botas', 'BOOT', 4, 2),
  (22, 'Perfumes', 'perfumes', 'FLOWER', 5, 1),
  (23, 'Maquillaje', 'maquillaje', 'LIPSTICK', 5, 2),
  (24, 'Cuidado de la piel', 'cuidado-piel', 'CREAM', 5, 3),
  (25, 'Muebles', 'muebles', 'SOFA', 6, 1),
  (26, 'Decoración', 'decoracion', 'LAMP', 6, 2),
  (27, 'Cocina y mesa', 'cocina-mesa', 'PLATE', 6, 3),
  (28, 'Didácticos', 'didacticos', 'PUZZLE', 7, 1),
  (29, 'Muñecas y peluches', 'munecas', 'DOLL', 7, 2),
  (30, 'Armables', 'armables', 'BRICK', 7, 3),
  (31, 'Fitness', 'fitness', 'DUMBBELL', 8, 1),
  (32, 'Outdoor', 'outdoor', 'TENT', 8, 2);

-- ------------------------------------------------------------
-- Marcas
-- ------------------------------------------------------------
INSERT INTO marcas (id, nombre, slug) VALUES
  (1, 'Nova', 'nova'),
  (2, 'Vertex', 'vertex'),
  (3, 'Lumen', 'lumen'),
  (4, 'Solaris', 'solaris'),
  (5, 'Aurora Home', 'aurora-home'),
  (6, 'Andes', 'andes'),
  (7, 'Mistral', 'mistral'),
  (8, 'Kaia', 'kaia'),
  (9, 'Roble', 'roble'),
  (10, 'Vela', 'vela'),
  (11, 'Zenit', 'zenit'),
  (12, 'Pampa', 'pampa');

-- ------------------------------------------------------------
-- Productos (48)
-- ------------------------------------------------------------
INSERT INTO productos
  (id, categoria_id, marca_id, nombre, slug, descripcion, precio, precio_oferta, stock, sku, imagen_url, calificacion, resenas, destacado)
VALUES
  (1, 9, 1, 'Smartphone Nova X6 5G 128 GB', 'smartphone-nova-x6-5g-128gb',
   'Pantalla AMOLED de 6,6 pulgadas, 128 GB de almacenamiento y carga rápida de 45 W. Cámara principal de 64 MP con modo noche.',
   499990, 399990, 25, 'AUR-0001', '/img/productos/smartphone-nova-x6-5g-128gb.svg', 4.7, 312, TRUE),

  (2, 9, 1, 'Smartphone Nova A3 64 GB', 'smartphone-nova-a3-64gb',
   'El equilibrio perfecto entre precio y rendimiento: batería para todo el dia y pantalla de 6,5 pulgadas a 90 Hz.',
   179990, 149990, 40, 'AUR-0002', '/img/productos/smartphone-nova-a3-64gb.svg', 4.4, 189, FALSE),

  (3, 9, 2, 'Smartphone Vertex Go 5G 256 GB', 'smartphone-vertex-go-5g-256gb',
   '256 GB de almacenamiento, 8 GB de RAM y resistencia al agua IP68. Incluye cargador de 33 W.',
   299990, NULL, 18, 'AUR-0003', '/img/productos/smartphone-vertex-go-5g-256gb.svg', 4.6, 97, FALSE),

  (4, 9, 1, 'Kit de carga y proteccion Nova', 'kit-carga-nova',
   'Funda antigolpes, laminilla de vidrio templado y cargador USB-C de 33 W compatibles con la linea Nova.',
   24990, 19990, 80, 'AUR-0004', '/img/productos/kit-carga-nova.svg', 4.2, 64, FALSE),

  (5, 10, 2, 'Notebook Vertex Air 14" 16 GB', 'notebook-vertex-air-14',
   'Chasis de aluminio de 1,2 kg, procesador de 12 nucleos, 16 GB de RAM y SSD de 512 GB. Ideal para trabajo y estudio.',
   899990, 749990, 12, 'AUR-0005', '/img/productos/notebook-vertex-air-14.svg', 4.8, 156, TRUE),

  (6, 10, 1, 'Notebook Nova Pro 15" 512 GB', 'notebook-nova-pro-15',
   'Pantalla 2K de 15,6 pulgadas, teclado retroiluminado y 512 GB SSD para proyectos exigentes.',
   1099990, NULL, 8, 'AUR-0006', '/img/productos/notebook-nova-pro-15.svg', 4.7, 88, FALSE),

  (7, 10, 3, 'Tablet Lumen Pad 11" 128 GB', 'tablet-lumen-pad-11',
   'Tablet de 11 pulgadas con lÃ¡piz incluido, 128 GB y hasta 12 horas de batería. Perfecta para dibujar y leer.',
   349990, 299990, 22, 'AUR-0007', '/img/productos/tablet-lumen-pad-11.svg', 4.5, 121, FALSE),

  (8, 10, 4, 'Monitor Solaris 27" QHD', 'monitor-solaris-27-qhd',
   'Resolucion 2560x1440, 100 Hz, bordes ultra finos y soporte ajustable en altura. Conexion HDMI y DisplayPort.',
   259990, 219990, 15, 'AUR-0008', '/img/productos/monitor-solaris-27-qhd.svg', 4.6, 73, FALSE),

  (9, 10, 11, 'Teclado mecánico Zenit K7', 'teclado-mecánico-zenit-k7',
   'Switches rojos silenciosos, retroiluminacion RGB y reposamunecas magnetico. Layout en espanol.',
   79990, 59990, 35, 'AUR-0009', '/img/productos/teclado-mecánico-zenit-k7.svg', 4.5, 142, FALSE),

  (10, 11, 3, 'Audífonos Lumen Air ANC', 'audifonos-lumen-air-anc',
   'Cancelacion activa de ruido, 30 horas de batería y estuche de carga inalambrica. Bluetooth 5.3 multipunto.',
   149990, 99990, 50, 'AUR-0010', '/img/productos/audifonos-lumen-air-anc.svg', 4.8, 402, TRUE),

  (11, 11, 12, 'Parlante Bluetooth Pampa Mini', 'parlante-pampa-mini',
   'Sonido de 360 grados, resistencia al agua IPX7 y 18 horas de reproduccion. Se lleva a todas partes.',
   49990, 39990, 60, 'AUR-0011', '/img/productos/parlante-pampa-mini.svg', 4.4, 210, FALSE),

  (12, 11, 4, 'Soundbar Solaris 2.1', 'soundbar-solaris-21',
   '120 W de potencia con subwoofer inalambrico, HDMI ARC y modo cine nocturno.',
   129990, 109990, 20, 'AUR-0012', '/img/productos/soundbar-solaris-21.svg', 4.3, 58, FALSE),

  (13, 12, 4, 'Smart TV Solaris 55" 4K', 'smart-tv-solaris-55-4k',
   '4K UHD con HDR10+, sistema operativo con las principales apps de streaming y control por voz.',
   529990, 449990, 10, 'AUR-0013', '/img/productos/smart-tv-solaris-55-4k.svg', 4.6, 233, TRUE),

  (14, 12, 1, 'Smart TV Nova 65" QLED', 'smart-tv-nova-65-qled',
   'Panel QLED de 65 pulgadas, 120 Hz y modo gaming de baja latencia para consolas.',
   899990, 799990, 6, 'AUR-0014', '/img/productos/smart-tv-nova-65-qled.svg', 4.7, 74, FALSE),

  (15, 13, 6, 'Refrigerador Andes 320 L No Frost', 'refrigerador-andes-320l',
   'Dos puertas, tecnologia No Frost, cajon de verduras amplio y consumo energético A+.',
   649990, 569990, 9, 'AUR-0015', '/img/productos/refrigerador-andes-320l.svg', 4.5, 61, FALSE),

  (16, 13, 6, 'Freezer horizontal Andes 200 L', 'freezer-andes-200l',
   'Congelacion rápida, canastillo interior y alarma de temperatura. Tapa con seguro para niños.',
   399990, NULL, 7, 'AUR-0016', '/img/productos/freezer-andes-200l.svg', 4.3, 29, FALSE),

  (17, 14, 5, 'Horno electrico Aurora Home 45 L', 'horno-electrico-aurora-45l',
   '45 litros, conveccion, grill y temporizador de 60 minutos. Bandeja y rejilla incluidas.',
   129990, 99990, 18, 'AUR-0017', '/img/productos/horno-electrico-aurora-45l.svg', 4.4, 87, FALSE),

  (18, 14, 7, 'Air fryer Mistral 5,5 L', 'air-fryer-mistral-55l',
   'Fritura sin aceite con 8 programas, cesta antiadherente de 5,5 litros y pantalla tactil.',
   89990, 69990, 40, 'AUR-0018', '/img/productos/air-fryer-mistral-55l.svg', 4.7, 356, TRUE),

  (19, 14, 10, 'Cafetera Vela Espresso', 'cafetera-vela-espresso',
   '15 bares de presion, vaporizador de leche y deposito de 1,2 litros. CafÃ© como en tu cafeteria favorita.',
   159990, 129990, 16, 'AUR-0019', '/img/productos/cafetera-vela-espresso.svg', 4.6, 143, FALSE),

  (20, 15, 6, 'Lavadora Andes 9 kg Inverter', 'lavadora-andes-9kg',
   'Motor Inverter silencioso, 15 programas y tambor de acero inoxidable. Ahorro energético clase A++.',
   549990, 479990, 11, 'AUR-0020', '/img/productos/lavadora-andes-9kg.svg', 4.5, 118, FALSE),

  (21, 15, 9, 'Secadora Roble 8 kg', 'secadora-roble-8kg',
   'Secado por condensacion con sensor de humedad y filtro antipelusa de facil acceso.',
   499990, NULL, 5, 'AUR-0021', '/img/productos/secadora-roble-8kg.svg', 4.4, 42, FALSE),

  (22, 16, 7, 'Ventilador de torre Mistral', 'ventilador-torre-mistral',
   'Flujo de aire oscilante de 90 grados, 3 velocidades y temporizador de 8 horas. Muy silencioso.',
   59990, 44990, 30, 'AUR-0022', '/img/productos/ventilador-torre-mistral.svg', 4.2, 95, FALSE),

  (23, 16, 3, 'Purificador de aire Lumen', 'purificador-lumen-air',
   'Filtro HEPA H13 para ambientes de hasta 40 m2, sensor de calidad de aire y modo nocturno.',
   199990, 169990, 14, 'AUR-0023', '/img/productos/purificador-lumen-air.svg', 4.6, 67, FALSE),

  (24, 17, 8, 'Vestido midi Kaia de lino', 'vestido-midi-kaia',
   'Corte fluido en lino y viscosa, mangas cortas y cinturon ajustable. Disponible en tallas S a XL.',
   49990, 34990, 25, 'AUR-0024', '/img/productos/vestido-midi-kaia.svg', 4.5, 132, FALSE),

  (25, 17, 9, 'Blazer Roble oversize', 'blazer-roble-oversize',
   'Blazer de hombro caido con forro liviano y bolsillos interiores. Un clasico de oficina.',
   79990, 59990, 18, 'AUR-0025', '/img/productos/blazer-roble-oversize.svg', 4.4, 58, FALSE),

  (26, 18, 10, 'Polera básica Vela de algodón', 'polera-vela-algodón',
   'Algodon peinado de 180 g, cuello reforzado y calce regular. Disponible en negro, blanco y gris.',
   19990, 14990, 100, 'AUR-0026', '/img/productos/polera-vela-algodón.svg', 4.6, 421, FALSE),

  (27, 18, 12, 'Jeans recto Pampa', 'jeans-recto-pampa',
   'Denim con elastano para mayor comodidad, tiro medio y calce recto. Lavado azul oscuro.',
   44990, 34990, 45, 'AUR-0027', '/img/productos/jeans-recto-pampa.svg', 4.3, 176, FALSE),

  (28, 19, 8, 'Cartera Kaia City', 'cartera-kaia-city',
   'Cartera mediana con correa ajustable, cierre magnetico y bolsillo interior con cierre.',
   69990, 49990, 20, 'AUR-0028', '/img/productos/cartera-kaia-city.svg', 4.7, 88, FALSE),

  (29, 19, 11, 'Reloj Zenit Classic', 'reloj-zenit-classic',
   'Caja de acero de 40 mm, correa de cuero y resistencia al agua de 5 ATM. Movimiento de cuarzo.',
   129990, 99990, 12, 'AUR-0029', '/img/productos/reloj-zenit-classic.svg', 4.5, 64, FALSE),

  (30, 20, 2, 'Zapatillas Vertex Run', 'zapatillas-vertex-run',
   'Amortiguacion de espuma reactiva y malla transpirable. Pensadas para entrenamiento diario.',
   89990, 69990, 55, 'AUR-0030', '/img/productos/zapatillas-vertex-run.svg', 4.7, 289, TRUE),

  (31, 20, 8, 'Zapatillas Kaia Urban', 'zapatillas-kaia-urban',
   'Diseño minimalista en cuero sintetico, suela de goma y plantilla acolchada para todo el dia.',
   74990, NULL, 40, 'AUR-0031', '/img/productos/zapatillas-kaia-urban.svg', 4.4, 154, FALSE),

  (32, 21, 12, 'Botas outdoor Pampa Trek', 'botas-pampa-trek',
   'Botas impermeables con membrana transpirable, puntera reforzada y suela de alto agarre.',
   119990, 89990, 22, 'AUR-0032', '/img/productos/botas-pampa-trek.svg', 4.6, 71, FALSE),

  (33, 22, 8, 'Perfume Kaia Bloom 100 ml', 'perfume-kaia-bloom',
   'Notas de peonia, pera y almizcle blanco. Una fragancia floral fresca para el dia a dia.',
   79990, 59990, 30, 'AUR-0033', '/img/productos/perfume-kaia-bloom.svg', 4.8, 203, FALSE),

  (34, 22, 9, 'Perfume Roble Noir 90 ml', 'perfume-roble-noir',
   'Cuero, cedro y ambar para una estela intensa y elegante. Edicion eau de parfum.',
   69990, NULL, 25, 'AUR-0034', '/img/productos/perfume-roble-noir.svg', 4.6, 97, FALSE),

  (35, 23, 10, 'Set de maquillaje Vela Glow', 'set-maquillaje-vela-glow',
   'Paleta de sombras, rubor en crema, mascara y labial. Todo lo necesario para un look luminoso.',
   39990, 29990, 35, 'AUR-0035', '/img/productos/set-maquillaje-vela-glow.svg', 4.5, 118, FALSE),

  (36, 24, 3, 'Crema facial Lumen Hydra', 'crema-facial-lumen-hydra',
   'Hidratacion profunda con acido hialuronico y niacinamida. Textura ligera, apta para piel sensible.',
   29990, 24990, 50, 'AUR-0036', '/img/productos/crema-facial-lumen-hydra.svg', 4.7, 264, FALSE),

  (37, 25, 5, 'Sillón Aurora Home Oslo', 'sillon-aurora-oslo',
   'Sillón de dos cuerpos con tapiz textil, patas de madera natural y cojines desmontables.',
   249990, 199990, 8, 'AUR-0037', '/img/productos/sillon-aurora-oslo.svg', 4.6, 37, FALSE),

  (38, 26, 10, 'Lámpara de pie Vela Nordica', 'lampara-vela-nordica',
   'Pantalla de lino y base de metal negro mate. Luz calida regulable con pedal.',
   59990, 44990, 24, 'AUR-0038', '/img/productos/lampara-vela-nordica.svg', 4.5, 82, FALSE),

  (39, 27, 4, 'Set 6 copas Solaris Crystal', 'copas-solaris-crystal',
   'Vidrio cristalino de pared fina, 350 ml por copa. Apto para lavavajillas.',
   29990, 19990, 40, 'AUR-0039', '/img/productos/copas-solaris-crystal.svg', 4.4, 91, FALSE),

  (40, 30, 11, 'Armable Zenit Space 850 piezas', 'armable-zenit-space',
   'Set de construccion con 850 piezas, figuras espaciales y manual ilustrado. Para 8 anos o mas.',
   59990, 49990, 30, 'AUR-0040', '/img/productos/armable-zenit-space.svg', 4.8, 145, TRUE),

  (41, 29, 8, 'Muneca Kaia Aventura', 'muneca-kaia-aventura',
   'Muneca articulada de 30 cm con vestuario intercambiable y accesorios de exploradora.',
   24990, 19990, 45, 'AUR-0041', '/img/productos/muneca-kaia-aventura.svg', 4.5, 76, FALSE),

  (42, 29, 12, 'Peluche Pampa Oso 40 cm', 'peluche-pampa-oso',
   'Peluche ultra suave de 40 cm, relleno hipoalergenico y costuras reforzadas.',
   19990, 14990, 60, 'AUR-0042', '/img/productos/peluche-pampa-oso.svg', 4.9, 318, FALSE),

  (43, 28, 11, 'Rompecabezas Zenit 1000 piezas', 'rompecabezas-zenit-1000',
   'Ilustracion de bosque nativo en 1000 piezas, corte preciso y caja con poster de referencia.',
   19990, NULL, 35, 'AUR-0043', '/img/productos/rompecabezas-zenit-1000.svg', 4.6, 54, FALSE),

  (44, 31, 11, 'Mancuernas ajustables Zenit 20 kg', 'mancuernas-zenit-20kg',
   'Par de mancuernas con discos intercambiables de 2,5 kg y estuche de transporte.',
   99990, 79990, 15, 'AUR-0044', '/img/productos/mancuernas-zenit-20kg.svg', 4.6, 103, FALSE),

  (45, 31, 12, 'Bicicleta Pampa MTB 29"', 'bicicleta-pampa-mtb-29',
   'Cuadro de aluminio, 21 velocidades, frenos de disco hidráulicos y horquilla con bloqueo.',
   399990, 349990, 6, 'AUR-0045', '/img/productos/bicicleta-pampa-mtb-29.svg', 4.5, 48, FALSE),

  (46, 32, 7, 'Carpa Mistral 4 personas', 'carpa-mistral-4p',
   'Doble techo impermeable, armado rapido y bolso de transporte. Ideal para escapadas de fin de semana.',
   149990, 119990, 10, 'AUR-0046', '/img/productos/carpa-mistral-4p.svg', 4.4, 39, FALSE),

  (47, 32, 12, 'Silla plegable outdoor Pampa', 'silla-outdoor-pampa',
   'Estructura de aluminio, respaldo de malla y portavasos. Soporta hasta 120 kg.',
   39990, 29990, 25, 'AUR-0047', '/img/productos/silla-outdoor-pampa.svg', 4.3, 62, FALSE),

  (48, 27, 5, 'Set de sabanas Aurora Home 2 plazas', 'set-sabanas-aurora-2p',
   'Sábanas de algodón 300 hilos, fundas de almohada y bolsa de guardado. Tacto suave y duradero.',
   39990, 29990, 30, 'AUR-0048', '/img/productos/set-sabanas-aurora-2p.svg', 4.5, 87, FALSE);

-- Galeria: dos vistas adicionales por producto
INSERT INTO imagenes_producto (producto_id, url, orden)
SELECT id, regexp_replace(imagen_url, '\.svg$', '-2.svg'), 1 FROM productos;

INSERT INTO imagenes_producto (producto_id, url, orden)
SELECT id, regexp_replace(imagen_url, '\.svg$', '-3.svg'), 2 FROM productos;

-- ------------------------------------------------------------
-- Cliente demo (contrasena: Demo1234)
-- ------------------------------------------------------------
INSERT INTO usuarios (id, nombre, correo, hash_contrasena, telefono)
VALUES (
  1,
  'Cliente Demo',
  'cliente@aurora.cl',
  'pbkdf2_sha256$210000$43e36c77ab767c20719282bcf4c4aef8$112817702d6c30c23dec0cadcd70ff4715dc160c81e90d6b0c22ab3055f40e4b',
  '+56 9 1234 5678'
);

INSERT INTO direcciones (id, usuario_id, alias, calle, numero, departamento, comuna, ciudad, region, codigo_postal, predeterminada)
VALUES (1, 1, 'Casa', 'Av. Providencia', '1234', 'Depto 56', 'Providencia', 'Santiago', 'Región Metropolitana', '7500000', TRUE);

-- ------------------------------------------------------------
-- Cupones
-- ------------------------------------------------------------
INSERT INTO cupones (id, codigo, tipo, valor, minimo_compra, activo) VALUES
  (1, 'BIENVENIDO10', 'porcentaje', 10, 19990, TRUE),
  (2, 'AURORA5000', 'monto', 5000, 49990, TRUE),
  (3, 'ENVIOGRATIS', 'envio', 0, 49990, TRUE);

-- ------------------------------------------------------------
-- Pedido de ejemplo del cliente demo
-- ------------------------------------------------------------
INSERT INTO pedidos
  (id, numero, usuario_id, estado, tipo_entrega, direccion_id, direccion_texto,
   subtotal, costo_envio, descuento, total, cupon_codigo, creado_en)
VALUES
  (1, 'AUR-20261110-0001', 1, 'entregado', 'despacho', 1, 'Av. Providencia 1234, Depto 56, Providencia',
   149890, 0, 0, 149890, NULL, NOW() - INTERVAL '9 days');

INSERT INTO pedido_items
  (pedido_id, producto_id, nombre_producto, imagen_url, precio_unitario, cantidad, subtotal)
VALUES
  (1, 10, 'Audífonos Lumen Air ANC', '/img/productos/audifonos-lumen-air-anc.svg', 99990, 1, 99990),
  (1, 26, 'Polera básica Vela de algodón', '/img/productos/polera-vela-algodón.svg', 14990, 1, 14990),
  (1, 42, 'Peluche Pampa Oso 40 cm', '/img/productos/peluche-pampa-oso.svg', 14990, 2, 29980);

-- ------------------------------------------------------------
-- Sincronizar secuencias
-- ------------------------------------------------------------
SELECT setval('categorias_id_seq', (SELECT MAX(id) FROM categorias));
SELECT setval('marcas_id_seq', (SELECT MAX(id) FROM marcas));
SELECT setval('productos_id_seq', (SELECT MAX(id) FROM productos));
SELECT setval('imagenes_producto_id_seq', (SELECT MAX(id) FROM imagenes_producto));
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));
SELECT setval('direcciones_id_seq', (SELECT MAX(id) FROM direcciones));
SELECT setval('cupones_id_seq', (SELECT MAX(id) FROM cupones));
SELECT setval('pedidos_id_seq', (SELECT MAX(id) FROM pedidos));
SELECT setval('pedido_items_id_seq', (SELECT MAX(id) FROM pedido_items));

COMMIT;
