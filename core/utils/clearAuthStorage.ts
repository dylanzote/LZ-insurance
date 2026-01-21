import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Utility to clear authentication storage
 * Use this for debugging or when you need to force logout and clear all stored data
 */
export const clearAuthStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('auth-storage');
    console.log('Auth storage cleared successfully');
  } catch (error) {
    console.error('Error clearing auth storage:', error);
    throw error;
  }
};

/**
 * Clear all app storage (use with caution!)
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log('All storage cleared successfully');
  } catch (error) {
    console.error('Error clearing all storage:', error);
    throw error;
  }
};
