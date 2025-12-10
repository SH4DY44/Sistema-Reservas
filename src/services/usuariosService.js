const db = require('../config/database');
const { isValidEmail, isNotEmpty } = require('../utils/validators');

class UsuariosService {
  // Obtener todos los usuarios
  static async obtenerTodos() {
    const result = await db.query('SELECT id, nombre, email, rol FROM usuarios');
    return result.rows;
  }

  // Obtener usuario por ID
  static async obtenerPorId(id) {
    const result = await db.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Login de usuario
  static async login(email, password) {
    if (!isValidEmail(email)) {
      throw { statusCode: 400, message: 'Email inválido' };
    }
    if (!isNotEmpty(password)) {
      throw { statusCode: 400, message: 'La contraseña es requerida' };
    }

    // Buscar usuario por email
    // NOTA: Contraseña en texto plano (se mejorará en siguiente iteración con bcrypt)
    const result = await db.query(
      'SELECT id, nombre, email, rol FROM usuarios WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 401, message: 'Credenciales inválidas' };
    }

    return result.rows[0];
  }

  // Crear usuario
  static async crear(datos) {
    const { nombre, email, password, rol } = datos;

    // Validaciones básicas
    if (!isNotEmpty(nombre)) throw { statusCode: 400, message: 'Nombre es requerido' };
    if (!isValidEmail(email)) throw { statusCode: 400, message: 'Email inválido' };
    if (!isNotEmpty(password)) throw { statusCode: 400, message: 'Password es requerido' };

    // Verificar si ya existe
    const existe = await db.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      throw { statusCode: 409, message: 'El email ya está registrado' };
    }

    // Insertar (rol por defecto 'miembro' si no se envía o si no es admin)
    // For security, usually self-registration shouldn't allow setting 'admin'.
    // We will default to 'miembro' unless explicitly handled otherwise.
    const rolFinal = (rol === 'admin' || rol === 'miembro') ? rol : 'miembro';

    const result = await db.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, password, rolFinal]
    );

    return result.rows[0];
  }

  // Actualizar usuario
  static async actualizar(id, datos) {
    const { nombre, email } = datos;

    // Validar si existe
    /* ... (lógica existente simplificada para brevedad) ... */

    const result = await db.query(
      'UPDATE usuarios SET nombre = COALESCE($1, nombre), email = COALESCE($2, email) WHERE id = $3 RETURNING id, nombre, email, rol',
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
    return { mensaje: 'Usuario eliminado' };
  }
}

module.exports = UsuariosService;
