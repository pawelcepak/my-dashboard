import { useContext } from 'react';

import { AuthContext, type AuthContextValue } from '@/app/auth/authContext';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth musi być używany wewnątrz AuthProvider.');
  }

  return context;
}
