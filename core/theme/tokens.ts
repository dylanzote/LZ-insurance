export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;

export const tokens = {
  spacing,
  radius: radii, // Keep this for backward compatibility
  radii, // Add this for the new structure
} as const;

export const status = {
  successBg: '#dcfce7',
  successText: '#166534',
  dangerBg: '#fecaca',
  dangerText: '#dc2626',
  warningBg: '#fef3c7',
  warningText: '#d97706',
} as const;