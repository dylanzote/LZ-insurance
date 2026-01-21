/**
 * Formatting Utilities
 * 
 * All formatting functions accept configuration to ensure
 * consistent formatting across the application.
 */

import type { AppConfig } from '@/core/config/types';

/**
 * Format currency amount using app configuration
 */
export const formatCurrency = (
  amount: number,
  config: AppConfig,
  locale: string = 'en',
  options?: {
    locale?: string;
    currency?: string;
    showSymbol?: boolean;
  }
): string => {
  const currencyCode = options?.currency || config.currency.code;
  const formatLocale = options?.locale || (locale === 'fr' ? 'fr-CA' : 'en-CA');
  
  const formatter = new Intl.NumberFormat(formatLocale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: config.currency.decimalPlaces,
    maximumFractionDigits: config.currency.decimalPlaces,
  });

  let formatted = formatter.format(amount);
  
  // If custom formatting is needed (for non-standard separators)
  if (config.currency.thousandsSeparator !== ',' || config.currency.decimalSeparator !== '.') {
    // Extract the number part and reformat
    const parts = formatter.formatToParts(amount);
    const numberPart = parts
      .filter(part => part.type === 'integer' || part.type === 'decimal' || part.type === 'fraction')
      .map(part => part.value)
      .join('');
    
    // Reconstruct with custom separators
    const [integer, decimal] = numberPart.split('.');
    const formattedInteger = integer.replace(/,/g, config.currency.thousandsSeparator);
    const formattedDecimal = decimal ? `${config.currency.decimalSeparator}${decimal}` : '';
    
    formatted = formatted.replace(numberPart, formattedInteger + formattedDecimal);
  }

  // Handle symbol position
  if (!options?.showSymbol && config.currency.position === 'after') {
    // Move symbol to end
    const symbol = config.currency.symbol;
    formatted = formatted.replace(symbol, '').trim() + ` ${symbol}`;
  }

  return formatted;
};

/**
 * Format number using app configuration
 */
export const formatNumber = (
  value: number,
  config: AppConfig,
  locale: string = 'en',
  options?: {
    decimals?: number;
    locale?: string;
  }
): string => {
  const formatLocale = options?.locale || (locale === 'fr' ? 'fr-CA' : 'en-CA');
  
  const formatter = new Intl.NumberFormat(formatLocale, {
    minimumFractionDigits: options?.decimals ?? 0,
    maximumFractionDigits: options?.decimals ?? config.currency.decimalPlaces,
  });

  return formatter.format(value);
};

/**
 * Format date using app configuration
 */
export const formatDate = (
  date: Date | string,
  config: AppConfig,
  locale: string = 'en',
  options?: {
    format?: 'short' | 'long' | 'full' | 'custom';
    customFormat?: string;
    locale?: string;
  }
): string => {
  const formatLocale = options?.locale || (locale === 'fr' ? 'fr-FR' : 'en-US');
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (options?.format === 'custom' && options.customFormat) {
    // Simple custom format implementation
    return formatDateCustom(dateObj, options.customFormat);
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: options?.format === 'short' ? 'short' : 'long',
    day: 'numeric',
  };

  if (options?.format === 'full') {
    formatOptions.weekday = 'long';
  }

  return dateObj.toLocaleDateString(formatLocale, formatOptions);
};

/**
 * Format time using app configuration
 */
export const formatTime = (
  date: Date | string,
  config: AppConfig,
  locale: string = 'en',
  options?: {
    locale?: string;
    includeSeconds?: boolean;
  }
): string => {
  const formatLocale = options?.locale || (locale === 'fr' ? 'fr-FR' : 'en-US');
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString(formatLocale, {
    hour: '2-digit',
    minute: '2-digit',
    second: options?.includeSeconds ? '2-digit' : undefined,
  });
};

/**
 * Format date and time using app configuration
 */
export const formatDateTime = (
  date: Date | string,
  config: AppConfig,
  locale: string = 'en',
  options?: {
    locale?: string;
    format?: 'short' | 'long';
  }
): string => {
  const formatLocale = options?.locale || (locale === 'fr' ? 'fr-FR' : 'en-US');
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString(formatLocale, {
    year: 'numeric',
    month: options?.format === 'short' ? 'short' : 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Helper function for custom date formatting
 */
const formatDateCustom = (date: Date, format: string): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const monthNamesFull = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return format
    .replace('yyyy', year.toString())
    .replace('MM', month.toString().padStart(2, '0'))
    .replace('M', month.toString())
    .replace('MMM', monthNames[month - 1])
    .replace('MMMM', monthNamesFull[month - 1])
    .replace('dd', day.toString().padStart(2, '0'))
    .replace('d', day.toString());
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (value: string, config: AppConfig): number => {
  // Remove currency symbol and whitespace
  let cleaned = value.replace(config.currency.symbol, '').trim();
  
  // Replace custom separators with standard ones
  cleaned = cleaned.replace(new RegExp(`\\${config.currency.thousandsSeparator}`, 'g'), '');
  cleaned = cleaned.replace(config.currency.decimalSeparator, '.');
  
  return parseFloat(cleaned) || 0;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

