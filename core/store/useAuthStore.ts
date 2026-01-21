import type { AuthResponse, UserResponse } from '@/core/types/backend';
import { authAPI } from '@/services/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

interface AuthState {
  user: UserResponse | null;
  tokens: AuthTokens | null;
  token: string | null; // For backward compatibility with interceptors
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserResponse) => void;
  setTokens: (tokens: AuthTokens) => void;
  refreshTokens: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      token: null, // For backward compatibility
      isAuthenticated: false,
      isLoading: true, // Start with loading true to prevent flash of wrong screen
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response: AuthResponse = await authAPI.login(email, password);
          
          // Validate user role - Only CUSTOMER role can access mobile app
          const isCustomer = response.user.roles?.some(
            role => role.isCustomerRole === true || 
                    role.name?.toUpperCase() === 'CUSTOMER' ||
                    role.name?.toUpperCase() === 'CUSTOMERS'
          );
          
          if (!isCustomer) {
            set({ 
              isLoading: false,
              error: 'Only customer accounts can access this app. Please use the admin portal.',
              isAuthenticated: false,
              user: null,
              tokens: null,
              token: null,
            });
            throw new Error('Only customer accounts can access this app. Please use the admin portal.');
          }
          
          // Extract tokens
          const tokens: AuthTokens = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn,
            refreshExpiresIn: response.refreshExpiresIn,
          };
          
          set({
            user: response.user,
            tokens,
            token: response.accessToken, // For backward compatibility with interceptors
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error?.message || 'Login failed. Please check your credentials.';
          set({ 
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            tokens: null,
            token: null,
          });
          throw new Error(errorMessage);
        }
      },
      
      register: async (userData: any) => {
        set({ isLoading: true, error: null });
        try {
          const response: AuthResponse = await authAPI.register(userData);
          
          // Extract tokens
          const tokens: AuthTokens = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn,
            refreshExpiresIn: response.refreshExpiresIn,
          };
          
          set({
            user: response.user,
            tokens,
            token: response.accessToken, // For backward compatibility
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error?.message || 'Registration failed. Please try again.';
          set({ 
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            tokens: null,
            token: null,
          });
          throw new Error(errorMessage);
        }
      },
      
      logout: async () => {
        try {
          // Call backend logout endpoint (don't wait for it to complete)
          authAPI.logout().catch((error) => {
            console.error('Logout API error (ignored):', error);
          });
        } catch (error) {
          // Ignore any errors - we're logging out anyway
          console.error('Logout error (ignored):', error);
        }
        
        // Immediately clear all auth state (don't wait for API)
        set({
          user: null,
          tokens: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
      
      setUser: (user: UserResponse) => {
        set({ user });
      },
      
      setTokens: (tokens: AuthTokens) => {
        set({ 
          tokens,
          token: tokens.accessToken, // For backward compatibility
        });
      },
      
      refreshTokens: async () => {
        const { tokens } = get();
        if (!tokens?.refreshToken) {
          throw new Error('No refresh token available');
        }
        
        try {
          const response: AuthResponse = await authAPI.refreshToken(tokens.refreshToken);
          
          const newTokens: AuthTokens = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn,
            refreshExpiresIn: response.refreshExpiresIn,
          };
          
          set({
            user: response.user,
            tokens: newTokens,
            token: response.accessToken, // For backward compatibility
            isAuthenticated: true,
          });
        } catch (error: any) {
          // Refresh failed, logout user
          get().logout();
          throw new Error('Session expired. Please login again.');
        }
      },
      
      refreshUser: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) {
          return;
        }
        
        try {
          const currentUser = await authAPI.getCurrentUser();
          set({ user: currentUser });
        } catch (error: any) {
          console.error('Failed to refresh user data:', error);
          // Don't throw or logout - just log the error
          // The user might be offline or have a temporary network issue
        }
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      setError: (error: string | null) => {
        set({ error });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist specific fields
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // Add version for migration if needed
      version: 1,
      // Validate state on hydration
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error rehydrating auth state:', error);
          // Clear invalid state
          useAuthStore.setState({
            user: null,
            tokens: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } else if (state) {
          // Validate the hydrated state
          const hasValidTokens = state.tokens?.accessToken && state.tokens?.refreshToken;
          const hasUser = state.user?.id;
          
          // If we don't have both valid tokens and user, clear the state
          if (state.isAuthenticated && (!hasValidTokens || !hasUser)) {
            console.log('Invalid persisted state detected, clearing authentication');
            useAuthStore.setState({
              user: null,
              tokens: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          } else {
            // Valid state, just set loading to false
            useAuthStore.setState({ isLoading: false });
          }
        }
      },
    }
  )
);