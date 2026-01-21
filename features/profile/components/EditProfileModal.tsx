import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormInput } from '@/components/ui/FormInput';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import type { UserResponse } from '@/core/types/backend';
import { profileUpdateSchema, type ProfileUpdateFormData } from '@/core/utils/validation';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useTranslation } from '@/hooks/useTranslation';
import { profileAPI } from '@/services/api/endpoints';
import { X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserResponse | null;
  onUpdate: (updatedProfile: UserResponse) => void;
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
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gender, setGender] = useState<string>('');

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
      setValue('phoneNumber', profile.phoneNumber || '');
      setValue('address', profile.address || '');
      setValue('dateOfBirth', profile.dateOfBirth || '');
      setValue('gender', profile.gender || '');
      setGender(profile.gender || '');
    }
  }, [profile, visible, setValue]);

  const onSubmit = async (data: ProfileUpdateFormData) => {
    if (!profile) {
      Alert.alert(t('common.error'), t('profile.loadError'));
      return;
    }

    // Log form data and validation state
    console.log('Form submitted with data:', data);
    console.log('Form errors:', errors);
    console.log('Gender state:', gender);

    try {
      setIsSubmitting(true);
      
      // Prepare update data matching backend UpdateUserRequest
      const updateData = {
        id: profile!.id,
        firstName: data.firstName?.trim() || '',
        lastName: data.lastName?.trim() || '',
        phoneNumber: data.phoneNumber?.trim() || '',
        address: data.address?.trim() || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: gender || data.gender || '',
        email: profile!.email,
        town: profile!.town || '',
        roleIds: profile!.roles?.map(r => r.id) || [],
      };

      console.log('Calling profileAPI.updateProfile with:', updateData);
      
      const updatedProfile = await profileAPI.updateProfile(updateData);

      console.log('Profile update response received:', updatedProfile);

      // Pass updated profile back
      onUpdate(updatedProfile.data);

      // Close modal and show success
      Alert.alert(
        t('common.ok'),
        t('profile.updateSuccess'),
        [{ 
          text: t('common.ok'),
          onPress: () => {
            handleClose();
          }
        }]
      );
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error instanceof Error ? error.message : t('profile.updateError');
      Alert.alert(
        t('common.error'),
        errorMessage
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFormError = (errors: any) => {
    console.log('Form validation errors:', errors);
    // Show first error to user
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      Alert.alert(
        t('common.error'),
        firstError.message
      );
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

              {/* Gender */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
                  {t('profile.gender')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  {[
                    { value: 'MALE', label: 'Male', icon: '👨' },
                    { value: 'FEMALE', label: 'Female', icon: '👩' },
                    { value: 'OTHER', label: 'Other', icon: '⚧' }
                  ].map((g) => (
                    <TouchableOpacity
                      key={g.value}
                      style={{ flex: 1 }}
                      onPress={() => {
                        setGender(g.value);
                        setValue('gender', g.value);
                      }}
                    >
                      <Card
                        variant="elevated"
                        style={{
                          padding: 16,
                          alignItems: 'center',
                          gap: 8,
                          borderWidth: gender === g.value ? 2 : 1,
                          borderColor: gender === g.value ? theme.colors.primary : theme.colors.border,
                          backgroundColor: gender === g.value ? theme.colors.primary + '15' : theme.colors.card,
                        }}
                      >
                        <Text style={{ fontSize: 24 }}>{g.icon}</Text>
                        <Text
                          variant="body"
                          weight={gender === g.value ? 'semibold' : 'regular'}
                          color={gender === g.value ? theme.colors.primary : theme.colors.text}
                        >
                          {g.label}
                        </Text>
                      </Card>
                    </TouchableOpacity>
                  ))}
                </View>
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
                  onPress={handleSubmit(onSubmit, onFormError)}
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

