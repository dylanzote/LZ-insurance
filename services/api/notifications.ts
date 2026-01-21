// Mock notifications data
const mockNotifications: any[] = [
  {
    id: '1',
    type: 'claim_approved',
    title: 'Claim Approved',
    message: 'Your auto insurance claim #CL-2024-001 has been approved for processing.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    deepLink: '/claims/CL-2024-001',
    metadata: { claimId: 'CL-2024-001' },
  },
  {
    id: '2',
    type: 'policy_expiring',
    title: 'Policy Renewal Reminder',
    message: 'Your home insurance policy expires in 15 days. Renew now to avoid coverage lapse.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    deepLink: '/policies/POL-001',
    metadata: { policyId: 'POL-001' },
  },
  {
    id: '3',
    type: 'payment_success',
    title: 'Payment Received',
    message: 'Your payment of $125.50 has been processed successfully.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    deepLink: '/billing',
    metadata: { amount: 125.50 },
  },
  {
    id: '4',
    type: 'quote_ready',
    title: 'Quote Ready',
    message: 'Your auto insurance quote is ready for review.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    deepLink: '/quotes/QT-2024-001',
    metadata: { quoteId: 'QT-2024-001' },
  },
  {
    id: '5',
    type: 'claim_document_required',
    title: 'Document Required',
    message: 'Additional documents are required for claim #CL-2024-002. Please upload them in the app.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    deepLink: '/claims/CL-2024-002',
    metadata: { claimId: 'CL-2024-002' },
  },
];

export const notificationAPI = {
  // Get all notifications
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: mockNotifications.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    };
  },

  // Get notification by ID
  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const notification = mockNotifications.find(n => n.id === id);
    if (!notification) throw new Error('Notification not found');
    return { data: notification };
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
    return { data: { success: true } };
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockNotifications.forEach(n => n.read = true);
    return { data: { success: true } };
  },

  // Delete notification
  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockNotifications.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
    }
    return { data: { success: true } };
  },

  // Register push notification token
  registerToken: async (tokenData: { token: string; deviceId: string; platform: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In production, this would send the token to your backend
    console.log('Registering push token:', tokenData);
    return { data: { success: true, tokenId: `token_${Date.now()}` } };
  },

  // Unregister push notification token
  unregisterToken: async (tokenData: { token: string; deviceId: string; platform: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // In production, this would remove the token from your backend
    console.log('Unregistering push token:', tokenData);
    return { data: { success: true } };
  },

  // Send push notification (for testing/admin use)
  send: async (notification: {
    title: string;
    body: string;
    data?: Record<string, any>;
    userId?: string;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In production, this would send via your backend/Expo Push Notification service
    console.log('Sending push notification:', notification);
    return { data: { success: true, notificationId: `notif_${Date.now()}` } };
  },
};

