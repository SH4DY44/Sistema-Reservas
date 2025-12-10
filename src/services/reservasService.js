/**
 * Servicio de Reservas - Lógica de negocio
 */

const db = require('../config/database');
const {
  isPositiveNumber,
  isValidDate,
  isValidDateRange,
} = require('../utils/validators');
const NotificationService = require('./notificationService');

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

  // Crear reserva con Exclusión Mutua
  // [TEMA 3: EXCLUSIÓN MUTUA]
  // Implementamos un algoritmo centralizado usando la base de datos para manejar la Sección Crítica.
  static async crear(datos) {
    const { usuario_id, recurso_id, fecha_inicio, fecha_fin } = datos;

    // Validaciones básicas (fuera de la transacción para no bloquear innecesariamente)
    if (!isPositiveNumber(usuario_id)) throw { statusCode: 400, message: 'Usuario ID inválido' };
    if (!isPositiveNumber(recurso_id)) throw { statusCode: 400, message: 'Recurso ID inválido' };
    if (!isValidDate(fecha_inicio)) throw { statusCode: 400, message: 'Fecha de inicio inválida' };
    if (!isValidDate(fecha_fin)) throw { statusCode: 400, message: 'Fecha de fin inválida' };
    if (!isValidDateRange(fecha_inicio, fecha_fin)) throw { statusCode: 400, message: 'La fecha de fin debe ser posterior a la de inicio' };

    const client = await db.connect(); // Obtenemos un cliente exclusivo del pool para la transacción

    try {
      // 1. INICIO DE LA TRANSACCIÓN
      await client.query('BEGIN');

      // 2. ADQUISICIÓN DEL BLOQUEO (Lock)
      // [EXCLUSIÓN MUTUA - SECCIÓN CRÍTICA]
      // Usamos 'FOR UPDATE' para bloquear la fila del recurso.
      // Esto detiene a cualquier otra transacción que intente reservar ESTE mismo recurso
      // hasta que nosotros terminemos (Commit o Rollback).
      const recursoQuery = await client.query(
        'SELECT id FROM recursos WHERE id = $1 FOR UPDATE',
        [recurso_id]
      );

      if (recursoQuery.rows.length === 0) {
        throw { statusCode: 404, message: 'Recurso no encontrado' };
      }

      // Verificar existencia de usuario (no requiere bloqueo, solo lectura)
      const usuarioQuery = await client.query('SELECT id FROM usuarios WHERE id = $1', [usuario_id]);
      if (usuarioQuery.rows.length === 0) {
        throw { statusCode: 404, message: 'Usuario no encontrado' };
      }

      // 3. VERIFICACIÓN DE CONFLICTOS (Dentro de la zona segura/bloqueada)
      const conflicto = await client.query(
        `SELECT id FROM reservas 
         WHERE recurso_id = $1
         AND (fecha_inicio < $3 AND fecha_fin > $2)`,
        [recurso_id, fecha_inicio, fecha_fin]
      );

      if (conflicto.rows.length > 0) {
        throw { statusCode: 409, message: 'El recurso ya está ocupado en ese horario (Conflicto detectado y evitado)' };
      }

      // 4. OPERACIÓN DE ESCRITURA
      const insert = await client.query(
        `INSERT INTO reservas (usuario_id, recurso_id, fecha_inicio, fecha_fin) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id`,
        [usuario_id, recurso_id, fecha_inicio, fecha_fin]
      );

      const reservaId = insert.rows[0].id;

      // Recuperar datos completos para devolver
      const result = await client.query(
        `SELECT r.*, u.nombre AS usuario_nombre, u.email AS usuario_email, rc.nombre AS recurso_nombre
         FROM reservas r
         LEFT JOIN usuarios u ON r.usuario_id = u.id
         LEFT JOIN recursos rc ON r.recurso_id = rc.id
         WHERE r.id = $1`,
        [reservaId]
      );

      // 5. LIBERACIÓN DEL BLOQUEO
      await client.query('COMMIT');
      
      return result.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      
      // [TEMA 4: CONSISTENCIA] Capturar error de constraint de exclusión o Deadlock
      if (error.code === '23P01' || error.code === '40P01') {
        throw { statusCode: 409, message: 'El recurso ya está ocupado en ese horario (Conflicto de concurrencia/BD)' };
      }
      
      throw error;
    } finally {
      client.release(); // Devolver cliente al pool
    }
  }

  // Crear reserva usando Patrón SAGA (Transacción Distribuida)
  static async crearReservaConSaga(datos) {
    let reservaCreada = null;

    try {
      // PASO 1: Transacción Local (Base de Datos)
      console.log('--- SAGA PASO 1: Creando Reserva en BD ---');
      reservaCreada = await this.crear(datos);
      console.log(`   Reserva creada con ID: ${reservaCreada.id}`);

      // PASO 2: Servicio Externo (Notificación)
      // Si este paso falla, la BD ya tiene los datos, así que debemos DESHACER (Compensar)
      console.log('--- SAGA PASO 2: Enviando Notificación Externa ---');
      // Usamos el email que viene del JOIN en 'crear'
      await NotificationService.enviarConfirmacion(reservaCreada, reservaCreada.usuario_email);

      return reservaCreada;

    } catch (error) {
      console.error('--- SAGA ERROR: Falló un paso de la transacción distribuida ---');
      console.error(`   Motivo: ${error.message}`);

      // LÓGICA DE COMPENSACIÓN (Rollback manual de pasos previos)
      if (reservaCreada && reservaCreada.id) {
        console.log('--- SAGA COMPENSACIÓN: Ejecutando Delete (Deshaciendo Paso 1) ---');
        await this.eliminar(reservaCreada.id);
        console.log('   Compensación exitosa: Reserva eliminada para mantener consistencia.');
      }

      // Propagamos el error al cliente
      throw { 
        statusCode: 500, 
        message: 'La reserva no pudo completarse porque falló el servicio de notificaciones. Se ha revertido la operación.',
        originalError: error.message 
      };
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
