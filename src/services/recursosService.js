/**
 * Servicio de Recursos - Lógica de negocio
 */

const db = require('../config/database');
const { isNotEmpty, isPositiveNumber } = require('../utils/validators');

class RecursosService {
  // Obtener todos los recursos
  static async obtenerTodos() {
    const result = await db.query(
      'SELECT * FROM recursos ORDER BY id DESC'
    );
    return result.rows;
  }

  // Obtener recurso por ID
  static async obtenerPorId(id) {
    const result = await db.query(
      'SELECT * FROM recursos WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Crear recurso
  static async crear(datos) {
    const { nombre, descripcion, cantidad_disponible } = datos;

    // Validar datos
    if (!isNotEmpty(nombre)) {
      throw { statusCode: 400, message: 'El nombre del recurso es requerido' };
    }
    
    // Default to 1 if not provided or invalid
    const cantidad = isPositiveNumber(cantidad_disponible) ? parseInt(cantidad_disponible) : 1;
    
    const result = await db.query(
      'INSERT INTO recursos (nombre, descripcion, cantidad_disponible) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion || null, cantidad]
    );

    return result.rows[0];
  }

  // Actualizar recurso
  static async actualizar(id, datos) {
    const { nombre, descripcion, cantidad_disponible } = datos;

    if (nombre && !isNotEmpty(nombre)) {
      throw { statusCode: 400, message: 'El nombre no puede estar vacío' };
    }

    const result = await db.query(
      'UPDATE recursos SET nombre = COALESCE($1, nombre), descripcion = COALESCE($2, descripcion), cantidad_disponible = COALESCE($3, cantidad_disponible) WHERE id = $4 RETURNING *',
      [nombre || null, descripcion || null, cantidad_disponible || null, id]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Recurso no encontrado' };
    }

    return result.rows[0];
  }

  // Eliminar recurso
  static async eliminar(id) {
    const result = await db.query('DELETE FROM recursos WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Recurso no encontrado' };
    }

    return { mensaje: 'Recurso eliminado exitosamente' };
  }
}

module.exports = RecursosService;
