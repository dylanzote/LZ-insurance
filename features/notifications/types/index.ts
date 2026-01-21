export type NotificationType =
  | 'claim_update'
  | 'claim_approved'
  | 'claim_rejected'
  | 'claim_document_required'
  | 'policy_reminder'
  | 'policy_expiring'
  | 'policy_renewed'
  | 'policy_cancelled'
  | 'payment'
  | 'payment_due'
  | 'payment_failed'
  | 'payment_success'
  | 'quote_ready'
  | 'quote_approved'
  | 'quote_expired'
  | 'system'
  | 'promotion'
  | 'security'
  | 'two_step_verification'
  | 'password_changed'
  | 'profile_updated'
  | 'driving_score'
  | 'trip_review'
  | 'invoice'
  | 'document_ready'
  | 'feedback_response';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  deepLink?: string; // Deep link path for navigation
  metadata?: {
    claimId?: string;
    policyId?: string;
    quoteId?: string;
    invoiceId?: string;
    tripId?: string;
    amount?: number;
    [key: string]: any; // Allow additional metadata
  };
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

export interface PushNotificationToken {
  token: string;
  deviceId: string;
  platform: 'ios' | 'android' | 'web';
}
