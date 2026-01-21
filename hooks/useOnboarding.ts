import { STORAGE_KEYS } from '@/core/constants/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const useOnboarding = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(STORAGE_KEYS.onboarding);
      setIsFirstLaunch(hasSeenOnboarding === null);
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.onboarding, 'true');
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return {
    isFirstLaunch,
    isLoading,
    completeOnboarding,
  };
};

