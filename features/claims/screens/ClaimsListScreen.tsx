import { Header } from '@/components/layout/Header';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'expo-router';
import { AlertCircle, FileText } from 'lucide-react-native';
import React from 'react';
import { FlatList, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { ClaimCard } from '../components/ClaimCard';
import { useClaims } from '../hooks/useClaims';
import { Claim } from '../types';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    flex: 1,
    padding: 16,
  } as const,
  headerSection: {
    marginBottom: 24,
  } as const,
  headerCard: {
    padding: 20,
    marginBottom: 16,
  } as const,
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 8,
    flexWrap: 'wrap' as const,
    flexShrink: 1,
  } as const,
  headerSubtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  } as const,
  statsRow: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 20,
  } as const,
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500' as const,
  } as const,
  newClaimButton: {
    marginBottom: 20,
  } as const,
  filterRow: {
    marginBottom: 16,
  } as const,
  filterScrollView: {
    paddingVertical: 4,
  } as const,
  filterScrollContent: {
    flexDirection: 'row' as const,
    gap: 8,
    paddingHorizontal: 4,
  } as const,
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  } as const,
  filterChipText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text,
  } as const,
  filterChipTextActive: {
    color: theme.colors.white,
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
    padding: 16,
  } as const,
  listContent: {
    paddingBottom: 20,
  } as const,
}));

export const ClaimsListScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { claims, loading, error, refetch } = useClaims();
  const [refreshing, setRefreshing] = React.useState(false);
  const [filter, setFilter] = React.useState<'all' | 'submitted' | 'in-review' | 'approved' | 'rejected'>('all');

  const handleClaimPress = (claim: Claim) => {
    router.push(`/claims/${claim.id}` as any);
  };

  const handleNewClaim = () => {
    router.push('/claims/new');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filteredClaims = React.useMemo(() => {
    if (filter === 'all') return claims;
    return claims.filter((claim: Claim) => {
      if (filter === 'in-review') {
        return claim.status === 'in-review' || 
               claim.status === 'document-verification' || 
               claim.status === 'surveyor-assigned' || 
               claim.status === 'assessment' ||
               claim.status === 'processing';
      }
      if (filter === 'approved') {
        return claim.status === 'approved' || claim.status === 'settlement';
      }
      return claim.status === filter;
    });
  }, [claims, filter]);

  const stats = React.useMemo(() => {
    const total = claims.length;
    const submitted = claims.filter((c: Claim) => c.status === 'submitted').length;
    const inReview = claims.filter((c: Claim) => 
      c.status === 'in-review' || c.status === 'document-verification' || 
      c.status === 'surveyor-assigned' || c.status === 'assessment'
    ).length;
    const approved = claims.filter((c: Claim) => c.status === 'approved' || c.status === 'settlement').length;
    
    return { total, submitted, inReview, approved };
  }, [claims]);

  if (loading && claims.length === 0) {
    return (
      <View style={styles.container}>
        <Header title={t('claims.title')} showNotifications={true} />
        <LoadingSpinner message={t('common.loading')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t('claims.title')} showNotifications={true} />
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Card variant="elevated" style={styles.headerCard}>
            <Text style={styles.headerTitle} numberOfLines={2} adjustsFontSizeToFit>
              {t('claims.title')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {t('claims.list.subtitle')}
            </Text>
          </Card>

          {/* Stats */}
          {stats.total > 0 && (
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>{t('claims.list.total')}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#f59e0b' }]}>{stats.submitted}</Text>
                <Text style={styles.statLabel}>{t('claims.status.submitted')}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#3b82f6' }]}>{stats.inReview}</Text>
                <Text style={styles.statLabel}>{t('claims.list.inReview')}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#10b981' }]}>{stats.approved}</Text>
                <Text style={styles.statLabel}>{t('claims.status.approved')}</Text>
              </View>
            </View>
          )}

          {/* New Claim Button */}
          <Button
            title={t('claims.newClaim')}
            onPress={handleNewClaim}
            style={styles.newClaimButton}
            variant="primary"
          />

          {/* Filters */}
          {claims.length > 0 && (
            <View style={styles.filterRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
                style={styles.filterScrollView}
              >
                {(['all', 'submitted', 'in-review', 'approved', 'rejected'] as const).map((filterType) => (
                  <TouchableOpacity
                    key={filterType}
                    style={[
                      styles.filterChip,
                      filter === filterType && styles.filterChipActive,
                    ]}
                    onPress={() => setFilter(filterType)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filter === filterType && styles.filterChipTextActive,
                      ]}
                    >
                      {t(`claims.list.filter.${filterType}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Error State */}
        {error && (
          <Card variant="outlined" style={{ marginBottom: 16, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AlertCircle size={20} color={theme.colors.error} style={{ marginRight: 8 }} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </Card>
        )}

        {/* Claims List */}
        <FlatList
          data={filteredClaims}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClaimCard claim={item} onPress={handleClaimPress} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={FileText}
              title={t('claims.list.empty.title')}
              message={t('claims.list.empty.description')}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            filteredClaims.length === 0 && { flex: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </View>
    </View>
  );
};
