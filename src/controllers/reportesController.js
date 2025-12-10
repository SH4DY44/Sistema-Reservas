const { sendSuccess } = require('../utils/responses');
const reportQueue = require('../services/reportQueue');

// Simular espera bloqueante
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.generarReporte = async (req, res, next) => {
  const { tipo } = req.query; // ?tipo=sync o ?tipo=async
  const usuario_id = req.body.usuario_id || 'Anonimo';

  try {
    if (tipo === 'async') {
      // --- MODO ASÍNCRONO (NON-BLOCKING) ---
      // 1. Aceptamos la petición
      // 2. La ponemos en cola
      // 3. Respondemos DE INMEDIATO
      
      reportQueue.addJob({ usuario_id, fecha: new Date() });

      return sendSuccess(res, { 
        status: 'pending', 
        mensaje: 'Tu reporte se está procesando. Te notificaremos cuando esté listo.' 
      }, 'Solicitud recibida correctamente', 202); 
      // 202 Accepted = "Entendido, lo haré luego".

    } else {
      // --- MODO SINCRONO (BLOCKING) ---
      // Simular carga pesada que bloquea la respuesta HTTP
      console.log(`[SyncReport] ⏳ Iniciando generación de reporte BLOQUEANTE para ${usuario_id}...`);
      
      await sleep(5000); // 5 segundos de espera real

      console.log(`[SyncReport] Reporte terminado.`);

      return sendSuccess(res, { 
        url: 'http://cdn.ejemplo.com/reporte_final.pdf',
        size: '15MB'
      }, 'Reporte generado exitosamente', 200);
    }

  } catch (error) {
    next(error);
  }
};
