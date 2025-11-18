import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export const useSafeArea = () => {
  const insets = useSafeAreaInsets();

  return {
    top: Math.max(insets.top, Platform.select({ ios: 20, android: 24, default: 0 }) || 0),
    bottom: Math.max(insets.bottom, Platform.select({ ios: 20, android: 16, default: 0 }) || 0),
    left: insets.left,
    right: insets.right,
    insets,
  };
};

