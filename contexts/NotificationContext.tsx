import type { Notification, NotificationType } from '@/features/notifications/types';
import { notificationAPI } from '@/services/api/endpoints';
import { notificationService } from '@/services/notifications/notificationService';
import { useRouter } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  pushToken: string | null;
  permissionsGranted: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  registerForPushNotifications: () => Promise<void>;
  handleNotificationTap: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const router = useRouter();

  // Load notifications from API
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getAll();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Register for push notifications
  const registerForPushNotifications = useCallback(async () => {
    try {
      const hasPermission = await notificationService.requestPermissions();
      setPermissionsGranted(hasPermission);

      if (hasPermission) {
        const token = await notificationService.registerForPushNotifications();
        setPushToken(token);
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  }, []);

  // Handle notification tap and navigate
  const handleNotificationTap = useCallback((notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type and metadata
    if (notification.deepLink) {
      router.push(notification.deepLink as any);
      return;
    }

    // Fallback navigation based on type
    switch (notification.type) {
      case 'claim_update':
      case 'claim_approved':
      case 'claim_rejected':
      case 'claim_document_required':
        if (notification.metadata?.claimId) {
          router.push(`/claims/${notification.metadata.claimId}` as any);
        } else {
          router.push('/claims' as any);
        }
        break;

      case 'policy_reminder':
      case 'policy_expiring':
      case 'policy_renewed':
      case 'policy_cancelled':
        if (notification.metadata?.policyId) {
          router.push(`/policies/${notification.metadata.policyId}` as any);
        } else {
          router.push('/policies' as any);
        }
        break;

      case 'quote_ready':
      case 'quote_approved':
      case 'quote_expired':
        if (notification.metadata?.quoteId) {
          router.push(`/quotes/${notification.metadata.quoteId}` as any);
        } else {
          router.push('/quotes' as any);
        }
        break;

      case 'payment':
      case 'payment_due':
      case 'payment_failed':
      case 'payment_success':
      case 'invoice':
        router.push('/billing' as any);
        break;

      case 'driving_score':
      case 'trip_review':
        if (notification.metadata?.tripId) {
          router.push(`/driving/review/${notification.metadata.tripId}` as any);
        } else {
          router.push('/driving' as any);
        }
        break;

      case 'two_step_verification':
      case 'password_changed':
      case 'profile_updated':
        router.push('/profile' as any);
        break;

      case 'document_ready':
        router.push('/documents' as any);
        break;

      case 'feedback_response':
        router.push('/feedback' as any);
        break;

      default:
        // For system, promotion, etc., just go to notifications screen
        router.push('/notifications' as any);
    }
  }, [router]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      // Update badge count
      const unread = notifications.filter(n => !n.read && n.id !== id).length;
      await notificationService.setBadgeCount(unread);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Optimistically update UI
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    }
  }, [notifications]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      await notificationService.clearBadge();
    } catch (error) {
      console.error('Error marking all as read:', error);
      // Optimistically update UI
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationAPI.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      // Update badge count
      const unread = notifications.filter(n => !n.read && n.id !== id).length;
      await notificationService.setBadgeCount(unread);
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Optimistically update UI
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  }, [notifications]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Set up notification listeners
  useEffect(() => {
    // Handle notification received while app is in foreground
    const receivedSubscription = notificationService.addNotificationReceivedListener(
      async (notification) => {
        // Convert Expo notification to our Notification type
        const newNotification: Notification = {
          id: notification.request.identifier,
          type: (notification.request.content.data?.type as NotificationType) || 'system',
          title: notification.request.content.title || '',
          message: notification.request.content.body || '',
          timestamp: new Date().toISOString(),
          read: false,
          deepLink: notification.request.content.data?.deepLink as string | undefined,
          metadata: notification.request.content.data?.metadata as Notification['metadata'],
        };

        // Add to notifications list
        setNotifications(prev => [newNotification, ...prev]);
        
        // Update badge
        await notificationService.setBadgeCount(unreadCount + 1);
      }
    );

    // Handle notification tap
    const responseSubscription = notificationService.addNotificationResponseListener(
      async (response) => {
        const data = response.notification.request.content.data;
        const notification: Notification = {
          id: response.notification.request.identifier,
          type: (data?.type as NotificationType) || 'system',
          title: response.notification.request.content.title || '',
          message: response.notification.request.content.body || '',
          timestamp: new Date().toISOString(),
          read: false,
          deepLink: data?.deepLink as string | undefined,
          metadata: data?.metadata as Notification['metadata'],
        };

        handleNotificationTap(notification);
      }
    );

    // Check for notification when app opens
    const checkLastNotification = async () => {
      const lastResponse = await notificationService.getLastNotificationResponse();
      if (lastResponse) {
        const data = lastResponse.notification.request.content.data;
        const notification: Notification = {
          id: lastResponse.notification.request.identifier,
          type: (data?.type as NotificationType) || 'system',
          title: lastResponse.notification.request.content.title || '',
          message: lastResponse.notification.request.content.body || '',
          timestamp: new Date().toISOString(),
          read: false,
          deepLink: data?.deepLink as string | undefined,
          metadata: data?.metadata as Notification['metadata'],
        };
        handleNotificationTap(notification);
      }
    };

    checkLastNotification();

    // Load notifications on mount
    loadNotifications();

    // Register for push notifications
    registerForPushNotifications();

    // Refresh notifications when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        loadNotifications();
        // Update badge count
        notificationService.setBadgeCount(unreadCount);
      }
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
      subscription.remove();
      notificationService.removeAllListeners();
    };
  }, [loadNotifications, registerForPushNotifications, handleNotificationTap, unreadCount]);

  // Update badge count when unread count changes
  useEffect(() => {
    notificationService.setBadgeCount(unreadCount);
  }, [unreadCount]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    pushToken,
    permissionsGranted,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: loadNotifications,
    registerForPushNotifications,
    handleNotificationTap,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

