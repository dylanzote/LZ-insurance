// core/theme/useTheme.ts
import { useContext } from 'react';
import { ThemeContext } from './index';

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};
