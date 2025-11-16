/**
 * Servicio de Recursos - Lógica de negocio
 */

const db = require('../config/database');
const { isNotEmpty, isPositiveNumber } = require('../utils/validators');

class RecursosService {
  // Obtener todos los recursos (ACTUALIZADO: Agregamos capacidad y ubicación en el SELECT)
  static async obtenerTodos() {
    const result = await db.query(
      'SELECT id, nombre, capacidad, ubicacion, descripcion, activo FROM recursos ORDER BY id DESC'
    );
    return result.rows;
  }

  // Obtener recurso por ID (SE MANTIENE IGUAL)
  static async obtenerPorId(id) {
    const result = await db.query(
      'SELECT * FROM recursos WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Crear recurso (MODIFICADO: Agregamos capacidad y ubicación)
  static async crear(datos) {
    // AGREGAMOS capacidad y ubicacion
    const { nombre, descripcion, capacidad, ubicacion } = datos;

    // Validar datos
    if (!isNotEmpty(nombre)) {
      throw { statusCode: 400, message: 'El nombre del recurso es requerido' };
    }
    // NUEVA VALIDACIÓN: Capacidad
    if (capacidad !== undefined && !isPositiveNumber(capacidad)) {
      throw { statusCode: 400, message: 'La capacidad debe ser un número positivo' };
    }
    // La descripción y ubicación son opcionales

    const result = await db.query(
      `INSERT INTO recursos (nombre, descripcion, capacidad, ubicacion) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [
        nombre, 
        descripcion || null, 
        capacidad || 1, // Usar 1 como valor por defecto si no se especifica
        ubicacion || null
      ]
    );

    return result.rows[0];
  }

  // Actualizar recurso (MODIFICADO: Agregamos capacidad y ubicación para PUT/PATCH)
  static async actualizar(id, datos) {
    // AGREGAMOS capacidad y ubicacion
    const { nombre, descripcion, capacidad, ubicacion } = datos;

    if (nombre && !isNotEmpty(nombre)) {
      throw { statusCode: 400, message: 'El nombre no puede estar vacío' };
    }
    // NUEVA VALIDACIÓN: Capacidad
    if (capacidad !== undefined && !isPositiveNumber(capacidad)) {
      throw { statusCode: 400, message: 'La capacidad debe ser un número positivo' };
    }

    const result = await db.query(
      `UPDATE recursos 
       SET nombre = COALESCE($1, nombre), 
           descripcion = COALESCE($2, descripcion),
           capacidad = COALESCE($3, capacidad),    
           ubicacion = COALESCE($4, ubicacion)    
       WHERE id = $5 
       RETURNING *`,
      [
        nombre || null, 
        descripcion || null, 
        capacidad || null, 
        ubicacion || null, 
        id
      ]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Recurso no encontrado' };
    }

    return result.rows[0];
  }

  // Eliminar recurso (SE MANTIENE IGUAL)
  static async eliminar(id) {
    const result = await db.query('DELETE FROM recursos WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Recurso no encontrado' };
    }

    return { mensaje: 'Recurso eliminado exitosamente' };
  }
}

module.exports = RecursosService;