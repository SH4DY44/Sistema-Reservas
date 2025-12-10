/**
 * Controlador de Recursos
 */

const RecursosService = require('../services/recursosService');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responses');

exports.getRecursos = async (req, res, next) => {
  try {
    const recursos = await RecursosService.getAll();
    sendSuccess(res, recursos, 'Recursos obtenidos exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.getRecurso = async (req, res, next) => {
  try {
    const recurso = await RecursosService.obtenerPorId(req.params.id);
    if (!recurso) {
      return sendNotFound(res, 'Recurso');
    }
    sendSuccess(res, recurso);
  } catch (error) {
    next(error);
  }
};

exports.createRecurso = async (req, res, next) => {
  try {
    const recurso = await RecursosService.crear(req.body);
    sendSuccess(res, recurso, 'Recurso creado exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

exports.updateRecurso = async (req, res, next) => {
  try {
    const recurso = await RecursosService.actualizar(req.params.id, req.body);
    sendSuccess(res, recurso, 'Recurso actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.deleteRecurso = async (req, res, next) => {
  try {
    const resultado = await RecursosService.eliminar(req.params.id);
    sendSuccess(res, resultado, resultado.mensaje);
  } catch (error) {
    next(error);
  }
};
