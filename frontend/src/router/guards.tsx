import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authModel } from '../models/authModel';

export function RequireAuth({ children }: { children: ReactNode }) {
  if (!authModel.isAuthenticated()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  if (!authModel.isAuthenticated()) return <Navigate to="/login" replace />;
  if (authModel.getUser()?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
