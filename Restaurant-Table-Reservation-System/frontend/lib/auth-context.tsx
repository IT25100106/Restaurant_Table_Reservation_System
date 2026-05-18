'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type UserDTO } from './api';
import { getCurrentUser, loginUser, logoutUser, registerUser, initializeData } from './storage';

interface AuthContextType {
  user: UserDTO | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  register: (name: string, email: string, password: string, isAdmin?: boolean) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeData();
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, message: result.message };
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const register = async (name: string, email: string, password: string, isAdmin = false) => {
    const result = await registerUser(name, email, password, isAdmin);
    if (result.success && result.user) {
      // Auto-login after registration
      const loginResult = await loginUser(email, password);
      if (loginResult.success && loginResult.user) {
        setUser(loginResult.user);
      }
    }
    return { success: result.success, message: result.message };
  };

  const refreshUser = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
