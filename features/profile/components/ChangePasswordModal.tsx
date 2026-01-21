import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/contexts/AuthContext';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { changePasswordSchema, type ChangePasswordFormData } from '@/core/utils/validation';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useTranslation } from '@/hooks/useTranslation';
import { userProfileAPI } from '@/services/api/endpoints';
import { Eye, EyeOff, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const useStyles = createThemedStyles((theme) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  } as const,
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    maxHeight: '90%',
    paddingBottom: theme.spacing.lg,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.text,
  } as const,
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  content: {
    padding: theme.spacing.lg,
  } as const,
  actions: {
    flexDirection: 'row' as const,
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  } as const,
  actionButton: {
    flex: 1,
  } as const,
  passwordToggle: {
    position: 'absolute' as const,
    right: 12,
    top: 38,
    zIndex: 1,
    padding: 8,
  } as const,
}));

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useFormValidation({
    schema: changePasswordSchema,
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsSubmitting(true);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Call real API for password change
      await userProfileAPI.changePassword({
        userId: user.id,
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
        // Include 2FA code if required (handled separately in UI)
      });

      Alert.alert(
        t('common.ok'),
        t('profile.passwordChangeSuccess'),
        [{ text: t('common.ok'), onPress: handleClose }]
      );
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : t('profile.passwordChangeError');
      
      // Map specific error messages
      let translatedMessage = errorMessage;
      if (errorMessage.includes('incorrect')) {
        translatedMessage = t('profile.currentPasswordIncorrect');
      } else if (errorMessage.includes('match')) {
        translatedMessage = t('profile.passwordMismatch');
      }

      Alert.alert(
        t('common.error'),
        translatedMessage
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text variant="h3" weight="bold" style={styles.headerTitle}>
                {t('profile.changePassword')}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                accessibilityLabel={t('common.close')}
                activeOpacity={0.7}
              >
                <X size={20} color={styles.headerTitle.color} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ marginBottom: 16, position: 'relative' }}>
                <FormInput
                  control={control}
                  name="currentPassword"
                  label={t('profile.currentPassword')}
                  placeholder={t('profile.enterCurrentPassword')}
                  error={errors.currentPassword}
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  activeOpacity={0.7}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} color={styles.headerTitle.color} />
                  ) : (
                    <Eye size={20} color={styles.headerTitle.color} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: 16, position: 'relative' }}>
                <FormInput
                  control={control}
                  name="newPassword"
                  label={t('profile.newPassword')}
                  placeholder={t('profile.enterNewPassword')}
                  error={errors.newPassword}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  activeOpacity={0.7}
                >
                  {showNewPassword ? (
                    <EyeOff size={20} color={styles.headerTitle.color} />
                  ) : (
                    <Eye size={20} color={styles.headerTitle.color} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: 16, position: 'relative' }}>
                <FormInput
                  control={control}
                  name="confirmPassword"
                  label={t('profile.confirmNewPassword')}
                  placeholder={t('profile.confirmNewPasswordPlaceholder')}
                  error={errors.confirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={styles.headerTitle.color} />
                  ) : (
                    <Eye size={20} color={styles.headerTitle.color} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.actions}>
                <Button
                  title={t('common.cancel')}
                  variant="outline"
                  onPress={handleClose}
                  style={styles.actionButton}
                  disabled={isSubmitting}
                />
                <Button
                  title={isSubmitting ? t('common.loading') : t('profile.saveChanges')}
                  onPress={handleSubmit(onSubmit)}
                  style={styles.actionButton}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

