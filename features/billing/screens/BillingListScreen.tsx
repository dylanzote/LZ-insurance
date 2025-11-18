import React, { useMemo } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { CreditCard, FileText, Plus } from 'lucide-react-native';
import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'expo-router';
import { useBilling } from '../hooks/useBilling';
import { BillingSummaryCard } from '../components/BillingSummaryCard';
import { InvoiceCard } from '../components/InvoiceCard';

interface BillingListScreenProps {
  policyId?: string;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: 16,
  } as const,
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 16,
    marginTop: 8,
  } as const,
  quickActions: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 24,
  } as const,
  quickActionCard: {
    flex: 1,
    padding: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as const,
  quickActionIcon: {
    marginBottom: 12,
  } as const,
  quickActionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text,
    textAlign: 'center' as const,
  } as const,
  filterContainer: {
    flexDirection: 'row' as const,
    marginBottom: 16,
    gap: 8,
  } as const,
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  } as const,
  filterText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text,
  } as const,
  filterTextActive: {
    color: theme.colors.white,
  } as const,
}));

type FilterType = 'all' | 'pending' | 'paid' | 'overdue';

export const BillingListScreen: React.FC<BillingListScreenProps> = ({ policyId }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const { invoices, summary, loading, error, refetch } = useBilling(policyId);
  const [filter, setFilter] = React.useState<FilterType>('all');

  const filteredInvoices = useMemo(() => {
    if (filter === 'all') return invoices;
    return invoices.filter(inv => inv.status === filter);
  }, [invoices, filter]);

  const handleInvoicePress = (invoice: any) => {
    router.push(`/billing/${invoice.id}` as any);
  };

  const handleManagePaymentMethods = () => {
    router.push('/billing/payment-methods' as any);
  };

  const handleAddPaymentMethod = () => {
    router.push('/billing/payment-methods?add=true' as any);
  };

  if (loading && !invoices.length) {
    return (
      <View style={styles.container}>
        <Header title={t('billing.title')} showNotifications={true} />
        <LoadingSpinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title={t('billing.title')} showNotifications={true} />
        <EmptyState
          icon={FileText}
          title={t('billing.error.title')}
          message={error.message}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t('billing.title')} showNotifications={true} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        {summary && !policyId && (
          <BillingSummaryCard summary={summary} />
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity
            onPress={handleManagePaymentMethods}
            activeOpacity={0.7}
            style={{ flex: 1 }}
          >
            <Card variant="elevated" style={styles.quickActionCard}>
              <CreditCard size={24} color={styles.quickActionText.color} style={styles.quickActionIcon} />
              <Text style={styles.quickActionText}>
                {t('billing.managePaymentMethods')}
              </Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAddPaymentMethod}
            activeOpacity={0.7}
            style={{ flex: 1 }}
          >
            <Card variant="elevated" style={styles.quickActionCard}>
              <Plus size={24} color={styles.quickActionText.color} style={styles.quickActionIcon} />
              <Text style={styles.quickActionText}>
                {t('billing.addPaymentMethod')}
              </Text>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          {(['all', 'pending', 'paid', 'overdue'] as FilterType[]).map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[styles.filterChip, filter === filterType && styles.filterChipActive]}
              onPress={() => setFilter(filterType)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, filter === filterType && styles.filterTextActive]}>
                {t(`billing.filters.${filterType}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          {t('billing.invoices')}
        </Text>

        {filteredInvoices.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t('billing.empty.title')}
            message={t('billing.empty.description')}
          />
        ) : (
          filteredInvoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onPress={handleInvoicePress}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

