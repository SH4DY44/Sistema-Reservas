require('dotenv').config();

const config = {
  // Base de datos
  database: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'reservas_db',
    password: process.env.DB_PASS || '',
    port: process.env.DB_PORT || 5432,
  },
  
  // Servidor
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // API
  api: {
    version: 'v1',
    prefix: '/api',
  },
};

// Validar que las variables críticas existan
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASS'];
const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.warn(
    `Variables de entorno faltantes: ${missingEnvVars.join(', ')}`
  );
}

module.exports = config;
