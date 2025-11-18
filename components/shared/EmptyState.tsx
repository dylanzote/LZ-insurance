import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message?: string;
  action?: React.ReactNode;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.xl,
    minHeight: 200,
  } as const,
  iconContainer: {
    marginBottom: theme.spacing.md,
  } as const,
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center' as const,
  } as const,
  message: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  } as const,
}));

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  message,
  action,
}) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {Icon && (
        <View style={styles.iconContainer}>
          <Icon size={64} color={styles.message.color} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {action}
    </View>
  );
};

