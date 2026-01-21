import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ChevronRight, FileText, Calendar, DollarSign } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useFormatting } from '@/hooks/useFormatting';
import type { Invoice } from '../types';

interface InvoiceCardProps {
  invoice: Invoice;
  onPress: (invoice: Invoice) => void;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    marginBottom: 16,
    padding: 20,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 16,
  } as const,
  headerLeft: {
    flex: 1,
  } as const,
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 8,
  } as const,
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  } as const,
  amount: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 16,
  } as const,
  detailsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as const,
  detailItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  } as const,
  detailIcon: {
    marginRight: 8,
  } as const,
  detailText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  } as const,
  chevron: {
    marginLeft: 8,
    opacity: 0.5,
  } as const,
}));

const getStatusColor = (status: Invoice['status'], theme: any) => {
  switch (status) {
    case 'paid':
      return theme.colors.success;
    case 'pending':
      return theme.colors.warning;
    case 'overdue':
      return theme.colors.error;
    case 'failed':
      return theme.colors.error;
    case 'cancelled':
      return theme.colors.textSecondary;
    default:
      return theme.colors.textSecondary;
  }
};

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

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onPress }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useStyles();
  const { formatCurrency, formatDate } = useFormatting();

  return (
    <Card variant="elevated" style={styles.card}>
      <TouchableOpacity
        onPress={() => onPress(invoice)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${t('billing.invoice')} ${invoice.invoiceNumber}`}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <FileText size={18} color={styles.invoiceNumber.color} style={{ marginRight: 8 }} />
              <Text variant="h4" weight="bold" style={styles.invoiceNumber}>
                {invoice.invoiceNumber}
              </Text>
            </View>
            <Text variant="body" style={styles.description}>
              {invoice.description}
            </Text>
            <Text variant="h3" weight="bold" style={styles.amount}>
              {formatCurrency(invoice.amount)}
            </Text>
            <Badge
              variant={getStatusVariant(invoice.status)}
              label={t(`billing.status.${invoice.status}`)}
            />
          </View>
          <ChevronRight size={20} color={styles.detailText.color} style={styles.chevron} />
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Calendar size={14} color={styles.detailText.color} style={styles.detailIcon} />
            <Text variant="caption" style={styles.detailText}>
              {t('billing.dueDate')}: {formatDate(invoice.dueDate, { format: 'short' })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

