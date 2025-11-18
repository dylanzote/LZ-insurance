import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme/useTheme';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label';

export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

const getVariantStyles = (variant: TextVariant): TextStyle => {
  switch (variant) {
    case 'h1':
      return {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: '700',
      };
    case 'h2':
      return {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '700',
      };
    case 'h3':
      return {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: '600',
      };
    case 'h4':
      return {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '600',
      };
    case 'body':
      return {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
      };
    case 'bodySmall':
      return {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
      };
    case 'caption':
      return {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400',
      };
    case 'label':
      return {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
      };
    default:
      return {};
  }
};

const getWeightValue = (weight?: TextWeight): TextStyle['fontWeight'] => {
  switch (weight) {
    case 'regular':
      return '400';
    case 'medium':
      return '500';
    case 'semibold':
      return '600';
    case 'bold':
      return '700';
    default:
      return undefined;
  }
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight,
  color,
  align,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const variantStyles = getVariantStyles(variant);
  const textColor = color || theme.colors.text;
  const fontWeight = weight ? getWeightValue(weight) : variantStyles.fontWeight;

  const textStyle: TextStyle = {
    ...variantStyles,
    color: textColor,
    fontWeight,
    textAlign: align,
  };

  return (
    <RNText
      style={[textStyle, style]}
      allowFontScaling={true}
      maxFontSizeMultiplier={1.2}
      {...props}
    >
      {children}
    </RNText>
  );
};
