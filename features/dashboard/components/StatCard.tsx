import React, { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  style?: ViewStyle;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    shadowColor: theme.colors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as const,
  value: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.primary,
    marginBottom: 4,
  } as const,
  title: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 2,
  } as const,
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  } as const,
}));

export const StatCard: React.FC<StatCardProps> = memo(({ title, value, subtitle, style }) => {
  const styles = useStyles();

  return (
    <Card style={style} variant="elevated" padding="md">
      <Text variant="h2" weight="bold" color={styles.value.color} style={{ marginBottom: 4 }}>
        {value}
      </Text>
      <Text variant="label" weight="semibold" style={{ marginBottom: 2 }}>
        {title}
      </Text>
      <Text variant="caption" color={styles.subtitle.color}>
        {subtitle}
      </Text>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.value === nextProps.value &&
    prevProps.subtitle === nextProps.subtitle
  );
});

StatCard.displayName = 'StatCard';