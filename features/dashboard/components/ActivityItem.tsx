import React from 'react';
import { View, Text } from 'react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { RecentActivity } from '../types';

interface ActivityItemProps {
  activity: RecentActivity;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  } as const,
  content: {
    flex: 1,
  } as const,
  description: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  } as const,
  amount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.primary,
  } as const,
}));

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const styles = useStyles();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'policy': return '#10b981';
      case 'claim': return '#f59e0b';
      case 'payment': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.description}>{activity.description}</Text>
        <Text style={styles.date}>{activity.date}</Text>
      </View>
      {activity.amount && (
        <Text style={styles.amount}>
          ${activity.amount}
        </Text>
      )}
    </View>
  );
};