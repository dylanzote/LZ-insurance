import { apiClient } from './client';
import type {
  UserResponse,
  UpdateUserRequest,
  UpdatePasswordRequest,
  ImageDto,
} from '@/core/types/backend';

/**
 * Profile API Service
 * Handles user profile management, password changes, and 2FA setup
 * Connects to User Service on port 8081
 */
export const profileAPI = {
  /**
   * Get current user profile
   * GET /user/get-profile
   */
  getProfile: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/user/get-profile');
    return response.data;
  },

  /**
   * Update user profile
   * PUT /user/update
   */
  updateProfile: async (updates: Partial<UpdateUserRequest>): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>('/user/update', updates);
    return response.data;
  },

  /**
   * Change password
   * PUT /user/update/password
   */
  changePassword: async (
    userId: string,
    oldPassword: string,
    newPassword: string,
    twoFactorCode?: string
  ): Promise<void> => {
    const request: UpdatePasswordRequest = {
      userId,
      oldPassword,
      newPassword,
      twoFactorCode,
    };
    await apiClient.put('/user/update/password', request);
  },

  /**
   * Upload user image/avatar
   * POST /user/upload/image/{userId}
   */
  uploadImage: async (userId: string, imageFile: FormData): Promise<ImageDto> => {
    const response = await apiClient.post<ImageDto>(
      `/user/upload/image/${userId}`,
      imageFile,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Get user image
   * GET /user/get/{id}/image
   */
  getUserImage: async (userId: string): Promise<ImageDto> => {
    const response = await apiClient.get<ImageDto>(`/user/get/${userId}/image`);
    return response.data;
  },

  /**
   * Two-Factor Authentication
   */
  twoFactor: {
    /**
     * Send verification code for 2FA setup or sensitive operations
     * POST /user/send-verification-code
     */
    sendVerificationCode: async (method: 'EMAIL' | 'SMS'): Promise<void> => {
      await apiClient.post('/user/send-verification-code', null, {
        params: { method },
      });
    },

    /**
     * Verify code and enable 2FA
     * POST /user/verify-two-step-code
     */
    verifyAndEnable: async (code: string, method: 'EMAIL' | 'SMS'): Promise<void> => {
      await apiClient.post('/user/verify-two-step-code', null, {
        params: { code, method },
      });
    },

    /**
     * Verify 2FA code for sensitive operations (when 2FA already enabled)
     * POST /user/verify-2fa-code
     */
    verify: async (code: string): Promise<void> => {
      await apiClient.post('/user/verify-2fa-code', null, {
        params: { code },
      });
    },

    /**
     * Disable two-factor authentication
     * POST /user/disable-two-step-verification
     */
    disable: async (): Promise<void> => {
      await apiClient.post('/user/disable-two-step-verification');
    },

    /**
     * Generate backup codes
     * POST /user/generate-backup-codes
     */
    generateBackupCodes: async (): Promise<string[]> => {
      const response = await apiClient.post<string[]>('/user/generate-backup-codes');
      return response.data;
    },

    /**
     * Verify and use backup code
     * POST /user/verify-backup-code
     */
    verifyBackupCode: async (code: string): Promise<boolean> => {
      const response = await apiClient.post<boolean>('/user/verify-backup-code', null, {
        params: { code },
      });
      return response.data;
    },

    /**
     * Get remaining backup codes count
     * GET /user/backup-codes/count
     */
    getBackupCodesCount: async (): Promise<number> => {
      const response = await apiClient.get<number>('/user/backup-codes/count');
      return response.data;
    },
  },
};
