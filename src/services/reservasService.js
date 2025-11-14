/**
 * Servicio de Reservas - Lógica de negocio
 */

const db = require('../config/database');
const {
  isPositiveNumber,
  isValidDate,
  isValidDateRange,
} = require('../utils/validators');

class ReservasService {
  // Obtener todas las reservas
  static async obtenerTodos() {
    const result = await db.query(
      `SELECT r.*, u.nombre AS usuario_nombre, rc.nombre AS recurso_nombre
       FROM reservas r
       LEFT JOIN usuarios u ON r.usuario_id = u.id
       LEFT JOIN recursos rc ON r.recurso_id = rc.id
       ORDER BY r.fecha_inicio DESC`
    );
    return result.rows;
  }

  // Obtener reserva por ID
  static async obtenerPorId(id) {
    const result = await db.query(
      `SELECT r.*, u.nombre AS usuario_nombre, rc.nombre AS recurso_nombre
       FROM reservas r
       LEFT JOIN usuarios u ON r.usuario_id = u.id
       LEFT JOIN recursos rc ON r.recurso_id = rc.id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Obtener reservas de un usuario
  static async obtenerPorUsuario(usuarioId) {
    const result = await db.query(
      `SELECT r.*, u.nombre AS usuario_nombre, rc.nombre AS recurso_nombre
       FROM reservas r
       LEFT JOIN usuarios u ON r.usuario_id = u.id
       LEFT JOIN recursos rc ON r.recurso_id = rc.id
       WHERE r.usuario_id = $1
       ORDER BY r.fecha_inicio DESC`,
      [usuarioId]
    );
    return result.rows;
  }

  // Obtener reservas de un recurso
  static async obtenerPorRecurso(recursoId) {
    const result = await db.query(
      `SELECT r.*, u.nombre AS usuario_nombre, rc.nombre AS recurso_nombre
       FROM reservas r
       LEFT JOIN usuarios u ON r.usuario_id = u.id
       LEFT JOIN recursos rc ON r.recurso_id = rc.id
       WHERE r.recurso_id = $1
       ORDER BY r.fecha_inicio DESC`,
      [recursoId]
    );
    return result.rows;
  }

  // Crear reserva
  static async crear(datos) {
    const { usuario_id, recurso_id, fecha_inicio, fecha_fin } = datos;

    // Validar datos
    if (!isPositiveNumber(usuario_id)) {
      throw { statusCode: 400, message: 'Usuario ID inválido' };
    }
    if (!isPositiveNumber(recurso_id)) {
      throw { statusCode: 400, message: 'Recurso ID inválido' };
    }
    if (!isValidDate(fecha_inicio)) {
      throw { statusCode: 400, message: 'Fecha de inicio inválida' };
    }
    if (!isValidDate(fecha_fin)) {
      throw { statusCode: 400, message: 'Fecha de fin inválida' };
    }
    if (!isValidDateRange(fecha_inicio, fecha_fin)) {
      throw { statusCode: 400, message: 'La fecha de fin debe ser posterior a la de inicio' };
    }

    // Verificar que el usuario existe
    const usuario = await db.query('SELECT id FROM usuarios WHERE id = $1', [usuario_id]);
    if (usuario.rows.length === 0) {
      throw { statusCode: 404, message: 'Usuario no encontrado' };
    }

    // Verificar que el recurso existe
    const recurso = await db.query('SELECT id FROM recursos WHERE id = $1', [recurso_id]);
    if (recurso.rows.length === 0) {
      throw { statusCode: 404, message: 'Recurso no encontrado' };
    }

    // Verificar disponibilidad (sin conflictos de fecha)
    const conflicto = await db.query(
      `SELECT id FROM reservas 
       WHERE recurso_id = $1
       AND (fecha_inicio < $3 AND fecha_fin > $2)`,
      [recurso_id, fecha_inicio, fecha_fin]
    );

    if (conflicto.rows.length > 0) {
      throw { statusCode: 409, message: 'El recurso no está disponible en esas fechas' };
    }

    try {
      const insert = await db.query(
        `INSERT INTO reservas (usuario_id, recurso_id, fecha_inicio, fecha_fin) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id`,
        [usuario_id, recurso_id, fecha_inicio, fecha_fin]
      );

      // Obtener la reserva insertada junto con nombres relacionados
      const reservaId = insert.rows[0].id;
      const result = await db.query(
        `SELECT r.*, u.nombre AS usuario_nombre, rc.nombre AS recurso_nombre
         FROM reservas r
         LEFT JOIN usuarios u ON r.usuario_id = u.id
         LEFT JOIN recursos rc ON r.recurso_id = rc.id
         WHERE r.id = $1`,
        [reservaId]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Actualizar reserva
  static async actualizar(id, datos) {
    const { fecha_inicio, fecha_fin, estado } = datos;

    if (fecha_inicio && !isValidDate(fecha_inicio)) {
      throw { statusCode: 400, message: 'Fecha de inicio inválida' };
    }
    if (fecha_fin && !isValidDate(fecha_fin)) {
      throw { statusCode: 400, message: 'Fecha de fin inválida' };
    }

    const result = await db.query(
      `UPDATE reservas 
       SET fecha_inicio = COALESCE($1, fecha_inicio), 
           fecha_fin = COALESCE($2, fecha_fin), 
           estado = COALESCE($3, estado)
       WHERE id = $4 
       RETURNING *`,
      [fecha_inicio || null, fecha_fin || null, estado || null, id]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Reserva no encontrada' };
    }

    return result.rows[0];
  }

  // Eliminar reserva
  static async eliminar(id) {
    const result = await db.query('DELETE FROM reservas WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Reserva no encontrada' };
    }

    return { mensaje: 'Reserva eliminada exitosamente' };
  }

  // Cancelar reserva
  static async cancelar(id) {
    const result = await db.query(
      'UPDATE reservas SET estado = $1 WHERE id = $2 RETURNING *',
      ['cancelada', id]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Reserva no encontrada' };
    }

    return result.rows[0];
  }
}

module.exports = ReservasService;
