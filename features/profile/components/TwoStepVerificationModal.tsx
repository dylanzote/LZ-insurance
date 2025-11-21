import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { profileAPI } from '@/services/api/endpoints';
import { CheckCircle2, Mail, Phone, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

interface TwoStepVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  enabled: boolean;
  method: 'sms' | 'email' | null;
  onToggle: (enabled: boolean, method: 'sms' | 'email' | null) => void;
}

const useStyles = createThemedStyles((theme) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  } as const,
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  headerTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: theme.colors.text,
  } as const,
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  content: {
    padding: 20,
  } as const,
  description: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  } as const,
  methodContainer: {
    marginBottom: 20,
  } as const,
  methodTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 12,
  } as const,
  methodCard: {
    marginBottom: 12,
    overflow: 'hidden' as const,
  } as const,
  methodOption: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 18,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  methodOptionLast: {
    borderBottomWidth: 0,
  } as const,
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  } as const,
  methodContent: {
    flex: 1,
  } as const,
  methodName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  methodDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  } as const,
  codeContainer: {
    marginTop: 24,
    marginBottom: 20,
  } as const,
  codeInputContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: 16,
  } as const,
  codeInput: {
    width: 50,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    textAlign: 'center' as const,
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.text,
  } as const,
  codeInputFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  } as const,
  codeInputFilled: {
    borderColor: theme.colors.success,
    backgroundColor: '#dcfce7',
  } as const,
  resendContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 16,
  } as const,
  resendText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 8,
  } as const,
  resendButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  } as const,
  resendButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.primary,
  } as const,
  statusCard: {
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  statusIcon: {
    marginRight: 12,
  } as const,
  statusContent: {
    flex: 1,
  } as const,
  statusTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  statusDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  } as const,
  actions: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 8,
  } as const,
  actionButton: {
    flex: 1,
  } as const,
}));

