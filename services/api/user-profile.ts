import type {
    ImageDto,
    UpdatePasswordRequest,
    UpdateUserRequest,
    UserResponse,
} from '@/core/types/backend';
import { apiClient } from './client';

/**
 * User Profile API Service
 * Handles profile updates, password changes, 2FA, and image uploads
 */
export const userProfileAPI = {
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
   * 
   * Note: Requires 2FA code if 2FA is enabled for sensitive operations
   */
  updateProfile: async (userData: UpdateUserRequest): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>('/user/update', userData);
    return response.data;
  },

  /**
   * Update user password
   * PUT /user/update/password
   * 
   * Note: Requires 2FA code if 2FA is enabled
   */
  changePassword: async (passwordData: UpdatePasswordRequest): Promise<void> => {
    await apiClient.put('/user/update/password', passwordData);
  },

  /**
   * Upload user profile image
   * POST /user/upload/image/{userId}
   */
  uploadImage: async (userId: string, imageFile: any): Promise<ImageDto> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await apiClient.post<ImageDto>(
      `/user/upload/image/${userId}`,
      formData,
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
  getImage: async (userId: string): Promise<ImageDto> => {
    const response = await apiClient.get<ImageDto>(`/user/get/${userId}/image`);
    return response.data;
  },

  /**
   * Two-Factor Authentication Management
   */
  twoFactor: {
    /**
     * Send verification code for 2FA setup
     * POST /user/send-verification-code
     * 
     * @param method - 'EMAIL' or 'SMS'
     */
    sendVerificationCode: async (method: 'EMAIL' | 'SMS'): Promise<void> => {
      await apiClient.post('/user/send-verification-code', null, {
        params: { method },
      });
    },

    /**
     * Verify code and enable 2FA
     * POST /user/verify-two-step-code
     * 
     * @param code - 6-digit verification code
     * @param method - 'EMAIL' or 'SMS'
     */
    verifyAndEnable: async (code: string, method: 'EMAIL' | 'SMS'): Promise<void> => {
      await apiClient.post('/user/verify-two-step-code', null, {
        params: { code, method },
      });
    },

    /**
     * Verify 2FA code for sensitive operations
     * POST /user/verify-2fa-code
     * 
     * @param code - 6-digit verification code
     */
    verify2FACode: async (code: string): Promise<void> => {
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
     * Verify and use a backup code
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

  /**
   * Session Management
   */
  sessions: {
    /**
     * Get current user's active sessions
     * GET /user/sessions
     */
    getMySessions: async (): Promise<any[]> => {
      const response = await apiClient.get<any[]>('/user/sessions');
      return response.data;
    },

    /**
     * Revoke a specific session
     * DELETE /user/sessions/{sessionId}
     */
    revokeSession: async (sessionId: string): Promise<void> => {
      await apiClient.delete(`/user/sessions/${sessionId}`);
    },

    /**
     * Revoke all sessions except current
     * DELETE /user/sessions/revoke-all
     */
    revokeAllOtherSessions: async (): Promise<void> => {
      await apiClient.delete('/user/sessions/revoke-all');
    },
  },
};
