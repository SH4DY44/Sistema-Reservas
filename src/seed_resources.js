const pool = require('./config/database');

const resources = [
  { nombre: 'Sala de Juntas "Vision"', descripcion: 'Sala ejecutiva con pantalla 4K y videoconferencia.', cantidad_disponible: 12 },
  { nombre: 'Sala Creativa "Spark"', descripcion: 'Pizarrón de pared completa, puffs y luz natural.', cantidad_disponible: 6 },
  { nombre: 'Escritorio Flex (Zona A)', descripcion: 'Espacio compartido en área silenciosa.', cantidad_disponible: 20 },
  { nombre: 'Escritorio Flex (Zona B)', descripcion: 'Espacio compartido cerca de la cafetería.', cantidad_disponible: 15 },
  { nombre: 'Oficina Privada 101', descripcion: 'Oficina cerrada para equipos pequeños.', cantidad_disponible: 4 },
  { nombre: 'Oficina Privada 102', descripcion: 'Oficina cerrada con vista a la ciudad.', cantidad_disponible: 4 },
  { nombre: 'Cabina Telefónica #1', descripcion: 'Cabina insonorizada para llamadas privadas.', cantidad_disponible: 1 },
  { nombre: 'Cabina Telefónica #2', descripcion: 'Cabina insonorizada para videollamadas.', cantidad_disponible: 1 },
  { nombre: 'Proyector Portátil Epson', descripcion: 'Proyector 3000 lúmenes con conexión HDMI/USB.', cantidad_disponible: 2 },
  { nombre: 'Auditorio Principal', descripcion: 'Espacio para eventos, conferencias y talleres.', cantidad_disponible: 50 },
  { nombre: 'Estudio de Grabación', descripcion: 'Equipo de podcast, micrófonos y aislamiento acústico.', cantidad_disponible: 3 }
];

async function seedResources() {
  console.log('--- POBLANDO BASE DE DATOS (RECURSOS) ---\n');
  
  try {
    for (const res of resources) {
      // Check if exists to avoid duplicates (by name)
      const exists = await pool.query('SELECT id FROM recursos WHERE nombre = $1', [res.nombre]);
      
      if (exists.rows.length === 0) {
        await pool.query(
          'INSERT INTO recursos (nombre, descripcion, cantidad_disponible) VALUES ($1, $2, $3)',
          [res.nombre, res.descripcion, res.cantidad_disponible]
        );
        console.log(`Agregado: ${res.nombre}`);
      } else {
        console.log(`Ya existe: ${res.nombre}`);
      }
    }
    console.log('\n¡Proceso finalizado con éxito!');
  } catch (error) {
    console.error('Error al poblar BD:', error);
  } finally {
    pool.end();
  }
}

seedResources();
