import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authModel } from '../models/authModel';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (storeId: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const store = await authModel.login(storeId, password);
      authModel.saveUser(store);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

interface RegisterPayload {
  storeId: string;
  password: string;
  email: string;
  address?: string;
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // payload = { name, storeId, password, balance, whalePass }
  const register = async (payload: RegisterPayload): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await authModel.register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}
