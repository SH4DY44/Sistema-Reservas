const express = require('express');
const router = express.Router();
const recursosController = require('../controllers/recursosController');

// Obtener todos los recursos
router.get('/', recursosController.getRecursos);

// Obtener un recurso específico
router.get('/:id', recursosController.getRecurso);

// Crear recurso
router.post('/', recursosController.createRecurso);

// Actualizar recurso
router.put('/:id', recursosController.updateRecurso);

// Eliminar recurso
router.delete('/:id', recursosController.deleteRecurso);

module.exports = router;
