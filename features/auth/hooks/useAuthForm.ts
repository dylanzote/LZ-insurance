import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginFormData } from '../types';

export const useAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (formData: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleLogin,
  };
};