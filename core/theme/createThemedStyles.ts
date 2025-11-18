import { useMemo } from 'react';
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import type { Theme } from './types';
import { useTheme } from './useTheme';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * createThemedStyles(factory)
 * - factory: (theme) => StyleSheet.NamedStyles<T>
 * returns a hook that provides memoized styles for the current theme
 * is a utility function that helps you create styles that automatically update when the app theme changes (light/dark/system), using React Native’s StyleSheet + React.memoization.
 */
export const createThemedStyles = <T extends NamedStyles<T>>(
  factory: (theme: Theme) => T
) => {
  return () => {
    const { theme } = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
};