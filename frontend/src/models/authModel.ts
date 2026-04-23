import { Store } from "../interfaces/Store"

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface RegisterPayload {
  storeId: string;
  password: string;
  email: string;
  address?: string;
}

export const authModel = {
  async register({ storeId, password, email, address }: RegisterPayload): Promise<Store> {
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
    return res.json() as Promise<Store>;
  },

  saveUser(store: Store): void {
    localStorage.setItem('store', JSON.stringify(store));
  },

  getUser(): Store | null {
    const s = localStorage.getItem('store');
    return s ? (JSON.parse(s) as Store) : null;
  },

  removeUser(): void {
    localStorage.removeItem('store');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('store');
  },
};
