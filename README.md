# 🛍️ Wallaclone - Práctica Frontend

<div align="center">

[![HTML5](https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/multipage/)
[![CSS3](https://img.shields.io/badge/css-663399?style=for-the-badge&logo=css&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)](https://www.ecma-international.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/vite-9135FF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/nodedotjs-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)

</div>

Este proyecto es una simulación de una aplicación web de anuncios clasificados, similar a Wallapop, desarrollada como parte de la práctica de Frontend del Bootcamp de Desarrollo Web FullStack en [KeepCoding](https://keepcoding.io/). La aplicación permite a los usuarios registrarse, iniciar sesión, ver, crear, editar y eliminar anuncios.

El principal requisito técnico de la práctica es el uso de **JavaScript vainilla**, sin la ayuda de librerías o frameworks como React, Vue o Angular. Para el diseño y la maquetación, se ha utilizado **Tailwind CSS**.

## ✨ Características Implementadas

### Funcionalidades obligatorias

- ✅ **Registro y autenticación de usuarios**: Los usuarios pueden crear una cuenta y hacer login. El sistema utiliza **tokens JWT** para gestionar la sesión.
- ✅ **Listado de Anuncios**: Muestra los anuncios existentes. Gestiona correctamente todos los estados de la interfaz: carga, error, éxito y listado vacío.
- ✅ **Botón de crear anuncio**: Aparece solo si el usuario ha iniciado sesión.
- ✅ **Página de detalle del anuncio**: Muestra la información completa de un anuncio.
- ✅ **Eliminación de anuncios**: Si un usuario es propietario de un anuncio, puede eliminarlo desde la página de detalle (con una ventana de confirmación).
- ✅ **Creación de anuncios**: Un formulario protegido permite a los usuarios crear nuevos anuncios, incluyendo la subida de una imagen.

### Funcionalidades Opcionales

- ✅ **Paginación**: El listado de anuncios está paginado y se puede navegar entre las diferentes páginas.
- ✅ **Buscador de Anuncios**: Se ha implementado una barra de búsqueda que filtra los anuncios por nombre.
- ✅ **Edición de Anuncios**: Los usuarios pueden editar sus propios anuncios.
- ✅ **Filtrado por Tags**: Se puede filtrar los anuncios haciendo clic en los tags.
- ✅ **Tags Dinámicos**: Los tags que se muestran para filtrar se cargan dinámicamente desde la API, basándose en los tags existentes en los anuncios.

## 🚀 Instalación y Puesta en Marcha

Para ejecutar este proyecto, necesitas tener dos terminales abiertas, una para el backend y otra para el frontend.

### 1. Backend (Servidor de API)

El backend utiliza `sparrest.js` (un wrapper de `json-server`) para simular una API REST.

```bash
# 1. Navega a la carpeta del backend
cd backend

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor
npm start
```

El servidor del backend se ejecutará en `http://localhost:8000`.

### 2. Frontend (Aplicación Web)

El frontend está construido con HTML, CSS (Tailwind) y JavaScript vainilla, utilizando Vite como servidor de desarrollo.

```bash
# 1. (En una nueva terminal) Navega a la carpeta del frontend
cd frontend

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

La aplicación frontend estará disponible en `http://localhost:5173` (o en el puerto que indique Vite en la terminal).

---

## 🛠️ Scripts Disponibles

### En la carpeta `backend/`:

- `npm start`: Inicia el servidor de la API REST con `sparrest.js`.

### En la carpeta `frontend/`:

- `npm run dev`: Inicia el servidor de desarrollo de Vite con Hot-Reload.
- `npm run build`: Genera una versión de producción de los archivos estáticos.
- `npm run preview`: Sirve localmente la versión de producción.

---

## 📁 Estructura del Proyecto

```
├── backend/       # Contiene el servidor de la API y la base de datos
│   ├── db.json    # Base de datos simulada con los anuncios y usuarios
│   └── ...
├── frontend/      # Contiene el código de la aplicación cliente
│   ├── src/       # Archivos fuente de JavaScript y CSS
│   ├── index.html # Página principal (listado de anuncios)
│   └── ...
└── README.md      # Este archivo
```

---

## 🤝 Contribución

Si quieres mejorar el proyecto:

1. Haz fork del repositorio.
2. Crea una rama: `git checkout -b feature/mi-mejora`.
3. Haz commits claros siguiendo Conventional Commits.
4. Haz push y abre un Pull Request describiendo los cambios.

---

## 📄 Licencia

Este proyecto se entrega con [**Licencia MIT**](https://github.com/Aratea10/wallaclone-practice/blob/main/LICENSE).

---

## 👨‍💻 Autora
**Sara Gallego Méndez** — Estudiante del Bootcamp de Desarrollo Web FullStack en [KeepCoding](https://keepcoding.io/).