export const TwoStepVerificationModal: React.FC<TwoStepVerificationModalProps> = ({
  visible,
  onClose,
  enabled,
  method,
  onToggle,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email' | null>(method);
  const [step, setStep] = useState<'select' | 'verify' | 'success'>('select');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const codeInputRefs = React.useRef<(TextInput | null)[]>([]);

  React.useEffect(() => {
    if (visible && enabled) {
      setStep('select');
      setSelectedMethod(method);
    } else if (visible && !enabled) {
      setStep('select');
      setSelectedMethod(null);
    }
  }, [visible, enabled, method]);

  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleMethodSelect = async (methodType: 'sms' | 'email') => {
    setSelectedMethod(methodType);
    setIsLoading(true);
    try {
      // Send verification code
      await profileAPI.sendVerificationCode(methodType);
      setStep('verify');
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('profile.verificationCodeError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleCodeKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join('');
    if (codeToVerify.length !== 6) {
      Alert.alert(
        t('common.error'),
        t('profile.invalidCode')
      );
      return;
    }

    setIsLoading(true);
    try {
      await profileAPI.verifyTwoStepCode(codeToVerify, selectedMethod!);
      onToggle(true, selectedMethod!);
      setStep('success');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('profile.verificationFailed')
      );
      setCode(['', '', '', '', '', '']);
      codeInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    Alert.alert(
      t('profile.disableTwoStep'),
      t('profile.disableTwoStepConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.disable'),
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await profileAPI.disableTwoStepVerification();
              onToggle(false, null);
              handleClose();
            } catch (error) {
              Alert.alert(
                t('common.error'),
                t('profile.disableError')
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !selectedMethod) return;
    
    setIsResending(true);
    try {
      await profileAPI.sendVerificationCode(selectedMethod);
      setResendCooldown(60);
      Alert.alert(
        t('common.success'),
        t('profile.codeResent')
      );
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('profile.resendError')
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    setStep('select');
    setCode(['', '', '', '', '', '']);
    setSelectedMethod(method);
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
          <Card variant="elevated" style={styles.modalContent}>
            <View style={styles.header}>
              <Text variant="h3" weight="bold" style={styles.headerTitle}>
                {t('profile.twoStepVerification')}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <X size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {step === 'select' && (
                <>
                  <Text style={styles.description}>
                    {enabled
                      ? t('profile.twoStepEnabledInfo', { method: method === 'sms' ? 'SMS' : 'Email' })
                      : t('profile.twoStepInfo')
                    }
                  </Text>

                  {enabled ? (
                    <Card variant="elevated" style={styles.statusCard}>
                      <View style={styles.statusIcon}>
                        <CheckCircle2 size={24} color={theme.colors.success} />
                      </View>
                      <View style={styles.statusContent}>
                        <Text style={styles.statusTitle}>
                          {t('profile.twoStepActive')}
                        </Text>
                        <Text style={styles.statusDescription}>
                          {t('profile.twoStepActiveDescription', { method: method === 'sms' ? 'SMS' : 'Email' })}
                        </Text>
                      </View>
                    </Card>
                  ) : (
                    <View style={styles.methodContainer}>
                      <Text style={styles.methodTitle}>
                        {t('profile.selectMethod')}
                      </Text>
                      
                      <Card variant="elevated" style={styles.methodCard}>
                        <TouchableOpacity
                          style={styles.methodOption}
                          onPress={() => handleMethodSelect('sms')}
                          activeOpacity={0.7}
                          disabled={isLoading}
                        >
                          <View style={styles.methodIcon}>
                            <Phone size={20} color={theme.colors.primary} />
                          </View>
                          <View style={styles.methodContent}>
                            <Text style={styles.methodName}>
                              {t('profile.smsVerification')}
                            </Text>
                            <Text style={styles.methodDescription}>
                              {t('profile.smsVerificationDescription')}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.methodOption, styles.methodOptionLast]}
                          onPress={() => handleMethodSelect('email')}
                          activeOpacity={0.7}
                          disabled={isLoading}
                        >
                          <View style={styles.methodIcon}>
                            <Mail size={20} color={theme.colors.primary} />
                          </View>
                          <View style={styles.methodContent}>
                            <Text style={styles.methodName}>
                              {t('profile.emailVerification')}
                            </Text>
                            <Text style={styles.methodDescription}>
                              {t('profile.emailVerificationDescription')}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </Card>
                    </View>
                  )}

                  <View style={styles.actions}>
                    {enabled && (
                      <Button
                        title={t('profile.disable')}
                        variant="outline"
                        onPress={handleDisable}
                        style={styles.actionButton}
                        disabled={isLoading}
                      />
                    )}
                    <Button
                      title={t('common.close')}
                      onPress={handleClose}
                      style={styles.actionButton}
                      disabled={isLoading}
                    />
                  </View>
                </>
              )}

              {step === 'verify' && (
                <>
                  <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <View style={[styles.methodIcon, { marginBottom: 16 }]}>
                      {selectedMethod === 'sms' ? (
                        <Phone size={24} color={theme.colors.primary} />
                      ) : (
                        <Mail size={24} color={theme.colors.primary} />
                      )}
                    </View>
                    <Text variant="h3" weight="bold" style={{ marginBottom: 8, textAlign: 'center' }}>
                      {t('profile.enterVerificationCode')}
                    </Text>
                    <Text style={styles.description}>
                      {t('profile.verificationCodeSent', { 
                        method: selectedMethod === 'sms' ? t('profile.sms') : t('profile.email'),
                        destination: selectedMethod === 'sms' ? 'your phone' : 'your email'
                      })}
                    </Text>
                  </View>

                  <View style={styles.codeContainer}>
                    <View style={styles.codeInputContainer}>
                      {code.map((digit, index) => (
                        <TextInput
                          key={index}
                          ref={(ref) => { codeInputRefs.current[index] = ref; }}
                          style={[
                            styles.codeInput,
                            digit && styles.codeInputFilled,
                          ]}
                          value={digit}
                          onChangeText={(value) => handleCodeChange(index, value)}
                          onKeyPress={({ nativeEvent }) => handleCodeKeyPress(index, nativeEvent.key)}
                          keyboardType="number-pad"
                          maxLength={1}
                          selectTextOnFocus
                          autoFocus={index === 0}
                        />
                      ))}
                    </View>

                    <View style={styles.resendContainer}>
                      <Text style={styles.resendText}>
                        {t('profile.didntReceiveCode')}
                      </Text>
                      {resendCooldown > 0 ? (
                        <Text style={styles.resendButtonText}>
                          {t('profile.resendIn', { seconds: resendCooldown })}
                        </Text>
                      ) : (
                        <TouchableOpacity
                          style={styles.resendButton}
                          onPress={handleResendCode}
                          disabled={isResending}
                        >
                          <Text style={styles.resendButtonText}>
                            {t('profile.resendCode')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  <View style={styles.actions}>
                    <Button
                      title={t('common.cancel')}
                      variant="outline"
                      onPress={handleClose}
                      style={styles.actionButton}
                      disabled={isLoading}
                    />
                    <Button
                      title={t('profile.verify')}
                      onPress={() => handleVerifyCode()}
                      style={styles.actionButton}
                      loading={isLoading}
                      disabled={isLoading || code.some(d => !d)}
                    />
                  </View>
                </>
              )}

              {step === 'success' && (
                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                  <CheckCircle2 size={64} color={theme.colors.success} />
                  <Text variant="h3" weight="bold" style={{ marginTop: 24, marginBottom: 12, textAlign: 'center' }}>
                    {t('profile.twoStepEnabled')}
                  </Text>
                  <Text style={styles.description}>
                    {t('profile.twoStepEnabledSuccess', { method: selectedMethod === 'sms' ? 'SMS' : 'Email' })}
                  </Text>
                </View>
              )}
            </ScrollView>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

