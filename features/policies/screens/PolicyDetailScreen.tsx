import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FileText, AlertCircle, ChevronRight } from 'lucide-react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { usePolicies } from '../hooks/usePolicies';
import { useTheme } from '@/core/theme/useTheme';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: 16,
  } as const,
  headerCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    overflow: 'hidden' as const,
    backgroundColor: theme.colors.primary,
  } as const,
  headerContent: {
    padding: 24,
  } as const,
  policySummary: {
    marginBottom: 16,
  } as const,
  policyName: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 28,
  } as const,
  policyNumber: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  } as const,
  policyStatus: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  } as const,
  startClaimButton: {
    marginTop: 16,
    alignItems: 'center' as const,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  } as const,
  startClaimIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
    position: 'relative' as const,
  } as const,
  startClaimText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.colors.primary,
    textAlign: 'center' as const,
  } as const,
  tabsContainer: {
    flexDirection: 'row' as const,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center' as const,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginHorizontal: 4,
  } as const,
  tabActive: {
    borderBottomColor: theme.colors.primary,
  } as const,
  tabText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.textSecondary,
  } as const,
  tabTextActive: {
    fontWeight: '600' as const,
    color: theme.colors.primary,
  } as const,
  sectionHeader: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 4,
  } as const,
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  } as const,
  infoCard: {
    marginBottom: 16,
  } as const,
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 16,
    paddingHorizontal: 20,
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
    color: theme.colors.text,
    fontWeight: '600' as const,
    flex: 1,
    textAlign: 'right' as const,
  } as const,
  coverageRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  coverageLeft: {
    flex: 1,
  } as const,
  coverageLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  coverageSubLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500' as const,
  } as const,
  coverageValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: theme.colors.text,
    textAlign: 'right' as const,
    marginLeft: 16,
  } as const,
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 40,
  } as const,
  notFoundText: {
    marginBottom: 24,
  } as const,
}));

type TabType = 'coverage' | 'vehicle' | 'details';

