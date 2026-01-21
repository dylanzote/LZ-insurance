import { defaultConfig } from '@/core/config/defaultConfig';
import type { AppConfig, ConfigResponse } from '@/core/config/types';

// Mock configuration - in production, this would fetch from your backend
let mockConfig: AppConfig = { ...defaultConfig };
let configVersion = '1.0.0';
let lastUpdated = new Date().toISOString();

export const configAPI = {
  /**
   * Get current application configuration
   */
  getConfig: async (): Promise<ConfigResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      config: mockConfig,
      version: configVersion,
      lastUpdated,
    };
  },

  /**
   * Update configuration (admin only)
   */
  updateConfig: async (updates: Partial<AppConfig>): Promise<ConfigResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    mockConfig = { ...mockConfig, ...updates };
    configVersion = `${parseFloat(configVersion) + 0.1}`.slice(0, 3);
    lastUpdated = new Date().toISOString();
    
    return {
      config: mockConfig,
      version: configVersion,
      lastUpdated,
    };
  },

  /**
   * Update specific configuration section
   */
  updateConfigSection: async <K extends keyof AppConfig>(
    section: K,
    value: AppConfig[K]
  ): Promise<ConfigResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    mockConfig = { ...mockConfig, [section]: value };
    configVersion = `${parseFloat(configVersion) + 0.1}`.slice(0, 3);
    lastUpdated = new Date().toISOString();
    
    return {
      config: mockConfig,
      version: configVersion,
      lastUpdated,
    };
  },

  /**
   * Reset configuration to defaults
   */
  resetConfig: async (): Promise<ConfigResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    mockConfig = { ...defaultConfig };
    configVersion = '1.0.0';
    lastUpdated = new Date().toISOString();
    
    return {
      config: mockConfig,
      version: configVersion,
      lastUpdated,
    };
  },

  /**
   * Get configuration version (for cache invalidation)
   */
  getConfigVersion: async (): Promise<{ version: string; lastUpdated: string }> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      version: configVersion,
      lastUpdated,
    };
  },
};

