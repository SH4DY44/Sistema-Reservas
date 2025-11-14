/**
 * Controlador de Usuarios
 * Maneja las peticiones HTTP y delega lógica al servicio
 */

const UsuariosService = require('../services/usuariosService');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responses');

exports.getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await UsuariosService.obtenerTodos();
    sendSuccess(res, usuarios, 'Usuarios obtenidos exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.getUsuario = async (req, res, next) => {
  try {
    const usuario = await UsuariosService.obtenerPorId(req.params.id);
    if (!usuario) {
      return sendNotFound(res, 'Usuario');
    }
    sendSuccess(res, usuario);
  } catch (error) {
    next(error);
  }
};

exports.createUsuario = async (req, res, next) => {
  try {
    const usuario = await UsuariosService.crear(req.body);
    sendSuccess(res, usuario, 'Usuario creado exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

exports.updateUsuario = async (req, res, next) => {
  try {
    const usuario = await UsuariosService.actualizar(req.params.id, req.body);
    sendSuccess(res, usuario, 'Usuario actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.deleteUsuario = async (req, res, next) => {
  try {
    const resultado = await UsuariosService.eliminar(req.params.id);
    sendSuccess(res, resultado, resultado.mensaje);
  } catch (error) {
    next(error);
  }
};

exports.loginUsuario = async (req, res, next) => {
  try {
    const usuario = await UsuariosService.login(req.body.email, req.body.password);
    sendSuccess(res, usuario, 'Inicio de sesión exitoso');
  } catch (error) {
    next(error);
  }
};
