import axios, { AxiosInstance } from 'axios';
import { APP_CONFIG } from '@/core/constants/app';
import { useAuthStore } from '@/core/store/useAuthStore';
import type {
  NotificationResponse,
  DeviceResponse,
  RegisterDeviceRequest,
  UnreadCountResponse,
  PageResponse,
  NotificationChannel,
  NotificationStatus,
} from '@/core/types/backend';

/**
 * Create a separate axios instance for Notification Service
 * Running on port 8086
 */
const notificationClient: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.notificationApiUrl || 'http://localhost:8086',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth interceptor
notificationClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Notification Service API
 * Handles push notifications, in-app notifications, email notifications
 */
export const notificationServiceAPI = {
  /**
   * Device Management
   */
  device: {
    /**
     * Register device for push notifications
     * POST /notification/devices/register
     */
    register: async (deviceData: RegisterDeviceRequest): Promise<DeviceResponse> => {
      const response = await notificationClient.post<DeviceResponse>(
        '/notification/devices/register',
        deviceData
      );
      return response.data;
    },

    /**
     * Update device push token
     * PUT /notification/devices/token
     */
    updateToken: async (deviceId: string, pushToken: string): Promise<void> => {
      await notificationClient.put('/notification/devices/token', {
        deviceId,
        pushToken,
      });
    },

    /**
     * Get current user's devices
     * GET /notification/devices/my-devices
     */
    getMyDevices: async (): Promise<DeviceResponse[]> => {
      const response = await notificationClient.get<DeviceResponse[]>(
        '/notification/devices/my-devices'
      );
      return response.data;
    },

    /**
     * Unregister device
     * DELETE /notification/devices/{deviceId}
     */
    unregister: async (deviceId: string): Promise<void> => {
      await notificationClient.delete(`/notification/devices/${deviceId}`);
    },

    /**
     * Subscribe device to topic
     * POST /notification/devices/{deviceId}/subscribe/{topic}
     */
    subscribeToTopic: async (deviceId: string, topic: string): Promise<void> => {
      await notificationClient.post(`/notification/devices/${deviceId}/subscribe/${topic}`);
    },

    /**
     * Unsubscribe device from topic
     * DELETE /notification/devices/{deviceId}/subscribe/{topic}
     */
    unsubscribeFromTopic: async (deviceId: string, topic: string): Promise<void> => {
      await notificationClient.delete(`/notification/devices/${deviceId}/subscribe/${topic}`);
    },
  },

  /**
   * Notification Management
   */
  notifications: {
    /**
     * Get user notifications with pagination
     * GET /notification/notifications/user/{userId}
     */
    getUserNotifications: async (
      userId: string,
      page: number = 0,
      size: number = 20,
      channel?: NotificationChannel,
      status?: NotificationStatus
    ): Promise<PageResponse<NotificationResponse>> => {
      const params: any = { page, size };
      if (channel) params.channel = channel;
      if (status) params.status = status;

      const response = await notificationClient.get<PageResponse<NotificationResponse>>(
        `/notification/notifications/user/${userId}`,
        { params }
      );
      return response.data;
    },

    /**
     * Get unread notifications count
     * GET /notification/notifications/user/{userId}/unread-count
     */
    getUnreadCount: async (userId: string): Promise<number> => {
      const response = await notificationClient.get<UnreadCountResponse>(
        `/notification/notifications/user/${userId}/unread-count`
      );
      return response.data.count;
    },

    /**
     * Mark notification as read
     * PUT /notification/notifications/{notificationId}/read
     */
    markAsRead: async (notificationId: string): Promise<void> => {
      await notificationClient.put(`/notification/notifications/${notificationId}/read`);
    },

    /**
     * Mark all notifications as read
     * PUT /notification/notifications/user/{userId}/read-all
     */
    markAllAsRead: async (userId: string): Promise<void> => {
      await notificationClient.put(`/notification/notifications/user/${userId}/read-all`);
    },

    /**
     * Cancel scheduled notification
     * DELETE /notification/notifications/{notificationId}
     */
    cancelScheduled: async (notificationId: string): Promise<void> => {
      await notificationClient.delete(`/notification/notifications/${notificationId}`);
    },
  },
};
