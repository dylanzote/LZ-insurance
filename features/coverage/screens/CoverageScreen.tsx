import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'expo-router';
import {
  Activity,
  AlertCircle,
  ChevronRight,
  Heart,
  Home,
  Shield,
  TrendingUp,
} from 'lucide-react-native';
import React from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: 16,
  } as const,
  summaryCard: {
    marginBottom: 24,
    padding: 24,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 16,
    overflow: 'visible' as const,
  } as const,
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.primaryDark,
    marginBottom: 12,
  } as const,
  summaryAmount: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: theme.colors.primaryDark,
    marginBottom: 8,
    lineHeight: 48,
  } as const,
  summarySubtext: {
    fontSize: 14,
    color: theme.colors.primaryDark,
    opacity: 0.8,
  } as const,
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 16,
  } as const,
  coverageCard: {
    marginBottom: 16,
    padding: 20,
  } as const,
  coverageHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  } as const,
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  } as const,
  coverageInfo: {
    flex: 1,
  } as const,
  coverageType: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  policyCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  } as const,
  coverageAmount: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.primary,
    marginBottom: 16,
  } as const,
  detailsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as const,
  detailLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  } as const,
  detailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
  viewPoliciesButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  } as const,
  viewPoliciesText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.white,
    marginRight: 8,
  } as const,
  emptyContainer: {
    padding: 40,
    alignItems: 'center' as const,
  } as const,
  emptyIcon: {
    marginBottom: 16,
  } as const,
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 8,
  } as const,
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 20,
  } as const,
}));

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'auto':
      return Shield;
    case 'home':
      return Home;
    case 'life':
      return Heart;
    case 'health':
      return Activity;
    default:
      return Shield;
  }
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'auto':
      return '#FF6B6B';
    case 'home':
      return '#4ECDC4';
    case 'life':
      return '#FFD93D';
    case 'health':
      return '#6BCB77';
    default:
      return '#3b82f6';
  }
};

export const CoverageScreen: React.FC = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { stats, loading, error, refetch } = useDashboard();

  const handleViewPolicies = (type: string) => {
    // Navigate to policies screen with type filter
    router.push({
      pathname: '/policies/viewPolicies' as any,
      params: { type },
    });
  };

  if (loading && !stats) {
    return (
      <View style={styles.container}>
        <Header title={t('coverage.title')} showNotifications={true} />
        <LoadingSpinner message={t('common.loading')} />
      </View>
    );
  }

  if (!stats || !stats.coverageBreakdown || stats.coverageBreakdown.length === 0) {
    return (
      <View style={styles.container}>
        <Header title={t('coverage.title')} showNotifications={true} />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
        >
          <View style={styles.emptyContainer}>
            <AlertCircle 
              color={theme.colors.textSecondary} 
              size={64} 
              style={styles.emptyIcon} 
            />
            <Text style={styles.emptyTitle}>
              {t('coverage.empty.title')}
            </Text>
            <Text style={styles.emptyText}>
              {t('coverage.empty.description')}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t('coverage.title')} showNotifications={true} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Total Coverage Summary */}
          <Card variant="elevated" padding="none" style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              {t('coverage.totalCoverage')}
            </Text>
            <Text style={styles.summaryAmount}>
              ${stats.totalCoverage.toLocaleString()}
            </Text>
            <Text style={styles.summarySubtext}>
              {t('coverage.totalCoverageDescription')}
            </Text>
          </Card>

          {/* Coverage Breakdown */}
          <Text variant="h2" style={styles.sectionTitle}>
            {t('coverage.breakdown')}
          </Text>

          {stats.coverageBreakdown.map((coverage, index) => {
            const Icon = getTypeIcon(coverage.type);
            const iconColor = getTypeColor(coverage.type);
            const typeName = t(`policies.types.${coverage.type.toLowerCase()}`) || 
              coverage.type.charAt(0).toUpperCase() + coverage.type.slice(1).toLowerCase();

            return (
              <Card key={index} variant="elevated" style={styles.coverageCard}>
                <View style={styles.coverageHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                    <Icon color={iconColor} size={28} />
                  </View>
                  <View style={styles.coverageInfo}>
                    <Text style={styles.coverageType}>
                      {typeName}
                    </Text>
                    <Text style={styles.policyCount}>
                      {coverage.policyCount} {coverage.policyCount === 1 
                        ? t('coverage.policy') 
                        : t('coverage.policies')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.coverageAmount}>
                  ${coverage.amount.toLocaleString()}
                </Text>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>
                    {t('coverage.averagePerPolicy')}
                  </Text>
                  <Text style={styles.detailValue}>
                    ${Math.round(coverage.amount / coverage.policyCount).toLocaleString()}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.viewPoliciesButton}
                  onPress={() => handleViewPolicies(coverage.type)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewPoliciesText}>
                    {t('coverage.viewPolicies')}
                  </Text>
                  <ChevronRight color={theme.colors.white} size={20} />
                </TouchableOpacity>
              </Card>
            );
          })}

          {/* Additional Info */}
          <Card variant="elevated" style={styles.coverageCard}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
              <TrendingUp color={theme.colors.primary} size={20} style={{ marginRight: 12, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.coverageType}>
                  {t('coverage.info.title')}
                </Text>
                <Text style={styles.policyCount}>
                  {t('coverage.info.description')}
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

