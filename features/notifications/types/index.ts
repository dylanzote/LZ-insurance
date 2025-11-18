export interface Notification {
  id: string;
  type: 'claim_update' | 'policy_reminder' | 'payment' | 'system' | 'promotion';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    claimId?: string;
    policyId?: string;
    amount?: number;
  };
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}