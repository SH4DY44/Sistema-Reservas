
// Este es el comentario de prueba para verificar que se puedan hacer cambios en el repositorio.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./config/environment');
const errorHandler = require('./middleware/errorHandler');

// Importar rutas
const requestLogger = require('./middleware/requestLogger');
const validateRequiredFields = require('./middleware/validator');

// Importar rutas
const usuariosRouter = require('./routes/usuarios');
const recursosRouter = require('./routes/recursos');
const reservasRouter = require('./routes/reservas');
const reportesRouter = require('./routes/reportes');

// Inicializar app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// [TEMA 2: MIDDLEWARE] Auditoría de solicitudes
// Aplicamos el logger globalmente para tener trazabilidad de TODAS las interacciones
app.use(requestLogger);

// Logging de solicitudes (Legacy dev logging - mantenemos por compatibilidad pero requestLogger es superior)
if (config.server.nodeEnv === 'development') {
  app.use((req, res, next) => {
    // console.log(`${req.method} ${req.path}`); // Comentado para no duplicar logs con requestLogger
    next();
  });
}

// Rutas de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Rutas API
// [TEMA 2: MIDDLEWARE] Validación en rutas
// Podemos interceptar rutas específicas para validar datos antes del controlador
app.post('/usuarios/login', validateRequiredFields(['email', 'password']), (req, res, next) => {
    // Si pasa la validación, el router original manejará la lógica
    next();
});

app.use('/usuarios', usuariosRouter);
app.use('/recursos', recursosRouter);
app.use('/reservas', reservasRouter);
app.use('/reportes', reportesRouter);

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
