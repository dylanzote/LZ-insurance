export type FeedbackCategory = 
  | 'bug' 
  | 'feature' 
  | 'improvement' 
  | 'complaint' 
  | 'compliment' 
  | 'other';

export type FeedbackStatus = 'submitted' | 'in-review' | 'resolved' | 'closed';

export interface Feedback {
  id: string;
  userId: string;
  category: FeedbackCategory;
  title: string;
  message: string;
  rating?: number; // 1-5 stars
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
  response?: string; // Admin response
  respondedAt?: string;
}

export interface FeedbackFormData {
  category: FeedbackCategory;
  title: string;
  message: string;
  rating?: number;
}

export interface FeedbackStats {
  total: number;
  byCategory: Record<FeedbackCategory, number>;
  averageRating: number;
  resolved: number;
  pending: number;
}

