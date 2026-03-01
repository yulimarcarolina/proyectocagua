# Sistema de Gestión Policial - Proyecto Cagua

Este es el frontend del Sistema de Gestión Policial desarrollado para el Proyecto Socio Tecnológico (PST).

## 🚀 Requisitos Previos

- Node.js 18.17 o superior
- npm o pnpm

## 🛠️ Instalación y Ejecución Local

1.  **Instalar dependencias:**
    ```bash
    npm install
    # o
    pnpm install
    ```

2.  **Ejecutar en modo desarrollo:**
    ```bash
    npm run dev
    ```
    El sistema estará disponible en `http://localhost:3000`.

## 📦 Construcción para Producción

Para generar una versión optimizada para producción:

```bash
npm run build
npm start
```

## ☁️ Despliegue

Este proyecto está construido con Next.js y se puede desplegar fácilmente en plataformas como Vercel o Netlify.

### Despliegue en Vercel (Recomendado)

1.  Crea una cuenta en [Vercel](https://vercel.com).
2.  Instala Vercel CLI: `npm i -g vercel`
3.  Ejecuta el comando `vercel` en la raíz del proyecto.
4.  Sigue las instrucciones en pantalla.

### Despliegue Manual

Sube el contenido de la carpeta `.next` (generada tras `npm run build`) a tu servidor de hosting preferido que soporte Node.js.

## 🔐 Roles y Credenciales de Acceso

El sistema cuenta con 3 niveles de acceso predefinidos para demostración:

### 1. Director
*   **Usuario:** `director@pst.gov`
*   **Contraseña:** `123456`
*   **Permisos:** Acceso total (Crear, Leer, Editar, Eliminar) en todos los módulos.

### 2. Coordinador
*   **Usuario:** `coordinador@pst.gov`
*   **Contraseña:** `123456`
*   **Permisos:**
    *   **Casos:** Solo lectura.
    *   **Otros Módulos:** Acceso total (Crear, Leer, Editar, Eliminar).

### 3. Funcionario
*   **Usuario:** `funcionario@pst.gov`
*   **Contraseña:** `123456`
*   **Permisos:**
    *   **Novedades y Visitas:** Puede registrar (Crear) y consultar (Leer).
    *   **Otros Módulos:** Solo lectura.
    *   **Restricción:** No puede editar ni eliminar ningún registro.

## 📂 Estructura del Proyecto

*   `/app`: Rutas y páginas del sistema (Next.js App Router).
*   `/components`: Componentes reutilizables y módulos específicos.
*   `/hooks`: Lógica de negocio y gestión de estado (localStorage).
*   `/lib`: Utilidades y configuraciones.
