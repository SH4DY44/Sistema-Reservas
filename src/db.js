const { Pool } = require('pg');


console.log('DB_PASS:', typeof process.env.DB_PASS, process.env.DB_PASS);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
