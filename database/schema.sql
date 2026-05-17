-- ============================================================================
-- PROYECTO: ALIMOP (Reducción de Desperdicio de Alimentos en Colombia)
-- BASE DE DATOS: db.alimop
-- FASE 1: Estructura de la Base de Datos PostgreSQL y Datos Semilla
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. LIMPIEZA DE TABLAS Y TIPOS EXISTENTES (Para reinicio rápido en desarrollo)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS pqrs CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS detalle_pedidos CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS ubicaciones CASCADE;
DROP TABLE IF EXISTS administradores CASCADE;
DROP TABLE IF EXISTS domiciliarios CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

DROP TYPE IF EXISTS tipo_pqr CASCADE;
DROP TYPE IF EXISTS estado_pqr CASCADE;
DROP TYPE IF EXISTS estado_pago CASCADE;
DROP TYPE IF EXISTS metodo_pago CASCADE;
DROP TYPE IF EXISTS estado_pedido CASCADE;
DROP TYPE IF EXISTS estado_producto CASCADE;
DROP TYPE IF EXISTS estado_usuario CASCADE;
DROP TYPE IF EXISTS rol_usuario CASCADE;

-- ----------------------------------------------------------------------------
-- 2. CREACIÓN DE TIPOS ENUM PERSONALIZADOS
-- ----------------------------------------------------------------------------
CREATE TYPE rol_usuario AS ENUM ('cliente', 'proveedor', 'domiciliario', 'administrador');
CREATE TYPE estado_usuario AS ENUM ('activo', 'inactivo', 'suspendido');
CREATE TYPE estado_producto AS ENUM ('disponible', 'casi_vencido', 'agotado', 'donado');
CREATE TYPE estado_pedido AS ENUM ('pendiente', 'preparando', 'en_camino', 'entregado', 'cancelado');
CREATE TYPE metodo_pago AS ENUM ('tarjeta_credito', 'tarjeta_debito', 'transferencia', 'efectivo', 'pago_contra_entrega');
CREATE TYPE estado_pago AS ENUM ('pendiente', 'aprobado', 'rechazado');
CREATE TYPE tipo_pqr AS ENUM ('peticion', 'queja', 'reclamo', 'sugerencia');
CREATE TYPE estado_pqr AS ENUM ('abierto', 'en_proceso', 'resuelto', 'cerrado');

-- ----------------------------------------------------------------------------
-- 3. CREACIÓN DE TABLAS DE USUARIOS Y ROLES (Especialización 1:1)
-- ----------------------------------------------------------------------------

-- Tabla Principal: usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol rol_usuario NOT NULL,
    estado estado_usuario DEFAULT 'activo',
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE usuarios IS 'Almacena la información de autenticación y datos comunes de todos los usuarios de la plataforma.';

-- Subtabla-Hija: clientes
CREATE TABLE clientes (
    id_usuario INT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_nacimiento DATE,
    preferencias_alimentarias TEXT,
    puntos_fidelidad INT DEFAULT 0 CHECK (puntos_fidelidad >= 0)
);
COMMENT ON TABLE clientes IS 'Subtabla para los usuarios que compran productos alimenticios o solicitan donaciones.';

-- Subtabla-Hija: proveedores
CREATE TABLE proveedores (
    id_usuario INT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    nit VARCHAR(50) UNIQUE NOT NULL,
    razon_social VARCHAR(150) NOT NULL,
    nombre_establecimiento VARCHAR(150) NOT NULL,
    tipo_establecimiento VARCHAR(100) NOT NULL, -- Ej: Supermercado, Panadería, Restaurante
    calificacion DECIMAL(3, 2) DEFAULT 5.0 CHECK (calificacion >= 0.0 AND calificacion <= 5.0),
    puntos_sostenibilidad INT DEFAULT 0 CHECK (puntos_sostenibilidad >= 0) -- Puntos por alimentos salvados
);
COMMENT ON TABLE proveedores IS 'Subtabla para establecimientos comerciales que publican excedentes de comida para la venta o donación.';

-- Subtabla-Hija: domiciliarios
CREATE TABLE domiciliarios (
    id_usuario INT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    vehiculo_tipo VARCHAR(50) NOT NULL, -- Ej: Bicicleta, Moto, Carro
    vehiculo_placa VARCHAR(20), -- Opcional para bicicletas
    disponible BOOLEAN DEFAULT TRUE,
    calificacion DECIMAL(3, 2) DEFAULT 5.0 CHECK (calificacion >= 0.0 AND calificacion <= 5.0)
);
COMMENT ON TABLE domiciliarios IS 'Subtabla para repartidores encargados de llevar los pedidos a los clientes.';

