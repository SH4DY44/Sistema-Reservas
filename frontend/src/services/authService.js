import apiFetch from './api';

const AuthService = {
  login: async (email, password) => {
    return await apiFetch('/usuarios/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  register: async (userData) => {
    return await apiFetch('/usuarios', {
      method: 'POST',
      body: userData,
    });
  },
};

export default AuthService;
