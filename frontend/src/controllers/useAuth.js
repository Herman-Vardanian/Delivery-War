import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authModel } from '../models/authModel';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (storeId, password) => {
    setLoading(true);
    setError(null);
    try {
      const store = await authModel.login(storeId, password);
      authModel.saveUser(store);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // payload = { name, storeId, password, balance, whalePass }
  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authModel.register(payload);
      authModel.saveToken(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}
