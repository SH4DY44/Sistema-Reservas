/**
 * Utilidades para respuestas estandarizadas
 */

const sendSuccess = (res, data, message = 'Éxito', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, error, message = 'Error', statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: error.message || error,
  });
};

const sendValidationError = (res, errors) => {
  res.status(400).json({
    success: false,
    message: 'Errores de validación',
    errors,
  });
};

const sendNotFound = (res, resource = 'Recurso') => {
  res.status(404).json({
    success: false,
    message: `${resource} no encontrado`,
  });
};

const sendConflict = (res, message = 'El recurso ya existe') => {
  res.status(409).json({
    success: false,
    message,
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendConflict,
};
