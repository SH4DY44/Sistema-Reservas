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
    const { nombre, descripcion } = datos;

    // Validar datos
    if (!isNotEmpty(nombre)) {
      throw { statusCode: 400, message: 'El nombre del recurso es requerido' };
    }
    /*if (!isPositiveNumber(cantidad_disponible)) {
      throw { statusCode: 400, message: 'La cantidad debe ser un número positivo' };
    }*/
    
    const result = await db.query(
      'INSERT INTO recursos (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion || null]
    );

    return result.rows[0];
  }

  // Actualizar recurso
  static async actualizar(id, datos) {
    const { nombre, descripcion } = datos;


    if (nombre && !isNotEmpty(nombre)) {
      throw { statusCode: 400, message: 'El nombre no puede estar vacío' };
    }
    /*if (cantidad_disponible && !isPositiveNumber(cantidad_disponible)) {
      throw { statusCode: 400, message: 'La cantidad debe ser un número positivo' };
    }*/

    const result = await db.query(
      'UPDATE recursos SET nombre = COALESCE($1, nombre), descripcion = COALESCE($2, descripcion) WHERE id = $3 RETURNING *',
      [nombre || null, descripcion || null, id]
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
