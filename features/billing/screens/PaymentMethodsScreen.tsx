import { Header } from '@/components/layout/Header';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import i18n from '@/core/i18n';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CreditCard } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { AddPaymentMethodModal } from '../components/AddPaymentMethodModal';
import { PaymentMethodCard } from '../components/PaymentMethodCard';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

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
  } as const,
  addButton: {
    marginBottom: 24,
  } as const,
}));

export const PaymentMethodsScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const { add } = useLocalSearchParams<{ add?: string }>();
  const { paymentMethods, loading, deletePaymentMethod, refetch } = usePaymentMethods();
  const [showAddModal, setShowAddModal] = useState(add === 'true');
  const [editingMethod, setEditingMethod] = useState<any>(null);

  const handleDelete = (method: any) => {
    Alert.alert(
      t('billing.paymentMethod.delete'),
      i18n.t('billing.paymentMethod.deleteConfirm', { method: method.label }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('billing.paymentMethod.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePaymentMethod(method.id);
              Alert.alert(t('common.success'), t('billing.paymentMethod.deleted'));
            } catch (error) {
              Alert.alert(t('billing.error.title'), t('billing.paymentMethod.deleteError'));
            }
          },
        },
      ]
    );
  };

  const handleEdit = (method: any) => {
    setEditingMethod(method);
    setShowAddModal(true);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    setEditingMethod(null);
    refetch();
  };

  if (loading && !paymentMethods.length) {
    return (
      <View style={styles.container}>
        <Header title={t('billing.managePaymentMethods')} showNotifications={true} />
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t('billing.managePaymentMethods')} showNotifications={true} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Button
          title={t('billing.addPaymentMethod')}
          onPress={() => {
            setEditingMethod(null);
            setShowAddModal(true);
          }}
          style={styles.addButton}
        />

        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          {t('billing.paymentMethods')}
        </Text>

        {paymentMethods.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title={t('billing.paymentMethodsSection.empty.title')}
            message={t('billing.paymentMethodsSection.empty.description')}
          />
        ) : (
          paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              paymentMethod={method}
              showActions={true}
              onEdit={handleEdit}
            />
          ))
        )}
      </ScrollView>

      <AddPaymentMethodModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingMethod(null);
        }}
        onSuccess={handleAddSuccess}
        editingMethod={editingMethod}
      />
    </View>
  );
};

