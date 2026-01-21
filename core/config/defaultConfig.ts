import type { AppConfig } from './types';

/**
 * Default Application Configuration
 * 
 * This file contains the default/fallback configuration.
 * Values can be overridden via API calls or environment variables.
 */
export const defaultConfig: AppConfig = {
  currency: {
    code: 'CAD',
    symbol: '$',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },

  locale: {
    default: 'en',
    supported: ['en', 'fr'],
    dateFormat: 'MMM dd, yyyy',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'MMM dd, yyyy HH:mm',
  },

  branding: {
    appName: 'LZ Insurance',
    companyName: 'LZ Insurance Direct Agency Inc.',
    supportEmail: 'support@lz-insurance.com',
    supportPhone: '+1 800-555-0123',
    website: 'https://www.lz-insurance.com',
  },

  features: {
    biometricAuth: true,
    pushNotifications: true,
    chatSupport: true,
    drivingScore: true,
    marketplace: true,
    feedback: true,
    twoStepVerification: true,
  },

  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081',
    timeout: 15000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  business: {
    minPolicyAmount: 100,
    maxPolicyAmount: 10000000,
    defaultDeductible: 500,
    claimSubmissionDeadline: 30,
    paymentGracePeriod: 15,
    tripReviewDeadline: 7,
    quoteExpirationDays: 30,
  },

  ui: {
    itemsPerPage: 20,
    maxFileUploadSize: 10,
    supportedImageFormats: ['jpg', 'jpeg', 'png', 'heic'],
    supportedDocumentFormats: ['pdf', 'doc', 'docx'],
    enableDarkMode: true,
    enableAnimations: true,
  },

  notifications: {
    enabled: true,
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    defaultChannels: ['email', 'push'],
  },
};

