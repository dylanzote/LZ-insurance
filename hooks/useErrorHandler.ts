import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { useTranslation } from './useTranslation';
import { ApiError } from '@/core/types';

interface ErrorHandlerOptions {
  showAlert?: boolean;
  logError?: boolean;
  onError?: (error: ApiError | Error) => void;
}

export const useErrorHandler = () => {
  const { t } = useTranslation();

  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const {
        showAlert = true,
        logError = __DEV__,
        onError,
      } = options;

      // Normalize error to ApiError format
      let normalizedError: ApiError;

      if (error instanceof Error) {
        normalizedError = {
          message: error.message,
          code: 'UNKNOWN_ERROR',
        };
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        normalizedError = error as ApiError;
      } else {
        normalizedError = {
          message: t('errors.generic'),
          code: 'UNKNOWN_ERROR',
        };
      }

      // Log error in development
      if (logError) {
        console.error('[ErrorHandler]', normalizedError);
      }

      // Call custom error handler if provided
      if (onError) {
        onError(normalizedError);
        return;
      }

      // Show alert if enabled
      if (showAlert) {
        const errorKey = normalizedError.code?.toLowerCase() || 'generic';
        const errorMessage = normalizedError.message || t(`errors.${errorKey}`) || t('errors.generic');

        Alert.alert(
          t('common.error'),
          errorMessage,
          [{ text: t('common.cancel'), style: 'cancel' }],
          { cancelable: true }
        );
      }
    },
    [t]
  );

  return { handleError };
};

