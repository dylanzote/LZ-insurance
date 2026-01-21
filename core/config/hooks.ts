/**
 * Configuration Hooks
 * 
 * React hooks for accessing and managing configuration
 */

import { useEffect } from 'react';
import { useConfigStore } from './store';
import { configAPI } from '@/services/api/config';

/**
 * Hook to fetch and load configuration from API
 */
export const useConfigLoader = () => {
  const { setLoading, setError, loadConfig, config } = useConfigStore();

  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if we need to update config
        const versionInfo = await configAPI.getConfigVersion();
        const currentVersion = useConfigStore.getState().version;
        
        // Only fetch if version changed or no config loaded
        if (!currentVersion || currentVersion !== versionInfo.version) {
          const response = await configAPI.getConfig();
          loadConfig(response);
        }
      } catch (error) {
        console.error('Failed to load configuration:', error);
        setError(error instanceof Error ? error.message : 'Failed to load configuration');
        // Continue with default config
      } finally {
        setLoading(false);
      }
    };

    loadConfiguration();
  }, [setLoading, setError, loadConfig]);
};

/**
 * Hook to access configuration with automatic loading
 */
export const useAppConfig = () => {
  useConfigLoader();
  return useConfigStore((state) => state.config);
};

/**
 * Hook to access specific configuration section
 */
export const useConfigSection = <K extends keyof ReturnType<typeof useAppConfig>>(
  section: K
) => {
  useConfigLoader();
  return useConfigStore((state) => state.config[section]);
};

