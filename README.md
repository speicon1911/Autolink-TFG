# AutoLink - Plataforma de Compra-Venta de Vehículos 🚗💨


**AutoLink** es una aplicación web moderna diseñada para facilitar la compra y venta de vehículos. Este proyecto ha sido desarrollado como el **Trabajo de Fin de Grado (TFG)** para el ciclo de Desarrollo de Aplicaciones Web (DAW). La plataforma ofrece una experiencia intuitiva tanto para compradores como para vendedores, integrando una gestión avanzada de inventario, búsquedas filtradas y un sistema de administración robusto.

---

## 📋 Índice
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
  - [Base de Datos (Docker)](#1-base-de-datos-docker)
  - [Backend (Spring Boot)](#2-backend-spring-boot)
  - [Frontend (Angular)](#3-frontend-angular)
- [Seguridad](#-seguridad)
- [Autores](#-autores)

---

## ✨ Características Principales

### Para Usuarios (Clientes)
- **Catálogo Dinámico:** Visualización de vehículos con filtros avanzados (marca, modelo, precio, kilometraje).
- **Favoritos:** Guarda tus vehículos preferidos para consultarlos más tarde.
- **Contacto Directo:** Formulario de contacto directo con el vendedor del vehículo.
- **Perfil de Usuario:** Gestión de datos personales y visualización de compras realizadas.

### Para Vendedores
- **Gestión de Stock:** Publicar, editar y eliminar vehículos de forma sencilla.
- **Carga de Imágenes:** Integración con API externa (ImgBB) para el almacenamiento de fotos en la nube.
- **Panel de Ventas:** Registro y seguimiento de transacciones realizadas.

### Para Administradores
- **Moderación:** Validación de anuncios antes de que sean públicos.
- **Control de Usuarios:** Supervisión de la actividad para garantizar la seguridad de la plataforma.
- **Gestión de Marcas:** Administración del catálogo maestro de marcas y modelos.

---

## 🛠️ Tecnologías Utilizadas

El proyecto sigue un enfoque de desacoplamiento total entre el cliente y el servidor:

| Componente | Tecnología |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.4.3 |
| **Frontend** | Angular 18/21, Tailwind CSS 4.0 |
| **Base de Datos** | MariaDB |
| **Contenedores** | Docker & Docker Compose |
| **Seguridad** | Spring Security & JWT (JSON Web Tokens) |
| **APIs Externas** | ImgBB (Imágenes), Gmail SMTP (Notificaciones) |

---

## 🏗️ Arquitectura

AutoLink utiliza una arquitectura de **Microservicios desacoplados** (Frontend SPA + Backend REST API Stateless).

- **Backend:** Organizado en capas (Controller, Service, Repository, DTO, Mapper) para asegurar la escalabilidad y mantenibilidad.
- **Frontend:** Basado en componentes *Standalone* y reactividad moderna mediante **Angular Signals**.
- **Persistencia:** Uso de Spring Data JPA con Hibernate para un mapeo objeto-relacional eficiente.

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- **Java JDK 21**
- **Node.js (LTS)** y **NPM**
- **Docker Desktop**
- Cuenta en **ImgBB** (para la API Key de imágenes)

### 1. Base de Datos (Docker)
Levanta la base de datos MariaDB y PhpMyAdmin usando Docker Compose:
```bash
docker-compose up -d
```
*La base de datos estará disponible en el puerto `3307`.*

### 2. Backend (Spring Boot)
1. Navega a la carpeta del backend: `cd autolink-backend`
2. Configura tus variables de entorno en `src/main/resources/application.properties` (o mediante variables del sistema):
   - `JWT_SECRET`: Tu clave secreta para los tokens.
   - `IMGBB_API_KEY`: Tu clave de API de ImgBB.
   - `SPRING_MAIL_PASSWORD`: Contraseña de aplicación de Gmail.
3. Ejecuta el backend:
```bash
./mvnw spring-boot:run
```

### 3. Frontend (Angular)
1. Navega a la carpeta del frontend: `cd autolink-frontend`
2. Instala las dependencias:
```bash
npm install
```
3. Inicia el servidor de desarrollo:
```bash
npm start
```
*Accede a la aplicación en `http://localhost:4200`.*

---

## 🔐 Seguridad

La seguridad es un pilar fundamental en AutoLink:
- **BCrypt:** Todas las contraseñas se almacenan encriptadas con algoritmos de hash aleatorios.
- **JWT:** Las comunicaciones entre Angular y Spring Boot están protegidas por tokens de sesión.
- **Interceptores:** El frontend incluye un `AuthInterceptor` que adjunta automáticamente el token a cada petición.
- **Roles:** Acceso granular basado en roles (`ROLE_USER`, `ROLE_SELLER`, `ROLE_ADMIN`).

---

## ✒️ Autores

* **Salvador Peinado** - *Desarrollador Full Stack* - [speicon1911](https://github.com/speicon1911)

---
*Este proyecto ha sido realizado para el módulo de Proyecto Intermodular de Desarrollo de Aplicaciones Web.*
