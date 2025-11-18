import { useState, useEffect } from 'react';
import { Notification } from '../types';

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'claim_update',
    title: 'Claim Status Updated',
    message: 'Your auto insurance claim #CL-2024-001 has been approved for processing.',
    timestamp: '2024-01-20T10:30:00Z',
    read: false,
    metadata: { claimId: 'CL-2024-001' }
  },
  {
    id: '2',
    type: 'policy_reminder',
    title: 'Policy Renewal Reminder',
    message: 'Your home insurance policy expires in 15 days. Renew now to avoid coverage lapse.',
    timestamp: '2024-01-19T14:20:00Z',
    read: false,
    metadata: { policyId: 'POL-001' }
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Received',
    message: 'Your payment of $125.50 has been processed successfully.',
    timestamp: '2024-01-18T09:15:00Z',
    read: true,
    metadata: { amount: 125.50 }
  },
  {
    id: '4',
    type: 'system',
    title: 'Welcome to LZ Insurance',
    message: 'Thank you for choosing LZ Insurance. Your account has been successfully created.',
    timestamp: '2024-01-15T16:45:00Z',
    read: true
  },
  {
    id: '5',
    type: 'claim_update',
    title: 'Document Required',
    message: 'Additional documents are required for claim #CL-2024-002. Please upload them in the app.',
    timestamp: '2024-01-14T11:20:00Z',
    read: false,
    metadata: { claimId: 'CL-2024-002' }
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setNotifications(mockNotifications);
    setLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: loadNotifications,
  };
};