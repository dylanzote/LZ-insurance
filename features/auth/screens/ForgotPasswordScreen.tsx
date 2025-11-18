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
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/core/utils/validation';
import { useTheme } from '@/core/theme/useTheme';
import { Shield, Mail, ArrowLeft } from 'lucide-react-native';
import { Alert } from 'react-native';
import { i18n } from '@/core/i18n';

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
  } as const,
  backButton: {
    marginBottom: theme.spacing.lg,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  backButtonText: {
    marginLeft: theme.spacing.sm,
  } as const,
  header: {
    alignItems: 'center' as const,
    marginBottom: theme.spacing.xl,
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
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.lg,
  } as const,
  title: {
    marginBottom: theme.spacing.sm,
    textAlign: 'center' as const,
  } as const,
  subtitle: {
    textAlign: 'center' as const,
    paddingHorizontal: theme.spacing.md,
    lineHeight: 24,
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
  errorContainer: {
    marginBottom: theme.spacing.md,
  } as const,
  errorText: {
    textAlign: 'center' as const,
  } as const,
  button: {
    marginTop: theme.spacing.md,
  } as const,
  infoText: {
    textAlign: 'center' as const,
    marginTop: theme.spacing.md,
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
  successContainer: {
    alignItems: 'center' as const,
    padding: theme.spacing.xl,
  } as const,
  successIcon: {
    marginBottom: theme.spacing.lg,
  } as const,
}));

export const ForgotPasswordScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useFormValidation({
    schema: forgotPasswordSchema,
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmittedEmail(data.email);
      setIsSuccess(true);

      Alert.alert(
        t('auth.passwordResetSent'),
        t('auth.passwordResetInstructions'),
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
          {
            text: t('auth.checkEmail'),
            onPress: () => {
              // Could navigate to email app or show instructions
            },
          },
        ]
      );
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : t('errors.generic');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const handleResendEmail = () => {
    const email = getValues('email');
    if (email) {
      onSubmit({ email });
    }
  };

  if (isSuccess) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackToLogin}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <ArrowLeft size={20} color={theme.colors.text} />
          <Text variant="bodySmall" color={theme.colors.text} style={styles.backButtonText}>
            {t('common.back')}
          </Text>
        </TouchableOpacity>

        <View style={styles.successContainer}>
          <View style={styles.iconContainer}>
            <Mail size={48} color={theme.colors.primary} />
          </View>
          
          <Text variant="h2" weight="bold" style={styles.title}>
            {t('auth.checkYourEmail')}
          </Text>
          
          <Text variant="body" color={theme.colors.textSecondary} style={styles.subtitle}>
            {i18n.t('auth.passwordResetSentTo', { email: submittedEmail })}
          </Text>
          
          <Text variant="bodySmall" color={theme.colors.textSecondary} style={styles.infoText}>
            {t('auth.passwordResetInstructions')}
          </Text>

          <Button
            style={styles.button}
            title={t('auth.backToLogin')}
            onPress={handleBackToLogin}
            size="lg"
          />

          <TouchableOpacity 
            onPress={handleResendEmail}
            style={{ marginTop: theme.spacing.md }}
            accessibilityRole="button"
            accessibilityLabel={t('auth.resendEmail')}
          >
            <Text variant="bodySmall" color={theme.colors.primary} weight="medium">
              {t('auth.resendEmail')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackToLogin}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <ArrowLeft size={20} color={theme.colors.text} />
          <Text variant="bodySmall" color={theme.colors.text} style={styles.backButtonText}>
            {t('common.back')}
          </Text>
        </TouchableOpacity>

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Shield size={40} color={theme.colors.primary} />
          </View>
          <Text variant="h1" weight="bold" style={styles.title}>
            {t('auth.forgotPassword')}
          </Text>
          <Text variant="body" color={theme.colors.textSecondary} style={styles.subtitle}>
            {t('auth.forgotPasswordDescription')}
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
              autoFocus
            />

            <Text variant="bodySmall" color={theme.colors.textSecondary} style={styles.infoText}>
              {t('auth.passwordResetInfo')}
            </Text>

            <Button
              style={styles.button}
              title={isLoading ? t('common.loading') : t('auth.sendResetLink')}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading || !isValid}
              loading={isLoading}
              size="lg"
            />
          </View>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text variant="bodySmall" color={theme.colors.textSecondary} style={styles.footerText}>
              {t('auth.rememberPassword')}{' '}
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

