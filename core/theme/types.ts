import { tokens } from './tokens';

// Define the theme colors as extendable
export type ThemeColors = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  white: string;
  background: string;
  card: string;
  surface: string;
  text: string;
  textLight: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray700: string;
  gray800: string;
  gray900: string;
};

export type Theme = {
  colors: ThemeColors;
  spacing: typeof tokens.spacing;
  radii: typeof tokens.radius;
};