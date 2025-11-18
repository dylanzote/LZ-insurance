import React from 'react';
import { View, ViewStyle, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '@/core/theme/useTheme';
import { createThemedStyles } from '@/core/theme/createThemedStyles';

interface CardProps extends Omit<TouchableOpacityProps, 'style'> {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Android
  } as const,
  cardOutlined: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  } as const,
  cardPressable: {
    // Touchable styles handled by TouchableOpacity
  } as const,
  paddingNone: {
    padding: 0,
  } as const,
  paddingSm: {
    padding: theme.spacing.sm,
  } as const,
  paddingMd: {
    padding: theme.spacing.md,
  } as const,
  paddingLg: {
    padding: theme.spacing.lg,
  } as const,
}));

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'md',
  onPress,
  ...props
}) => {
  const styles = useStyles();

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return styles.cardElevated;
      case 'outlined':
        return styles.cardOutlined;
      default:
        return {};
    }
  };

  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return styles.paddingNone;
      case 'sm':
        return styles.paddingSm;
      case 'md':
        return styles.paddingMd;
      case 'lg':
        return styles.paddingLg;
      default:
        return styles.paddingMd;
    }
  };

  const cardStyle = [
    styles.card,
    getVariantStyle(),
    onPress ? styles.cardPressable : {},
    getPaddingStyle(),
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ disabled: props.disabled }}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} accessibilityRole="none" {...(props as any)}>
      {children}
    </View>
  );
};
