import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  } as const,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background + 'CC',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 1000,
  } as const,
  message: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  } as const,
}));

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'large',
  fullScreen = true,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const content = (
    <>
      <ActivityIndicator size={size} color={styles.message.color} />
      {(message || fullScreen) && (
        <Text style={styles.message}>
          {message || t('common.loading')}
        </Text>
      )}
    </>
  );

  if (fullScreen) {
    return <View style={styles.container}>{content}</View>;
  }

  return <View style={styles.overlay}>{content}</View>;
};

