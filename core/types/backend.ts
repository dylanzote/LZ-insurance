/**
 * Backend API Types - Matching Java DTOs Exactly
 * User Service API running on port 8081
 * DO NOT MODIFY - These match the backend Java classes exactly
 */

// ============================================================================
// Enums (matching backend)
// ============================================================================

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type Language = 'EN' | 'FR';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'SUSPENDED' | 'PENDING';
export type TwoFacMethod = 'EMAIL' | 'SMS';

// ============================================================================
// AUTH TYPES
// ============================================================================

/**
 * Backend: AuthRequest
 */
export interface AuthRequest {
  email: string;
  password: string;
}

/**
 * Backend: AuthResponse
 */
export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  refreshToken: string;
  user: UserResponse;
}

/**
 * Backend: PasswordStrengthResponse
 */
export interface PasswordStrengthResponse {
  score: number; // 0-100
  strength: 'WEAK' | 'FAIR' | 'GOOD' | 'STRONG' | 'VERY_STRONG';
  feedback: string[];
  passed: boolean;
}

/**
 * Backend: PasswordPolicyResponse
 */
export interface PasswordPolicyResponse {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireSpecialChar: boolean;
  specialChars: string;
  maxConsecutiveChars: number;
  preventCommonPasswords: boolean;
}

/**
 * Backend: RequestPasswordResetRequest
 */
export interface RequestPasswordResetRequest {
  email: string;
}

/**
 * Backend: PasswordResetRequest
 */
export interface PasswordResetRequest {
  token: string;
  newPassword: string;
}

// ============================================================================
// USER TYPES
// ============================================================================

/**
 * Backend: CreateUserRequest (for customer self-registration)
 */
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  userName: string;
  gender: Gender;
  email: string;
  phoneNumber: string;
  roleIds: string[]; // Backend uses Set<String>, but JSON serializes to array
  dateOfBirth: string; // Format: dd/MM/yyyy
  town: string;
  address: string;
  password: string;
  branchId?: string;
  department?: string;
  language?: Language;
}

/**
 * Backend: UserResponse
 */
export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phone: string; // Alias for phoneNumber
  dateOfBirth: string;
  roles: RoleResponse[];
  status: UserStatus;
  emailConfirmed: boolean;
  newUser: boolean;
  gender: Gender;
  language: Language;
  town: string;
  address: string;
  imageUrl?: string;
  avatar?: string; // Alias for imageUrl
  branchId?: string;
  department?: string;
  twoFactorEnabled: boolean;
  twoFactorMethod?: TwoFacMethod;
  authResponse?: AuthResponse;
  createdBy?: string;
  createdAt?: string; // ISO date string
  lastModifiedBy?: string;
  updatedAt?: string; // ISO date string
  lastLogin?: string; // ISO date string
}

/**
 * Backend: RoleResponse
 */
export interface RoleResponse {
  id: string;
  name: string;
  description?: string;
  isCustomerRole: boolean;
  permissions?: string[];
}

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

/**
 * Standard API success response
 */
export interface ApiSuccessResponse<T = any> {
  data: T;
  message?: string;
  StatusCode?: number;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  message: string;
  StatusCode: number;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

/**
 * Paginated response
 */
export interface PageResponse<T> {
  data: T[];
  pageNo: number;
  sizePerPage: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
}

// ============================================================================
// NOTIFICATION SERVICE TYPES (Port 8086)
// ============================================================================

/**
 * Notification enums
 */
export type NotificationChannel = 'PUSH' | 'EMAIL' | 'SMS' | 'IN_APP';
export type NotificationStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'CANCELLED';
export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type NotificationType = 
  | 'POLICY_UPDATE' 
  | 'CLAIM_STATUS' 
  | 'PAYMENT_DUE' 
  | 'PAYMENT_RECEIVED'
  | 'DOCUMENT_REQUEST'
  | 'RENEWAL_REMINDER'
  | 'GENERAL'
  | 'SECURITY_ALERT'
  | 'PROMOTION'
  | 'SYSTEM';

export type DevicePlatform = 'IOS' | 'ANDROID' | 'WEB';

/**
 * Backend: RegisterDeviceRequest
 */
export interface RegisterDeviceRequest {
  deviceId: string;
  userId?: string;
  platform: DevicePlatform;
  platformVersion?: string;
  appVersion?: string;
  pushToken: string;
  deviceModel?: string;
  deviceLanguage?: string;
  initialTopics?: string[];
}

/**
 * Backend: DeviceResponse
 */
export interface DeviceResponse {
  id: string;
  deviceId: string;
  platform: string;
  platformVersion?: string;
  appVersion?: string;
  deviceModel?: string;
  deviceLanguage?: string;
  isActive: boolean;
  lastSeenAt?: string; // ISO date string
  createdAt: string; // ISO date string
  subscribedTopics?: string[];
}

/**
 * Backend: NotificationResponse
 */
export interface NotificationResponse {
  id: string;
  userId: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  providerMessageId?: string;
  locale?: string;
  scheduledAt?: string; // ISO date string
  sentAt?: string; // ISO date string
  deliveredAt?: string; // ISO date string
  readAt?: string; // ISO date string
  createdAt: string; // ISO date string
}

/**
 * Backend: UnreadCountResponse
 */
export interface UnreadCountResponse {
  count: number;
}

// ============================================================================
// USER PROFILE TYPES (Extended)
// ============================================================================

/**
 * Backend: UpdateUserRequest (for profile updates)
 */
export interface UpdateUserRequest {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
  phoneNumber: string;
  dateOfBirth: string; // Format: dd/MM/yyyy
  town: string;
  roleIds: string[];
  address: string;
  branchId?: string;
  department?: string;
  language?: Language;
  twoFactorCode?: string; // Optional: 2FA code for sensitive operations
}

/**
 * Backend: UpdatePasswordRequest
 */
export interface UpdatePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
  twoFactorCode?: string; // Optional: 2FA code for sensitive operations
}

/**
 * Backend: ImageDto
 */
export interface ImageDto {
  url?: string;
  base64?: string;
}
