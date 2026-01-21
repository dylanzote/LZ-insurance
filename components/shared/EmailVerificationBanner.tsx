import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { authAPI } from '@/services/api/endpoints';
import { AlertCircle, Mail, RefreshCw, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, TouchableOpacity, View } from 'react-native';

interface EmailVerificationBannerProps {
  /**
   * If true, shows as a blocking modal that can't be dismissed
   * If false, shows as a banner that can be dismissed
   */
  blocking?: boolean;
  onVerificationSent?: () => void;
}

export const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({
  blocking = false,
  onVerificationSent,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [isVisible, setIsVisible] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number | null>(null);

  // Don't show if email is already verified
  if (user?.emailConfirmed) {
    return null;
  }

  // Don't show if dismissed (only for non-blocking mode)
  if (!blocking && !isVisible) {
    return null;
  }

  const handleResendEmail = async () => {
    if (!user?.email) return;

    // Rate limiting: prevent spam (30 seconds cooldown)
    const now = Date.now();
    if (lastSentTime && now - lastSentTime < 30000) {
      const remainingSeconds = Math.ceil((30000 - (now - lastSentTime)) / 1000);
      Alert.alert(
        t('common.error'),
        t('auth.pleaseWaitBeforeResending', { seconds: remainingSeconds })
      );
      return;
    }

    try {
      setIsSending(true);
      await authAPI.resendVerificationEmail(user.email);
      setLastSentTime(now);
      
      Alert.alert(
        t('common.success'),
        t('auth.verificationEmailSent')
      );
      
      onVerificationSent?.();
    } catch (error: any) {
      console.error('Failed to resend verification email:', error);
      Alert.alert(
        t('common.error'),
        error.response?.data?.message || t('auth.verificationEmailFailed')
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleDismiss = () => {
    if (!blocking) {
      setIsVisible(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      await refreshUser();
      
      // After refreshing, check if email is now verified
      if (user?.emailConfirmed) {
        Alert.alert(
          t('common.success'),
          'Your email has been verified successfully!'
        );
      } else {
        Alert.alert(
          t('common.info') || 'Info',
          'Email not yet verified. Please check your inbox and click the verification link.'
        );
      }
    } catch (error) {
      console.error('Failed to refresh verification status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const BannerContent = (
    <Card
      variant="elevated"
      style={{
        margin: blocking ? 0 : 16,
        backgroundColor: theme.colors.warning + '15',
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.warning,
      }}
    >
      <View style={{ padding: 16 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
          <View
            style={{
              backgroundColor: theme.colors.warning + '25',
              padding: 8,
              borderRadius: 8,
              marginRight: 12,
            }}
          >
            <AlertCircle size={24} color={theme.colors.warning} />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text variant="subtitle" weight="semibold" color={theme.colors.text}>
              {t('auth.emailNotVerified')}
            </Text>
            <Text variant="body" color={theme.colors.textSecondary} style={{ marginTop: 4 }}>
              {blocking 
                ? t('auth.mustVerifyEmailToUseApp')
                : t('auth.pleaseVerifyEmailToAccess')}
            </Text>
          </View>

          {!blocking && (
            <TouchableOpacity onPress={handleDismiss} style={{ padding: 4 }}>
              <X size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Email address */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Mail size={16} color={theme.colors.primary} />
          <Text variant="body" style={{ marginLeft: 8, flex: 1 }}>
            {user?.email}
          </Text>
        </View>

        {/* Instructions */}
        <Text variant="caption" color={theme.colors.textSecondary} style={{ marginBottom: 16 }}>
          {t('auth.checkInboxForVerification')}
        </Text>

        {/* Actions */}
        <View style={{ gap: 12 }}>
          <Button
            title={
              isSending
                ? t('auth.sendingVerificationEmail')
                : t('auth.resendVerificationEmail')
            }
            onPress={handleResendEmail}
            disabled={isSending}
            variant="primary"
            icon={
              isSending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Mail size={18} color="#fff" />
              )
            }
          />

          <Button
            title={
              isRefreshing
                ? 'Checking Status...'
                : 'I\'ve Verified - Refresh Status'
            }
            onPress={handleRefreshStatus}
            disabled={isRefreshing}
            variant="outline"
            icon={
              isRefreshing ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <RefreshCw size={18} color={theme.colors.primary} />
              )
            }
          />

          {!blocking && (
            <Button
              title={t('auth.verifyLater')}
              onPress={handleDismiss}
              variant="ghost"
            />
          )}
        </View>

        {/* Note for blocking mode */}
        {blocking && (
          <View
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: theme.colors.background,
              borderRadius: 8,
            }}
          >
            <Text variant="caption" color={theme.colors.textSecondary} style={{ textAlign: 'center' }}>
              {t('auth.emailVerificationRequired')}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );

  if (blocking) {
    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          {BannerContent}
        </View>
      </Modal>
    );
  }

  return BannerContent;
};

