import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Linking, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Phone, Mail, MessageCircle, Clock, AlertCircle, Send } from 'lucide-react-native';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { FormInput } from '@/components/ui/FormInput';
import { useFormValidation } from '@/hooks/useFormValidation';
import { z } from 'zod';
import { emailSchema } from '@/core/utils/validation';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: theme.spacing.md,
  } as const,
  section: {
    marginBottom: theme.spacing.lg,
  } as const,
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  } as const,
  contactCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.radii.lg,
    overflow: 'hidden' as const,
  } as const,
  contactHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: theme.spacing.md,
  } as const,
  contactInfo: {
    flex: 1,
  } as const,
  contactTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  contactDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  } as const,
  contactActions: {
    flexDirection: 'row' as const,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  } as const,
  actionButton: {
    flex: 1,
  } as const,
  emergencyCard: {
    backgroundColor: theme.colors.error + '15',
    borderColor: theme.colors.error,
    borderWidth: 2,
  } as const,
  emergencyHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.md,
  } as const,
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.error + '20',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: theme.spacing.md,
  } as const,
  emergencyInfo: {
    flex: 1,
  } as const,
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.error,
    marginBottom: 4,
  } as const,
  emergencyPhone: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.error,
    marginBottom: 4,
  } as const,
  emergencyDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  } as const,
  officeHoursCard: {
    padding: theme.spacing.md,
  } as const,
  officeHoursRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.sm,
  } as const,
  officeHoursIcon: {
    marginRight: theme.spacing.sm,
  } as const,
  officeHoursText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  } as const,
  formCard: {
    padding: theme.spacing.md,
  } as const,
}));

