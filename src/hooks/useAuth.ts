import { use } from 'react';
import { AuthContext } from '../contexts';

export const useAuth = () => {
  const context = use(AuthContext);
  if (!context)
    throw new Error('useAuth debe usarse dentro de un AuthProvider');

  return context;
};
