import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { setupInterceptors } from './interceptors';
import { APP_CONFIG } from '@/core/constants/app';

// Create axios instance with optimized configuration
export const apiClient = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  timeout: APP_CONFIG.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Retry logic helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const shouldRetry = (error: AxiosError): boolean => {
  if (!error.response) {
    // Network error - retry
    return true;
  }
  
  const status = error.response.status;
  // Retry on server errors (5xx) or rate limiting (429)
  return status >= 500 || status === 429;
};

// Add retry logic to request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Store original request config for retry
    (config as any).__retryCount = (config as any).__retryCount || 0;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add retry logic to response interceptor (before error handling)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { __retryCount?: number };
    
    if (!config) {
      return Promise.reject(error);
    }

    const retryCount = config.__retryCount || 0;
    const shouldRetryError = shouldRetry(error);

    if (shouldRetryError && retryCount < APP_CONFIG.retryAttempts) {
      config.__retryCount = retryCount + 1;
      
      // Wait before retrying
      await delay(APP_CONFIG.retryDelay * (retryCount + 1)); // Exponential backoff
      
      // Retry the request
      return apiClient.request(config);
    }

    return Promise.reject(error);
  }
);

// Setup interceptors for auth, errors, etc.
setupInterceptors(apiClient);

export default apiClient;