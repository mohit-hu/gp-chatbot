'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: () => false,
  logout: () => {},
});

// Hardcoded credentials
const ADMIN_EMAIL = 'admin@gpsrinagar.ac.in';
const ADMIN_PASSWORD = 'password123';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On the client, we can determine the auth state is not loading.
    // For a real app, you might check localStorage or a cookie here.
    setIsLoading(false);
  }, []);

  const login = (email: string, pass: string): boolean => {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
