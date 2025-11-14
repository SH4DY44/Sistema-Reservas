/**
 * Middleware para manejo centralizado de errores
 */

const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // Error de validación
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.details,
    });
  }

  // Error de duplicado en BD
  if (error.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Este registro ya existe',
    });
  }

  // Error de clave foránea
  if (error.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida a otro registro',
    });
  }

  // Error de conexión a BD
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Error de conexión a la base de datos',
    });
  }

  // Error genérico
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
  });
};

module.exports = errorHandler;
