import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormInput } from '@/components/ui/FormInput';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/contexts/AuthContext';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { LoginFormData, loginSchema } from '@/core/utils/validation';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useTranslation } from '@/hooks/useTranslation';
import { biometricAuthService } from '@/services/auth/biometricAuth';
import { Link, useRouter } from 'expo-router';
import { Shield } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
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
    // Remove paddingBottom - will be handled by safe area insets dynamically
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
  errorContainer: {
    marginBottom: theme.spacing.md,
  } as const,
  errorText: {
    textAlign: 'center' as const,
  } as const,
  forgotPassword: {
    alignItems: 'flex-end' as const,
    marginTop: -theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  } as const,
  forgotPasswordText: {
    fontSize: 14,
  } as const,
  button: {
    marginTop: theme.spacing.md,
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
  divider: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginVertical: theme.spacing.lg,
  } as const,
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  } as const,
  dividerText: {
    marginHorizontal: theme.spacing.md,
    fontSize: 12,
  } as const,
  biometricButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  } as const,
  biometricButtonContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as const,
  biometricIcon: {
    marginRight: theme.spacing.sm,
  } as const,
}));

export const LoginScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useFormValidation({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  // Check biometric availability on mount
  useEffect(() => {
    const checkBiometric = async () => {
      const available = await biometricAuthService.isAvailable();
      setBiometricAvailable(available);
      if (available) {
        const typeName = await biometricAuthService.getBiometricTypeName();
        setBiometricType(typeName);
      }
    };
    checkBiometric();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await login(data.email, data.password);
      
      // Reset form on success
      reset();
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : t('errors.loginFailed');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await biometricAuthService.authenticate(
        t('auth.loginWithBiometric', { type: biometricType })
      );

      if (result.success) {
        // For demo purposes, use default credentials after biometric success
        // In production, you would retrieve stored credentials securely
        await login('user@example.com', 'password123');
      } else {
        if (result.error === 'Authentication was cancelled') {
          // User cancelled, don't show error
          return;
        }
        setError(result.error || t('auth.biometricError'));
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : t('auth.biometricError');
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
            {t('auth.welcomeBack')}
          </Text>
          <Text variant="body" color={theme.colors.textSecondary} style={styles.subtitle}>
            {t('auth.signInToContinue')}
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
              autoFocus={false}
            />

            <FormInput
              control={control}
              name="password"
              label={t('auth.password')}
              placeholder={t('auth.enterPassword')}
              style={styles.input}
              secureTextEntry
              autoComplete="password"
              error={errors.password}
            />

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => router.push('/auth/forgot-password')}
              accessibilityRole="button"
              accessibilityLabel={t('auth.forgotPassword')}
            >
              <Text 
                variant="bodySmall" 
                color={theme.colors.primary} 
                weight="medium"
                style={styles.forgotPasswordText}
              >
                {t('auth.forgotPassword')}
              </Text>
            </TouchableOpacity>

            <Button
              style={styles.button}
              title={isLoading ? t('common.loading') : t('auth.signIn')}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading || !isValid}
              loading={isLoading}
              size="lg"
            />

            {/* Biometric Login Button */}
            {biometricAvailable && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text variant="bodySmall" color={theme.colors.textSecondary} style={styles.dividerText}>
                    {t('common.or')}
                  </Text>
                  <View style={styles.dividerLine} />
                </View>
                <Button
                  style={styles.biometricButton}
                  title={t('auth.loginWithBiometric', { type: biometricType })}
                  onPress={handleBiometricLogin}
                  disabled={isLoading}
                  variant="outline"
                  size="lg"
                  icon={
                    <View style={styles.biometricIcon}>
                      <Shield size={20} color={theme.colors.primary} />
                    </View>
                  }
                />
              </>
            )}
          </View>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text variant="bodySmall" color={theme.colors.textSecondary} style={styles.footerText}>
              {t('auth.dontHaveAccount')}{' '}
            </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t('auth.signUp')}
              >
                <Text 
                  variant="bodySmall" 
                  color={theme.colors.primary} 
                  weight="semibold"
                  style={styles.link}
                >
                  {t('auth.signUp')}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
