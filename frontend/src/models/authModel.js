const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const authModel = {
  async register({ storeId, password, email, address }) {
    const res = await fetch(`${API_BASE}/stores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: storeId,
        password,
        email,
        address,
        role: 'STORE',
      }),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Erreur lors de l'inscription");
    return res.json();
  },

  async login(storeId, password) {
    const res = await fetch(`${API_BASE}/stores/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: storeId, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Identifiants incorrects');
    return res.json();
  },

  saveUser(store) {
    localStorage.setItem('store', JSON.stringify(store));
  },

  getUser() {
    const s = localStorage.getItem('store');
    return s ? JSON.parse(s) : null;
  },

  removeUser() {
    localStorage.removeItem('store');
  },

  isAuthenticated() {
    return !!localStorage.getItem('store');
  },
};
