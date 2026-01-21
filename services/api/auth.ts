import type {
  AuthRequest,
  AuthResponse,
  CreateUserRequest,
  PasswordPolicyResponse,
  PasswordResetRequest,
  PasswordStrengthResponse,
  RequestPasswordResetRequest,
  RoleResponse
} from '@/core/types/backend';
import { apiClient } from './client';

/**
 * Authentication API Service
 * Connects to User Service on port 8081
 */
export const authAPI = {
  /**
   * Login with email and password
   * POST /authenticate
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const request: AuthRequest = { email, password };
    const response = await apiClient.post<AuthResponse>('/authenticate', request);
    return response.data;
  },

  /**
   * Register a new customer user
   * POST /user/create
   * 
   * Note: For customer self-registration, we need to get the CUSTOMER role ID first
   * After successful registration, we automatically log the user in
   */
  register: async (userData: Omit<CreateUserRequest, 'roleIds'>): Promise<AuthResponse> => {
    // First, get all roles to find the CUSTOMER role
    const rolesResponse = await apiClient.get<RoleResponse[]>('/role/get-all');
    const customerRole = rolesResponse.data.find(
      role => role.isCustomerRole === true || 
              role.name?.toUpperCase() === 'CUSTOMER' || 
              role.name?.toUpperCase() === 'CUSTOMERS'
    );

    if (!customerRole) {
      throw new Error('Customer role not found. Please contact support.');
    }

    // Create user with CUSTOMER role
    const createUserRequest: CreateUserRequest = {
      ...userData,
      roleIds: [customerRole.id],
    };

    // Create the user (returns UserResponse, not AuthResponse)
    await apiClient.post('/user/create', createUserRequest);
    
    // Automatically login the user after successful registration
    const loginResponse = await authAPI.login(userData.email, userData.password);
    return loginResponse;
  },

  /**
   * Refresh access token
   * POST /auth/refresh-token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh-token', null, {
      params: { refreshToken },
    });
    return response.data;
  },

  /**
   * Logout current user
   * POST /auth/logout
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  /**
   * Get current authenticated user
   * GET /auth/me
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Request password reset
   * POST /auth/forgot-password
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    const request: RequestPasswordResetRequest = { email };
    await apiClient.post('/auth/forgot-password', request);
  },

  /**
   * Reset password with token
   * POST /auth/reset-password
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    const request: PasswordResetRequest = { token, newPassword };
    await apiClient.post('/auth/reset-password', request);
  },

  /**
   * Verify email with token
   * POST /auth/verify-email
   */
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post('/auth/verify-email', null, {
      params: { token },
    });
  },

  /**
   * Resend verification email
   * POST /auth/resend-verification
   */
  resendVerificationEmail: async (email: string): Promise<void> => {
    await apiClient.post('/auth/resend-verification', null, {
      params: { email },
    });
  },

  /**
   * Validate password strength
   * POST /auth/validate-password
   */
  validatePassword: async (password: string): Promise<PasswordStrengthResponse> => {
    const response = await apiClient.post<PasswordStrengthResponse>('/auth/validate-password', null, {
      params: { password },
    });
    return response.data;
  },

  /**
   * Get current password policy
   * GET /auth/password-policy
   */
  getPasswordPolicy: async (): Promise<PasswordPolicyResponse> => {
    const response = await apiClient.get<PasswordPolicyResponse>('/auth/password-policy');
    return response.data;
  },
};

