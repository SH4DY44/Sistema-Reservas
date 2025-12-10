/**
 * Middleware para validación genérica de campos requeridos.
 * 
 * Este middleware actúa como un guardia, verificando que el cuerpo de la solicitud (body)
 * contenga los campos necesarios antes de permitir que la petición llegue a la lógica de negocio.
 * Esto mejora la seguridad y la integridad de los datos en el sistema distribuido.
 * 
 * @param {Array<string>} fields - Lista de nombres de campos que deben estar presentes en el body
 * @returns {Function} Middleware de Express configurado
 */
const validateRequiredFields = (fields) => {
    return (req, res, next) => {
        const missingFields = [];

        // Verificamos cada campo requerido
        fields.forEach(field => {
            if (!req.body || req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
                missingFields.push(field);
            }
        });

        // Si faltan campos, respondemos con un error 400 (Bad Request) y detenemos la cadena
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos para procesar la solicitud',
                error: `Campos faltantes: ${missingFields.join(', ')}`
            });
        }

        // Si todo está bien, pasamos al siguiente eslabón
        next();
    };
};

module.exports = validateRequiredFields;
