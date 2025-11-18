import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { i18n } from '@/core/i18n';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'expo-router';
import { Calendar, Info, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CircularScoreMeter } from '../components/CircularScoreMeter';
import { DataTrackingToggle } from '../components/DataTrackingToggle';
import { ScoreCalculationModal } from '../components/ScoreCalculationModal';
import { TripReviewCard } from '../components/TripReviewCard';
import { useDrivingScore } from '../hooks/useDrivingScore';
import { useTripsToReview } from '../hooks/useTripsToReview';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: theme.spacing.md,
  } as const,
  header: {
    alignItems: 'center' as const,
    marginBottom: theme.spacing.lg,
  } as const,
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  } as const,
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  } as const,
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  } as const,
  discountSection: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: theme.spacing.md,
  } as const,
  discountCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
  } as const,
  discountLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  } as const,
  discountValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.primary,
    marginBottom: 4,
  } as const,
  discountSubtext: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  } as const,
  appliedDate: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as const,
  appliedDateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  } as const,
  infoLink: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as const,
  infoLinkText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: 6,
    textDecorationLine: 'underline' as const,
  } as const,
  trendRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  trendLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  } as const,
  trendValue: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text,
  } as const,
  tipItem: {
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.sm,
  } as const,
  tipText: {
    fontSize: 14,
    color: theme.colors.primaryDark,
    lineHeight: 20,
  } as const,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  emptyState: {
    alignItems: 'center' as const,
    padding: theme.spacing.xl,
  } as const,
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: theme.spacing.md,
  } as const,
}));

const calculateDiscount = (score: number): number => {
  return Math.min(30, Math.floor(score * 0.3));
};

const calculateProjectedDiscount = (currentScore: number, improvement: number = 5): number => {
  const projectedScore = Math.min(100, currentScore + improvement);
  return Math.min(30, Math.floor(projectedScore * 0.3));
};

