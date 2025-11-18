import React, { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { tokens } from './tokens';
import type { Theme } from './types';
import { palette } from '../constants/colors';

const THEME_STORAGE_KEY = 'app:theme:mode';

//theme creation: creates a Theme object with default colors and spacing/radii from tokens.
const createTheme = (overrides: Partial<Theme['colors']> = {}): Theme => ({
  colors: {
    ...palette,
    background: '#ffffff',
    card: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    ...overrides,
  },
  spacing: tokens.spacing,
  radii: tokens.radius,
});

export const lightTheme = createTheme(); //uses default

export const darkTheme = createTheme({
  background: '#0f172a',
  card: '#1e293b',
  surface: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
}); // overides some colors for dark mode

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggle: () => Promise<void>;
}

//This creates a React Context that will hold:
// theme (light or dark)
// mode ('light', 'dark', or 'system')
// isDark (boolean)
// setMode (function to change mode)
// toggle (function to switch between light/dark)
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

//Wrap your app with <ThemeProvider> to make theme available via useTheme.
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const systemPrefersDark = systemColorScheme === 'dark'; //Uses device settings to determine if the system prefers dark mode.

  const [mode, setModeState] = useState<ThemeMode>('system'); //tracks user-selected theme mode ('light' | 'dark' | 'system')
  const [isDark, setIsDark] = useState<boolean>(systemPrefersDark); //determines whether the current theme is dark

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setModeState(stored);
        // Only set isDark based on system if mode is 'system'
        if (stored === 'system') {
          setIsDark(systemPrefersDark);
        } else {
          setIsDark(stored === 'dark');
        }
      }
    })();
  }, [systemPrefersDark]);

  useEffect(() => {
    if (mode === 'system') {
      setIsDark(systemPrefersDark);
    }
  }, [systemPrefersDark, mode]);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    // Update isDark based on the new mode
    if (newMode === 'system') {
      setIsDark(systemPrefersDark);
    } else {
      setIsDark(newMode === 'dark');
    }
  };

  const toggle = async () => {
    await setMode(isDark ? 'light' : 'dark');
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, isDark, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};