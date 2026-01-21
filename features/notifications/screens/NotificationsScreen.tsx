import React from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from '../components/NotificationItem';
import { Button } from '@/components/ui/Button';
import { Notification } from '../types';
import { Header } from '@/components/layout/Header';
import { EmptyState } from '@/components/shared/EmptyState';
import { Bell } from 'lucide-react-native';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: theme.spacing.md,
    flex: 1,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.lg,
  } as const,
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: theme.colors.text,
  } as const,
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  } as const,
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.xl,
  } as const,
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: theme.spacing.md,
  } as const,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  } as const,
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
}));

export const NotificationsScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    handleNotificationTap,
  } = useNotifications();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = (notification: Notification) => {
    handleNotificationTap(notification);
  };

  const handleNotificationLongPress = (notification: Notification) => {
    deleteNotification(notification.id);
  };

  if (loading && notifications.length === 0) {
    return (
      <View style={styles.container}>
        <Header title={t('notifications.title')} showNotifications={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16, color: styles.subtitle.color }}>
            {t('notifications.loading')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t('notifications.title')} showNotifications={false} />
      <View style={styles.content}>
        {unreadCount > 0 && (
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              {t('notifications.unreadCount', { count: unreadCount })}
            </Text>
            <Button
              title={t('notifications.markAllRead')}
              variant="ghost"
              size="sm"
              onPress={markAllAsRead}
            />
          </View>
        )}

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onPress={handleNotificationPress}
              onLongPress={handleNotificationLongPress}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={Bell}
              title={t('notifications.empty')}
              message={t('notifications.emptySubtext')}
            />
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};
