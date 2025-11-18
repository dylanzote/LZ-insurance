// API-specific types
import { ApiResponse, ApiError, PaginatedResponse } from './index';

export type { ApiResponse, ApiError, PaginatedResponse };

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: import('./index').User;
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
}
