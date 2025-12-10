/**
 * Servicio de Notificaciones (Simulado)
 * Representa un sistema externo (Email Provider, SMS Gateway)
 */
class NotificationService {
    /**
     * Envía una notificación de confirmación de reserva.
     * @param {Object} reserva - Datos de la reserva
     * @param {string} emailUsuario - Email del destinatario
     * @returns {Promise<boolean>}
     */
    static async enviarConfirmacion(reserva, emailUsuario) {
      console.log(`[NotificationService] Iniciando envío de correo a ${emailUsuario}...`);
      
      return new Promise((resolve, reject) => {
        // Simulamos latencia de red (1-3 segundos)
        setTimeout(() => {
          // Simulamos una probabilidad de fallo del 30%
          // O podemos forzar fallo si el usuario tiene un email específico test_fail@nexus.com
          const debeFallar = emailUsuario.includes('fail');
  
          if (debeFallar) {
            console.error('[NotificationService] Error: Timeout al conectar con servidor SMTP.');
            reject(new Error('Fallo al enviar notificación (Simulado)'));
          } else {
            console.log('[NotificationService] Correo enviado exitosamente.');
            resolve(true);
          }
        }, 1500);
      });
    }
  }
  
  module.exports = NotificationService;
