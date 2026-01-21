import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppConfig, ConfigResponse } from './types';
import { defaultConfig } from './defaultConfig';

interface ConfigState {
  config: AppConfig;
  version: string | null;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setConfig: (config: AppConfig) => void;
  updateConfig: (updates: Partial<AppConfig>) => void;
  updateConfigValue: <K extends keyof AppConfig>(
    key: K,
    value: AppConfig[K]
  ) => void;
  loadConfig: (configResponse: ConfigResponse) => void;
  resetConfig: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const CONFIG_STORAGE_KEY = 'app:config';

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      version: null,
      lastUpdated: null,
      isLoading: false,
      error: null,

      setConfig: (config) => {
        set({ config, error: null });
      },

      updateConfig: (updates) => {
        set((state) => ({
          config: { ...state.config, ...updates },
          error: null,
        }));
      },

      updateConfigValue: (key, value) => {
        set((state) => ({
          config: { ...state.config, [key]: value },
          error: null,
        }));
      },

      loadConfig: (configResponse) => {
        set({
          config: configResponse.config,
          version: configResponse.version,
          lastUpdated: configResponse.lastUpdated,
          error: null,
        });
      },

      resetConfig: () => {
        set({
          config: defaultConfig,
          version: null,
          lastUpdated: null,
          error: null,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: CONFIG_STORAGE_KEY,
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
      partialize: (state): Pick<ConfigState, 'config' | 'version' | 'lastUpdated'> => ({
        config: state.config,
        version: state.version,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);

// Selectors for easy access
export const useCurrencyConfig = () => useConfigStore((state) => state.config.currency);
export const useLocaleConfig = () => useConfigStore((state) => state.config.locale);
export const useBrandingConfig = () => useConfigStore((state) => state.config.branding);
export const useFeatureFlags = () => useConfigStore((state) => state.config.features);
export const useBusinessConfig = () => useConfigStore((state) => state.config.business);
export const useUIConfig = () => useConfigStore((state) => state.config.ui);

