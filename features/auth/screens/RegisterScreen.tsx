import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useFormValidation } from '@/hooks/useFormValidation';
import { registerSchema, RegisterFormData } from '@/core/utils/validation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/core/theme/useTheme';
import { Shield } from 'lucide-react-native';

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
  const { login } = useAuth();
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
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate registration API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // After successful registration, automatically log in the user
      // In a real app, you might want to verify email first
      await login(data.email, data.password);
      
      // Navigation will happen automatically via the auth context
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : t('errors.generic');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
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
              label={t('auth.phoneNumberOptional')}
              placeholder={t('auth.enterPhoneNumber')}
              style={styles.input}
              keyboardType="phone-pad"
              autoComplete="tel"
              error={errors.phoneNumber}
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
