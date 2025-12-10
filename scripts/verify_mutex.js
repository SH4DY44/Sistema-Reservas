require('dotenv').config();
const { Pool } = require('pg');

// Configuración de conexión (usando las mismas variables que la app)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

async function runConcurrencyTest() {
  console.log('--- TEST DE EXCLUSIÓN MUTUA (SIMULACIÓN DE CARRERA) ---\n');
  const client = await pool.connect();

  let user1Id, user2Id, resourceId;

  try {
    // 1. SETUP: Crear datos de prueba
    console.log('1. Creando datos de prueba...');
    
    // Crear recurso único
    const resRes = await client.query(
      "INSERT INTO recursos (nombre, descripcion, cantidad_disponible) VALUES ('Recurso Test Mutex', 'Para test de concurrencia', 1) RETURNING id"
    );
    resourceId = resRes.rows[0].id;

    // Crear 2 usuarios
    const timestamp = Date.now();
    const email1 = `t1_${timestamp}@test.com`;
    const email2 = `t2_${timestamp}@test.com`;

    const u1Res = await client.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES ('Tester 1', $1, '123456', 'miembro') RETURNING id",
      [email1]
    );
    user1Id = u1Res.rows[0].id;

    const u2Res = await client.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES ('Tester 2', $1, '123456', 'miembro') RETURNING id",
      [email2]
    );
    user2Id = u2Res.rows[0].id;

    console.log(`   Recurso ID: ${resourceId}`);
    console.log(`   User 1 ID: ${user1Id}, User 2 ID: ${user2Id}\n`);

    // 2. EJECUCIÓN: Lanzar peticiones simultáneas
    console.log('2. Lanzando 2 peticiones SIMULTÁNEAS para el mismo recurso/hora...');
    
    const url = 'http://localhost:3000/reservas';
    const bodyBase = {
      recurso_id: resourceId,
      fecha_inicio: '2025-12-25T10:00:00Z',
      fecha_fin: '2025-12-25T11:00:00Z'
    };

    // Usamos fetch nativo (Node 18+)
    const p1 = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...bodyBase, usuario_id: user1Id })
    });

    const p2 = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...bodyBase, usuario_id: user2Id })
    });

    // Esperar a que ambas terminen
    const [r1, r2] = await Promise.all([p1, p2]);
    const d1 = await r1.json();
    const d2 = await r2.json();

    console.log('\n--- RESULTADOS ---');
    console.log(`Peticion Usuario 1: Status ${r1.status} - ${d1.message || JSON.stringify(d1)}`);
    console.log(`Peticion Usuario 2: Status ${r2.status} - ${d2.message || JSON.stringify(d2)}`);

    // 3. ANÁLISIS
    let successCount = 0;
    let conflictCount = 0;

    if (r1.status === 201) successCount++;
    if (r1.status === 409) conflictCount++; // 409 Conflict es lo esperado para el perdedor
    
    if (r2.status === 201) successCount++;
    if (r2.status === 409) conflictCount++;

    console.log('\n--- CONCLUSIÓN ---');
    if (successCount === 1 && conflictCount === 1) {
        console.log('ÉXITO TOTAL: El sistema bloqueó correctamente la segunda petición.');
        console.log('   La Exclusión Mutua funciona.');
    } else if (successCount === 2) {
        console.error('FALLO CRÍTICO: ¡Doble reserva permitida! (Race Condition)');
    } else {
        console.log('Resultado inesperado (Revisar logs). Puede ser otro error.');
    }

  } catch (error) {
    console.error('Error en el test:', error);
  } finally {
    // 4. CLEANUP
    console.log('\n4. Limpiando datos...');
    
    // Eliminar reservas creadas durante el test
    if (resourceId) await client.query('DELETE FROM reservas WHERE recurso_id = $1', [resourceId]);
    
    // Eliminar recursos y usuarios
    if (resourceId) await client.query('DELETE FROM recursos WHERE id = $1', [resourceId]);
    if (user1Id) await client.query('DELETE FROM usuarios WHERE id = $1', [user1Id]);
    if (user2Id) await client.query('DELETE FROM usuarios WHERE id = $1', [user2Id]);
    client.release();
    pool.end();
  }
}

runConcurrencyTest();