-- Subtabla-Hija: administradores
CREATE TABLE administradores (
    id_usuario INT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    nivel_acceso INT DEFAULT 1 CHECK (nivel_acceso BETWEEN 1 AND 5) -- 1: Soporte, 5: SuperAdmin
);
COMMENT ON TABLE administradores IS 'Subtabla para el personal administrativo y de soporte de ALIMOP.';

-- ----------------------------------------------------------------------------
-- 4. CREACIÓN DE TABLAS ADICIONALES (Ubicaciones, Productos, Pedidos, Pagos, PQRs)
-- ----------------------------------------------------------------------------

-- Tabla: ubicaciones
CREATE TABLE ubicaciones (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    direccion VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100) DEFAULT 'Bogotá',
    departamento VARCHAR(100) DEFAULT 'Cundinamarca',
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE ubicaciones IS 'Registra las ubicaciones geográficas de usuarios para cálculo de entregas y promociones cercanas.';

-- Tabla: productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    id_proveedor INT NOT NULL REFERENCES proveedores(id_usuario) ON DELETE CASCADE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_original DECIMAL(10, 2) NOT NULL CHECK (precio_original >= 0),
    precio_descuento DECIMAL(10, 2) CHECK (precio_descuento >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    fecha_vencimiento DATE NOT NULL,
    imagen_url VARCHAR(255),
    categoria VARCHAR(100) NOT NULL, -- Ej: Panadería, Frutas y Verduras, Comidas Preparadas
    es_donacion BOOLEAN DEFAULT FALSE, -- Indica si es gratuito/donación
    estado estado_producto DEFAULT 'disponible',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_precios CHECK (
        (es_donacion = TRUE AND (precio_original = 0 OR precio_original IS NULL) AND (precio_descuento = 0 OR precio_descuento IS NULL)) OR
        (es_donacion = FALSE AND precio_original > 0 AND (precio_descuento IS NULL OR precio_descuento <= precio_original))
    )
);
COMMENT ON TABLE productos IS 'Almacena el catálogo de productos disponibles, con fechas de vencimiento clave para reducir desperdicio.';

-- Tabla: pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL REFERENCES clientes(id_usuario) ON DELETE RESTRICT,
    id_domiciliario INT REFERENCES domiciliarios(id_usuario) ON DELETE SET NULL,
    fecha_pedido TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estado estado_pedido DEFAULT 'pendiente',
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    id_ubicacion_entrega INT NOT NULL REFERENCES ubicaciones(id) ON DELETE RESTRICT,
    fecha_entrega TIMESTAMP WITH TIME ZONE
);
COMMENT ON TABLE pedidos IS 'Registra las transacciones/órdenes de compra o donaciones realizadas por los clientes.';

-- Tabla: detalle_pedidos (Relación de Muchos a Muchos entre Pedidos y Productos)
CREATE TABLE detalle_pedidos (
    id SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    id_producto INT NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0)
);
COMMENT ON TABLE detalle_pedidos IS 'Guarda el desglose de los productos e inventarios vinculados a cada pedido.';

-- Tabla: pagos
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    id_pedido INT UNIQUE NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    monto DECIMAL(10, 2) NOT NULL CHECK (monto >= 0),
    metodo metodo_pago NOT NULL,
    estado estado_pago DEFAULT 'pendiente',
    transaccion_id VARCHAR(100) UNIQUE, -- ID devuelto por la pasarela de pagos
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE pagos IS 'Detalla la información del pago de pedidos no gratuitos.';

-- Tabla: pqrs (Peticiones, Quejas, Reclamos y Sugerencias)
CREATE TABLE pqrs (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo tipo_pqr NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    estado estado_pqr DEFAULT 'abierto',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP WITH TIME ZONE,
    respuesta TEXT
);
COMMENT ON TABLE pqrs IS 'Módulo de atención al usuario para soporte, reporte de inconvenientes y sugerencias.';

-- ----------------------------------------------------------------------------
-- 5. ÍNDICES DE RENDIMIENTO (Para acelerar geolocalización y búsquedas frecuentes)
-- ----------------------------------------------------------------------------
CREATE INDEX idx_productos_fecha_vencimiento ON productos(fecha_vencimiento);
CREATE INDEX idx_productos_estado ON productos(estado);
CREATE INDEX idx_ubicaciones_geo ON ubicaciones(latitud, longitud);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_productos_proveedor ON productos(id_proveedor);

-- ============================================================================
-- 6. DATOS SEMILLA (SEEDERS) - Colombia Realista
-- ============================================================================

