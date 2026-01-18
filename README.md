# Wallaclone Practice

Aplicación web similar a Wallapop desarrollada como práctica de JavaScript vanilla.

## Estructura del proyecto

- **backend/**: API REST con sparrest.js
- **frontend/**: Aplicación frontend con Vite y Tailwind CSS

## Instalación

### Backend

```bash
cd backend
npm install
npm start
```

## Requisitos

- Node.js (v14 o superior)
- npm

## Endpoints del API

- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Login de usuarios  
- `POST /upload` - Subida de archivos
- `GET /api/adverts` - Listado de anuncios
- `POST /api/adverts` - Crear anuncio (requiere autenticación)
- `GET /api/adverts/:id` - Detalle de anuncio
- `PUT /api/adverts/:id` - Actualizar anuncio (requiere autenticación)
- `DELETE /api/adverts/:id` - Eliminar anuncio (requiere autenticación)
