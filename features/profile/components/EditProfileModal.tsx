import React, { useState, useEffect } from 'react';
import { View, Modal, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { X } from 'lucide-react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Card } from '@/components/ui/Card';
import { useFormValidation } from '@/hooks/useFormValidation';
import { profileUpdateSchema, type ProfileUpdateFormData } from '@/core/utils/validation';
import { profileAPI } from '@/services/api/endpoints';
import type { UserProfile } from '../types';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const useStyles = createThemedStyles((theme) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  } as const,
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
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
  formRow: {
    flexDirection: 'row' as const,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  } as const,
  formRowItem: {
    flex: 1,
  } as const,
  actions: {
    flexDirection: 'row' as const,
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  } as const,
  actionButton: {
    flex: 1,
  } as const,
}));

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  profile,
  onUpdate,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useFormValidation({
    schema: profileUpdateSchema,
  });

  // Initialize form with profile data
  useEffect(() => {
    if (profile && visible) {
      setValue('firstName', profile.firstName || '');
      setValue('lastName', profile.lastName || '');
      setValue('phoneNumber', profile.phone || '');
      setValue('address', profile.address || '');
      setValue('dateOfBirth', profile.dateOfBirth || '');
    }
  }, [profile, visible, setValue]);

  const onSubmit = async (data: ProfileUpdateFormData) => {
    if (!profile) return;

    try {
      setIsSubmitting(true);
      const updatedProfile = await profileAPI.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
      });

      onUpdate({
        ...profile,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        phone: updatedProfile.phoneNumber,
        address: updatedProfile.address,
        dateOfBirth: updatedProfile.dateOfBirth,
      });

      Alert.alert(
        t('common.ok'),
        t('profile.updateSuccess'),
        [{ text: t('common.ok'), onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        t('common.error'),
        error instanceof Error ? error.message : t('profile.updateError')
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
                {t('profile.editProfile')}
              </Text>
              <Button
                variant="ghost"
                onPress={handleClose}
                style={styles.closeButton}
                accessibilityLabel={t('common.close')}
              >
                <X size={20} color={styles.headerTitle.color} />
              </Button>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formRow}>
                <View style={styles.formRowItem}>
                  <FormInput
                    control={control}
                    name="firstName"
                    label={t('profile.firstName')}
                    placeholder={t('profile.enterFirstName')}
                    error={errors.firstName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.formRowItem}>
                  <FormInput
                    control={control}
                    name="lastName"
                    label={t('profile.lastName')}
                    placeholder={t('profile.enterLastName')}
                    error={errors.lastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <FormInput
                control={control}
                name="phoneNumber"
                label={t('profile.phoneNumber')}
                placeholder={t('profile.enterPhoneNumber')}
                error={errors.phoneNumber}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />

              <FormInput
                control={control}
                name="address"
                label={t('profile.address')}
                placeholder={t('profile.enterAddress')}
                error={errors.address}
                autoCapitalize="words"
                multiline
                numberOfLines={2}
              />

              <FormInput
                control={control}
                name="dateOfBirth"
                label={t('profile.dateOfBirth')}
                placeholder={t('profile.selectDateOfBirth')}
                error={errors.dateOfBirth}
              />

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

