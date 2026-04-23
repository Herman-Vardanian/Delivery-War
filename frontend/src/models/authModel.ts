import type { Store } from "../interfaces/Store"

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'store';

interface RegisterPayload {
  storeId: string;
  password: string;
  email: string;
  address?: string;
}

interface LoginResponse {
  token: string;
  store: Store;
}

export const authModel = {
  async register({ storeId, password, email, address }: RegisterPayload): Promise<Store> {
    const res = await fetch(`${API_BASE}/stores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: storeId, password, email, address, role: 'STORE' }),
    });
    if (!res.ok) throw new Error((await res.json() as { message?: string }).message || "Erreur lors de l'inscription");
    return res.json() as Promise<Store>;
  },

  async login(storeId: string, password: string): Promise<Store> {
    const res = await fetch(`${API_BASE}/stores/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: storeId, password }),
    });
    if (!res.ok) throw new Error((await res.json() as { message?: string }).message || 'Identifiants incorrects');
    const { token, store } = await res.json() as LoginResponse;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(store));
    return store;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  saveUser(store: Store): void {
    localStorage.setItem(USER_KEY, JSON.stringify(store));
  },

  getUser(): Store | null {
    const s = localStorage.getItem(USER_KEY);
    return s ? (JSON.parse(s) as Store) : null;
  },

  removeUser(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
