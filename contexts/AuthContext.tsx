import { useAuthStore } from '@/core/store/useAuthStore';
import type { UserResponse } from '@/core/types/backend';
import React, { createContext, useContext, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error,
    login, 
    register,
    logout,
    refreshUser,
    setLoading,
    clearError,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Zustand persist will automatically load stored state
        // But we need to validate if we actually have valid tokens
        const state = useAuthStore.getState();
        
        // If we have tokens but no user, or vice versa, clear the invalid state
        if ((state.tokens && !state.user) || (!state.tokens && state.user)) {
          console.log('Invalid auth state detected, clearing...');
          logout();
        }
        
        // If we claim to be authenticated but have no tokens, clear it
        if (state.isAuthenticated && !state.tokens?.accessToken) {
          console.log('Authenticated but no tokens, clearing...');
          logout();
        }
        
        // Optional: Validate token with backend
        // You could call authAPI.getCurrentUser() here to verify the token is still valid
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout(); // Clear on any error
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [logout]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    clearError,
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
