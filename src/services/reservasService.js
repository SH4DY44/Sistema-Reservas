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
  // ... (obtenerTodos, obtenerPorId, obtenerPorUsuario, obtenerPorRecurso se mantienen igual) ...

  // Crear reserva (MODIFICADO para incluir motivo y estado)
  static async crear(datos) {
    // AGREGAMOS 'motivo' al destructuring
    const { usuario_id, recurso_id, fecha_inicio, fecha_fin, motivo } = datos;
    const estado = 'confirmada'; // Estado inicial por defecto

    // Validar datos (AGREGAMOS VALIDACIÓN DE MOTIVO)
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
    if (!motivo || motivo.trim().length === 0) { // Validamos que el motivo no esté vacío
        throw { statusCode: 400, message: 'El motivo de la reserva es obligatorio' };
    }

    // Verificar que el usuario existe (se mantiene igual)
    const usuario = await db.query('SELECT id FROM usuarios WHERE id = $1', [usuario_id]);
    if (usuario.rows.length === 0) {
      throw { statusCode: 404, message: 'Usuario no encontrado' };
    }

    // Verificar que el recurso existe (se mantiene igual)
    const recurso = await db.query('SELECT id FROM recursos WHERE id = $1', [recurso_id]);
    if (recurso.rows.length === 0) {
      throw { statusCode: 404, message: 'Recurso no encontrado' };
    }

    // Verificar disponibilidad (LÓGICA DE CONFLICTO MEJORADA)
    // Criterio: (Fecha_Inicio_Existente < Fecha_Fin_Nueva) AND (Fecha_Fin_Existente > Fecha_Inicio_Nueva)
    const conflicto = await db.query(
      `SELECT id FROM reservas 
       WHERE recurso_id = $1
       AND estado != 'cancelada' -- Ignoramos reservas que ya fueron canceladas
       AND (fecha_inicio < $3 AND fecha_fin > $2)`,
      [recurso_id, fecha_inicio, fecha_fin]
    );

    if (conflicto.rows.length > 0) {
      throw { statusCode: 409, message: 'El recurso no está disponible en esas fechas' };
    }

    try {
      // AGREGAMOS 'motivo' y 'estado' en la inserción
      const insert = await db.query(
        `INSERT INTO reservas (usuario_id, recurso_id, fecha_inicio, fecha_fin, motivo, estado) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id`,
        [usuario_id, recurso_id, fecha_inicio, fecha_fin, motivo, estado]
      );

      // Obtener la reserva insertada junto con nombres relacionados
      const reservaId = insert.rows[0].id;
      // La consulta SELECT debe actualizarse para mostrar el motivo y estado
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

  // Actualizar reserva (Soporta PUT y PATCH - AGREGADO MOTIVO)
  static async actualizar(id, datos) {
    const { fecha_inicio, fecha_fin, estado, motivo } = datos; // AGREGAMOS MOTIVO

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
           estado = COALESCE($3, estado),
           motivo = COALESCE($4, motivo) -- NUEVO CAMPO
       WHERE id = $5 
       RETURNING *`,
      [fecha_inicio || null, fecha_fin || null, estado || null, motivo || null, id] // AÑADIR motivo || null
    );

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Reserva no encontrada' };
    }

    return result.rows[0];
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
