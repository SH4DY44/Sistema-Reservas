/**
 * Servicio de Recursos Remotos (Simulación)
 * Representa una API externa o un sistema legado en otra ubicación geográfica.
 */
class RemoteResourcesService {
    /**
     * Obtiene recursos de un sistema externo.
     * @returns {Promise<Array>}
     */
    static async getExternalResources() {
      // Simulamos latencia de red de una llamada externa
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 9001, // IDs altos para evitar colisión visual
              nombre: 'Licencia Zoom Pro #1 (Nube)',
              descripcion: 'Recurso Virtual - Gestionado remotamente',
              cantidad_disponible: 1,
              es_remoto: true
            },
            {
              id: 9002,
              nombre: 'Servidor AWS EC2 (N. Virginia)',
              descripcion: 'Instancia t3.medium para cómputo distribuido',
              cantidad_disponible: 5,
              es_remoto: true
            },
            {
              id: 9003,
              nombre: 'Laboratorio Virtual MATLAB',
              descripcion: 'Acceso remoto vía VPN',
              cantidad_disponible: 50,
              es_remoto: true
            }
          ]);
        }, 800); // 800ms de latencia
      });
    }
  }
  
  module.exports = RemoteResourcesService;
