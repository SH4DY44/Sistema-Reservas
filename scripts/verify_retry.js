require('dotenv').config();
const ReservasService = require('../src/services/reservasService');
const db = require('../src/db');

async function testRetryMechanism() {
  console.log('\n--- TEST TOLERANCIA A FALLAS: REINTENTOS MÚLTIPLES ---');
  console.log('Esperado: Fallo -> Espera -> Fallo -> Espera -> ÉXITO FINAL.');

  const client = await db.connect();
  let userId, recursoId;

  try {
    const timestamp = Date.now();
    
    // Crear User con email 'flaky' para activar lógica de fallo transitorio
    const uRes = await client.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES ('Retry User', $1, '123', 'miembro') RETURNING id",
      [`user_flaky_${timestamp}@test.com`]
    );
    userId = uRes.rows[0].id;

    // Crear Recurso
    const rRes = await client.query(
      "INSERT INTO recursos (nombre, descripcion, cantidad_disponible) VALUES ('Recurso Retry', 'Test', 1) RETURNING id"
    );
    recursoId = rRes.rows[0].id;

    const datos = {
      usuario_id: userId,
      recurso_id: recursoId,
      fecha_inicio: '2026-05-01T10:00:00Z',
      fecha_fin: '2026-05-01T12:00:00Z'
    };

    console.log('Ejecutando Reserva con usuario "flaky"...');
    const start = Date.now();
    const reserva = await ReservasService.crearReservaConSaga(datos);
    const end = Date.now();
    
    console.log('\nRESULTADO FINAL: Saga completada.');
    console.log(`   Tiempo total: ${(end - start)}ms (Incluye tiempos de espera de reintentos)`);
    console.log(`   Reserva ID final: ${reserva.id}`);

    // Verificar que existe en BD
    const check = await client.query('SELECT id FROM reservas WHERE id = $1', [reserva.id]);
    if (check.rows.length === 1) {
      console.log('   Verificación BD: La reserva se mantuvo (el sistema se recuperó).');
    }

  } catch (error) {
    console.error('FALLO EL TEST: El sistema se rindió antes de tiempo.', error);
  } finally {
    // Cleanup
    if (userId) await client.query('DELETE FROM reservas WHERE usuario_id = $1', [userId]);
    if (userId) await client.query('DELETE FROM usuarios WHERE id = $1', [userId]);
    if (recursoId) await client.query('DELETE FROM recursos WHERE id = $1', [recursoId]);
    client.release();
    db.end();
  }
}

testRetryMechanism();