-- A. Insertar Usuarios Principales (Contraseñas de prueba hash simuladas)
INSERT INTO usuarios (nombre_completo, email, password_hash, telefono, rol, estado) VALUES
-- Administradores
('Leandro Pérez', 'admin.leo@alimop.com', '$2b$10$wL4G271/Z1uM9P/eLh5f3upYnZ6Z/EaNfO0.2N/W8kZ.jA9gU8d.a', '3124567890', 'administrador', 'activo'),
-- Clientes
('Juan Carlos Gómez', 'juan.gomez@gmail.com', '$2b$10$wL4G271/Z1uM9P/eLh5f3upYnZ6Z/EaNfO0.2N/W8kZ.jA9gU8d.a', '3001234567', 'cliente', 'activo'),
('Camila Restrepo', 'camila.res@yahoo.com', '$2b$10$wL4G271/Z1uM9P/eLh5f3upYnZ6Z/EaNfO0.2N/W8kZ.jA9gU8d.a', '3159876543', 'cliente', 'activo'),
-- Proveedores
('Supermercado Carulla Pepe Sierra', 'contacto@carullapepe.com', '$2b$10$wL4G271/Z1uM9P/eLh5f3upYnZ6Z/EaNfO0.2N/W8kZ.jA9gU8d.a', '3105556677', 'proveedor', 'activo'),
('Panadería El Trigal Bogotá', 'ventas@eltrigal.com', '$2b$10$wL4G271/Z1uM9P/eLh5f3upYnZ6Z/EaNfO0.2N/W8kZ.jA9gU8d.a', '3213334455', 'proveedor', 'activo'),
-- Domiciliarios
('Andrés Felipe Barbosa', 'andres.domicilios@gmail.com', '$2b$10$wL4G271/Z1uM9P/eLh5f3upYnZ6Z/EaNfO0.2N/W8kZ.jA9gU8d.a', '3174445566', 'domiciliario', 'activo');

-- B. Asignar Perfiles Hijos
-- Administradores
INSERT INTO administradores (id_usuario, nivel_acceso) VALUES
(1, 5); -- SuperAdmin (Leandro)

-- Clientes
INSERT INTO clientes (id_usuario, fecha_nacimiento, preferencias_alimentarias, puntos_fidelidad) VALUES
(2, '1995-04-12', 'Vegetariano, prefiere productos orgánicos', 120),
(3, '1998-08-25', 'Sin restricciones, prefiere panadería y lácteos', 50);

-- Proveedores
INSERT INTO proveedores (id_usuario, nit, razon_social, nombre_establecimiento, tipo_establecimiento, calificacion, puntos_sostenibilidad) VALUES
(4, '800.192.834-1', 'Supermercados Carulla S.A.S.', 'Carulla Calle 116', 'Supermercado', 4.8, 850),
(5, '901.002.334-2', 'Panificadora y Pastelería El Trigal Ltda', 'Panadería El Trigal Norte', 'Panadería', 4.5, 340);

-- Domiciliarios
INSERT INTO domiciliarios (id_usuario, vehiculo_tipo, vehiculo_placa, disponible, calificacion) VALUES
(6, 'Moto', 'XYZ-98F', TRUE, 4.9);

-- C. Insertar Ubicaciones (Bogotá - Coordenadas Reales para pruebas de GPS)
INSERT INTO ubicaciones (id_usuario, direccion, ciudad, departamento, latitud, longitud, es_principal) VALUES
-- Admin
(1, 'Calle 100 # 15-30, Oficina 401', 'Bogotá', 'Bogotá D.C.', 4.68340000, -74.04350000, TRUE),
-- Cliente Juan Gómez
(2, 'Carrera 7 # 120-20, Apto 502', 'Bogotá', 'Bogotá D.C.', 4.69780000, -74.02980000, TRUE),
-- Cliente Camila Restrepo
(3, 'Calle 140 # 19-45, Casa 3', 'Bogotá', 'Bogotá D.C.', 4.72100000, -74.04100000, TRUE),
-- Proveedor Carulla
(4, 'Calle 116 # 15-60', 'Bogotá', 'Bogotá D.C.', 4.69650000, -74.03780000, TRUE),
-- Proveedor El Trigal
(5, 'Carrera 15 # 134-20', 'Bogotá', 'Bogotá D.C.', 4.71250000, -74.04520000, TRUE),
-- Domiciliario Andrés
(6, 'Calle 127 # 45-10', 'Bogotá', 'Bogotá D.C.', 4.70780000, -74.05450000, TRUE);

