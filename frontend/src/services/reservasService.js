import apiFetch from './api';

const ReservasService = {
  getAll: async () => {
    return await apiFetch('/reservas');
  },

  getById: async (id) => {
    return await apiFetch(`/reservas/${id}`);
  },

  getByUsuario: async (userId) => {
    return await apiFetch(`/reservas/usuario/${userId}`);
  },

  create: async (data) => {
    return await apiFetch('/reservas', {
      method: 'POST',
      body: data,
    });
  },

  cancel: async (id) => {
    return await apiFetch(`/reservas/cancelar/${id}`, {
      method: 'PUT',
    });
  },

  delete: async (id) => {
    return await apiFetch(`/reservas/${id}`, {
      method: 'DELETE',
    });
  },
};

export default ReservasService;
