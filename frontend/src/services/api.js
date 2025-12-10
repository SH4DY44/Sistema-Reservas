const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Wrapper genérico para fetch
 * Maneja la URL base, headers comunes y parseo de errores estandar
 */
async function apiFetch(endpoint, options = {}) {
  const { body, ...customConfig } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...customConfig.headers,
  };

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      // Si el servidor devuelve un error controlado (formato { success: false, message: ... })
      throw {
        message: data.message || 'Error desconocido en el servidor',
        status: response.status,
        data: data.data
      };
    }
  } catch (error) {
    // Si es un error de red o algo que no tiene response.json()
    if (error.message) {
      throw error;
    }
    throw new Error('Error de conexión o respuesta inválida del servidor');
  }
}

export default apiFetch;
