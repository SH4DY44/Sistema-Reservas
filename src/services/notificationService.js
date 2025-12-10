/**
 * Servicio de Notificaciones (Simulado)
 * Representa un sistema externo (Email Provider, SMS Gateway)
 */
class NotificationService {
  // Simulamos un contador de intentos para el email "flaky"
  static intentosFallidos = 0;

  /**
   * Envía una notificación de confirmación de reserva.
   * @param {Object} reserva - Datos de la reserva
   * @param {string} emailUsuario - Email del destinatario
   * @returns {Promise<boolean>}
   */
  static async enviarConfirmacion(reserva, emailUsuario) {
    console.log(`[NotificationService] Iniciando envío de correo a ${emailUsuario}...`);
    
    return new Promise((resolve, reject) => {
      // Latencia aleatoria
      setTimeout(() => {
        // Caso: Fallo Permanente (Simulación anterior)
        if (emailUsuario.includes('fail')) {
          console.error('[NotificationService] Error: Timeout al conectar con servidor SMTP.');
          return reject(new Error('Fallo al enviar notificación (Simulado Permanentemente)'));
        }

        // Caso: Fallo Transitorio (Flaky)
        // Simulamos que falla las primeras 2 veces, funciona a la 3ra
        if (emailUsuario.includes('flaky')) {
          this.intentosFallidos++;
          if (this.intentosFallidos < 3) {
            console.error(`[NotificationService] Error Transitorio: Fallo de red (Intento ${this.intentosFallidos}/3).`);
            return reject(new Error('Fallo temporal de red'));
          }
          // A la tercera va la vencida, reseteamos para futuras pruebas
          this.intentosFallidos = 0;
        }

        console.log('[NotificationService] Correo enviado exitosamente.');
        resolve(true);
      }, 500);
    });
  }

  /**
   * Envoltura con Tolerancia a Fallas (Reintentos + Backoff Exponencial)
   */
  static async enviarConReintento(reserva, email, maxRetries = 5) {
    let attempt = 1;
    
    while (attempt <= maxRetries) {
      try {
        return await this.enviarConfirmacion(reserva, email);
      } catch (error) {
        // Si es el último intento, rendirse
        if (attempt === maxRetries) throw error;

        // Calcular Backoff: 2^attempt * 200 ms (ej: 400ms, 800ms, 1600ms...)
        const delay = Math.pow(2, attempt) * 200;
        console.log(`[FaultTolerance] Fallo detectado. Reintentando en ${delay}ms... (Intento ${attempt}/${maxRetries})`);
        
        await new Promise(r => setTimeout(r, delay));
        attempt++;
      }
    }
  }
  }
  
  module.exports = NotificationService;
