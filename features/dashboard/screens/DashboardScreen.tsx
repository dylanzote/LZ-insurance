import { Header } from '@/components/layout/Header';
import { PermissionRequestCard } from '@/components/location/PermissionRequestCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureFlags } from '@/core/config/store';
import { getActionColor, getActionGradient } from '@/core/theme/colors';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import type { Theme } from '@/core/theme/types';
import { useTheme } from '@/core/theme/useTheme';
import { useDrivingScore } from '@/features/driving';
import { usePolicies } from '@/features/policies';
import { useFormatting } from '@/hooks/useFormatting';
import { useTranslation } from '@/hooks/useTranslation';
import { tripTracker } from '@/services/location/tripTracker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { AppState, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { ActivityItem } from '../components/ActivityItem';
import { DrivingScoreCard } from '../components/DrivingScoreCard';
import { PolicyCoverageCard } from '../components/PolicyCoverageCard';
import { StatCard } from '../components/StatCard';
import { useDashboard } from '../hooks/useDashboard';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: 16,
  } as const,
  greeting: {
    marginTop: 8,
    marginBottom: 24,
    paddingTop: 8,
  } as const,
  greetingText: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 36,
  } as const,
  greetingSubtext: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  } as const,
  statsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    marginBottom: 24,
  } as const,
  section: {
    marginBottom: 24,
  } as const,
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  } as const,
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
  viewAll: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500' as const,
  } as const,
  coverageGrid: {
    gap: 16,
  } as const,
  activityList: {
    gap: 8,
  } as const,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 40,
  } as const,
  errorText: {
    color: theme.colors.error,
    textAlign: 'center' as const,
    marginBottom: 16,
  } as const,
  errorContainer: {
    padding: 16,
    alignItems: 'center' as const,
  } as const,
  trackingPrompt: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  } as const,
  trackingHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  } as const,
  trackingTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginLeft: 8,
  } as const,
  trackingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  } as const,
  enableButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  } as const,
  enableButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  } as const,
  quickActionsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  } as const,
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  } as const,
  supportGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  supportCard: {
    alignItems: 'center',
    flex: 1,
  } as const,
  supportTitle: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginTop: 6,
    textAlign: 'center',
  } as const,
  quickActionsScroll: {
    marginBottom: 8,
  } as const,
  quickActionsContainer: {
    flexDirection: 'row' as const,
    paddingHorizontal: 4,
    paddingVertical: 8,
  } as const,
  quickActionCard: {
    width: 140,
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 12,
    shadowColor: theme.colors.gray900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.white + '1A',
  } as const,
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: theme.colors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as const,
  actionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 16,
  } as const,
  coverageCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.gray900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as const,
  coverageHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  } as const,
  coverageType: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  coverageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  } as const,
  coverageTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
  coverageAmount: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.primary,
  } as const,
  coverageDetails: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  } as const,
  policyCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  } as const,
  coverageStatus: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.colors.success,
    backgroundColor: `${theme.colors.success}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  } as const,
}));

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'goodMorning';
  if (hour < 18) return 'goodAfternoon';
  return 'goodEvening';
};

const getPolicyIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'auto': return 'car-sport';
    case 'home': return 'home';
    case 'life': return 'person';
    default: return 'shield-checkmark';
  }
};

const getPolicyColor = (type: string, theme: Theme) => {
  switch (type.toLowerCase()) {
    case 'auto': return getActionColor('auto', theme);
    case 'home': return getActionColor('home', theme);
    case 'life': return getActionColor('life', theme);
    default: return getActionColor('health', theme);
  }
};

export const DashboardScreen: React.FC = () => {
  const { formatCurrency } = useFormatting();
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { stats, recentActivity, loading, error, refetch } = useDashboard();
  const { score: drivingScore, tripHistory } = useDrivingScore();
  const { policies } = usePolicies();
  const features = useFeatureFlags();
  
  // Filter only active policies for display
  const activePolicies = React.useMemo(() => {
    return policies.filter(p => p.status === 'active');
  }, [policies]);

  // State for tracking permission
  const [trackingEnabled, setTrackingEnabled] = React.useState(false);
  const [showPermissionCard, setShowPermissionCard] = React.useState(false);

  // Check tracking status and permissions
  const checkTrackingStatus = React.useCallback(async () => {
    const hasPermissions = await tripTracker.hasPermissions();
    const isTracking = tripTracker.isTrackingActive();

    console.log('Tracking status check:', { hasPermissions, isTracking });
    
    // If we have permissions but tracking is not active, start tracking
    if (hasPermissions && !isTracking) {
      const started = await tripTracker.startTracking();
      if (started) {
        setTrackingEnabled(true);
        setShowPermissionCard(false);
        return;
      }
    }
    
    // Update state
    setTrackingEnabled(hasPermissions && isTracking);
    
    // Only show permission card if permissions are missing
    // Don't show if tracking is just not started but permissions exist
    setShowPermissionCard(!hasPermissions);
  }, []);

  // Check tracking status on mount and when app comes to foreground
  React.useEffect(() => {
    checkTrackingStatus();
    
    // Re-check when app comes to foreground (user might have changed permissions)
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkTrackingStatus();
      }
    });
    
    return () => {
      subscription?.remove();
    };
  }, [checkTrackingStatus]);

  const calculateDiscount = (score: number) => {
    return Math.min(30, Math.floor(score * 0.3));
  };

  const tripsToReview = tripHistory.filter(trip => 
    trip.score < 80
  ).length;

  const handlePermissionGranted = async () => {
    // Re-check permissions and start tracking
    await checkTrackingStatus();
  };

  const handlePermissionDismiss = () => {
    setShowPermissionCard(false);
  };


  const quickActions = [
    {
      title: t('dashboard.quickActions.startClaim'),
      icon: 'document-text' as const,
      route: '/(app)/claims/new',
      color: getActionColor('claim', theme),
      gradient: getActionGradient('claim'),
    },
    {
      title: t('dashboard.quickActions.viewCoverage'),
      icon: 'shield-checkmark' as const,
      route: '/(app)/coverage',
      color: getActionColor('coverage', theme),
      gradient: getActionGradient('coverage'),
    },
    {
      title: t('dashboard.quickActions.proofInsurance'),
      icon: 'card' as const,
      route: '/documents',
      color: getActionColor('document', theme),
      gradient: getActionGradient('document'),
    },
    {
      title: t('dashboard.quickActions.billing'),
      icon: 'cash' as const,
      route: '/(app)/billing',
      color: getActionColor('billing', theme),
      gradient: getActionGradient('billing'),
    },
    // Only show driving score if feature is enabled
    ...(features.drivingScore ? [{
      title: t('dashboard.drivingScore'),
      icon: 'speedometer' as const,
      route: '/(app)/(tabs)/driving',
      color: getActionColor('driving', theme),
      gradient: getActionGradient('driving'),
    }] : []),
  ];

  // Support Actions Data
  const supportActions = [
    {
      title: t('dashboard.support.contactUs'),
      icon: 'mail' as const,
      route: '/support/contact',
      color: getActionColor('contact', theme),
    },
    {
      title: t('dashboard.support.faqs'),
      icon: 'help-circle' as const,
      route: '/support/faqs',
      color: getActionColor('faq', theme),
    },
    // Only show chat if feature is enabled
    ...(features.chatSupport ? [{
      title: t('dashboard.support.chat'),
      icon: 'chatbubbles' as const,
      route: '/chat',
      color: getActionColor('chat', theme),
    }] : []),
  ];

  if (loading && !stats) {
    return (
      <View style={styles.container}>
        <Header title={t('dashboard.title')} showNotifications={true} />
        <LoadingSpinner message={t('common.loading')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t('dashboard.title')} showNotifications={true} />
      
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        <View style={styles.content}>
          {/* Permission Request Card */}
          {showPermissionCard && !trackingEnabled && (
            <PermissionRequestCard
              onPermissionGranted={handlePermissionGranted}
              onDismiss={handlePermissionDismiss}
            />
          )}

          {/* Greeting */}
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>
              {t(`dashboard.${getGreeting()}`)}, {user?.firstName}!
            </Text>
            <Text style={styles.greetingSubtext}>
              {t('dashboard.welcomeMessage')}
            </Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text variant="body" color={styles.errorText.color} style={styles.errorText}>
                {error}
              </Text>
              <Button
                title={t('common.retry')}
                onPress={refetch}
                variant="outline"
                style={{ marginTop: 12 }}
              />
            </View>
          )}


          {/* Stats Grid */}
          {stats && (
            <View style={styles.statsGrid}>
              <StatCard
                title={t('dashboard.totalPolicies')}
                value={stats.totalPolicies.toString()}
                subtitle={t('dashboard.covered')}
                style={{ marginBottom: 16, width: '48%' }}
              />
              <StatCard
                title={t('dashboard.activePolicies')}
                value={stats.activePolicies.toString()}
                subtitle={t('dashboard.covered')}
                style={{ marginBottom: 16, width: '48%' }}
              />
              <StatCard
                title={t('dashboard.pendingClaims')}
                value={stats.pendingClaims.toString()}
                subtitle={t('dashboard.inReview')}
                style={{ marginBottom: 16, width: '48%' }}
              />
              <StatCard
                title={t('dashboard.totalCoverage')}
                value={formatCurrency(stats.totalCoverage)}
                subtitle={t('dashboard.protected')}
                style={{ marginBottom: 16, width: '48%' }}
              />
            </View>
          )}

          {/* Driving Score Card */}
          {features.drivingScore && drivingScore && (
            <View style={styles.section}>
              <DrivingScoreCard
                score={drivingScore.score}
                discount={calculateDiscount(drivingScore.score)}
                tripsToReview={tripsToReview}
                onPress={() => router.push('/(app)/(tabs)/driving')}
              />
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {t('dashboard.quickActions.title')}
              </Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>
                  {t('common.viewAll')}
              </Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.quickActionsScroll}
              contentContainerStyle={styles.quickActionsContainer}
            >
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickActionCard}
                  onPress={() => router.push(action.route as any)}
                >
                  <View style={[styles.actionIconContainer, { 
                    backgroundColor: action.color,
                    shadowColor: action.color,
                  }]}>
                    <Ionicons name={action.icon} size={24} color="white" />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* My Coverage - Show active policies */}
          {activePolicies.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {t('dashboard.myCoverage')}
                </Text>
                <TouchableOpacity onPress={() => router.push('/(app)/coverage' as any)}>
                  <Text style={styles.viewAll}>
                    {t('common.viewAll')}
                  </Text>
                </TouchableOpacity>
              </View>
              {activePolicies.map((policy) => (
                <PolicyCoverageCard
                  key={policy.id}
                  policy={policy}
                  onPress={() => router.push(`/policies/${policy.id}` as any)}
                />
              ))}
            </View>
          )}


          {/* Recent Activity - Only show if there's data */}
          {recentActivity && recentActivity.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {t('dashboard.recentActivity')}
                </Text>
                <TouchableOpacity onPress={() => router.push('/activity' as any)}>
                  <Text style={styles.viewAll}>
                    {t('common.viewAll')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.activityList}>
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </View>
            </View>
          )}

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
              {t('dashboard.support.title')}
            </Text>
            <View style={styles.supportGrid}>
              {supportActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.supportCard}
                  onPress={() => router.push(action.route as any)}
                >
                  <Ionicons name={action.icon} size={24} color={action.color} />
                  <Text style={styles.supportTitle}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};