import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isFirstLaunch, isLoading: onboardingLoading } = useOnboarding();

  // Show nothing while loading - the root layout handles loading state
  if (authLoading || onboardingLoading) {
    return null;
  }

  // Check first launch BEFORE authentication check
  // Priority: Onboarding > Auth State
  if (isFirstLaunch) {
    return <Redirect href="/onboarding" />;
  }

  // Redirect based on auth state
  // When authenticated, go to the app which contains the drawer
  // The drawer will show the tabs as the default screen
  return <Redirect href={isAuthenticated ? "/(app)/(tabs)" : "/auth/login"} />;
}