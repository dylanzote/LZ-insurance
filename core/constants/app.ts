// Application constants

export const APP_CONFIG = {
  name: 'LZ-Insurance',
  version: '1.0.0',
  // User Service API (port 8081)
  // IMPORTANT: Update .env.development file with correct IP for your device type
  // - Android Emulator: http://10.0.2.2:8081
  // - Physical Device: http://YOUR_COMPUTER_IP:8081
  // - iOS Simulator: http://localhost:8081
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://10.0.0.251:8081', // Default to physical device IP
  apiTimeout: 15000, // 15 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  
  // Notification Service API (port 8086)
  notificationApiUrl: process.env.EXPO_PUBLIC_NOTIFICATION_API_URL || 'http://10.0.0.251:8086',
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
