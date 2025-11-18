// Core application types

export type PolicyType = 'auto' | 'home' | 'life' | 'health' | 'travel';
export type PolicyStatus = 'active' | 'expired' | 'pending' | 'cancelled';
export type ClaimStatus = 'submitted' | 'inReview' | 'approved' | 'rejected' | 'pending';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
