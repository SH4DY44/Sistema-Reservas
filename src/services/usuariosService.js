/**
 * Servicio de Usuarios - Lógica de negocio
 */

const db = require('../config/database');
const {
  isValidEmail,
  isValidPassword,
  isNotEmpty,
} = require('../utils/validators');

class UsuariosService {
  // Obtener todos los usuarios
  static async obtenerTodos() {
    const result = await db.query('SELECT * FROM usuarios ORDER BY id DESC');
    return result.rows;
  }

  // Obtener usuario por ID
  static async obtenerPorId(id) {
    const result = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Crear usuario
  static async crear(datos) {
    const { nombre, email, password } = datos;

    // Validar datos
    if (!isNotEmpty(nombre)) {
      throw { statusCode: 400, message: 'El nombre es requerido' };
    }
    if (!isValidEmail(email)) {
      throw { statusCode: 400, message: 'El email no es válido' };
    }
    if (!isValidPassword(password)) {
      throw { statusCode: 400, message: 'La contraseña debe tener mínimo 6 caracteres' };
    }

    try {
      const result = await db.query(
        'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *',
        [nombre, email, password]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw { statusCode: 409, message: 'El email ya está registrado' };
      }
      throw error;
    }
  }

  // Actualizar usuario
  static async actualizar(id, datos) {
    const { nombre, email } = datos;

    if (nombre && !isNotEmpty(nombre)) {
      throw { statusCode: 400, message: 'El nombre no puede estar vacío' };
    }
    if (email && !isValidEmail(email)) {
      throw { statusCode: 400, message: 'El email no es válido' };
    }

    const result = await db.query(
      'UPDATE usuarios SET nombre = COALESCE($1, nombre), email = COALESCE($2, email) WHERE id = $3 RETURNING *',
      [nombre || null, email || null, id]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Usuario no encontrado' };
    }

    return result.rows[0];
  }

  // Eliminar usuario
  static async eliminar(id) {
    const result = await db.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Usuario no encontrado' };
    }

    return { mensaje: 'Usuario eliminado exitosamente' };
  }

  // Login
  static async login(email, password) {
    if (!isValidEmail(email)) {
      throw { statusCode: 400, message: 'Email no válido' };
    }
    if (!password) {
      throw { statusCode: 400, message: 'Contraseña requerida' };
    }

    const result = await db.query(
      'SELECT id, nombre, email FROM usuarios WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 401, message: 'Credenciales incorrectas' };
    }

    return result.rows[0];
  }
}

module.exports = UsuariosService;
