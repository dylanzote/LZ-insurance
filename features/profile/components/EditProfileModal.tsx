import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormInput } from '@/components/ui/FormInput';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { profileUpdateSchema, type ProfileUpdateFormData } from '@/core/utils/validation';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useTranslation } from '@/hooks/useTranslation';
import { profileAPI } from '@/services/api/endpoints';
import { X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
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
  const [maritalStatus, setMaritalStatus] = useState<string>('');
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
      setValue('phoneNumber', profile.phone || '');
      setValue('address', profile.address || '');
      setValue('dateOfBirth', profile.dateOfBirth || '');
      setValue('maritalStatus', profile.maritalStatus || '');
      setValue('gender', profile.gender || '');
      setMaritalStatus(profile.maritalStatus || '');
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
    console.log('Marital status state:', maritalStatus);
    console.log('Gender state:', gender);

    try {
      setIsSubmitting(true);
      
      // Prepare update data with all fields
      const updateData = {
        firstName: data.firstName?.trim() || '',
        lastName: data.lastName?.trim() || '',
        phoneNumber: data.phoneNumber?.trim() || '',
        address: data.address?.trim() || '',
        dateOfBirth: data.dateOfBirth || '',
        maritalStatus: maritalStatus || data.maritalStatus || '',
        gender: gender || data.gender || '',
      };

      console.log('Calling profileAPI.updateProfile with:', updateData);
      
      const updatedProfile = await profileAPI.updateProfile(updateData);

      console.log('Profile update response received:', updatedProfile);

      // Update profile with returned data
      const updatedProfileData: UserProfile = {
        ...profile,
        firstName: updatedProfile.data.firstName || profile.firstName,
        lastName: updatedProfile.data.lastName || profile.lastName,
        phone: updatedProfile.data.phoneNumber || updatedProfile.data.phone || profile.phone,
        address: updatedProfile.data.address || profile.address,
        dateOfBirth: updatedProfile.data.dateOfBirth || profile.dateOfBirth,
        maritalStatus: updatedProfile.data.maritalStatus || maritalStatus || profile.maritalStatus,
        gender: updatedProfile.data.gender || gender || profile.gender,
      };

      console.log('Updating profile with:', updatedProfileData);
      onUpdate(updatedProfileData);

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

              {/* Marital Status */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
                  {t('quotes.form.maritalStatus')}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
                  {['single', 'married', 'divorced', 'widowed'].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={{ width: '48%', margin: '1%', marginHorizontal: 6, marginBottom: 12 }}
                      onPress={() => {
                        setMaritalStatus(status);
                        setValue('maritalStatus', status);
                      }}
                    >
                      <Card
                        variant="elevated"
                        style={{
                          padding: 12,
                          alignItems: 'center',
                          borderWidth: maritalStatus === status ? 2 : 0,
                          borderColor: maritalStatus === status ? theme.colors.primary : 'transparent',
                          backgroundColor: maritalStatus === status ? theme.colors.primaryLight + '20' : theme.colors.card,
                        }}
                      >
                        <Text
                          variant="body"
                          weight={maritalStatus === status ? 'semibold' : 'regular'}
                          color={maritalStatus === status ? theme.colors.primary : theme.colors.text}
                        >
                          {t(`quotes.form.marital.${status}`)}
                        </Text>
                      </Card>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Gender */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
                  {t('quotes.form.gender')}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
                  {['male', 'female', 'other', 'prefer-not-to-say'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={{ width: '48%', margin: '1%', marginHorizontal: 6, marginBottom: 12 }}
                      onPress={() => {
                        setGender(g);
                        setValue('gender', g);
                      }}
                    >
                      <Card
                        variant="elevated"
                        style={{
                          padding: 12,
                          alignItems: 'center',
                          borderWidth: gender === g ? 2 : 0,
                          borderColor: gender === g ? theme.colors.primary : 'transparent',
                          backgroundColor: gender === g ? theme.colors.primaryLight + '20' : theme.colors.card,
                        }}
                      >
                        <Text
                          variant="body"
                          weight={gender === g ? 'semibold' : 'regular'}
                          color={gender === g ? theme.colors.primary : theme.colors.text}
                        >
                          {t(`quotes.form.genderOptions.${g}`)}
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

