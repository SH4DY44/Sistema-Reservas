# ProyectoDistribuidos

Aplicación de gestión de recursos y reservas compuesta por un backend en Node.js/Express y un frontend en React (Vite + TailwindCSS).

## Resumen

La aplicación permite registrar usuarios, recursos y reservas. Incluye autenticación básica, operaciones CRUD y una interfaz responsiva.

## Tecnologías

- Backend: Node.js, Express
- Base de datos: PostgreSQL (pool con `pg`)
- Frontend: React + Vite, TailwindCSS
- Autenticación: Context API (frontend) y rutas protegidas (backend)

## Requisitos

- Node.js 20.x o superior (recomendado)
- npm (o pnpm/yarn)
- PostgreSQL

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con al menos las siguientes variables:

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=reservas_db
DB_PASS=tu_contraseña
DB_PORT=5432
PORT=3000
NODE_ENV=development
```

Ajusta los valores según tu entorno.

## Instalación y ejecución (local)

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/proyectoDistribuidos.git
cd proyectoDistribuidos
```

2. Instala dependencias del backend:

```bash
npm install
```

3. Instala dependencias del frontend:

```bash
cd frontend
npm install
cd ..
```

4. Configura la base de datos PostgreSQL y crea la base de datos indicada en `DB_NAME`.

5. Crea el archivo `.env` con las variables mencionadas más arriba.

6. Inicia el backend (desde la raíz del proyecto):

```bash
node src/app.js
# o si usas nodemon
npx nodemon src/app.js
```

7. Inicia el frontend (en otra terminal):

```bash
cd frontend
npm run dev
```

8. Abre la aplicación en el navegador (por defecto Vite usa http://localhost:5173).

## Estructura del proyecto

- `src/` - código del backend (controladores, servicios, modelos, rutas)
- `frontend/` - aplicación React (Vite)
- `setup-info.sh` - script informativo
- `package.json` - scripts y dependencias del backend

## Base de datos

Asegúrate de crear la base de datos y las tablas necesarias. El proyecto asume que existen tablas `usuarios`, `recursos` y `reservas` con las columnas utilizadas en el código. Si no tienes migraciones, puedes crear las tablas manualmente.

Ejemplo mínimo (PostgreSQL):

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE recursos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT
);

CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  recurso_id INTEGER REFERENCES recursos(id),
  fecha_inicio TIMESTAMP NOT NULL,
  fecha_fin TIMESTAMP NOT NULL
);
```

