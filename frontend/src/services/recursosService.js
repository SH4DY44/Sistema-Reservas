import apiFetch from './api';

const RecursosService = {
  getAll: async () => {
    return await apiFetch('/recursos');
  },

  getById: async (id) => {
    return await apiFetch(`/recursos/${id}`);
  },

  create: async (data) => {
    return await apiFetch('/recursos', {
      method: 'POST',
      body: data,
    });
  },

  update: async (id, data) => {
    return await apiFetch(`/recursos/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  delete: async (id) => {
    return await apiFetch(`/recursos/${id}`, {
      method: 'DELETE',
    });
  },
};

export default RecursosService;
