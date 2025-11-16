
// Este es el comentario de prueba para verificar que se puedan hacer cambios en el repositorio.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./config/environment');
const errorHandler = require('./middleware/errorHandler');

// Importar rutas
const usuariosRouter = require('./routes/usuarios');
const recursosRouter = require('./routes/recursos');
const reservasRouter = require('./routes/reservas');

// Inicializar app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Logging de solicitudes
if (config.server.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Rutas de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Rutas API
app.use('/usuarios', usuariosRouter);
app.use('/recursos', recursosRouter);
app.use('/reservas', reservasRouter);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
});

// Middleware de manejo de errores (DEBE ir al final)
app.use(errorHandler);

// Iniciar servidor
const PORT = config.server.port;
const server = app.listen(PORT, () => {
  console.log(`

║  Servidor iniciado exitosamente                ║
║  Puerto: ${PORT}                                      ║
║  Ambiente: ${config.server.nodeEnv}                     ║

  `);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Rechazo no manejado en:', promise, 'razón:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Excepción no capturada:', error);
  process.exit(1);
});

module.exports = app;
