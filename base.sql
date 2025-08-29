drop database bdjavascript;
FLUSH PRIVILEGES;
USE bdJavascript;

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
    detalle_id INT NOT NULL,        -- Servicio realizado facturado
    empresa_id INT NOT NULL,        -- Taller
    usuario_id INT NOT NULL,        -- Cliente
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


