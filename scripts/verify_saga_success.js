require('dotenv').config();
const ReservasService = require('../src/services/reservasService');
const db = require('../src/db');

// Mockear console.log para ver output limpio, o dejarlo para debug
// console.log = () => {};

async function testSagaSuccess() {
  console.log('\n--- TEST SAGA: CASO DE ÉXITO ---');
  console.log('Esperado: Reserva creada, Notificación enviada, Retorno exitoso.');

  // Usuario con email NORMAL (no contiene 'fail')
  // Asumimos que existe usuario con id=1 o lo creamos
  // Para ser robustos, insertamos un user temporal
  const client = await db.connect();
  let userId, recursoId;

  try {
    const timestamp = Date.now();
    
    // Crear User
    const uRes = await client.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES ('Saga Success User', $1, '123', 'miembro') RETURNING id",
      [`saga_ok_${timestamp}@test.com`]
    );
    userId = uRes.rows[0].id;

    // Crear Recurso
    const rRes = await client.query(
      "INSERT INTO recursos (nombre, descripcion, cantidad_disponible) VALUES ('Recurso Saga OK', 'Test', 1) RETURNING id"
    );
    recursoId = rRes.rows[0].id;

    // EJECUTAR SAGA
    const datos = {
      usuario_id: userId,
      recurso_id: recursoId,
      fecha_inicio: '2026-01-01T10:00:00Z',
      fecha_fin: '2026-01-01T12:00:00Z'
    };

    const reserva = await ReservasService.crearReservaConSaga(datos);
    
    console.log('\nRESULTADO: Saga completada.');
    console.log(`   Reserva ID final: ${reserva.id}`);

    // Verificar que existe en BD
    const check = await client.query('SELECT id FROM reservas WHERE id = $1', [reserva.id]);
    if (check.rows.length === 1) {
      console.log('   Verificación BD: La reserva EXISTE (Correcto).');
    } else {
      console.error('   Verificación BD: La reserva NO existe (Error).');
    }

  } catch (error) {
    console.error('ERROR INESPERADO:', error);
  } finally {
    // Cleanup
    if (userId) await client.query('DELETE FROM reservas WHERE usuario_id = $1', [userId]);
    if (userId) await client.query('DELETE FROM usuarios WHERE id = $1', [userId]);
    if (recursoId) await client.query('DELETE FROM recursos WHERE id = $1', [recursoId]);
    client.release();
    db.end();
  }
}

testSagaSuccess();
