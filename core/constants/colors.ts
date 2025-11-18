// Use string types instead of literal types for palette
export const palette = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#dbeafe',

  white: '#ffffff',
  background: '#f8fafc', // This is just a default, can be overridden
  card: '#ffffff', // This is just a default, can be overridden

  text: '#0f172a', // This is just a default
  textLight: '#64748b',
  textSecondary: '#64748b', // This is just a default

  border: '#e2e8f0', // This is just a default

  error: '#dc2626',
  success: '#16a34a',
  warning: '#d97706',
  info: '#2563eb',

  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
} as const; // Keep as const for the base palette

// But export a type that allows string values for theme overrides
export type Palette = {
  [K in keyof typeof palette]: string;
};
