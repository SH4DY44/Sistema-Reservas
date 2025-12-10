require('dotenv').config();
const ReservasService = require('../src/services/reservasService');
const db = require('../src/db');

async function testSagaFailure() {
  console.log('\n--- TEST SAGA: CASO DE FALLO (COMPENSACIÓN) ---');
  console.log('Esperado: Reserva creada temporalmente, Fallo en notificación, Rollback (Borrado automático).');

  const client = await db.connect();
  let userId, recursoId, reservaIdTemp;

  try {
    const timestamp = Date.now();
    
    // Crear User con email 'fail' para activar el error simulado en NotificationService
    const uRes = await client.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES ('Saga Fail User', $1, '123', 'miembro') RETURNING id",
      [`saga_fail_${timestamp}@test.com`]
    );
    userId = uRes.rows[0].id;

    // Crear Recurso
    const rRes = await client.query(
      "INSERT INTO recursos (nombre, descripcion, cantidad_disponible) VALUES ('Recurso Saga Fail', 'Test', 1) RETURNING id"
    );
    recursoId = rRes.rows[0].id;

    // EJECUTAR SAGA
    const datos = {
      usuario_id: userId,
      recurso_id: recursoId,
      fecha_inicio: '2026-01-02T10:00:00Z',
      fecha_fin: '2026-01-02T12:00:00Z'
    };

    console.log('Intentando crear reserva...');
    await ReservasService.crearReservaConSaga(datos);
    
    // Si llega aquí, falló el test porque debería haber lanzado excepción
    console.error('FALLO EL TEST: La saga no debió completarse exitosamente.');

  } catch (error) {
    console.log('\nSAGA ERROR CAPTURADO (Esperado):');
    console.log(`   Mensaje: ${error.message}`);
    
    // Verificar que la reserva NO existe en BD (Compensación funcionó)
    // El ID no lo tenemos fácil porque la función falló, pero podemos buscar por usuario
    const check = await client.query('SELECT id FROM reservas WHERE usuario_id = $1', [userId]);
    
    if (check.rows.length === 0) {
      console.log('   Verificación BD: La reserva NO existe.');
      console.log('   CONCLUSIÓN: La compensación se ejecutó correctamente (Rollback Lógico).');
    } else {
      console.error('   Verificación BD: La reserva AÚN EXISTE.');
      console.error('   CONCLUSIÓN: La compensación FALLÓ. Inconsistencia de datos.');
    }

  } finally {
    // Cleanup
    if (userId) await client.query('DELETE FROM reservas WHERE usuario_id = $1', [userId]);
    if (userId) await client.query('DELETE FROM usuarios WHERE id = $1', [userId]);
    if (recursoId) await client.query('DELETE FROM recursos WHERE id = $1', [recursoId]);
    client.release();
    db.end();
  }
}

testSagaFailure();
