import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show nothing while loading - the root layout handles loading state
  if (isLoading) {
    return null;
  }

  // Redirect based on auth state
  return <Redirect href={isAuthenticated ? "/(tabs)" : "/auth/login"} />;
}