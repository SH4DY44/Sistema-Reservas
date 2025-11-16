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
    // Nota: Es mejor práctica NO seleccionar la columna 'contrasena' en obtenerTodos()
    const result = await db.query('SELECT id, nombre, email FROM usuarios ORDER BY id DESC');
    return result.rows;
  }

  // Obtener usuario por ID
  static async obtenerPorId(id) {
    const result = await db.query('SELECT id, nombre, email FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Crear usuario
  static async crear(datos) {
    // La destructuración ya usa 'contrasena', lo cual es correcto
    const { nombre, email, contrasena } = datos;

    // Validar datos
    if (!isNotEmpty(nombre)) {
      throw { statusCode: 400, message: 'El nombre es requerido' };
    }
    if (!isValidEmail(email)) {
      throw { statusCode: 400, message: 'El email no es válido' };
    }
    // 💡 CAMBIO 1: Usamos la variable 'contrasena' para la validación
    if (!isValidPassword(contrasena)) { 
      throw { statusCode: 400, message: 'La contraseña debe tener mínimo 6 caracteres' };
    }

    try {
      const result = await db.query(
        // 💡 CAMBIO 2: La columna SQL debe ser 'contrasena'
        'INSERT INTO usuarios (nombre, email, contrasena) VALUES ($1, $2, $3) RETURNING *',
        // 💡 CAMBIO 3: La variable que se inserta es 'contrasena'
        [nombre, email, contrasena] 
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw { statusCode: 409, message: 'El email ya está registrado' };
      }
      throw error;
    }
  }

  // Actualizar usuario (SE MANTIENE IGUAL)
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

  // Eliminar usuario (SE MANTIENE IGUAL)
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
      // 💡 CAMBIO 4: La columna SQL debe ser 'contrasena' para la verificación de credenciales
      'SELECT id, nombre, email FROM usuarios WHERE email = $1 AND contrasena = $2',
      [email, password] // 'password' es el valor que viene del frontend
    );

    if (result.rows.length === 0) {
      throw { statusCode: 401, message: 'Credenciales incorrectas' };
    }

    return result.rows[0];
  }
}

module.exports = UsuariosService;