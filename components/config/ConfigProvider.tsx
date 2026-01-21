/**
 * Configuration Provider
 * 
 * Initializes and loads application configuration on app startup
 */

import React, { useEffect } from 'react';
import { useConfigLoader } from '@/core/config/hooks';
import { useConfigStore } from '@/core/config/store';

interface ConfigProviderProps {
  children: React.ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  useConfigLoader();
  const isLoading = useConfigStore((state) => state.isLoading);
  const error = useConfigStore((state) => state.error);

  useEffect(() => {
    if (error) {
      console.warn('Configuration loading error:', error);
      // Continue with default config - don't block app
    }
  }, [error]);

  // Render children even if config is loading (uses default config)
  // This ensures the app doesn't block on config loading
  return <>{children}</>;
};

