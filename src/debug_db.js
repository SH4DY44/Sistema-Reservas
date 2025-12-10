const pool = require('./config/database');

async function checkDatabase() {
  try {
    console.log('\n--- DIAGNÓSTICO DE BASE DE DATOS ---\n');

    // 1. Usuarios
    const users = await pool.query('SELECT id, nombre, email FROM usuarios');
    console.log(`[USUARIOS] Total: ${users.rowCount}`);
    if (users.rowCount > 0) {
      console.table(users.rows);
    } else {
      console.log('  (Tabla vacía)');
    }
    console.log('-'.repeat(40));

    // 2. Recursos
    const recursos = await pool.query('SELECT id, nombre, descripcion FROM recursos');
    console.log(`[RECURSOS] Total: ${recursos.rowCount}`);
    if (recursos.rowCount > 0) {
      console.table(recursos.rows);
    } else {
      console.log('  (Tabla vacía)');
    }
    console.log('-'.repeat(40));

    // 3. Reservas
    const reservas = await pool.query(`
      SELECT r.id, u.nombre as usuario, rc.nombre as recurso, r.fecha_inicio, r.fecha_fin 
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN recursos rc ON r.recurso_id = rc.id
    `);
    console.log(`[RESERVAS] Total: ${reservas.rowCount}`);
    if (reservas.rowCount > 0) {
      console.table(reservas.rows);
    } else {
      console.log('  (Tabla vacía)');
    }

  } catch (error) {
    console.error('ERROR AL CONSULTAR LA BD:', error.message);
  } finally {
    pool.end();
  }
}

checkDatabase();
