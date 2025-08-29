drop database bdjavascript;
FLUSH PRIVILEGES;
USE bdJavascript;


-- 1. Crear la base de datos
CREATE DATABASE bdjavascript;

-- 2. Crear el usuario y establecer su contraseña
CREATE USER 'KevinPaez'@'localhost' IDENTIFIED BY '12345';

-- 3. Darle permisos al usuario sobre la base de datos
GRANT ALL PRIVILEGES ON bdjavascript.* TO 'KevinPaez'@'localhost';

-- 4. Aplicar los cambios
FLUSH PRIVILEGES;


-- ========================
-- TABLA ROLES
-- ========================
CREATE TABLE Roles (
    rol_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL
);

-- ========================
-- TABLA USUARIOS
-- ========================
CREATE TABLE Usuarios (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100),
    telefono VARCHAR(20),
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(100) NOT NULL,
    rol_id INT NOT NULL,
    id_estado INT NOT NULL,
    FOREIGN KEY (id_estado) REFERENCES EstadosUsuario(estado_usuario_id),
    FOREIGN KEY (rol_id) REFERENCES Roles(rol_id)
);
-- ========================
-- TABLA EMPRESAS
-- ========================
CREATE TABLE Empresa (
    empresa_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    nit VARCHAR(50) UNIQUE,
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    representante_legal VARCHAR(100)
);

-- ========================
-- TABLA CATEGORÍAS
-- ========================
CREATE TABLE Categorias (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- ========================
-- TABLA PRODUCTOS
-- ========================
CREATE TABLE Productos (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    categoria_id INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES Categorias(categoria_id)
);

-- ========================
-- TABLA SERVICIOS
-- ========================
CREATE TABLE Servicios (
    servicio_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_servicio VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL
);

-- ========================
-- TABLA ESTADOS DE SERVICIO
-- ========================
CREATE TABLE EstadosServicio (
    estado_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE
);
-- ========================
-- TABLA VEHÍCULOS
-- ========================
CREATE TABLE Vehiculos (
    vehiculo_id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(20) UNIQUE NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
);

-- ========================
-- TABLA SERVICIOS REALIZADOS
-- ========================
CREATE TABLE ServiciosRealizados (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY,
    servicio_id INT NOT NULL,
    vehiculo_id INT NOT NULL,
    fecha DATE NOT NULL,
    observaciones TEXT,
    estado_id INT NOT NULL,
    nombre_mecanico VARCHAR(100) NOT NULL,
    FOREIGN KEY (servicio_id) REFERENCES Servicios(servicio_id),
    FOREIGN KEY (vehiculo_id) REFERENCES Vehiculos(vehiculo_id),
    FOREIGN KEY (estado_id) REFERENCES EstadosServicio(estado_id)
);
-- ========================
-- TABLA SERVICIOS CONSUMIBLES (PRODUCTOS USADOS)
-- ========================
CREATE TABLE ServiciosConsumibles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    detalle_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad_usada INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
	total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (detalle_id) REFERENCES ServiciosRealizados(detalle_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id)
);
-- ========================
-- TABLA FACTURAS (VINCULADAS A SERVICIOS)
-- ========================
CREATE TABLE Facturas (
    factura_id INT AUTO_INCREMENT PRIMARY KEY,
    detalle_id INT NOT NULL,        -- Servicio realizado facturado
    empresa_id INT NOT NULL,        -- Taller
    usuario_id INT NOT NULL,        -- Cliente
    fecha_emision DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (detalle_id) REFERENCES ServiciosRealizados(detalle_id),
    FOREIGN KEY (empresa_id) REFERENCES Empresa(empresa_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
);

CREATE TABLE EstadosUsuario (
    estado_usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE
);  
CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permiso VARCHAR(50)
);

CREATE TABLE permisos_roles (
    rol_id INT,
    id_permiso INT,
    FOREIGN KEY (rol_id) REFERENCES Roles(rol_id) ON DELETE SET NULL,
    FOREIGN KEY (id_permiso) REFERENCES permisos(id) ON DELETE SET NULL
);   


/*crea los permisos del admin*/
INSERT INTO permisos_roles (rol_id, id_permiso)
SELECT 1, p.id
FROM permisos p
WHERE p.id NOT IN (
    21,22,23,24, -- ServiciosRealizados
    25,26,27,28, -- ServiciosConsumibles
    29,31,32     -- Facturas (solo puede listar)
);


/*Clientes - permisos*/
INSERT INTO permisos_roles (rol_id, id_permiso)
SELECT 2, p.id
FROM permisos p
WHERE p.id IN (
    14,  -- Servicios_Listar
    30,  -- Facturas_Listar
    17,  -- Vehiculos_Crear
    18,  -- Vehiculos_Listar
    19,  -- Vehiculos_Actualizar
    20,  -- Vehiculos_Eliminar
    2,   -- Usuarios_Listar
    3    -- Usuarios_Actualizar
);

select * from permisos_roles;

