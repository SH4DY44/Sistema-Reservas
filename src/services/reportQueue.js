/**
 * Cola de procesamiento en memoria para Reportes (Simulación de Asincronía)
 * En un sistema real, esto sería Redis/RabbitMQ/Kafka.
 */
class ReportQueue {
    constructor() {
      this.jobs = []; // Cola de trabajos
      this.isProcessing = false;
    }
  
    /**
     * Agrega un trabajo a la cola
     * @param {Object} data - Datos del reporte a generar
     */
    addJob(data) {
      console.log(`[AsyncQueue] Trabajo recibido: Reporte para usuario ${data.usuario_id}`);
      this.jobs.push(data);
      this.processNext();
    }
  
    /**
     * Procesa el siguiente trabajo si el "worker" está libre
     */
    async processNext() {
      if (this.isProcessing || this.jobs.length === 0) {
        return;
      }
  
      this.isProcessing = true;
      const job = this.jobs.shift();
  
      console.log(`[AsyncQueue] Procesando reporte en SEGUNDO PLANO (Job ID: ${Date.now()})...`);
      
      // Simular tarea pesada (5 segundos)
      setTimeout(() => {
        console.log(`[AsyncQueue] Reporte TERMINADO para usuario ${job.usuario_id}. (Se podría enviar por email/guardar en disco)`);
        
        // Seguir con el siguiente
        this.isProcessing = false;
        this.processNext();
      }, 5000);
    }
  }
  
  // Exportamos una instancia única (Singleton)
  module.exports = new ReportQueue();