const getNextRenewalDate = (): string => {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  return nextMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const DrivingScoreScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { score, tripHistory, loading, refreshScore } = useDrivingScore();
  const { trips: tripsToReview, loading: loadingTrips, refetch: refetchTrips } = useTripsToReview();
  const [showCalculationModal, setShowCalculationModal] = React.useState(false);
  const router = useRouter();

  const handleReviewTrip = (tripId: string) => {
    router.push(`/driving/review?tripId=${tripId}` as any);
  };

  const currentDiscount = score ? calculateDiscount(score.score) : 0;
  const projectedDiscount = score ? calculateProjectedDiscount(score.score) : 0;
  const nextRenewalDate = getNextRenewalDate();

  if (loading && !score) {
    return (
      <View style={styles.container}>
        <Header title={t('driving.title')} showNotifications={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16, color: styles.subtitle.color }}>
            {t('driving.loading')}
          </Text>
        </View>
      </View>
    );
  }

  if (!score) {
    return (
      <View style={styles.container}>
        <Header title={t('driving.title')} showNotifications={true} />
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>
            {t('driving.noData')}
          </Text>
          <Button title={t('common.retry')} onPress={refreshScore} style={{ marginTop: 16 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t('driving.title')} showNotifications={true} />
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshScore} />
        }
      >
        <View style={styles.content}>
          {/* Data Tracking Toggle */}
          <DataTrackingToggle />

          {/* Score Display with Circular Progress */}
          <View style={[styles.card, { alignItems: 'center' }]}>
            <CircularScoreMeter score={score.score} size={160} strokeWidth={14} />
            <Text style={styles.subtitle}>
              {t('driving.lastUpdated')}: {new Date(score.lastUpdated).toLocaleDateString()}
            </Text>
          </View>

          {/* Discount Cards */}
          <Card variant="elevated" style={styles.card}>
            <Text style={styles.sectionTitle}>
              {t('driving.discountEligible')}
            </Text>
            
            <View style={styles.discountSection}>
              <View style={styles.discountCard}>
                <Text style={styles.discountLabel}>
                  {t('driving.currentDiscount')}
                </Text>
                <Text style={styles.discountValue}>
                  {currentDiscount}%
                </Text>
                <Text style={styles.discountSubtext}>
                  {i18n.t('driving.discountEligible', { discount: currentDiscount })}
                </Text>
              </View>
              
              <View style={[styles.discountCard, { backgroundColor: theme.colors.primaryLight }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <TrendingUp color={theme.colors.primary} size={14} />
                  <Text style={[styles.discountLabel, { marginLeft: 4, color: theme.colors.primaryDark }]}>
                    {t('driving.projectedDiscount')}
                  </Text>
                </View>
                <Text style={[styles.discountValue, { color: theme.colors.primaryDark }]}>
                  {projectedDiscount}%
                </Text>
                <Text style={[styles.discountSubtext, { color: theme.colors.primaryDark }]}>
                  {i18n.t('driving.discountEligible', { discount: projectedDiscount })}
                </Text>
              </View>
            </View>

            <View style={styles.appliedDate}>
              <Calendar color={theme.colors.textSecondary} size={16} />
              <Text style={styles.appliedDateText}>
                {t('driving.discountApplied')}: {nextRenewalDate}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.infoLink}
              onPress={() => setShowCalculationModal(true)}
            >
              <Info color={theme.colors.primary} size={16} />
              <Text style={styles.infoLinkText}>
                {t('driving.premiumAdjustment')}
              </Text>
            </TouchableOpacity>
          </Card>

          {/* Driving Trends */}
          <Card variant="elevated" style={styles.card}>
            <Text style={styles.sectionTitle}>
              {t('driving.trends.title')}
            </Text>
            
            <View style={styles.trendRow}>
              <Text style={styles.trendLabel}>
                {t('driving.trends.speeding')}
              </Text>
              <Text style={styles.trendValue}>{score.trends.speeding}</Text>
            </View>
            
            <View style={styles.trendRow}>
              <Text style={styles.trendLabel}>
                {t('driving.trends.braking')}
              </Text>
              <Text style={styles.trendValue}>{score.trends.braking}</Text>
            </View>
            
            <View style={styles.trendRow}>
              <Text style={styles.trendLabel}>
                {t('driving.trends.acceleration')}
              </Text>
              <Text style={styles.trendValue}>{score.trends.acceleration}</Text>
            </View>
            
            <View style={styles.trendRow}>
              <Text style={styles.trendLabel}>
                {t('driving.trends.phoneUsage')}
              </Text>
              <Text style={styles.trendValue}>{score.trends.phoneUsage}</Text>
            </View>
            
            <View style={styles.trendRow}>
              <Text style={styles.trendLabel}>
                {t('driving.trends.mileage')}
              </Text>
              <Text style={styles.trendValue}>{score.trends.mileage} km</Text>
            </View>
          </Card>

          {/* Improvement Tips */}
          <Card variant="elevated" style={styles.card}>
            <Text style={styles.sectionTitle}>
              {t('driving.tips')}
            </Text>
            {score.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipText}>• {tip}</Text>
              </View>
            ))}
          </Card>

          {/* Trips to Review */}
          <Card variant="elevated" style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={styles.sectionTitle}>
                {t('driving.tripsToReview.title')}
              </Text>
              {tripsToReview.length > 0 && (
                <TouchableOpacity onPress={refetchTrips}>
                  <Text style={styles.infoLinkText}>
                    {t('common.retry')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {loadingTrips ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="small" />
                <Text style={[styles.emptyText, { marginTop: 12 }]}>
                  {t('driving.tripsToReview.loading')}
                </Text>
              </View>
            ) : tripsToReview.length > 0 ? (
              tripsToReview.map((trip) => (
                <TripReviewCard
                  key={trip.id}
                  trip={trip}
                  onReview={handleReviewTrip}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  {t('driving.tripsToReview.empty')}
                </Text>
                <Button
                  title={t('driving.tripsToReview.reload')}
                  onPress={refetchTrips}
                  variant="outline"
                  style={{ marginTop: 12 }}
                />
              </View>
            )}
          </Card>

          {/* Recent Trips */}
          {tripHistory.length > 0 && (
            <Card variant="elevated" style={styles.card}>
              <Text style={styles.sectionTitle}>
                {t('driving.tripHistory')}
              </Text>
              {tripHistory.slice(0, 5).map((trip) => (
                <View key={trip.id} style={styles.trendRow}>
                  <View>
                    <Text style={styles.trendLabel}>
                      {new Date(trip.date).toLocaleDateString()}
                    </Text>
                    <Text style={[styles.trendValue, { fontSize: 12 }]}>
                      {trip.distance.toFixed(1)} km
                    </Text>
                  </View>
                  <Text style={[styles.trendValue, { color: theme.colors.primary }]}>
                    {trip.score}
                  </Text>
                </View>
              ))}
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Score Calculation Modal */}
      <ScoreCalculationModal
        visible={showCalculationModal}
        onClose={() => setShowCalculationModal(false)}
      />
    </View>
  );
};
