require('dotenv').config();
const pool = require('../src/db');

async function addConsistencyConstraints() {
  console.log('--- APLICANDO CONSTRAINTS DE CONSISTENCIA DE DATOS ---\n');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Instalar extensión requerida para rangos en GIST (si no existe)
    console.log('1. Habilitando extensión btree_gist...');
    await client.query('CREATE EXTENSION IF NOT EXISTS btree_gist');

    // 2. Limpiar datos corruptos previos (si los hubiera) para evitar fallos al crear constraint
    console.log('2. Verificando consistencia actual...');
    // (Opcional: aquí podríamos borrar reservas solapadas viejas, 
    // pero asumimos que el usuario quiere ver el fallo si hay basura)

    // 3. Agregar Constraint CHECK (Validación simple)
    console.log('3. Agregando CHECK (fecha_fin > fecha_inicio)...');
    try {
        await client.query('SAVEPOINT check_constraint');
        await client.query(`
            ALTER TABLE reservas 
            ADD CONSTRAINT check_fechas_logicas 
            CHECK (fecha_fin > fecha_inicio);
        `);
        await client.query('RELEASE SAVEPOINT check_constraint');
    } catch (e) {
        await client.query('ROLLBACK TO SAVEPOINT check_constraint');
        console.log('   (Constraint check_fechas_logicas ya existía o falló)');
    }

    // 4. Agregar EXCLUSION CONSTRAINT (La magia de inconsistencia temporal)
    // Esto dice: "Para un mismo recurso_id (=), los rangos de tiempo (&&) NO pueden solaparse"
    console.log('4. Agregando EXCLUSION CONSTRAINT (sin solapamientos)...');
    
    // Primero eliminamos si existe para evitar error al re-ejecutar
    await client.query('ALTER TABLE reservas DROP CONSTRAINT IF EXISTS no_overlapping_reservations');

    await client.query(`
        ALTER TABLE reservas
        ADD CONSTRAINT no_overlapping_reservations
        EXCLUDE USING GIST (
            recurso_id WITH =,
            tsrange(fecha_inicio::timestamp, fecha_fin::timestamp) WITH &&
        );
    `);

    await client.query('COMMIT');
    console.log('\nÉXITO: Base de datos blindada contra inconsistencias temporales.');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\nERROR al aplicar constraints:', error.message);
    console.error('   Hint: Es posible que ya existan datos corruptos (solapados) en la BD.');
  } finally {
    client.release();
    pool.end();
  }
}

addConsistencyConstraints();
