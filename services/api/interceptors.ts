import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '@/core/store/useAuthStore';
import { ApiError } from '@/core/types';

export const setupInterceptors = (instance: AxiosInstance) => {
  // Request interceptor to add auth token and handle request
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add request timestamp for debugging
      if (__DEV__) {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      }
      
      return config;
    },
    (error: AxiosError) => {
      if (__DEV__) {
        console.error('[API] Request Error:', error);
      }
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle errors and transform responses
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (__DEV__) {
        console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - Success`);
      }
      return response;
    },
    async (error: AxiosError<ApiError>) => {
      if (__DEV__) {
        console.error('[API] Response Error:', error.response?.data || error.message);
      }

      // Handle different error status codes
      const status = error.response?.status;
      
      switch (status) {
        case 401:
          // Token expired or invalid - logout user
          useAuthStore.getState().logout();
          // Transform error for consistent handling
          const authError: ApiError = {
            message: error.response?.data?.message || 'Your session has expired. Please login again.',
            code: 'UNAUTHORIZED',
            statusCode: 401,
          };
          return Promise.reject(authError);
        
        case 403:
          const forbiddenError: ApiError = {
            message: error.response?.data?.message || 'You don\'t have permission to access this resource.',
            code: 'FORBIDDEN',
            statusCode: 403,
          };
          return Promise.reject(forbiddenError);
        
        case 404:
          const notFoundError: ApiError = {
            message: error.response?.data?.message || 'The requested resource was not found.',
            code: 'NOT_FOUND',
            statusCode: 404,
          };
          return Promise.reject(notFoundError);
        
        case 422:
          // Validation errors
          const validationError: ApiError = {
            message: error.response?.data?.message || 'Validation error',
            code: 'VALIDATION_ERROR',
            statusCode: 422,
            errors: error.response?.data?.errors,
          };
          return Promise.reject(validationError);
        
        case 429:
          // Rate limiting
          const rateLimitError: ApiError = {
            message: error.response?.data?.message || 'Too many requests. Please try again later.',
            code: 'RATE_LIMIT',
            statusCode: 429,
          };
          return Promise.reject(rateLimitError);
        
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          const serverError: ApiError = {
            message: error.response?.data?.message || 'Server error. Please try again later.',
            code: 'SERVER_ERROR',
            statusCode: status,
          };
          return Promise.reject(serverError);
        
        default:
          // Network errors or other
          if (!error.response) {
            const networkError: ApiError = {
              message: 'Network error. Please check your connection.',
              code: 'NETWORK_ERROR',
            };
            return Promise.reject(networkError);
          }
          
          // Generic error
          const genericError: ApiError = {
            message: error.response?.data?.message || 'Something went wrong. Please try again.',
            code: error.response?.data?.code || 'UNKNOWN_ERROR',
            statusCode: status,
          };
          return Promise.reject(genericError);
      }
    }
  );
};