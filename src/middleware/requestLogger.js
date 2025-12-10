/**
 * Middleware para el registro (logging) de solicitudes HTTP.
 * 
 * En sistemas distribuidos, es crucial tener trazabilidad de las peticiones.
 * Este middleware intercepta cada solicitud entrante y registra metadatos importantes
 * como el método HTTP, la URL, la dirección IP del cliente y la fecha/hora.
 * 
 * @param {Object} req - Objeto de solicitud (Request) de Express
 * @param {Object} res - Objeto de respuesta (Response) de Express
 * @param {Function} next - Función para pasar el control al siguiente middleware
 */
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const ip = req.ip || req.connection.remoteAddress;

    // Registramos la información de la solicitud en la consola del servidor
    // En un entorno de producción real, esto podría enviarse a un sistema de logs centralizado (ELK, Datadog, etc.)
    console.log(`[${timestamp}] Solicitud entrante: ${method} ${url} desde IP: ${ip}`);

    // Continuamos con el siguiente middleware o controlador
    next();
};

module.exports = requestLogger;
