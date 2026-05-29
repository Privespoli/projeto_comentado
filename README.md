# travelapp_backend
# ✈️ TravelApp

> Aplicación web para la gestión de viajes en grupo. Organiza, comparte y planifica tus viajes con tus compañeros de aventura.

![TravelApp](https://img.shields.io/badge/status-en%20desarrollo-green) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js) ![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)

---

## 📋 Tabla de contenidos

- [Sobre el proyecto](#sobre-el-proyecto)
- [Funcionalidades](#funcionalidades)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Base de datos](#base-de-datos)
- [Equipo](#equipo)

---

## 🌍 Sobre el proyecto

TravelApp es una aplicación fullstack desarrollada como proyecto final de bootcamp. Permite a los usuarios crear viajes, invitar a otros participantes y gestionar toda la información del viaje de forma colaborativa: tickets, documentos, itinerario, puntos de interés y mucho más.

---

## ✨ Funcionalidades

### Autenticación
- Registro e inicio de sesión con email y contraseña (Supabase Auth)
- Rutas protegidas — solo usuarios autenticados acceden al dashboard
- Cierre de sesión

### Dashboard
- Vista de todos los viajes donde el usuario es **titular** o **integrante**
- Badge visual que distingue el rol en cada viaje
- Creación de nuevos viajes con imagen, destino y fechas
- Cambio de estado del viaje (Planificación / En curso / Finalizado) — solo el titular

### Gestión del viaje
- **Integrantes** — añadir por email, ver lista con nombres, eliminar (solo titular)
- **Tickets & Docs** — subir PDF e imágenes con título, lugar y fecha; eliminar (titular y integrantes)
- **Itinerario** — gestión de actividades por día, data y hora en orden cronológica, añadir y quitar informaciones (titular)
- **Mapa & POI** — puntos de interés con votación y visualización en mapa, añadir punto de interés, añadir POI al itinerário (integrantes y titular)

### Perfil de usuario
- Foto de perfil, nombre y teléfono
- El nombre se muestra en el header del dashboard y en la lista de integrantes

### Formulario de contacto
- Integrado en la landing page
- Envío de emails via EmailJS sin necesidad de backend

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Storage | Supabase Storage |
| Email | EmailJS |
| Control de versiones | Git + GitHub |

---

## 🏗️ Arquitectura

```
Cliente (React + Vite)
        ↓ HTTP requests con JWT
Servidor (Node.js + Express)
        ↓ supabaseAdmin (service key)
Supabase (PostgreSQL + Storage + Auth)
```

El backend actúa como intermediario entre el frontend y Supabase, usando la **service key** para saltarse las políticas RLS y tener control total sobre los datos.

---

## 🚀 Instalación

### Requisitos previos
- Node.js v18+
- Cuenta en Supabase
- Cuenta en EmailJS

### Backend

```bash
# Clonar el repositorio
git clone https://github.com/melinarivera/travelapp_backend.git
cd travelapp_backend

# Instalar dependencias
npm install

# Crear archivo .env (ver sección de variables de entorno)
cp .env.example .env

# Arrancar en desarrollo
npm run dev
```

### Frontend

```bash
# Clonar el repositorio
git clone https://github.com/melinarivera/travelapp_frontend.git
cd travelapp_frontend

# Instalar dependencias
npm install

# Arrancar en desarrollo
npm run dev
```

---

## 🔐 Variables de entorno

### Backend — `.env`

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_KEY=tu_service_role_key
PORT=3000
```

### Frontend

Las credenciales de EmailJS están configuradas directamente en el componente `ContactForm.jsx`.

---

## 📁 Estructura del proyecto

### Backend
```
travelapp_backend/
├── index.js
└── src/
    ├── controllers/
    │   ├── authController.js
    │   ├── viajesController.js
    │   ├── integrantesController.js
    │   ├── documentosController.js
    │   └── perfilController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── viajesRoutes.js
    │   ├── integrantesRoutes.js
    │   ├── documentosRoutes.js
    │   └── perfilRoutes.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── uploadMiddleware.js
    └── supabaseClient.js
```

### Frontend
```
travelapp_frontend/
└── src/
    ├── pages/
    │   ├── AuthPage.jsx
    │   ├── Dashboard.jsx
    │   ├── ViajePage.jsx
    │   └── PerfilPage.jsx
    ├── components/
    │   ├── LoginForm.jsx
    │   ├── RegisterForm.jsx
    │   ├── ViajeCard.jsx
    │   ├── CrearViajeModal.jsx
    │   ├── Integrantes.jsx
    │   ├── TicketsYDocs.jsx
    │   ├── Perfil.jsx
    │   └── ContactForm.jsx
    ├── context/
    │   └── AuthContext.jsx
    └── api.js
```

---

## 🗄️ Base de datos

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `viajes` | Viajes creados por los usuarios |
| `integrantes` | Relación usuario-viaje con rol |
| `documentos` | Tickets y documentos subidos por viaje |
| `perfiles` | Nombre, teléfono y foto de cada usuario |
| `itinerarios` | Nombre, dirección, fecha y hora de cada local añadido en el itinerario |
| `lugares_poi` | Nombre y descripición cada local añadido en el POI |
| `votos_poi` | registro de voto unico por id |

### Storage buckets

| Bucket | Contenido |
|--------|-----------|
| `imagenes-viajes` | Portadas de los viajes |
| `documentos` | PDFs e imágenes de tickets |
| `avatares` | Fotos de perfil de usuarios |

---

## 👩‍💻 Equipo

| Desarrolladoras | Áreas |
|---------------|-------|
| **Melina Rivera** | Backend, autenticación, login, dashboard, integrantes, tickets & docs, perfil, formulario de contacto, Base de Datos |
| **Priscila Nunes** | Backend, Base de Datos, registro, Itinerario, mapa & POI, puntos de interés con votación, diseño visual, cursor y paleta de colores |

---

## 📄 Licencia

Proyecto académico — Bootcamp 2026.

### © 2026 Melina Rivera & Priscila Nunes. Todos los derechos reservados.

Este proyecto es **software propietario**. El código fuente se comparte públicamente con fines de **exhibición y portfolio personal** únicamente.

**Queda estrictamente prohibido**, sin autorización escrita y expresa de las autoras:

* Clonar, copiar o descargar este repositorio con fines distintos a la visualización.
* Distribuir, sublicenciar o vender el código, en su totalidad o en parte.
* Usar este proyecto como base para otros proyectos, ya sean personales o comerciales.
* Modificar, descompilar o crear obras derivadas a partir de este código.

Para solicitar permisos de uso, colaboración o cualquier consulta relacionada, puedes contactarnos a través de GitHub: [@melinarivera](https://github.com/melinarivera) o [@Privespoli](https://github.com/Privespoli).

> El hecho de que este repositorio sea público **no implica** que se otorgue ningún tipo de licencia de uso, copia o distribución.
