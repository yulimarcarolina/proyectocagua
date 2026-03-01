-- ============================================
-- SISTEMA DE GESTIÓN POLICIAL - ESQUEMA DE BASE DE DATOS
-- Comandancia de Policía de Cagua
-- ============================================


-- ============================================
-- TABLA: usuarios
-- Descripción: Almacena información de usuarios del sistema
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL, -- Encriptada con bcrypt
    rol ENUM('DIRECTOR', 'COORDINADOR', 'FUNCIONARIO') NOT NULL DEFAULT 'FUNCIONARIO',
    jerarquia VARCHAR(50) NOT NULL,
    
    -- Preguntas de Seguridad (CAPTCHA)
    ciudad_nacimiento VARCHAR(100) NOT NULL,
    nombre_padre VARCHAR(100) NOT NULL,
    nombre_madre VARCHAR(100) NOT NULL,
    
    -- Control de acceso
    intentos_fallidos INT DEFAULT 0,
    bloqueado BOOLEAN DEFAULT FALSE,
    fecha_bloqueo DATETIME NULL,
    
    -- Auditoría
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    
    INDEX idx_usuario (usuario),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: detenidos
-- Descripción: Registro de personas privadas de libertad
-- ============================================
CREATE TABLE IF NOT EXISTS detenidos (
    id_detenido INT PRIMARY KEY AUTO_INCREMENT,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    edad INT NOT NULL,
    genero ENUM('MASCULINO', 'FEMENINO', 'OTRO') NOT NULL,
    nacionalidad VARCHAR(50) NOT NULL DEFAULT 'VENEZOLANA',
    direccion TEXT,
    telefono VARCHAR(20),
    
    -- Datos del arresto
    fecha_detencion DATETIME NOT NULL,
    lugar_detencion VARCHAR(200) NOT NULL,
    motivo_detencion TEXT NOT NULL,
    
    -- Datos físicos
    estatura DECIMAL(3,2), -- en metros
    peso DECIMAL(5,2), -- en kg
    señas_particulares TEXT,
    foto_url VARCHAR(255),
    
    -- Auditoría
    id_usuario_registro INT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario_registro) REFERENCES usuarios(id_usuario),
    INDEX idx_cedula (cedula),
    INDEX idx_fecha_detencion (fecha_detencion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: delitos
-- Descripción: Catálogo de delitos
-- ============================================
CREATE TABLE IF NOT EXISTS delitos (
    id_delito INT PRIMARY KEY AUTO_INCREMENT,
    codigo_delito VARCHAR(20) UNIQUE NOT NULL,
    nombre_delito VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria ENUM('GRAVE', 'LEVE', 'MODERADO') NOT NULL,
    pena_minima INT, -- en meses
    pena_maxima INT, -- en meses
    activo BOOLEAN DEFAULT TRUE,
    
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_codigo (codigo_delito),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: casos
-- Descripción: Expedientes judiciales
-- ============================================
CREATE TABLE IF NOT EXISTS casos (
    id_caso INT PRIMARY KEY AUTO_INCREMENT,
    numero_expediente VARCHAR(50) UNIQUE NOT NULL,
    id_detenido INT NOT NULL,
    id_delito INT NOT NULL,
    
    -- Información del caso
    fecha_apertura DATE NOT NULL,
    fecha_cierre DATE NULL,
    estado ENUM('ABIERTO', 'EN_PROCESO', 'CERRADO', 'ARCHIVADO') NOT NULL DEFAULT 'ABIERTO',
    descripcion_hechos TEXT NOT NULL,
    
    -- Funcionario asignado
    id_funcionario_asignado INT NOT NULL,
    
    -- Auditoría
    id_usuario_registro INT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_detenido) REFERENCES detenidos(id_detenido),
    FOREIGN KEY (id_delito) REFERENCES delitos(id_delito),
    FOREIGN KEY (id_funcionario_asignado) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_usuario_registro) REFERENCES usuarios(id_usuario),
    
    INDEX idx_expediente (numero_expediente),
    INDEX idx_estado (estado),
    INDEX idx_fecha_apertura (fecha_apertura)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: victimas
-- Descripción: Registro de víctimas
-- ============================================
CREATE TABLE IF NOT EXISTS victimas (
    id_victima INT PRIMARY KEY AUTO_INCREMENT,
    id_caso INT NOT NULL,
    cedula VARCHAR(20),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    edad INT,
    genero ENUM('MASCULINO', 'FEMENINO', 'OTRO'),
    telefono VARCHAR(20),
    direccion TEXT,
    relacion_con_caso TEXT,
    
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_caso) REFERENCES casos(id_caso) ON DELETE CASCADE,
    INDEX idx_caso (id_caso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: ministerio_publico
-- Descripción: Representantes del Ministerio Público
-- ============================================
CREATE TABLE IF NOT EXISTS ministerio_publico (
    id_fiscal INT PRIMARY KEY AUTO_INCREMENT,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    fiscalia VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_cedula (cedula)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: director_garantia
-- Descripción: Directores de garantía de detenidos
-- ============================================
CREATE TABLE IF NOT EXISTS director_garantia (
    id_director INT PRIMARY KEY AUTO_INCREMENT,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_cedula (cedula)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: novedades
-- Descripción: Registro de novedades/incidentes
-- ============================================
CREATE TABLE IF NOT EXISTS novedades (
    id_novedad INT PRIMARY KEY AUTO_INCREMENT,
    id_detenido INT,
    tipo_novedad ENUM('MEDICA', 'DISCIPLINARIA', 'TRASLADO', 'VISITA', 'LEGAL', 'OTRA') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_novedad DATETIME NOT NULL,
    gravedad ENUM('BAJA', 'MEDIA', 'ALTA', 'CRITICA') NOT NULL DEFAULT 'MEDIA',
    
    -- Funcionario que reporta
    id_funcionario_reporta INT NOT NULL,
    
    -- Auditoría
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_detenido) REFERENCES detenidos(id_detenido) ON DELETE SET NULL,
    FOREIGN KEY (id_funcionario_reporta) REFERENCES usuarios(id_usuario),
    
    INDEX idx_tipo (tipo_novedad),
    INDEX idx_fecha (fecha_novedad),
    INDEX idx_gravedad (gravedad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: visitas
-- Descripción: Registro de visitas a detenidos
-- ============================================
CREATE TABLE IF NOT EXISTS visitas (
    id_visita INT PRIMARY KEY AUTO_INCREMENT,
    id_detenido INT NOT NULL,
    
    -- Datos del visitante
    cedula_visitante VARCHAR(20) NOT NULL,
    nombre_visitante VARCHAR(100) NOT NULL,
    apellido_visitante VARCHAR(100) NOT NULL,
    parentesco VARCHAR(50),
    telefono VARCHAR(20),
    
    -- Datos de la visita
    fecha_visita DATETIME NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME,
    duracion_minutos INT,
    observaciones TEXT,
    autorizada BOOLEAN DEFAULT TRUE,
    
    -- Funcionario que autoriza
    id_funcionario_autoriza INT NOT NULL,
    
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_detenido) REFERENCES detenidos(id_detenido) ON DELETE CASCADE,
    FOREIGN KEY (id_funcionario_autoriza) REFERENCES usuarios(id_usuario),
    
    INDEX idx_detenido (id_detenido),
    INDEX idx_fecha (fecha_visita)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: traslados
-- Descripción: Registro de traslados de detenidos
-- ============================================
CREATE TABLE IF NOT EXISTS traslados (
    id_traslado INT PRIMARY KEY AUTO_INCREMENT,
    id_detenido INT NOT NULL,
    
    -- Origen y destino
    lugar_origen VARCHAR(200) NOT NULL,
    lugar_destino VARCHAR(200) NOT NULL,
    motivo_traslado TEXT NOT NULL,
    
    -- Fechas
    fecha_traslado DATETIME NOT NULL,
    fecha_retorno DATETIME,
    
    -- Custodia
    id_funcionario_custodia INT NOT NULL,
    observaciones TEXT,
    estado ENUM('PROGRAMADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO') NOT NULL DEFAULT 'PROGRAMADO',
    
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_detenido) REFERENCES detenidos(id_detenido) ON DELETE CASCADE,
    FOREIGN KEY (id_funcionario_custodia) REFERENCES usuarios(id_usuario),
    
    INDEX idx_detenido (id_detenido),
    INDEX idx_fecha (fecha_traslado),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: guardias
-- Descripción: Registro de guardias internas
-- ============================================
CREATE TABLE IF NOT EXISTS guardias (
    id_guardia INT PRIMARY KEY AUTO_INCREMENT,
    fecha_guardia DATE NOT NULL,
    turno ENUM('MAÑANA', 'TARDE', 'NOCHE') NOT NULL,
    
    -- Funcionarios asignados
    id_funcionario_jefe INT NOT NULL,
    funcionarios_asignados JSON, -- Array de IDs de funcionarios
    
    -- Detalles
    novedades TEXT,
    observaciones TEXT,
    estado ENUM('PROGRAMADA', 'EN_CURSO', 'FINALIZADA') NOT NULL DEFAULT 'PROGRAMADA',
    
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_funcionario_jefe) REFERENCES usuarios(id_usuario),
    
    INDEX idx_fecha (fecha_guardia),
    INDEX idx_turno (turno)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: eventos_sociales
-- Descripción: Actividades sociales para detenidos
-- ============================================
CREATE TABLE IF NOT EXISTS eventos_sociales (
    id_evento INT PRIMARY KEY AUTO_INCREMENT,
    nombre_evento VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo_evento ENUM('DEPORTIVO', 'CULTURAL', 'EDUCATIVO', 'RELIGIOSO', 'RECREATIVO') NOT NULL,
    
    -- Programación
    fecha_evento DATETIME NOT NULL,
    duracion_minutos INT NOT NULL,
    lugar VARCHAR(200) NOT NULL,
    
    -- Participantes
    cupo_maximo INT,
    participantes JSON, -- Array de IDs de detenidos
    
    -- Responsable
    id_funcionario_responsable INT NOT NULL,
    
    estado ENUM('PROGRAMADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO') NOT NULL DEFAULT 'PROGRAMADO',
    observaciones TEXT,
    
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_funcionario_responsable) REFERENCES usuarios(id_usuario),
    
    INDEX idx_fecha (fecha_evento),
    INDEX idx_tipo (tipo_evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: menores
-- Descripción: Registro especial para menores de edad
-- ============================================
CREATE TABLE IF NOT EXISTS menores (
    id_menor INT PRIMARY KEY AUTO_INCREMENT,
    id_detenido INT UNIQUE NOT NULL,
    
    -- Datos del tutor/representante
    nombre_tutor VARCHAR(100) NOT NULL,
    cedula_tutor VARCHAR(20) NOT NULL,
    parentesco_tutor VARCHAR(50) NOT NULL,
    telefono_tutor VARCHAR(20),
    
    -- Información educativa
    nivel_educativo VARCHAR(100),
    institucion_educativa VARCHAR(200),
    
    -- Información legal
    defensor_publico VARCHAR(200),
    medidas_especiales TEXT,
    
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_detenido) REFERENCES detenidos(id_detenido) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: audiencias
-- Descripción: Registro de audiencias judiciales
-- ============================================
CREATE TABLE IF NOT EXISTS audiencias (
    id_audiencia INT PRIMARY KEY AUTO_INCREMENT,
    id_caso INT NOT NULL,
    tipo_audiencia VARCHAR(100) NOT NULL,
    fecha_audiencia DATETIME NOT NULL,
    tribunal VARCHAR(200) NOT NULL,
    juez VARCHAR(100),
    
    -- Resultado
    resultado TEXT,
    proxima_audiencia DATETIME,
    
    -- Asistencia
    id_fiscal INT,
    id_director_garantia INT,
    
    observaciones TEXT,
    
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_caso) REFERENCES casos(id_caso) ON DELETE CASCADE,
    FOREIGN KEY (id_fiscal) REFERENCES ministerio_publico(id_fiscal),
    FOREIGN KEY (id_director_garantia) REFERENCES director_garantia(id_director),
    
    INDEX idx_caso (id_caso),
    INDEX idx_fecha (fecha_audiencia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: documentos
-- Descripción: Documentos asociados a casos
-- ============================================
CREATE TABLE IF NOT EXISTS documentos (
    id_documento INT PRIMARY KEY AUTO_INCREMENT,
    id_caso INT NOT NULL,
    tipo_documento VARCHAR(100) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    descripcion TEXT,
    
    id_usuario_carga INT NOT NULL,
    fecha_carga DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_caso) REFERENCES casos(id_caso) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_carga) REFERENCES usuarios(id_usuario),
    
    INDEX idx_caso (id_caso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: auditoria
-- Descripción: Registro de auditoría del sistema
-- ============================================
CREATE TABLE IF NOT EXISTS auditoria (
    id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(50) NOT NULL,
    id_registro_afectado INT,
    datos_anteriores JSON,
    datos_nuevos JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    fecha_accion DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    
    INDEX idx_usuario (id_usuario),
    INDEX idx_fecha (fecha_accion),
    INDEX idx_tabla (tabla_afectada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: respaldos
-- Descripción: Registro de respaldos de base de datos
-- ============================================
CREATE TABLE IF NOT EXISTS respaldos (
    id_respaldo INT PRIMARY KEY AUTO_INCREMENT,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamaño_bytes BIGINT NOT NULL,
    tipo_respaldo ENUM('COMPLETO', 'INCREMENTAL', 'DIFERENCIAL') NOT NULL,
    
    id_usuario_ejecuta INT NOT NULL,
    fecha_respaldo DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    estado ENUM('EXITOSO', 'FALLIDO', 'EN_PROCESO') NOT NULL DEFAULT 'EN_PROCESO',
    observaciones TEXT,
    
    FOREIGN KEY (id_usuario_ejecuta) REFERENCES usuarios(id_usuario),
    
    INDEX idx_fecha (fecha_respaldo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: roles
-- Descripción: Catálogo normalizado de roles del sistema
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos JSON,
    activo BOOLEAN DEFAULT TRUE,

    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_nombre_rol (nombre_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: funcionarios
-- Descripción: Registro detallado del personal policial
-- ============================================
CREATE TABLE IF NOT EXISTS funcionarios (
    id_funcionario INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    jerarquia VARCHAR(50) NOT NULL,
    cargo VARCHAR(100),
    estatus ENUM('ACTIVO', 'INACTIVO', 'VACACIONES', 'REPOSO') NOT NULL DEFAULT 'ACTIVO',
    fecha_ingreso DATE,
    observaciones TEXT,

    -- Auditoría
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),

    INDEX idx_cedula (cedula),
    INDEX idx_jerarquia (jerarquia),
    INDEX idx_estatus (estatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: centros_preventivos
-- Descripción: Registro de centros de detención preventiva
-- ============================================
CREATE TABLE IF NOT EXISTS centros_preventivos (
    id_centro INT PRIMARY KEY AUTO_INCREMENT,
    nombre_centro VARCHAR(200) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20),
    capacidad_maxima INT,
    ocupacion_actual INT DEFAULT 0,
    tipo_centro ENUM('PREVENTIVO', 'JUDICIAL', 'TRANSITORIO') NOT NULL DEFAULT 'PREVENTIVO',
    responsable VARCHAR(200),
    estado ENUM('ACTIVO', 'INACTIVO', 'EN_MANTENIMIENTO') NOT NULL DEFAULT 'ACTIVO',
    observaciones TEXT,

    -- Auditoría
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_nombre_centro (nombre_centro),
    INDEX idx_tipo_centro (tipo_centro),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: evidencias
-- Descripción: Registro de evidencias asociadas a casos
-- ============================================
CREATE TABLE IF NOT EXISTS evidencias (
    id_evidencia INT PRIMARY KEY AUTO_INCREMENT,
    id_caso INT NOT NULL,
    tipo_evidencia VARCHAR(100) NOT NULL,
    descripcion_detallada TEXT,
    fecha_incautacion DATETIME NOT NULL,
    lugar_incautacion VARCHAR(200) NOT NULL,
    estado_encontrado TEXT,
    caracteristica TEXT,
    id_oficial_cargo INT,
    cadena_custodia VARCHAR(100),
    ubicacion_actual VARCHAR(200),
    estado ENUM('EN_CUSTODIA', 'EN_ANALISIS', 'DEVUELTA', 'DESTRUIDA') NOT NULL DEFAULT 'EN_CUSTODIA',
    observaciones TEXT,

    -- Auditoría
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (id_caso) REFERENCES casos(id_caso) ON DELETE CASCADE,
    FOREIGN KEY (id_oficial_cargo) REFERENCES usuarios(id_usuario),

    INDEX idx_caso (id_caso),
    INDEX idx_tipo (tipo_evidencia),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar delitos comunes
INSERT IGNORE INTO delitos (codigo_delito, nombre_delito, categoria, pena_minima, pena_maxima) VALUES
('ART-405', 'Homicidio Intencional', 'GRAVE', 180, 360),
('ART-451', 'Robo Agravado', 'GRAVE', 120, 240),
('ART-458', 'Hurto Simple', 'LEVE', 6, 36),
('ART-216', 'Lesiones Personales', 'MODERADO', 12, 60),
('ART-374', 'Tráfico de Drogas', 'GRAVE', 96, 180),
('ART-264', 'Violencia de Género', 'GRAVE', 60, 180);

-- Insertar roles del sistema
INSERT IGNORE INTO roles (nombre_rol, descripcion) VALUES
('DIRECTOR', 'Director del centro. Acceso total al sistema, gestión de usuarios y configuración.'),
('COORDINADOR', 'Coordinador operativo. Gestión de casos, funcionarios y operaciones diarias.'),
('FUNCIONARIO', 'Funcionario policial. Acceso básico para registro y consulta de información.');

-- Usuario administrador por defecto (contraseña: admin123)
-- Nota: En producción, la contraseña debe ser encriptada con bcrypt
INSERT IGNORE INTO usuarios (nombre, usuario, contraseña, rol, jerarquia, ciudad_nacimiento, nombre_padre, nombre_madre) VALUES
('Administrador del Sistema', 'admin@pst.gov', '$2b$10$rGHvQqZJZqZJZqZJZqZJZeO', 'DIRECTOR', 'Comisario General', 'Caracas', 'Admin', 'Admin');
