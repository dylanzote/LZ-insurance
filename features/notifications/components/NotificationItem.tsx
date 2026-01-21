import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { Notification } from '../types';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/core/theme/useTheme';

interface NotificationItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
  onLongPress?: (notification: Notification) => void;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    marginVertical: 4,
    borderRadius: theme.radii.md,
    borderLeftWidth: 4,
  } as const,
  unread: {
    backgroundColor: theme.colors.primary + '08',
    borderLeftColor: theme.colors.primary,
  } as const,
  read: {
    borderLeftColor: theme.colors.border,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: theme.spacing.xs,
  } as const,
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  } as const,
  time: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  } as const,
  message: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  } as const,
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start' as const,
    marginTop: 4,
  } as const,
  typeText: {
    fontSize: 10,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  } as const,
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  } as const,
}));

const getTypeStyles = (type: string, theme: any) => {
  switch (type) {
    case 'claim_update':
      return {
        backgroundColor: theme.colors.info + '20',
        color: theme.colors.info,
      };
    case 'policy_reminder':
      return {
        backgroundColor: theme.colors.warning + '20',
        color: theme.colors.warning,
      };
    case 'payment':
      return {
        backgroundColor: theme.colors.success + '20',
        color: theme.colors.success,
      };
    case 'system':
      return {
        backgroundColor: theme.colors.gray200,
        color: theme.colors.gray700,
      };
    case 'promotion':
      return {
        backgroundColor: theme.colors.primaryLight,
        color: theme.colors.primary,
      };
    default:
      return {
        backgroundColor: theme.colors.border,
        color: theme.colors.textSecondary,
      };
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onLongPress,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleLongPress = () => {
    Alert.alert(
      'Notification',
      'What would you like to do?',
      [
        {
          text: 'Mark as Read',
          onPress: () => onPress(notification),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onLongPress?.(notification),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const typeStyles = getTypeStyles(notification.type, theme);

  return (
    <Pressable
      onPress={() => onPress(notification)}
      onLongPress={handleLongPress}
      style={[
        styles.container,
        notification.read ? styles.read : styles.unread,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{notification.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.time}>
            {new Date(notification.timestamp).toLocaleDateString()}
          </Text>
          {!notification.read && <View style={styles.dot} />}
        </View>
      </View>

      <Text style={styles.message}>{notification.message}</Text>

      <View style={[styles.typeBadge, { backgroundColor: typeStyles.backgroundColor }]}>
        <Text style={[styles.typeText, { color: typeStyles.color }]}>
          {notification.type.replace('_', ' ')}
        </Text>
      </View>
    </Pressable>
  );
};