export const ContactScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useFormValidation({
    schema: contactFormSchema,
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert(t('common.error'), 'Unable to make phone call');
    });
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert(t('common.error'), 'Unable to open email client');
    });
  };

  const handleChat = () => {
    Alert.alert(
      t('support.contact.chat'),
      'Live chat feature will be available soon. Please use phone or email for now.',
      [{ text: t('common.ok') }]
    );
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        t('common.ok'),
        t('support.contact.contactForm.success'),
        [{ text: t('common.ok'), onPress: () => reset() }]
      );
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('support.contact.contactForm.error')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      id: 'claims',
      title: t('support.contact.contactMethods.claims'),
      description: t('support.contact.contactMethods.claimsDescription'),
      icon: AlertCircle,
      phone: '1-800-LZ-CLAIMS',
      email: 'claims@lzinsurance.com',
    },
    {
      id: 'billing',
      title: t('support.contact.contactMethods.billing'),
      description: t('support.contact.contactMethods.billingDescription'),
      icon: Phone,
      phone: '1-800-LZ-BILL',
      email: 'billing@lzinsurance.com',
    },
    {
      id: 'policies',
      title: t('support.contact.contactMethods.policies'),
      description: t('support.contact.contactMethods.policiesDescription'),
      icon: Mail,
      phone: '1-800-LZ-POLICY',
      email: 'policies@lzinsurance.com',
    },
    {
      id: 'technical',
      title: t('support.contact.contactMethods.technical'),
      description: t('support.contact.contactMethods.technicalDescription'),
      icon: MessageCircle,
      phone: '1-800-LZ-TECH',
      email: 'support@lzinsurance.com',
    },
    {
      id: 'general',
      title: t('support.contact.contactMethods.general'),
      description: t('support.contact.contactMethods.generalDescription'),
      icon: Mail,
      phone: '1-800-LZ-HELP',
      email: 'info@lzinsurance.com',
    },
  ];

  return (
    <View style={styles.container}>
      <Header title={t('support.contact.title')} showNotifications={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Emergency Claims */}
            <Card variant="elevated" padding="none" style={[styles.contactCard, styles.emergencyCard]}>
              <View style={styles.emergencyHeader}>
                <View style={styles.emergencyIcon}>
                  <AlertCircle size={24} color={styles.emergencyTitle.color} />
                </View>
                <View style={styles.emergencyInfo}>
                  <Text variant="h3" weight="bold" style={styles.emergencyTitle}>
                    {t('support.contact.emergency')}
                  </Text>
                  <Text variant="h3" weight="bold" style={styles.emergencyPhone}>
                    {t('support.contact.emergencyPhone')}
                  </Text>
                  <Text variant="bodySmall" style={styles.emergencyDescription}>
                    {t('support.contact.emergencyDescription')}
                  </Text>
                </View>
              </View>
              <View style={styles.contactActions}>
                <Button
                  title={t('support.contact.call')}
                  onPress={() => handleCall('1-800-LZ-CLAIM')}
                  style={styles.actionButton}
                />
              </View>
            </Card>

            {/* Contact Methods */}
            <View style={styles.section}>
              <Text variant="h3" weight="bold" style={styles.sectionTitle}>
                {t('support.contact.subtitle')}
              </Text>
              {contactMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <Card key={method.id} variant="elevated" padding="none" style={styles.contactCard}>
                    <View style={styles.contactHeader}>
                      <View style={styles.contactIcon}>
                        <IconComponent size={20} color={styles.contactTitle.color} />
                      </View>
                      <View style={styles.contactInfo}>
                        <Text variant="body" weight="semibold" style={styles.contactTitle}>
                          {method.title}
                        </Text>
                        <Text variant="bodySmall" style={styles.contactDescription}>
                          {method.description}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.contactActions}>
                      <Button
                        title={t('support.contact.call')}
                        variant="outline"
                        onPress={() => handleCall(method.phone)}
                        style={styles.actionButton}
                      />
                      <Button
                        title={t('support.contact.emailUs')}
                        variant="outline"
                        onPress={() => handleEmail(method.email)}
                        style={styles.actionButton}
                      />
                    </View>
                  </Card>
                );
              })}
            </View>

            {/* Office Hours */}
            <Card variant="elevated" padding="md" style={styles.officeHoursCard}>
              <View style={styles.officeHoursRow}>
                <Clock size={20} color={styles.officeHoursText.color} style={styles.officeHoursIcon} />
                <Text variant="body" weight="semibold" style={styles.officeHoursText}>
                  {t('support.contact.officeHours')}
                </Text>
              </View>
              <Text variant="bodySmall" style={[styles.officeHoursText, { marginLeft: 28, marginTop: 4 }]}>
                {t('support.contact.officeHoursValue')}
              </Text>
            </Card>

            {/* Contact Form */}
            <Card variant="elevated" padding="md" style={styles.formCard}>
              <Text variant="h3" weight="bold" style={styles.sectionTitle}>
                {t('support.contact.contactForm.title')}
              </Text>
              
              <FormInput
                control={control}
                name="name"
                label={t('support.contact.contactForm.name')}
                placeholder={t('support.contact.contactForm.namePlaceholder')}
                error={errors.name}
                autoCapitalize="words"
              />
              
              <FormInput
                control={control}
                name="email"
                label={t('support.contact.contactForm.email')}
                placeholder={t('support.contact.contactForm.emailPlaceholder')}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <FormInput
                control={control}
                name="subject"
                label={t('support.contact.contactForm.subject')}
                placeholder={t('support.contact.contactForm.subjectPlaceholder')}
                error={errors.subject}
                autoCapitalize="words"
              />
              
              <View style={{ marginBottom: 16 }}>
                <FormInput
                  control={control}
                  name="message"
                  label={t('support.contact.contactForm.message')}
                  placeholder={t('support.contact.contactForm.messagePlaceholder')}
                  error={errors.message}
                  multiline
                  numberOfLines={6}
                  style={{ minHeight: 120 }}
                />
              </View>
              
              <Button
                title={isSubmitting ? t('support.contact.contactForm.sending') : t('support.contact.contactForm.send')}
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

