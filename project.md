# Proyecto de Desarrollo de Software

## 1. Descripción del Proyecto

El proyecto consiste en el desarrollo de una aplicación web enfocada en un sistema para gimnasios, que permita a los usuarios registrados en la aplicación llevar un control de sus rutinas de entrenamiento y seguimiento de su progreso.

## 2. Objetivos

- Desarrollar una aplicación web que permita a los usuarios registrados en la aplicación llevar un control de sus rutinas de entrenamiento y seguimiento de su progreso.

## 3. Requisitos

- El sistema debe permitir el registro de usuarios con credenciales (correo electrónico y contraseña) y redes sociales (Google).

- Los usuarios deben crear rutinas de entrenamiento.

- Cada rutina debe contener categoria, nombre, descripcion, series, repeticiones, peso, tiempo, descanso, observaciones.

- Se debe poder editar, eliminar y ver las rutinas creadas.

- Se debe poder ver el progreso del usuario en sus rutinas y graficadas segun su progreso.

## 4. Tecnologias

- Next.js (frontend)
- Tailwind CSS (estilos)
- TypeScript (tipado)
- Shadcn UI (componentes)
- Nestjs (backend)
- PostgreSQL (base de datos)

## 5. Librerias Sugeridas

- typeorm
- react-hook-form
- yup
- shadcn ui
- lucide-react
- slugify (para generar slug en caso de que se requiera)

## 6. Funcionalidades

- Autenticación de usuarios (correo electrónico y contraseña, redes sociales (Google)).
- CRUD de rutinas de entrenamiento.
- Visualización de progreso del usuario en sus rutinas y graficadas segun su progreso.
- Cada usuario tendra un perfil donde podra ver su informacion y sus rutinas creadas.

## 7. Reglas

- Para la autencicacion se usara nuestro propio sistema de autenticación.
- Se debe priorizar el renderizado del lado del servidor (SSR) para mejorar el rendimiento y el SEO.
- Evitar ocupar any todo tiene que ir tipado correctamente.
- Se debe ocupar tailwind css para los estilos.
- Se debe ocupar shadcn ui para los componentes.
- Se debe ocupar lucide-react para los iconos.
- Se debe ocupar typeorm para la base de datos.
- Se debe ocupar react-hook-form para los formularios.
- Se debe ocupar yup para la validación de formularios.
- Se debe ocupar slugify para generar slug en caso de que se requiera.
- Utilizar las ultimas versiones de las tecnologias mencionadas y librerias.

## 8. MCP

- Shadcn UI MCP
- Next.js MCP
