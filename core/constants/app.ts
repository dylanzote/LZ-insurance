// Application constants

export const APP_CONFIG = {
  name: 'LZ-Insurance',
  version: '1.0.0',
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.lz-insurance.com/v1',
  apiTimeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

export const STORAGE_KEYS = {
  auth: 'auth-storage',
  theme: 'app:theme:mode',
  language: 'app:language',
  onboarding: 'app:onboarding:completed',
  fcmToken: 'app:fcm:token',
} as const;

export const ROUTES = {
  HOME: '/(tabs)',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/(tabs)',
  POLICIES: '/policies',
  POLICY_DETAIL: (id: string) => `/policies/${id}`,
  CLAIMS: '/claims',
  CLAIM_NEW: '/claims/new',
  CLAIM_DETAIL: (id: string) => `/claims/${id}`,
  DRIVING: '/(tabs)/driving',
  PROFILE: '/(tabs)/profile',
  INSURANCE: '/(tabs)/insurance',
  MARKETPLACE: '/insurance/marketplace',
  BILLING: '/billing',
  QUOTES: '/quotes',
  SUPPORT: '/support',
  SETTINGS: '/settings',
} as const;

export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  api: 'yyyy-MM-dd',
  datetime: 'MMM dd, yyyy HH:mm',
  time: 'HH:mm',
} as const;

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
} as const;