-- D. Insertar Productos (Con salvado de desperdicio: precios reducidos y fechas de vencimiento cercanas)
INSERT INTO productos (id_proveedor, nombre, descripcion, precio_original, precio_descuento, stock, fecha_vencimiento, imagen_url, categoria, es_donacion, estado) VALUES
-- Carulla Calle 116
(4, 'Ensalada Premium con Pollo 300g', 'Ensalada César fresca. Vencimiento hoy al cierre. Perfectas condiciones.', 18000.00, 7500.00, 8, CURRENT_DATE, 'https://res.cloudinary.com/alimop/cesar.jpg', 'Comidas Preparadas', FALSE, 'casi_vencido'),
(4, 'Yogur Griego Alpina Natural 1L', 'Lote con vencimiento en 2 días. Conservado en cadena de frío.', 14500.00, 6000.00, 15, CURRENT_DATE + INTERVAL '2 days', 'https://res.cloudinary.com/alimop/yogur.jpg', 'Lácteos', FALSE, 'disponible'),
(4, 'Manzanas Rojas Importadas x4', 'Manzanas con leves magulladuras estéticas pero 100% aptas para consumo. Ideal para jugos o compotas.', 10000.00, 4000.00, 5, CURRENT_DATE + INTERVAL '3 days', 'https://res.cloudinary.com/alimop/manzanas.jpg', 'Frutas y Verduras', FALSE, 'disponible'),
-- Panadería El Trigal
(5, 'Baguette Rústico de Masa Madre', 'Pan horneado esta mañana. Descuento especial de fin de jornada.', 6500.00, 2500.00, 10, CURRENT_DATE + INTERVAL '1 day', 'https://res.cloudinary.com/alimop/baguette.jpg', 'Panadería', FALSE, 'disponible'),
(5, 'Donas de Chocolate x6 unidades', 'Excedentes del día de hoy. Sabor y frescura garantizados.', 15000.00, 5000.00, 4, CURRENT_DATE, 'https://res.cloudinary.com/alimop/donas.jpg', 'Panadería', FALSE, 'casi_vencido'),
-- Donación Carulla
(4, 'Caja de Bananos Maduros 5kg', 'Donación destinada a fundaciones o personas con alta vulnerabilidad alimentaria. Listos para repostería.', 0.00, 0.00, 2, CURRENT_DATE + INTERVAL '2 days', 'https://res.cloudinary.com/alimop/bananos.jpg', 'Frutas y Verduras', TRUE, 'disponible');

-- E. Insertar Pedidos y Detalles de Compra
-- Pedido 1: Juan compra Ensalada y Yogur
INSERT INTO pedidos (id_cliente, id_domiciliario, estado, total, id_ubicacion_entrega) VALUES
(2, 6, 'pendiente', 21000.00, 2);

INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario) VALUES
(1, 1, 2, 7500.00), -- 2 Ensaladas César = 15000
(1, 2, 1, 6000.00); -- 1 Yogur Griego = 6000

-- Pedido 2: Camila solicita la donación de Bananos
INSERT INTO pedidos (id_cliente, id_domiciliario, estado, total, id_ubicacion_entrega) VALUES
(3, NULL, 'entregado', 0.00, 3); -- Retiro presencial

INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario) VALUES
(2, 6, 1, 0.00); -- 1 Caja de Donación Bananos

-- F. Registrar Pago del Pedido 1 (No gratuito)
INSERT INTO pagos (id_pedido, monto, metodo, estado, transaccion_id) VALUES
(1, 21000.00, 'tarjeta_debito', 'aprobado', 'TX_ALIMOP_9928341');

-- G. Insertar PQR de Prueba
INSERT INTO pqrs (id_usuario, tipo, asunto, descripcion, estado) VALUES
(2, 'sugerencia', 'Más opciones vegetarianas', 'Me encantaría ver más restaurantes y tiendas que publiquen platos exclusivamente vegetarianos listos para consumir.', 'abierto'),
(3, 'reclamo', 'Demora en asignación de domiciliario', 'El pedido de Carulla tardó más de 30 minutos en encontrar repartidor. Sugiero ampliar el radio de cobertura.', 'resuelto');

UPDATE pqrs SET respuesta = 'Hola Camila, lamentamos el inconveniente. Hemos ampliado la cobertura y habilitado incentivos dinámicos para los domiciliarios en horas de alta demanda para agilizar las entregas.', fecha_resolucion = CURRENT_TIMESTAMP WHERE id = 2;

-- ============================================================================
-- FIN DEL SCRIPT DE LA FASE 1
-- ============================================================================
