import React, { useState, useMemo } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { usePolicies } from '../hooks/usePolicies';
import { PolicyListItem } from '../components/PolicyListItem';
import { Policy } from '../types';
import { useTranslation } from '@/hooks/useTranslation';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { ChevronRight, Settings, CreditCard, TrendingUp } from 'lucide-react-native';
import i18n from '@/core/i18n';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: 16,
  } as const,
  sectionHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 4,
  } as const,
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  } as const,
  manageSection: {
    marginTop: 24,
    marginBottom: 16,
  } as const,
  manageSectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 16,
    paddingHorizontal: 16,
  } as const,
  manageItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: 20,
    marginBottom: 16,
  } as const,
  manageItemLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  } as const,
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  } as const,
  manageItemContent: {
    flex: 1,
  } as const,
  manageItemTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  manageItemDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  } as const,
  infoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    padding: 20,
  } as const,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  errorText: {
    color: theme.colors.error,
    textAlign: 'center' as const,
    marginBottom: 16,
  } as const,
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 40,
  } as const,
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  } as const,
}));

interface PoliciesListScreenProps {
  typeFilter?: string;
}

export const PoliciesListScreen: React.FC<PoliciesListScreenProps> = ({ typeFilter }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const { policies, loading, error, refetch } = usePolicies();
  const [refreshing, setRefreshing] = useState(false);

  // Filter policies by type if typeFilter is provided
  const filteredPolicies = useMemo(() => {
    if (!typeFilter) return policies;
    return policies.filter(p => p.type.toLowerCase() === typeFilter.toLowerCase());
  }, [policies, typeFilter]);

  // Group policies by type
  const groupedPolicies = useMemo(() => {
    const groups: Record<string, Policy[]> = {};
    filteredPolicies.forEach(policy => {
      const type = policy.type.toUpperCase();
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(policy);
    });
    return groups;
  }, [filteredPolicies]);

  const handlePolicyPress = (policy: Policy) => {
    router.push(`/policies/${policy.id}` as any);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleManagePolicies = () => {
    router.push('/(app)/policies/viewPolicies' as any);
  };

  const handleManageBilling = () => {
    router.push('/(app)/billing' as any);
  };

  // Get title based on type filter
  const getTitle = () => {
    if (typeFilter) {
      const typeName = t(`policies.types.${typeFilter.toLowerCase()}`) || 
        typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1).toLowerCase();
      return `${typeName} ${t('policies.title')}`;
    }
    return t('policies.title');
  };

  const renderSection = (type: string, policies: Policy[]) => {
    const typeLabel = type === 'AUTO' ? t('policies.types.auto') : 
                      type === 'HOME' ? t('policies.types.home') : 
                      type;
    
    return (
      <View key={type}>
        <View style={styles.sectionHeader}>
          <Text variant="caption" weight="bold" style={styles.sectionTitle}>
            {typeLabel}
          </Text>
        </View>
        {policies.map((policy) => (
          <PolicyListItem
            key={policy.id}
            policy={policy}
            onPress={handlePolicyPress}
          />
        ))}
      </View>
    );
  };

  if (loading && policies.length === 0) {
    return (
      <View style={styles.container}>
        <Header title={getTitle()} showNotifications={true} />
        <LoadingSpinner message={t('common.loading')} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title={getTitle()} showNotifications={true} />
        <View style={[styles.loadingContainer, { padding: 20 }]}>
          <Text variant="body" style={styles.errorText}>{error}</Text>
          <Button 
            title={t('common.retry')} 
            onPress={refetch} 
            style={{ marginTop: 16 }} 
          />
        </View>
      </View>
    );
  }

  const sections = Object.entries(groupedPolicies);

  return (
    <View style={styles.container}>
      <Header title={getTitle()} showNotifications={true} />
      <FlatList
        data={sections}
        keyExtractor={([type]) => type}
        renderItem={({ item: [type, policies] }) => renderSection(type, policies)}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="body" style={styles.emptyText}>
              {typeFilter 
                ? i18n.t('policies.empty.filtered', { 
                    type: t(`policies.types.${typeFilter.toLowerCase()}`) || typeFilter 
                  })
                : t('policies.empty.all')}
            </Text>
          </View>
        }
        ListFooterComponent={
          <>
            {filteredPolicies.length > 0 && (
              <>
                <View style={styles.manageSection}>
                  <Text variant="caption" weight="bold" style={styles.manageSectionTitle}>
                    {t('policies.managePolicies')} & {t('policies.manageBilling').split(' ')[0]}
                  </Text>
                  <Card variant="elevated" padding="none" style={{ marginBottom: 16 }}>
                    <TouchableOpacity
                      style={styles.manageItem}
                      onPress={handleManagePolicies}
                      activeOpacity={0.7}
                    >
                      <View style={styles.manageItemLeft}>
                        <View style={styles.iconWrapper}>
                          <Settings size={28} color={styles.manageItemTitle.color} />
                        </View>
                        <View style={styles.manageItemContent}>
                          <Text variant="body" weight="semibold" style={styles.manageItemTitle}>
                            {t('policies.managePolicies')}
                          </Text>
                          <Text variant="bodySmall" style={styles.manageItemDescription}>
                            {t('policies.managePoliciesDescription')}
                          </Text>
                        </View>
                      </View>
                      <ChevronRight size={20} color={styles.manageItemDescription.color} style={{ opacity: 0.5 }} />
                    </TouchableOpacity>
                  </Card>
                  <Card variant="elevated" padding="none" style={{ marginBottom: 16 }}>
                    <TouchableOpacity
                      style={styles.manageItem}
                      onPress={handleManageBilling}
                      activeOpacity={0.7}
                    >
                      <View style={styles.manageItemLeft}>
                        <View style={styles.iconWrapper}>
                          <CreditCard size={28} color={styles.manageItemTitle.color} />
                        </View>
                        <View style={styles.manageItemContent}>
                          <Text variant="body" weight="semibold" style={styles.manageItemTitle}>
                            {t('policies.manageBilling')}
                          </Text>
                          <Text variant="bodySmall" style={styles.manageItemDescription}>
                            {t('policies.manageBillingDescription')}
                          </Text>
                        </View>
                      </View>
                      <ChevronRight size={20} color={styles.manageItemDescription.color} style={{ opacity: 0.5 }} />
                    </TouchableOpacity>
                  </Card>
                </View>
                <Card variant="elevated" padding="md" style={styles.infoCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <TrendingUp color={styles.manageItemDescription.color} size={20} style={{ marginRight: 12, marginTop: 2 }} />
                    <Text variant="bodySmall" style={styles.manageItemDescription}>
                      {t('policies.newPolicyInfo')}
                    </Text>
                  </View>
                </Card>
              </>
            )}
          </>
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};
