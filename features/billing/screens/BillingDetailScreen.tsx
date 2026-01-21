import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { FileText, Calendar, DollarSign, CheckCircle, CreditCard } from 'lucide-react-native';
import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useFormatting } from '@/hooks/useFormatting';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { billingAPI } from '@/services/api/endpoints';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import type { Invoice } from '../types';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: 16,
  } as const,
  headerCard: {
    padding: 24,
    marginBottom: 24,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 16,
  } as const,
  invoiceNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.primaryDark,
    marginBottom: 8,
  } as const,
  amount: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: theme.colors.primaryDark,
    marginBottom: 16,
  } as const,
  infoCard: {
    padding: 20,
    marginBottom: 16,
  } as const,
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  infoRowLast: {
    borderBottomWidth: 0,
  } as const,
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  } as const,
  infoValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'right' as const,
  } as const,
  lineItemsCard: {
    padding: 20,
    marginBottom: 16,
  } as const,
  lineItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  lineItemLast: {
    borderBottomWidth: 0,
  } as const,
  lineItemDescription: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  } as const,
  lineItemAmount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
  totalRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
  } as const,
  totalLabel: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
  } as const,
  totalAmount: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.primary,
  } as const,
  payButton: {
    marginTop: 24,
  } as const,
}));

export const BillingDetailScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { paymentMethods } = usePaymentMethods();

  React.useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await billingAPI.getInvoiceById(id);
        setInvoice(response.data);
      } catch (error) {
        Alert.alert(t('billing.error.title'), t('billing.error.loadInvoice'));
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const { formatCurrency, formatDate } = useFormatting();

  const handlePay = async () => {
    if (!invoice) return;

    const defaultPaymentMethod = paymentMethods.find(pm => pm.isDefault);
    if (!defaultPaymentMethod) {
      Alert.alert(
        t('billing.payment.noMethod.title'),
        t('billing.payment.noMethod.message'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('billing.addPaymentMethod'),
            onPress: () => router.push('/(app)/billing/payment-methods?add=true' as any),
          },
        ]
      );
      return;
    }

    try {
      setProcessing(true);
      await billingAPI.processPayment({
        invoiceId: invoice.id,
        paymentMethodId: defaultPaymentMethod.id,
        amount: invoice.amount,
      });
      Alert.alert(t('billing.payment.success.title'), t('billing.payment.success.message'), [
        { text: t('common.ok'), onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert(t('billing.payment.error.title'), t('billing.payment.error.message'));
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !invoice) {
    return (
      <View style={styles.container}>
        <Header title={t('billing.invoiceDetails')} showNotifications={true} />
        <LoadingSpinner />
      </View>
    );
  }

  const getStatusVariant = (status: Invoice['status']): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('billing.invoiceDetails')} showNotifications={true} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Card variant="elevated" style={styles.headerCard}>
          <Text variant="h2" weight="bold" style={styles.invoiceNumber}>
            {invoice.invoiceNumber}
          </Text>
          <Text variant="h1" weight="bold" style={styles.amount}>
            {formatCurrency(invoice.amount)}
          </Text>
          <Badge
            variant={getStatusVariant(invoice.status)}
            label={t(`billing.status.${invoice.status}`)}
          />
        </Card>

        <Card variant="elevated" style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <FileText size={16} color={styles.infoLabel.color} style={{ marginRight: 8 }} />
              <Text variant="body" style={styles.infoLabel}>
                {t('billing.description')}
              </Text>
            </View>
            <Text variant="body" weight="semibold" style={styles.infoValue}>
              {invoice.description}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Calendar size={16} color={styles.infoLabel.color} style={{ marginRight: 8 }} />
              <Text variant="body" style={styles.infoLabel}>
                {t('billing.dueDate')}
              </Text>
            </View>
            <Text variant="body" weight="semibold" style={styles.infoValue}>
              {formatDate(invoice.dueDate)}
            </Text>
          </View>
          {invoice.paidDate && (
            <View style={styles.infoRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <CheckCircle size={16} color={styles.infoLabel.color} style={{ marginRight: 8 }} />
                <Text variant="body" style={styles.infoLabel}>
                  {t('billing.paidDate')}
                </Text>
              </View>
              <Text variant="body" weight="semibold" style={styles.infoValue}>
                {formatDate(invoice.paidDate)}
              </Text>
            </View>
          )}
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <DollarSign size={16} color={styles.infoLabel.color} style={{ marginRight: 8 }} />
              <Text variant="body" style={styles.infoLabel}>
                {t('billing.billingPeriod')}
              </Text>
            </View>
            <Text variant="body" weight="semibold" style={styles.infoValue}>
              {formatDate(invoice.billingPeriod.start)} - {formatDate(invoice.billingPeriod.end)}
            </Text>
          </View>
        </Card>

        <Card variant="elevated" style={styles.lineItemsCard}>
          <Text variant="h4" weight="bold" style={{ marginBottom: 16 }}>
            {t('billing.lineItems')}
          </Text>
          {invoice.lineItems.map((item, index) => (
            <View
              key={index}
              style={[styles.lineItem, index === invoice.lineItems.length - 1 && styles.lineItemLast]}
            >
              <Text variant="body" style={styles.lineItemDescription}>
                {item.description}
                {item.quantity && ` × ${item.quantity}`}
              </Text>
              <Text variant="body" weight="semibold" style={styles.lineItemAmount}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text variant="h4" weight="bold" style={styles.totalLabel}>
              {t('billing.total')}
            </Text>
            <Text variant="h3" weight="bold" style={styles.totalAmount}>
              {formatCurrency(invoice.amount)}
            </Text>
          </View>
        </Card>

        {invoice.status !== 'paid' && (
          <Button
            title={t('billing.payNow')}
            onPress={handlePay}
            loading={processing}
            style={styles.payButton}
            icon={<CreditCard size={20} />}
          />
        )}
      </ScrollView>
    </View>
  );
};

