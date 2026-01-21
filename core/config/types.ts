/**
 * Configuration Types
 * 
 * Defines all configurable aspects of the application
 */

export interface AppConfig {
  // Currency Configuration
  currency: {
    code: string; // ISO 4217 currency code (e.g., 'CAD', 'USD', 'EUR')
    symbol: string; // Currency symbol (e.g., '$', '€', '£')
    position: 'before' | 'after'; // Symbol position
    decimalPlaces: number; // Number of decimal places
    thousandsSeparator: string; // Thousands separator (e.g., ',', '.', ' ')
    decimalSeparator: string; // Decimal separator (e.g., '.', ',')
  };

  // Localization
  locale: {
    default: string; // Default locale code
    supported: string[]; // Supported locale codes
    dateFormat: string; // Date format pattern
    timeFormat: string; // Time format pattern
    dateTimeFormat: string; // DateTime format pattern
  };

  // App Branding
  branding: {
    appName: string;
    companyName: string;
    supportEmail: string;
    supportPhone: string;
    website: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };

  // Feature Flags
  features: {
    biometricAuth: boolean;
    pushNotifications: boolean;
    chatSupport: boolean;
    drivingScore: boolean;
    marketplace: boolean;
    feedback: boolean;
    twoStepVerification: boolean;
  };

  // API Configuration
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };

  // Business Rules
  business: {
    minPolicyAmount: number;
    maxPolicyAmount: number;
    defaultDeductible: number;
    claimSubmissionDeadline: number; // Days
    paymentGracePeriod: number; // Days
    tripReviewDeadline: number; // Days
    quoteExpirationDays: number;
  };

  // UI Configuration
  ui: {
    itemsPerPage: number;
    maxFileUploadSize: number; // MB
    supportedImageFormats: string[];
    supportedDocumentFormats: string[];
    enableDarkMode: boolean;
    enableAnimations: boolean;
  };

  // Notification Settings
  notifications: {
    enabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    defaultChannels: string[];
  };
}

export interface ConfigResponse {
  config: AppConfig;
  version: string;
  lastUpdated: string;
}

export type ConfigKey = keyof AppConfig;
export type ConfigValue = AppConfig[ConfigKey];

