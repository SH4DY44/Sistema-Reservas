const { Pool } = require('pg');
const config = require('./environment');

const pool = new Pool(config.database);

// Eventos de la conexión
pool.on('error', (error) => {
  console.error('Error en el pool de conexiones:', error.message);
});

pool.on('connect', () => {
  console.log('Nueva conexión establecida con la BD');
});

// Verificar conexión al iniciar
pool.query('SELECT NOW()', (error, result) => {
  if (error) {
    console.error('Error al conectar a la BD:', error.message);
  } else {
    console.log('Conexión a BD exitosa:', result.rows[0].now);
  }
});

module.exports = pool;
