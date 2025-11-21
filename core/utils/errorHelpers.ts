import { ApiError } from '@/core/types';
import { AxiosError } from 'axios';

/**
 * Extracts error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as ApiError).message);
  }
  
  return 'An unknown error occurred';
};

/**
 * Extracts API error from Axios error
 */
export const extractApiError = (error: unknown): ApiError => {
  if (error && typeof error === 'object' && error !== null) {
    // Check if it's already an ApiError
    if ('message' in error && 'code' in error) {
      return error as ApiError;
    }
    
    // Check if it's an AxiosError
    if ('isAxiosError' in error && (error as AxiosError).response) {
      const axiosError = error as AxiosError<ApiError>;
      return axiosError.response?.data || {
        message: axiosError.message || 'Network error',
        code: 'NETWORK_ERROR',
        statusCode: axiosError.response?.status,
      };
    }
  }
  
  // Fallback
  return {
    message: getErrorMessage(error),
    code: 'UNKNOWN_ERROR',
  };
};

/**
 * Checks if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  const apiError = extractApiError(error);
  return apiError.code === 'NETWORK_ERROR' || apiError.code === 'NETWORK_REQUEST_FAILED';
};

/**
 * Checks if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  const apiError = extractApiError(error);
  return apiError.code === 'UNAUTHORIZED' || apiError.statusCode === 401;
};

/**
 * Formats validation errors for display
 */
export const formatValidationErrors = (errors?: Record<string, string[]>): string => {
  if (!errors) {
    return '';
  }
  
  const errorMessages = Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n');
  
  return errorMessages;
};

