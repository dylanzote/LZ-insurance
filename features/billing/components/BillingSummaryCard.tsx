import React from 'react';
import { View } from 'react-native';
import { DollarSign, Calendar, AlertCircle, CheckCircle } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import type { BillingSummary } from '../types';

interface BillingSummaryCardProps {
  summary: BillingSummary;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    marginBottom: 24,
    padding: 24,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 16,
  } as const,
  title: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.primaryDark,
    marginBottom: 16,
  } as const,
  totalDue: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: theme.colors.primaryDark,
    marginBottom: 8,
    lineHeight: 48,
  } as const,
  subtitle: {
    fontSize: 14,
    color: theme.colors.primaryDark,
    opacity: 0.8,
    marginBottom: 24,
  } as const,
  statsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.primaryDark + '20',
  } as const,
  statItem: {
    flex: 1,
    alignItems: 'flex-start' as const,
  } as const,
  statLabel: {
    fontSize: 12,
    color: theme.colors.primaryDark,
    opacity: 0.7,
    marginBottom: 4,
  } as const,
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.primaryDark,
  } as const,
  nextPaymentRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.primaryDark + '20',
  } as const,
  nextPaymentIcon: {
    marginRight: 12,
  } as const,
  nextPaymentInfo: {
    flex: 1,
  } as const,
  nextPaymentLabel: {
    fontSize: 12,
    color: theme.colors.primaryDark,
    opacity: 0.7,
    marginBottom: 4,
  } as const,
  nextPaymentValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.primaryDark,
  } as const,
}));

export const BillingSummaryCard: React.FC<BillingSummaryCardProps> = ({ summary }) => {
  const styles = useStyles();
  const { t, locale } = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-CA' : 'en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const formatLocale = locale === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(formatLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <Text variant="label" style={styles.title}>
        {t('billing.summary.title')}
      </Text>
      <Text variant="h1" weight="bold" style={styles.totalDue}>
        {formatCurrency(summary.totalDue)}
      </Text>
      <Text variant="body" style={styles.subtitle}>
        {t('billing.summary.totalDue')}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text variant="caption" style={styles.statLabel}>
            {t('billing.summary.totalPaid')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckCircle size={16} color={styles.statValue.color} style={{ marginRight: 4 }} />
            <Text variant="h4" weight="bold" style={styles.statValue}>
              {formatCurrency(summary.totalPaid)}
            </Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <Text variant="caption" style={styles.statLabel}>
            {t('billing.summary.overdue')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AlertCircle size={16} color={styles.statValue.color} style={{ marginRight: 4 }} />
            <Text variant="h4" weight="bold" style={styles.statValue}>
              {formatCurrency(summary.overdueAmount)}
            </Text>
          </View>
        </View>
      </View>

      {summary.nextPaymentDate && summary.nextPaymentAmount && (
        <View style={styles.nextPaymentRow}>
          <Calendar size={20} color={styles.nextPaymentValue.color} style={styles.nextPaymentIcon} />
          <View style={styles.nextPaymentInfo}>
            <Text variant="caption" style={styles.nextPaymentLabel}>
              {t('billing.summary.nextPayment')}
            </Text>
            <Text variant="body" weight="semibold" style={styles.nextPaymentValue}>
              {formatCurrency(summary.nextPaymentAmount)} {t('billing.on')} {formatDate(summary.nextPaymentDate)}
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
};

