import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme/useTheme';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { Text } from './Text';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle | ViewStyle[];
}

const useStyles = createThemedStyles((theme) => ({
  badge: {
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  } as const,
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  } as const,
  badgeMd: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  } as const,
  badgeLg: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
  } as const,
  badgeDefault: {
    backgroundColor: theme.colors.gray200,
  } as const,
  badgeSuccess: {
    backgroundColor: theme.colors.success + '20',
  } as const,
  badgeWarning: {
    backgroundColor: theme.colors.warning + '20',
  } as const,
  badgeError: {
    backgroundColor: theme.colors.error + '20',
  } as const,
  badgeInfo: {
    backgroundColor: theme.colors.info + '20',
  } as const,
  textDefault: {
    color: theme.colors.gray700,
  } as const,
  textSuccess: {
    color: theme.colors.success,
  } as const,
  textWarning: {
    color: theme.colors.warning,
  } as const,
  textError: {
    color: theme.colors.error,
  } as const,
  textInfo: {
    color: theme.colors.info,
  } as const,
}));

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  style,
}) => {
  const styles = useStyles();

  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return [styles.badgeSuccess, styles.textSuccess];
      case 'warning':
        return [styles.badgeWarning, styles.textWarning];
      case 'error':
        return [styles.badgeError, styles.textError];
      case 'info':
        return [styles.badgeInfo, styles.textInfo];
      default:
        return [styles.badgeDefault, styles.textDefault];
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.badgeSm;
      case 'md':
        return styles.badgeMd;
      case 'lg':
        return styles.badgeLg;
      default:
        return styles.badgeMd;
    }
  };

  const getTextSize = (): 'caption' | 'bodySmall' => {
    switch (size) {
      case 'sm':
        return 'caption';
      case 'lg':
        return 'bodySmall';
      default:
        return 'caption';
    }
  };

  const [bgStyle, textColor] = getVariantStyle();

  return (
    <View
      style={[styles.badge, getSizeStyle(), bgStyle, style]}
      accessibilityRole="text"
      accessibilityLabel={`Badge: ${label}`}
    >
      <Text
        variant={getTextSize()}
        weight="semibold"
        color={textColor.color as string}
      >
        {label}
      </Text>
    </View>
  );
};

