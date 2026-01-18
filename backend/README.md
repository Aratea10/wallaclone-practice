# Sparrest.js

Un fork de [json-server](https://github.com/typicode/json-server) para disfrutar desarrollando aplicaciones frontend sin un backend real, pero con autenticación JWT.

## Configuración

1. Crea un archivo `db.json` con las entidades de tu base de datos.
2. Ejecuta el servidor con `npm start`.
3. Registra un usuario con `POST /auth/register { username: "luke", password: "skywalker" }`.
4. Inicia sesión para obtener tu token JWT: `POST /auth/login { username: "luke", password: "skywalker" }`.
5. Comienza a usar las rutas de json-server en `/api/<json-server routes>`. Necesitarás autenticar cada petición añadiendo una cabecera HTTP: `Authorization: Bearer <JWT token>`.

## Subir archivos

Puedes subir archivos haciendo una petición POST multipart con un campo file (con el contenido del archivo) a `/upload`.

## Notas (Cambios de dependencias)

Para la entrega se han actualizado las dependencias del `package.json` con el objetivo de **corregir vulnerabilidades de seguridad críticas** que impedían una instalación limpia (`npm install`).

Cambios realizados:

- **0 vulnerabilidades**: Se han resuelto todas las alertas de seguridad reportadas por `npm audit`.
- **Librerías actualizadas**:
  - `json-server`: v0.16.x -> **v0.17.4** (Versión estable más reciente compatible).
  - `multer`: v1.4.x -> **v1.4.5-lts.1** (Versión segura con parches para CVEs).
  - Actualización general de otras dependencias a sus versiones seguras ("patched").

El funcionamiento del servidor ha sido verificado con `npm start` manteniendo la compatibilidad total con el código original.
