import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

class BiometricAuthService {
  /**
   * Check if biometric authentication is available on the device
   */
  async isAvailable(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        return false;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return enrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Get the type of biometric authentication available
   */
  async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Error getting supported authentication types:', error);
      return [];
    }
  }

  /**
   * Get a user-friendly name for the biometric type
   */
  async getBiometricTypeName(): Promise<string> {
    const types = await this.getSupportedTypes();
    
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris';
    }
    
    return 'Biometric';
  }

  /**
   * Authenticate using biometrics
   */
  async authenticate(reason?: string): Promise<BiometricAuthResult> {
    try {
      const available = await this.isAvailable();
      if (!available) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device',
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason || 'Authenticate to continue',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        fallbackLabel: 'Use Password',
      });

      if (result.success) {
        return { success: true };
      }

      if (result.error === 'user_cancel') {
        return {
          success: false,
          error: 'Authentication was cancelled',
        };
      }

      if (result.error === 'user_fallback') {
        return {
          success: false,
          error: 'User chose to use password instead',
        };
      }

      return {
        success: false,
        error: result.error || 'Authentication failed',
      };
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  /**
   * Check if Face ID is available (iOS specific)
   */
  async isFaceIDAvailable(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return false;
    }

    const types = await this.getSupportedTypes();
    return types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
  }
}

export const biometricAuthService = new BiometricAuthService();








