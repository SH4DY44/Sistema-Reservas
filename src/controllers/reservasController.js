/**
 * Controlador de Reservas
 */

const ReservasService = require('../services/reservasService');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responses');

exports.getReservas = async (req, res, next) => {
  try {
    const reservas = await ReservasService.obtenerTodos();
    sendSuccess(res, reservas, 'Reservas obtenidas exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.getReserva = async (req, res, next) => {
  try {
    const reserva = await ReservasService.obtenerPorId(req.params.id);
    if (!reserva) {
      return sendNotFound(res, 'Reserva');
    }
    sendSuccess(res, reserva);
  } catch (error) {
    next(error);
  }
};

exports.getReservasPorUsuario = async (req, res, next) => {
  try {
    const reservas = await ReservasService.obtenerPorUsuario(req.params.usuarioId);
    sendSuccess(res, reservas, 'Reservas del usuario obtenidas');
  } catch (error) {
    next(error);
  }
};

exports.getReservasPorRecurso = async (req, res, next) => {
  try {
    const reservas = await ReservasService.obtenerPorRecurso(req.params.recursoId);
    sendSuccess(res, reservas, 'Reservas del recurso obtenidas');
  } catch (error) {
    next(error);
  }
};

exports.createReserva = async (req, res, next) => {
  try {
    // [TEMA 5: TRANSACCIONES DISTRIBUIDAS]
    // Usamos la orquestación SAGA en lugar de la creación simple
    const reserva = await ReservasService.crearReservaConSaga(req.body);
    sendSuccess(res, reserva, 'Reserva creada y notificada exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

exports.updateReserva = async (req, res, next) => {
  try {
    const reserva = await ReservasService.actualizar(req.params.id, req.body);
    sendSuccess(res, reserva, 'Reserva actualizada exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.deleteReserva = async (req, res, next) => {
  try {
    const resultado = await ReservasService.eliminar(req.params.id);
    sendSuccess(res, resultado, resultado.mensaje);
  } catch (error) {
    next(error);
  }
};

exports.cancelarReserva = async (req, res, next) => {
  try {
    const reserva = await ReservasService.cancelar(req.params.id);
    sendSuccess(res, reserva, 'Reserva cancelada exitosamente');
  } catch (error) {
    next(error);
  }
};
