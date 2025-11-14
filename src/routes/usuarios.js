const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Obtener todos los usuarios
router.get('/', usuariosController.getUsuarios);

// Obtener un usuario específico
router.get('/:id', usuariosController.getUsuario);

// Crear usuario
router.post('/', usuariosController.createUsuario);

// Login
router.post('/login', usuariosController.loginUsuario);

// Actualizar usuario
router.put('/:id', usuariosController.updateUsuario);

// Eliminar usuario
router.delete('/:id', usuariosController.deleteUsuario);

module.exports = router;
