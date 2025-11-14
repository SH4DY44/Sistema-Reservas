const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');

// Obtener todas las reservas
router.get('/', reservasController.getReservas);

// Obtener una reserva específica
router.get('/:id', reservasController.getReserva);

// Obtener reservas de un usuario
router.get('/usuario/:usuarioId', reservasController.getReservasPorUsuario);

// Obtener reservas de un recurso
router.get('/recurso/:recursoId', reservasController.getReservasPorRecurso);

// Crear reserva
router.post('/', reservasController.createReserva);

// Actualizar reserva
router.put('/:id', reservasController.updateReserva);

// Cancelar reserva
router.post('/:id/cancelar', reservasController.cancelarReserva);

// Eliminar reserva
router.delete('/:id', reservasController.deleteReserva);

module.exports = router;
