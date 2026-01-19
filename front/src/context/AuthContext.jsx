import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../api/client.js';

const AuthContext = createContext(null);

const getStored = () => {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');
  return { token, user: userRaw ? JSON.parse(userRaw) : null };
};

export const AuthProvider = ({ children }) => {
  const [{ token, user }, setAuth] = useState(getStored());

  const saveAuth = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem('token', nextToken);
    } else {
      localStorage.removeItem('token');
    }
    if (nextUser) {
      localStorage.setItem('user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('user');
    }
    setAuth({ token: nextToken, user: nextUser });
  }, []);

  const logout = useCallback(() => {
    saveAuth(null, null);
  }, [saveAuth]);

  useEffect(() => {
    const interceptor = apiClient.addAuthInterceptor(() => token, logout);
    return () => apiClient.removeAuthInterceptor(interceptor);
  }, [token, logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      setAuth: saveAuth,
      logout
    }),
    [token, user, saveAuth, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
