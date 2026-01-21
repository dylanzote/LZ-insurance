import { useAuthStore } from '@/core/store/useAuthStore';
import type { DevicePlatform } from '@/core/types/backend';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { notificationServiceAPI } from '../api/endpoints';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationToken {
  token: string;
  deviceId: string;
  platform: 'ios' | 'android' | 'web';
}

class NotificationService {
  private pushToken: string | null = null;
  private deviceId: string | null = null;
  private listeners: Array<{ remove: () => void }> = [];

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Get current notification permissions status
   */
  async getPermissionsStatus(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.getPermissionsAsync();
  }

  /**
   * Register for push notifications and get push token.
   * In Expo Go on Android (SDK 53+), remote push is not supported — we skip to avoid the runtime error.
   */
  async registerForPushNotifications(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      // Expo Go on Android: push was removed in SDK 53 — skip getExpoPushTokenAsync to avoid ERROR
      const isExpoGoAndroid =
        Constants.appOwnership === 'expo' && Platform.OS === 'android';
      if (isExpoGoAndroid) {
        if (__DEV__) {
          console.warn(
            '[Notifications] Push is not supported in Expo Go on Android (SDK 53+). Use a development build for push.'
          );
        }
        return null;
      }

      const deviceId = await this.getDeviceId();

      // Get push token (can throw in unsupported environments)
      let tokenData: { data: string };
      try {
        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ||
          Constants.expoConfig?.extra?.projectId ||
          process.env.EXPO_PUBLIC_PROJECT_ID ||
          undefined;
        tokenData = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined
        );
      } catch (e: any) {
        const msg = e?.message || String(e);
        const isFirebase = /Firebase|FirebaseApp|FCM|google-services/i.test(msg);
        if (__DEV__) {
          console.warn('[Notifications] getExpoPushTokenAsync failed:', msg);
          if (Platform.OS === 'android' && isFirebase) {
            console.warn(
              '[Notifications] For Android push, set up FCM: add google-services.json and run prebuild. See https://docs.expo.dev/push-notifications/fcm-credentials/'
            );
          }
        }
        return null;
      }

      this.pushToken = tokenData.data;
      this.deviceId = deviceId;

      // Register device with Notification Service (port 8086)
      await this.registerTokenWithBackend({
        token: this.pushToken,
        deviceId,
        platform: Platform.OS as 'ios' | 'android' | 'web',
      });

      return this.pushToken;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  /**
   * Get device ID (simplified - in production use a proper solution)
   */
  private async getDeviceId(): Promise<string> {
    // In production, use expo-device or react-native-device-info
    // For now, generate a simple ID
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    let deviceId = await AsyncStorage.getItem('@device_id');
    
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('@device_id', deviceId);
    }
    
    return deviceId;
  }

  /**
   * Register device with Notification Service API (port 8086)
   * POST /notification/devices/register
   */
  private async registerTokenWithBackend(tokenData: PushNotificationToken): Promise<void> {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.id) {
        if (__DEV__) {
          console.warn('[Notifications] Skipping device register: user not logged in');
        }
        return;
      }

      const platform: DevicePlatform =
        tokenData.platform === 'ios'
          ? 'IOS'
          : tokenData.platform === 'android'
            ? 'ANDROID'
            : 'WEB';

      const v = Constants.expoConfig?.version;
      const rv = Constants.expoConfig?.runtimeVersion;
      const appVersion =
        (typeof v === 'string' ? v : undefined) ??
        (typeof rv === 'string' ? rv : undefined) ??
        '1.0.0';

      const request = {
        deviceId: tokenData.deviceId,
        pushToken: tokenData.token,
        platform,
        userId: user.id,
        appVersion,
      };

      await notificationServiceAPI.device.register(request);
      if (__DEV__) {
        console.log('[Notifications] Device registered with notification service:', tokenData.deviceId);
      }
    } catch (error) {
      console.error('Error registering device with notification service:', error);
      // Don't throw - registration failure shouldn't break the app
    }
  }

  /**
   * Unregister device from Notification Service (port 8086)
   * DELETE /notification/devices/{deviceId}
   */
  async unregisterPushToken(): Promise<void> {
    const deviceId = this.deviceId;
    this.pushToken = null;
    this.deviceId = null;

    if (!deviceId) {
      return;
    }

    try {
      await notificationServiceAPI.device.unregister(deviceId);
      if (__DEV__) {
        console.log('[Notifications] Device unregistered:', deviceId);
      }
    } catch (error) {
      console.error('Error unregistering device:', error);
    }
  }

  /**
   * Schedule a local notification
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: Record<string, any>,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: trigger || null, // null means show immediately
    });

    return notificationId;
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Set notification badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  /**
   * Clear notification badge
   */
  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  /**
   * Add notification received listener
   */
  addNotificationReceivedListener(
    handler: (notification: Notifications.Notification) => void
  ): { remove: () => void } {
    const subscription = Notifications.addNotificationReceivedListener(handler);
    this.listeners.push(subscription);
    return subscription;
  }

  /**
   * Add notification response listener (when user taps notification)
   */
  addNotificationResponseListener(
    handler: (response: Notifications.NotificationResponse) => void
  ): { remove: () => void } {
    const subscription = Notifications.addNotificationResponseReceivedListener(handler);
    this.listeners.push(subscription);
    return subscription;
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
  }

  /**
   * Get last notification response (when app opened from notification)
   */
  async getLastNotificationResponse(): Promise<Notifications.NotificationResponse | null> {
    return await Notifications.getLastNotificationResponseAsync();
  }

  /**
   * Get push token (if already registered)
   */
  getPushToken(): string | null {
    return this.pushToken;
  }
}

export const notificationService = new NotificationService();

