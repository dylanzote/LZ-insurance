 import { ThemeContext } from '@/core/theme';
import { useContext } from 'react';

/**
 * Custom hook to access theme context
 * @returns {ThemeContextType} Theme context with theme, isDark, and toggleTheme
 * @throws {Error} If used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
