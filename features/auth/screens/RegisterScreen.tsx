import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { FormInput } from '@/components/ui/FormInput';
import { GenderSelector } from '@/components/ui/GenderSelector';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/contexts/AuthContext';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { RegisterFormData, registerSchema } from '@/core/utils/validation';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useTranslation } from '@/hooks/useTranslation';
import { Link, useRouter } from 'expo-router';
import { Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  keyboardView: {
    flex: 1,
  } as const,
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? theme.spacing.xl * 2 : theme.spacing.xl,
    paddingBottom: theme.spacing.xl * 2,
  } as const,
  header: {
    alignItems: 'center' as const,
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  } as const,
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.lg,
  } as const,
  title: {
    marginBottom: theme.spacing.sm,
  } as const,
  subtitle: {
    textAlign: 'center' as const,
    paddingHorizontal: theme.spacing.md,
  } as const,
  card: {
    marginTop: theme.spacing.lg,
  } as const,
  form: {
    gap: theme.spacing.md,
  } as const,
  input: {
    marginBottom: 0,
  } as const,
  nameRow: {
    flexDirection: 'row' as const,
    gap: theme.spacing.md,
  } as const,
  nameInput: {
    flex: 1,
    marginBottom: 0,
  } as const,
  errorContainer: {
    marginBottom: theme.spacing.md,
  } as const,
  errorText: {
    textAlign: 'center' as const,
  } as const,
  button: {
    marginTop: theme.spacing.md,
  } as const,
  termsContainer: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  } as const,
  termsText: {
    textAlign: 'center' as const,
    lineHeight: 20,
  } as const,
  footer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center' as const,
    // Add extra bottom padding - will be supplemented by safe area insets
    paddingBottom: theme.spacing.lg,
  } as const,
  footerRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  footerText: {
    textAlign: 'center' as const,
  } as const,
  link: {
    marginLeft: 4,
  } as const,
}));

export const RegisterScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { register } = useAuth();
  const insets = useSafeAreaInsets(); // FIX: Add missing hook call
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useFormValidation({
    schema: registerSchema,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: 'MALE' as any,
      town: '',
      address: '',
    },
  });

  /**
   * Format date from YYYY-MM-DD to dd/MM/yyyy (backend requirement)
   */
  const formatDateForBackend = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare user data for backend (matching CreateUserRequest)
      const userData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        userName: data.email.split('@')[0], // Generate username from email
        gender: data.gender,
        email: data.email.trim().toLowerCase(),
        phoneNumber: data.phoneNumber.trim(),
        dateOfBirth: formatDateForBackend(data.dateOfBirth), // Convert to dd/MM/yyyy
        town: data.town.trim(),
        address: data.address.trim(),
        password: data.password,
        language: 'EN' as const, // Default language
      };

      // Call register API - this will automatically log in the user
      await register(userData);
      
      // Navigation will happen automatically via the auth context
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : t('errors.registrationFailed');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, 16) + 16, // Safe area + extra padding
          }
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Shield size={40} color={theme.colors.primary} />
          </View>
          <Text variant="h1" weight="bold" style={styles.title}>
            {t('auth.getStarted')}
          </Text>
          <Text variant="body" color={theme.colors.textSecondary} style={styles.subtitle}>
            {t('auth.signUpToStart')}
          </Text>
        </View>

        {/* Form Card */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <View style={styles.form}>
            {error && (
              <View style={styles.errorContainer}>
                <Text 
                  variant="bodySmall" 
                  color={theme.colors.error} 
                  style={styles.errorText}
                  accessibilityRole="alert"
                >
                  {error}
                </Text>
              </View>
            )}

            {/* Name Row */}
            <View style={styles.nameRow}>
              <FormInput
                control={control}
                name="firstName"
                label={t('auth.firstName')}
                placeholder={t('auth.enterFirstName')}
                style={styles.nameInput}
                autoCapitalize="words"
                autoComplete="given-name"
                error={errors.firstName}
              />
              <FormInput
                control={control}
                name="lastName"
                label={t('auth.lastName')}
                placeholder={t('auth.enterLastName')}
                style={styles.nameInput}
                autoCapitalize="words"
                autoComplete="family-name"
                error={errors.lastName}
              />
            </View>

            <FormInput
              control={control}
              name="email"
              label={t('auth.email')}
              placeholder={t('auth.enterEmail')}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              error={errors.email}
            />

            <FormInput
              control={control}
              name="phoneNumber"
              label={t('auth.phoneNumber')}
              placeholder="+1234567890"
              style={styles.input}
              keyboardType="phone-pad"
              autoComplete="tel"
              error={errors.phoneNumber}
            />

            <DatePickerInput
              control={control}
              name="dateOfBirth"
              label={t('auth.dateOfBirth')}
              placeholder={t('auth.selectDate') || 'Select your date of birth'}
              style={styles.input}
              error={errors.dateOfBirth}
            />

            <GenderSelector
              control={control}
              name="gender"
              label={t('auth.gender')}
              style={styles.input}
              error={errors.gender}
            />

            <FormInput
              control={control}
              name="town"
              label={t('auth.town')}
              placeholder={t('auth.enterTown')}
              style={styles.input}
              autoCapitalize="words"
              error={errors.town}
            />

            <FormInput
              control={control}
              name="address"
              label={t('auth.address')}
              placeholder={t('auth.enterAddress')}
              style={styles.input}
              autoCapitalize="words"
              multiline
              numberOfLines={2}
              error={errors.address}
            />

            <FormInput
              control={control}
              name="password"
              label={t('auth.password')}
              placeholder={t('auth.enterPassword')}
              style={styles.input}
              secureTextEntry
              autoComplete="password-new"
              error={errors.password}
            />

            <FormInput
              control={control}
              name="confirmPassword"
              label={t('auth.confirmPassword')}
              placeholder={t('auth.confirmYourPassword')}
              style={styles.input}
              secureTextEntry
              autoComplete="password-new"
              error={errors.confirmPassword}
            />

            <Button
              style={styles.button}
              title={isLoading ? t('common.loading') : t('auth.createAccount')}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading || !isValid}
              loading={isLoading}
              size="lg"
            />

            <View style={styles.termsContainer}>
              <Text variant="caption" color={theme.colors.textSecondary} style={styles.termsText}>
                {t('auth.termsAgreement')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text variant="bodySmall" color={theme.colors.textSecondary} style={styles.footerText}>
              {t('auth.alreadyHaveAccount')}{' '}
            </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t('auth.signIn')}
              >
                <Text 
                  variant="bodySmall" 
                  color={theme.colors.primary} 
                  weight="semibold"
                  style={styles.link}
                >
                  {t('auth.signIn')}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