export const PolicyDetailScreen: React.FC = () => {
  const styles = useStyles();
  const { t, locale } = useTranslation();
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { policies, loading, refetch } = usePolicies();
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('coverage');

  // Find the policy by ID
  const policy = policies.find(p => p.id === id);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatLocale = locale === 'fr' ? 'fr-FR' : 'en-US';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(formatLocale, {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(formatLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(formatLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleStartClaim = () => {
    router.push('/claims/new' as any);
  };

  const getPolicyDisplayName = () => {
    if (policy?.vehicleDetails) {
      const { make, model, year } = policy.vehicleDetails;
      return `${make} ${model} ${year}`;
    }
    if (policy?.propertyDetails) {
      const { address, city, state, zipCode } = policy.propertyDetails;
      return [address, city, state, zipCode].filter(Boolean).join(', ');
    }
    return policy?.vehicle || policy?.property || t(`policies.types.${policy?.type}`);
  };

  if (loading && !policy) {
    return (
      <View style={styles.container}>
        <Header title={t('policies.details')} showNotifications={true} />
        <LoadingSpinner message={t('common.loading')} />
      </View>
    );
  }

  if (!policy) {
    return (
      <View style={styles.container}>
        <Header title={t('policies.details')} showNotifications={true} />
        <View style={styles.notFoundContainer}>
          <Text variant="h2" style={styles.notFoundText}>
            {t('policies.notFound')}
          </Text>
          <Button
            title={t('policies.backToPolicies')}
            onPress={() => router.back()}
          />
        </View>
      </View>
    );
  }

  const renderCoverageTab = () => {
    if (!policy.coverageDetails || Object.keys(policy.coverageDetails).length === 0) {
      return (
        <View style={styles.content}>
          <Card variant="elevated" padding="lg">
            <Text variant="body" style={{ textAlign: 'center', color: styles.infoLabel.color }}>
              {t('policies.coverageDetails')} not available
            </Text>
          </Card>
        </View>
      );
    }

    const coverageEntries = Object.entries(policy.coverageDetails).filter(([_, value]) => value !== undefined);
    const lastIndex = coverageEntries.length - 1;

    return (
      <View>
        {policy.type === 'auto' && policy.vehicleDetails && (
          <View style={styles.sectionHeader}>
            <Text variant="caption" weight="bold" style={styles.sectionHeaderText}>
              {t('policies.coverageForVehicle')}
            </Text>
          </View>
        )}
        <Card variant="elevated" padding="none" style={styles.infoCard}>
          {coverageEntries.map(([key, value], index) => {
            // Determine if it's a limit, deductible, or included
            const isLimit = ['liability', 'propertyDamage', 'uninsuredMotorist', 'dwelling', 'personalProperty', 'familyProtection'].includes(key);
            const isDeductible = ['collision', 'comprehensive', 'directCompensation'].includes(key);
            const isIncluded = value === 0 && ['accidentBenefits', 'uninsuredMotorist', 'lienholderProtection'].includes(key);

            let subLabel = '';
            if (isLimit) subLabel = t('policies.limit');
            else if (isDeductible) subLabel = t('policies.deductible');
            else if (isIncluded) subLabel = t('policies.included');

            return (
              <TouchableOpacity
                key={key}
                style={[styles.coverageRow, index === lastIndex && styles.infoRowLast]}
                activeOpacity={0.7}
              >
                <View style={styles.coverageLeft}>
                  <Text variant="body" weight="semibold" style={styles.coverageLabel}>
                    {t(`policies.coverageTypes.${key}`) || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Text>
                  {subLabel && (
                    <Text variant="caption" style={styles.coverageSubLabel}>
                      {subLabel}
                    </Text>
                  )}
                </View>
                <Text variant="body" weight="semibold" style={styles.coverageValue}>
                  {isIncluded ? t('policies.included') : formatCurrency(value as number)}
                </Text>
                <ChevronRight size={18} color={styles.infoLabel.color} style={{ marginLeft: 8, opacity: 0.4 }} />
              </TouchableOpacity>
            );
          })}
        </Card>
      </View>
    );
  };

  const renderVehicleTab = () => {
    if (!policy.vehicleDetails) {
      return (
        <View style={styles.content}>
          <Card variant="elevated" padding="lg">
            <Text variant="body" style={{ textAlign: 'center', color: styles.infoLabel.color }}>
              {t('policies.vehicle')} not available
            </Text>
          </Card>
        </View>
      );
    }

    const vehicleInfo = [
      { label: t('policies.vinNumber'), value: policy.vehicleDetails.vin || 'N/A' },
      ...(policy.termPremium ? [{ label: t('policies.termPremium'), value: formatCurrency(policy.termPremium) }] : []),
    ];

    return (
      <View>
        <Card variant="elevated" padding="none" style={styles.infoCard}>
          {vehicleInfo.map((info, index) => (
            <View key={index} style={[styles.infoRow, index === vehicleInfo.length - 1 && styles.infoRowLast]}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                {info.label}
              </Text>
              <Text variant="bodySmall" style={styles.infoValue}>
                {info.value}
              </Text>
            </View>
          ))}
        </Card>
        {policy.drivers && policy.drivers.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text variant="caption" weight="bold" style={styles.sectionHeaderText}>
                {t('policies.drivers')}
              </Text>
            </View>
            <Card variant="elevated" padding="none" style={styles.infoCard}>
              {policy.drivers.map((driver, index) => (
                <View key={index} style={[styles.infoRow, index === policy.drivers!.length - 1 && styles.infoRowLast]}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    {driver.type === 'principal' ? t('policies.principalDriver') : `Driver ${index + 1}`}
                  </Text>
                  <Text variant="bodySmall" style={styles.infoValue}>
                    {driver.name}
                  </Text>
                </View>
              ))}
            </Card>
          </>
        )}
      </View>
    );
  };

  const renderDetailsTab = () => {
    const details = [
      { label: t('policies.policyNumber'), value: policy.id },
      { label: t('policies.coverageTerm'), value: `${formatDate(policy.startDate)} to ${formatDate(policy.endDate)}` },
      ...(policy.termPremium ? [{ label: t('policies.termPremium'), value: formatCurrency(policy.termPremium) }] : []),
      ...(policy.insurer ? [{ label: t('policies.insurer'), value: policy.insurer }] : []),
      ...(policy.agency ? [{ label: t('policies.agency'), value: policy.agency }] : []),
      { label: t('policies.status'), value: t(`policies.${policy.status}`) },
      ...(policy.nextPayment ? [{ label: t('policies.nextPayment'), value: formatCurrency(policy.nextPayment) }] : []),
      ...(policy.paymentDate ? [{ label: t('policies.paymentDate'), value: formatShortDate(policy.paymentDate) }] : []),
    ];

    return (
      <Card variant="elevated" padding="none" style={styles.infoCard}>
        {details.map((detail, index) => (
          <View key={index} style={[styles.infoRow, index === details.length - 1 && styles.infoRowLast]}>
            <Text variant="bodySmall" style={styles.infoLabel}>
              {detail.label}
            </Text>
            <Text variant="bodySmall" style={styles.infoValue}>
              {detail.value}
            </Text>
          </View>
        ))}
      </Card>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'coverage':
        return renderCoverageTab();
      case 'vehicle':
        return renderVehicleTab();
      case 'details':
        return renderDetailsTab();
      default:
        return renderCoverageTab();
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('policies.details')} showNotifications={true} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Policy Summary Header */}
        <Card variant="elevated" padding="none" style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.policySummary}>
              <Text variant="h2" weight="bold" style={styles.policyName}>
                {getPolicyDisplayName()}
              </Text>
              <Text variant="bodySmall" style={styles.policyNumber}>
                {t('policies.policyNumber')} {policy.id}
              </Text>
              <Text variant="bodySmall" style={styles.policyStatus}>
                {t('policies.active')} until {formatDate(policy.endDate)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.startClaimButton}
              onPress={handleStartClaim}
              activeOpacity={0.8}
            >
              <View style={styles.startClaimIcon}>
                <FileText size={24} color={styles.headerCard.backgroundColor} />
                <View style={{ position: 'absolute', top: 2, right: 2 }}>
                  <AlertCircle size={14} color={styles.headerCard.backgroundColor} />
                </View>
              </View>
              <Text variant="caption" weight="semibold" style={styles.startClaimText}>
                {t('policies.startClaim')}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'coverage' && styles.tabActive]}
            onPress={() => setActiveTab('coverage')}
            activeOpacity={0.7}
          >
            <Text variant="bodySmall" weight={activeTab === 'coverage' ? 'semibold' : 'medium'} style={[styles.tabText, activeTab === 'coverage' && styles.tabTextActive]}>
              {t('policies.tabs.coverage')}
            </Text>
          </TouchableOpacity>
          {policy.vehicleDetails && (
            <TouchableOpacity
              style={[styles.tab, activeTab === 'vehicle' && styles.tabActive]}
              onPress={() => setActiveTab('vehicle')}
              activeOpacity={0.7}
            >
              <Text variant="bodySmall" weight={activeTab === 'vehicle' ? 'semibold' : 'medium'} style={[styles.tabText, activeTab === 'vehicle' && styles.tabTextActive]}>
                {t('policies.tabs.vehicle')}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.tab, activeTab === 'details' && styles.tabActive]}
            onPress={() => setActiveTab('details')}
            activeOpacity={0.7}
          >
            <Text variant="bodySmall" weight={activeTab === 'details' ? 'semibold' : 'medium'} style={[styles.tabText, activeTab === 'details' && styles.tabTextActive]}>
              {t('policies.tabs.details')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.content}>
          {renderTabContent()}
        </View>
      </ScrollView>
    </View>
  );
};
