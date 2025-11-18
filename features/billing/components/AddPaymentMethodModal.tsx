import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormInput } from '@/components/ui/FormInput';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useTranslation } from '@/hooks/useTranslation';
import { billingAPI } from '@/services/api/endpoints';
import { Building2, CreditCard, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
import type { AddPaymentMethodRequest, PaymentMethod } from '../types';

interface AddPaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingMethod?: PaymentMethod | null;
}

const paymentMethodSchema = z.object({
  type: z.enum(['credit_card', 'debit_card', 'bank_account', 'e_transfer']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  bankName: z.string().optional(),
  accountType: z.enum(['checking', 'savings']).optional(),
  setAsDefault: z.boolean().default(false),
});

const useStyles = createThemedStyles((theme) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  } as const,
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  paymentTypeContainer: {
    marginBottom: theme.spacing.md,
  } as const,
  paymentTypeLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  } as const,
  paymentTypeCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  paymentTypeCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  } as const,
  paymentTypeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  } as const,
  paymentTypeContent: {
    flex: 1,
  } as const,
  paymentTypeName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
}));

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  visible,
  onClose,
  onSuccess,
  editingMethod,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentType, setPaymentType] = useState<'credit_card' | 'debit_card' | 'bank_account' | 'e_transfer'>(
    editingMethod?.type || 'credit_card'
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useFormValidation({
    schema: paymentMethodSchema,
  });

  const setAsDefault = watch('setAsDefault');

  useEffect(() => {
    if (editingMethod && visible) {
      setPaymentType(editingMethod.type);
      setValue('type', editingMethod.type);
      // Note: We don't set sensitive data like card numbers
      if (editingMethod.bankName) setValue('bankName', editingMethod.bankName);
      if (editingMethod.accountType) setValue('accountType', editingMethod.accountType);
      setValue('setAsDefault', editingMethod.isDefault);
    } else if (visible) {
      reset();
      setPaymentType('credit_card');
      setValue('type', 'credit_card');
      setValue('setAsDefault', false);
    }
  }, [visible, editingMethod, reset, setValue]);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const request: AddPaymentMethodRequest = {
        type: paymentType,
        ...(paymentType === 'credit_card' || paymentType === 'debit_card'
          ? {
              cardNumber: data.cardNumber,
              expiryDate: data.expiryDate,
              cvv: data.cvv,
            }
          : {
              accountNumber: data.accountNumber,
              routingNumber: data.routingNumber,
              bankName: data.bankName,
              accountType: data.accountType,
            }),
        setAsDefault: data.setAsDefault || false,
      };

      if (editingMethod) {
        await billingAPI.updatePaymentMethod(editingMethod.id, {
          ...request,
          isDefault: request.setAsDefault,
        } as any);
      } else {
        await billingAPI.addPaymentMethod(request);
      }

      Alert.alert(
        t('common.success'),
        editingMethod ? t('billing.paymentMethod.updated') : t('billing.paymentMethod.added')
      );
      onSuccess();
    } catch (error) {
      Alert.alert(
        t('billing.error.title'),
        error instanceof Error ? error.message : t('billing.paymentMethod.addError')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalOverlay}>
          <Card variant="elevated" style={styles.modalContent}>
            <View style={styles.header}>
              <Text variant="h3" weight="bold" style={styles.headerTitle}>
                {editingMethod ? t('billing.paymentMethod.edit') : t('billing.addPaymentMethod')}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel={t('common.close')}
              >
                <X size={20} color={styles.headerTitle.color} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Payment Type Selection */}
              <View style={styles.paymentTypeContainer}>
                <Text variant="label" style={styles.paymentTypeLabel}>
                  {t('billing.paymentMethod.type')}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.paymentTypeCard,
                    paymentType === 'credit_card' && styles.paymentTypeCardActive,
                  ]}
                  onPress={() => {
                    setPaymentType('credit_card');
                    setValue('type', 'credit_card');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.paymentTypeIconContainer}>
                    <CreditCard size={20} color={styles.paymentTypeName.color} />
                  </View>
                  <View style={styles.paymentTypeContent}>
                    <Text variant="body" weight="semibold" style={styles.paymentTypeName}>
                      {t('billing.paymentMethod.types.creditCard')}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.paymentTypeCard,
                    paymentType === 'debit_card' && styles.paymentTypeCardActive,
                  ]}
                  onPress={() => {
                    setPaymentType('debit_card');
                    setValue('type', 'debit_card');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.paymentTypeIconContainer}>
                    <CreditCard size={20} color={styles.paymentTypeName.color} />
                  </View>
                  <View style={styles.paymentTypeContent}>
                    <Text variant="body" weight="semibold" style={styles.paymentTypeName}>
                      {t('billing.paymentMethod.types.debitCard')}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.paymentTypeCard,
                    paymentType === 'bank_account' && styles.paymentTypeCardActive,
                  ]}
                  onPress={() => {
                    setPaymentType('bank_account');
                    setValue('type', 'bank_account');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.paymentTypeIconContainer}>
                    <Building2 size={20} color={styles.paymentTypeName.color} />
                  </View>
                  <View style={styles.paymentTypeContent}>
                    <Text variant="body" weight="semibold" style={styles.paymentTypeName}>
                      {t('billing.paymentMethod.types.bankAccount')}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.paymentTypeCard,
                    paymentType === 'e_transfer' && styles.paymentTypeCardActive,
                  ]}
                  onPress={() => {
                    setPaymentType('e_transfer');
                    setValue('type', 'e_transfer');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.paymentTypeIconContainer}>
                    <Building2 size={20} color={styles.paymentTypeName.color} />
                  </View>
                  <View style={styles.paymentTypeContent}>
                    <Text variant="body" weight="semibold" style={styles.paymentTypeName}>
                      {t('billing.paymentMethod.types.eTransfer')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {paymentType === 'credit_card' || paymentType === 'debit_card' ? (
                <>
                  <FormInput
                    control={control}
                    name="cardNumber"
                    label={t('billing.paymentMethod.cardNumber')}
                    placeholder="1234 5678 9012 3456"
                    keyboardType="numeric"
                    maxLength={19}
                    error={errors.cardNumber}
                  />
                  <View style={styles.formRow}>
                    <View style={styles.formRowItem}>
                      <FormInput
                        control={control}
                        name="expiryDate"
                        label={t('billing.paymentMethod.expiryDate')}
                        placeholder="MM/YY"
                        maxLength={5}
                        error={errors.expiryDate}
                      />
                    </View>
                    <View style={styles.formRowItem}>
                      <FormInput
                        control={control}
                        name="cvv"
                        label={t('billing.paymentMethod.cvv')}
                        placeholder="123"
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                        error={errors.cvv}
                      />
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <FormInput
                    control={control}
                    name="bankName"
                    label={t('billing.paymentMethod.bankName')}
                    placeholder={t('billing.paymentMethod.bankNamePlaceholder')}
                    error={errors.bankName}
                  />
                  <FormInput
                    control={control}
                    name="accountNumber"
                    label={t('billing.paymentMethod.accountNumber')}
                    placeholder={t('billing.paymentMethod.accountNumberPlaceholder')}
                    keyboardType="numeric"
                    error={errors.accountNumber}
                  />
                  <FormInput
                    control={control}
                    name="routingNumber"
                    label={t('billing.paymentMethod.routingNumber')}
                    placeholder={t('billing.paymentMethod.routingNumberPlaceholder')}
                    keyboardType="numeric"
                    error={errors.routingNumber}
                  />
                  <FormInput
                    control={control}
                    name="accountType"
                    label={t('billing.paymentMethod.accountTypeLabel')}
                    placeholder={t('billing.paymentMethod.selectAccountType')}
                    editable={false}
                    value={watch('accountType') || ''}
                  />
                </>
              )}

              <View style={styles.actions}>
                <Button
                  title={t('common.cancel')}
                  variant="outline"
                  onPress={onClose}
                  style={styles.actionButton}
                />
                <Button
                  title={editingMethod ? t('common.update') : t('common.add')}
                  onPress={handleSubmit(onSubmit)}
                  loading={isSubmitting}
                  style={styles.actionButton}
                />
              </View>
            </ScrollView>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

