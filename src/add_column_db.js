const pool = require('./config/database');

async function addColumn() {
  try {
    console.log('--- AGREGANDO COLUMNA cantidad_disponible ---\n');

    // Executing the ALTER TABLE command
    await pool.query('ALTER TABLE recursos ADD COLUMN cantidad_disponible INTEGER DEFAULT 1');
    
    console.log('Columna agregada exitosamente.');
    
    // Verifying the change
    const res = await pool.query('SELECT * FROM recursos LIMIT 1');
    console.log('Estructura actual (primera fila):');
    console.log(res.rows[0]);

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('La columna ya existía.');
    } else {
      console.error('Error al modificar la tabla:', error.message);
    }
  } finally {
    pool.end();
  }
}

addColumn();
