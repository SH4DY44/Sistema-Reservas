const pool = require('./config/database');

async function addRoleColumn() {
  try {
    console.log('--- AGREGANDO ROL A USUARIOS ---\n');

    // 1. Add Column
    await pool.query("ALTER TABLE usuarios ADD COLUMN rol VARCHAR(20) DEFAULT 'miembro'");
    console.log('Columna "rol" agregada (default: miembro).');

    // 2. Promote specific user to ADMIN (Updating the first user found or specific one)
    // Let's make "Juan" or the first user an admin for testing purposes.
    const adminUpdate = await pool.query("UPDATE usuarios SET rol = 'admin' WHERE id = (SELECT id FROM usuarios ORDER BY id ASC LIMIT 1) RETURNING *");
    
    if (adminUpdate.rows.length > 0) {
        console.log(`Usuario promovido a ADMIN: ${adminUpdate.rows[0].nombre} (${adminUpdate.rows[0].email})`);
    }

    // 3. Verify
    const users = await pool.query('SELECT id, nombre, email, rol FROM usuarios');
    console.table(users.rows);

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('La columna ya existía.');
      const users = await pool.query('SELECT id, nombre, email, rol FROM usuarios');
      console.table(users.rows);
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    pool.end();
  }
}

addRoleColumn();
