import { Header } from '@/components/layout/Header';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { usePaymentMethods } from '@/features/billing/hooks/usePaymentMethods';
import { useProfile } from '@/features/profile/hooks/useProfile';
import type { InsuranceType } from '@/features/quotes/types';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, View } from 'react-native';
import { InsuranceProductCard } from '../components/InsuranceProductCard';
import { useMarketplace } from '../hooks/useMarketplace';
import { InsuranceProduct } from '../types';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: theme.spacing.md,
  } as const,
  header: {
    marginBottom: theme.spacing.lg,
  } as const,
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  } as const,
  filterContainer: {
    marginBottom: theme.spacing.lg,
  } as const,
  filterScrollView: {
    paddingVertical: theme.spacing.xs,
  } as const,
  filterButton: {
    marginRight: theme.spacing.sm,
  } as const,
  productsContainer: {
    gap: theme.spacing.md,
  } as const,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.xl,
  } as const,
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.textSecondary,
  } as const,
}));

const insuranceTypes: Array<{ id: 'all' | InsuranceType; translationKey: string }> = [
  { id: 'all', translationKey: 'allInsurance' },
  { id: 'auto', translationKey: 'auto' },
  { id: 'home', translationKey: 'home' },
  { id: 'life', translationKey: 'life' },
  { id: 'health', translationKey: 'health' },
  { id: 'travel', translationKey: 'travel' },
  { id: 'motorcycle', translationKey: 'motorcycle' },
];

export const InsuranceMarketplaceScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const { products, loading, subscribeToProduct } = useMarketplace();
  const { paymentMethods } = usePaymentMethods();
  const { profile } = useProfile();
  const [selectedType, setSelectedType] = useState<'all' | InsuranceType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  const filteredProducts = selectedType === 'all' 
    ? products 
    : products.filter(product => product.type === selectedType);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh - in real app, this would fetch from API
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleSubscribe = async (product: InsuranceProduct) => {
    if (subscribingId) return; // Prevent multiple simultaneous subscriptions

    // Check if user has a payment method
    const defaultPaymentMethod = paymentMethods.find(pm => pm.isDefault);
    if (!defaultPaymentMethod) {
      Alert.alert(
        t('billing.payment.noMethod.title'),
        t('billing.payment.noMethod.message'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('billing.addPaymentMethod'),
            onPress: () => router.push('/billing/payment-methods?add=true' as any),
          },
        ]
      );
      return;
    }

    setSubscribingId(product.id);
    try {
      // Navigate to quote form with pre-filled product information
      // This ensures users go through the proper quote process with all details
      router.push({
        pathname: '/quotes/new',
        params: {
          productId: product.id,
          type: product.type,
        } as any,
      });
      setSubscribingId(null);
      return;
      
      // Alternative: Direct subscription (commented out - use quote flow instead)
      // const result = await subscribeToProduct({
      //   productId: product.id,
      //   personalInfo: {
      //     firstName: profile?.firstName || '',
      //     lastName: profile?.lastName || '',
      //     email: profile?.email || '',
      //     phone: profile?.phone || '',
      //     address: profile?.address || '',
      //   },
      //   details: {} as any,
      // });
      
      // Note: result is not available in current flow (direct subscription is commented out)
      // if (result.success) {
      //   // Create an invoice for the first payment
      //   // In a real app, this would be done by the backend
      //   // For now, we'll just show success
      //   Alert.alert(
      //     t('common.success'),
      //     t('marketplace.subscribeSuccess'),
      //     [
      //       {
      //         text: t('common.ok'),
      //         onPress: () => {
      //           // Optionally navigate to billing to see the new invoice
      //           router.push('/billing' as any);
      //         },
      //       },
      //     ]
      //   );
      // }
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('marketplace.subscribeError'),
        [{ text: t('common.ok') }]
      );
    } finally {
      setSubscribingId(null);
    }
  };

  if (loading && products.length === 0) {
    return (
      <View style={styles.container}>
        <Header title={t('marketplace.title')} showNotifications={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text variant="body" style={styles.loadingText}>
            {t('marketplace.loading')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t('marketplace.title')} showNotifications={true} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="body" style={styles.subtitle}>
              {t('marketplace.subtitle')}
            </Text>
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollView}
            >
              {insuranceTypes.map((type) => (
                <Button
                  key={type.id}
                  title={t(`marketplace.${type.translationKey}`)}
                  variant={selectedType === type.id ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => setSelectedType(type.id)}
                  style={styles.filterButton}
                />
              ))}
            </ScrollView>
          </View>

          {/* Products List */}
          {filteredProducts.length > 0 ? (
            <View style={styles.productsContainer}>
              {filteredProducts.map((product) => (
                <InsuranceProductCard
                  key={product.id}
                  product={product}
                  onSubscribe={handleSubscribe}
                  isSubscribing={subscribingId === product.id}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              icon={ShoppingBag}
              title={t('marketplace.noProducts')}
              message={t('marketplace.subtitle')}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};
