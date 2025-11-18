import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '@/core/store/useAuthStore';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, isAuthenticated, isLoading, login, logout, setLoading } = useAuthStore();

  // You can add any initialization logic here
  useEffect(() => {
    // Check for stored tokens, validate them, etc.
    const initializeAuth = async () => {
      setLoading(true);
      // Add token validation logic here if needed
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
