/**
 * Formatting Hooks
 * 
 * React hooks that provide formatting functions with automatic
 * configuration and locale access
 */

import { useMemo } from 'react';
import { useConfigStore } from '@/core/config/store';
import { useLanguage } from '@/contexts/LanguageContext';
import * as formatting from '@/core/utils/formatting';

/**
 * Hook for currency formatting
 */
export const useCurrencyFormat = () => {
  const config = useConfigStore((state) => state.config);
  const { locale } = useLanguage();

  return useMemo(
    () => (amount: number, options?: Parameters<typeof formatting.formatCurrency>[3]) =>
      formatting.formatCurrency(amount, config, locale, options),
    [config, locale]
  );
};

/**
 * Hook for number formatting
 */
export const useNumberFormat = () => {
  const config = useConfigStore((state) => state.config);
  const { locale } = useLanguage();

  return useMemo(
    () => (value: number, options?: Parameters<typeof formatting.formatNumber>[3]) =>
      formatting.formatNumber(value, config, locale, options),
    [config, locale]
  );
};

/**
 * Hook for date formatting
 */
export const useDateFormat = () => {
  const config = useConfigStore((state) => state.config);
  const { locale } = useLanguage();

  return useMemo(
    () => (date: Date | string, options?: Parameters<typeof formatting.formatDate>[3]) =>
      formatting.formatDate(date, config, locale, options),
    [config, locale]
  );
};

/**
 * Hook for time formatting
 */
export const useTimeFormat = () => {
  const config = useConfigStore((state) => state.config);
  const { locale } = useLanguage();

  return useMemo(
    () => (date: Date | string, options?: Parameters<typeof formatting.formatTime>[3]) =>
      formatting.formatTime(date, config, locale, options),
    [config, locale]
  );
};

/**
 * Hook for date-time formatting
 */
export const useDateTimeFormat = () => {
  const config = useConfigStore((state) => state.config);
  const { locale } = useLanguage();

  return useMemo(
    () => (date: Date | string, options?: Parameters<typeof formatting.formatDateTime>[3]) =>
      formatting.formatDateTime(date, config, locale, options),
    [config, locale]
  );
};

/**
 * Hook for all formatting functions
 */
export const useFormatting = () => {
  const formatCurrency = useCurrencyFormat();
  const formatNumber = useNumberFormat();
  const formatDate = useDateFormat();
  const formatTime = useTimeFormat();
  const formatDateTime = useDateTimeFormat();
  const config = useConfigStore((state) => state.config);

  return {
    formatCurrency,
    formatNumber,
    formatDate,
    formatTime,
    formatDateTime,
    formatFileSize: formatting.formatFileSize,
    formatPercentage: formatting.formatPercentage,
    parseCurrency: (value: string) => formatting.parseCurrency(value, config),
  };
};