/*Permisos Mecanico*/
INSERT INTO permisos_roles (rol_id, id_permiso)
SELECT 3, p.id
FROM permisos p
WHERE p.id IN (
    21, -- ServiciosRealizados_Crear
    22, -- ServiciosRealizados_Listar
    23, -- ServiciosRealizados_Actualizar
    24, -- ServiciosRealizados_Eliminar
    18, -- Vehiculos_Listar
    29, -- Facturas_Crear
    32, -- Facturas_Eliminar
    25, -- ServiciosConsumibles_Crear
    27, -- ServiciosConsumibles_Actualizar
    28  -- ServiciosConsumibles_Eliminar
);



-- ========================
-- ROLES
-- ========================
INSERT INTO Roles (nombre_rol) VALUES
('administrador'),
('cliente'),
('mecanico');

-- ========================
-- ESTADOS DE USUARIO
-- ========================
INSERT INTO EstadosUsuario (nombre_estado) VALUES
('Activo'),
('Inactivo'),
('Suspendido');

-- ========================
-- USUARIOS
-- ========================

INSERT INTO Empresa (nombre, nit, direccion, telefono, correo, representante_legal) VALUES
('Taller Mecánico motofix', '900123456-7', 'Calle 123 #45-67', '3001112233', 'motofix@talleralfa.com', 'Kevin Paez');


-- ========================
-- CATEGORÍAS
-- ========================
INSERT INTO Categorias (nombre) VALUES
('Aceites'),
('Filtros'),
('Frenos'),
('Suspensión');

-- ========================
-- PRODUCTOS
-- ========================
INSERT INTO Productos (nombre, precio, stock, categoria_id) VALUES
('Aceite 10W40', 50.00, 100, 1),
('Filtro de aceite', 25.00, 50, 2),
('Pastillas de freno', 40.00, 30, 3),
('Amortiguador delantero', 120.00, 10, 4);

-- ========================
-- SERVICIOS
-- ========================
INSERT INTO Servicios (nombre_servicio, descripcion, precio) VALUES
('Cambio de aceite', 'Cambio de aceite y revisión general', 80000),
('Cambio de frenos', 'Revisión y reemplazo de frenos', 150000),
('Alineación y balanceo', 'Alineación y balanceo de ruedas', 60000);

-- ========================
-- ESTADOS DE SERVICIO
-- ========================
INSERT INTO EstadosServicio (nombre_estado) VALUES
('Pendiente'),
('En proceso'),
('Finalizado'),
('Cancelado');

-- ========================
-- VEHÍCULOS
-- ========================
INSERT INTO Vehiculos (placa, marca, modelo, usuario_id) VALUES
('ABC123', 'AKT', 'Flex125', 3),
('XYZ789', 'Yamaha', 'Yz85', 3);

-- ========================
-- SERVICIOS REALIZADOS
-- ========================
INSERT INTO ServiciosRealizados (servicio_id, vehiculo_id, fecha, observaciones, estado_id, nombre_mecanico) VALUES
(1, 1, '2025-08-28', 'Revisión completa', 3, 'Brayan1234'),
(2, 2, '2025-08-29', 'Cambio de frenos delanteros', 1, 'Brayan1234');

-- ========================
-- SERVICIOS CONSUMIBLES
-- ========================
INSERT INTO ServiciosConsumibles (detalle_id, producto_id, cantidad_usada, precio_unitario, total) VALUES
(1, 1, 1, 50000, 50000),
(1, 2, 1, 25000, 25000),
(2, 3, 2, 40000, 80000);

-- ========================
-- FACTURAS
-- ========================
INSERT INTO Facturas (detalle_id, empresa_id, usuario_id, fecha_emision, subtotal, total) VALUES
(1, 1, 3, '2025-08-28', 75000, 80000),
(2, 2, 3, '2025-08-29', 150000, 160000);

-- ========================
-- PERMISOS
-- ========================
INSERT INTO permisos (permiso) VALUES
('Usuarios_Crear'), ('Usuarios_Listar'), ('Usuarios_Actualizar'), ('Usuarios_Eliminar'),
('Categorias_Crear'), ('Categorias_Listar'), ('Categorias_Actualizar'), ('Categorias_Eliminar'),
('Productos_Crear'), ('Productos_Listar'), ('Productos_Actualizar'), ('Productos_Eliminar'),
('Servicios_Crear'), ('Servicios_Listar'), ('Servicios_Actualizar'), ('Servicios_Eliminar'),
('Vehiculos_Crear'), ('Vehiculos_Listar'), ('Vehiculos_Actualizar'), ('Vehiculos_Eliminar'),
('ServiciosRealizados_Crear'), ('ServiciosRealizados_Listar'), ('ServiciosRealizados_Actualizar'), ('ServiciosRealizados_Eliminar'),
('ServiciosConsumibles_Crear'), ('ServiciosConsumibles_Listar'), ('ServiciosConsumibles_Actualizar'), ('ServiciosConsumibles_Eliminar'),
('Facturas_Crear'), ('Facturas_Listar'), ('Facturas_Actualizar'), ('Facturas_Eliminar');

-- ========================
-- PERMISOS_ROLES
-- ========================


