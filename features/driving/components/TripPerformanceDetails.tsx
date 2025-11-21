import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  AlertCircle, 
  CheckCircle, 
  CornerDownRight, 
  Navigation, 
  Smartphone, 
  TrendingDown, 
  TrendingUp, 
  Zap,
  Award,
  Target
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import type { TripData } from '../types';

interface TripPerformanceDetailsProps {
  trip: TripData;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    marginBottom: 16,
  } as const,
  section: {
    marginBottom: 20,
  } as const,
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 12,
  } as const,
  performanceGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginTop: 12,
  } as const,
  performanceCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
  } as const,
  performanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  } as const,
  performanceLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: 4,
  } as const,
  performanceValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    textAlign: 'center' as const,
  } as const,
  ratingRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  } as const,
  ratingLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  } as const,
  ratingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  } as const,
  ratingContent: {
    flex: 1,
  } as const,
  ratingTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 2,
  } as const,
  ratingDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  } as const,
  ratingBadge: {
    marginLeft: 8,
  } as const,
  insightsContainer: {
    gap: 12,
  } as const,
  insightCard: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 8,
  } as const,
  insightHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  } as const,
  insightIcon: {
    marginRight: 8,
  } as const,
  insightTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    flex: 1,
  } as const,
  insightText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  } as const,
  eventList: {
    gap: 8,
  } as const,
  eventItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  } as const,
  eventIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  } as const,
  eventContent: {
    flex: 1,
  } as const,
  eventTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 2,
  } as const,
  eventSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  } as const,
  eventCount: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginLeft: 8,
  } as const,
}));

// Calculate performance ratings for different aspects
const calculatePerformanceRatings = (trip: TripData) => {
  const baseScore = trip.score;
  
  // Speed rating (penalize speeding)
  const speedRating = trip.events.speeding > 0 
    ? Math.max(0, baseScore - (trip.events.speeding * 15))
    : Math.min(100, baseScore + 5);
  
  // Smoothness rating (penalize hard braking and rapid acceleration)
  const smoothnessDeduction = (trip.events.hardBraking * 10) + (trip.events.rapidAcceleration * 8);
  const smoothnessRating = Math.max(0, baseScore - smoothnessDeduction);
  
  // Safety rating (penalize cornering and phone usage)
  const safetyDeduction = (trip.events.cornering * 5) + (trip.events.phoneUsage * 20);
  const safetyRating = Math.max(0, baseScore - safetyDeduction);
  
  // Overall consistency (less variation = better)
  const totalEvents = trip.events.speeding + trip.events.hardBraking + 
                     trip.events.rapidAcceleration + trip.events.cornering + trip.events.phoneUsage;
  const consistencyRating = totalEvents === 0 ? 100 : Math.max(0, 100 - (totalEvents * 10));
  
  return {
    speed: Math.round(speedRating),
    smoothness: Math.round(smoothnessRating),
    safety: Math.round(safetyRating),
    consistency: Math.round(consistencyRating),
  };
};

// Get rating level (excellent, good, fair, poor)
const getRatingLevel = (score: number): { level: string; color: string } => {
  if (score >= 90) return { level: 'excellent', color: '#10b981' }; // green
  if (score >= 75) return { level: 'good', color: '#3b82f6' }; // blue
  if (score >= 60) return { level: 'fair', color: '#f59e0b' }; // orange
  return { level: 'poor', color: '#ef4444' }; // red
};

export const TripPerformanceDetails: React.FC<TripPerformanceDetailsProps> = ({ trip }) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const ratings = calculatePerformanceRatings(trip);
  const speedRating = getRatingLevel(ratings.speed);
  const smoothnessRating = getRatingLevel(ratings.smoothness);
  const safetyRating = getRatingLevel(ratings.safety);
  const consistencyRating = getRatingLevel(ratings.consistency);

  const totalEvents = trip.events.speeding + trip.events.hardBraking + 
                     trip.events.rapidAcceleration + trip.events.cornering + trip.events.phoneUsage;
  
  const getPerformanceInsights = () => {
    const insights: Array<{ type: 'good' | 'warning' | 'info'; title: string; message: string; icon: any }> = [];
    
    if (trip.score >= 90) {
      insights.push({
        type: 'good',
        title: t('driving.performance.excellent'),
        message: t('driving.performance.excellentMessage'),
        icon: Award,
      });
    }
    
    if (trip.events.speeding === 0 && trip.events.hardBraking === 0 && trip.events.rapidAcceleration === 0) {
      insights.push({
        type: 'good',
        title: t('driving.performance.smoothDriving'),
        message: t('driving.performance.smoothDrivingMessage'),
        icon: CheckCircle,
      });
    }
    
    if (trip.events.speeding > 0) {
      insights.push({
        type: 'warning',
        title: t('driving.performance.speedingDetected'),
        message: trip.events.speeding === 1
          ? t('driving.performance.speedingMessage')
          : t('driving.performance.speedingMessage_plural', { count: trip.events.speeding }),
        icon: AlertCircle,
      });
    }
    
    if (trip.events.hardBraking > 0) {
      insights.push({
        type: 'warning',
        title: t('driving.performance.hardBrakingDetected'),
        message: trip.events.hardBraking === 1
          ? t('driving.performance.hardBrakingMessage')
          : t('driving.performance.hardBrakingMessage_plural', { count: trip.events.hardBraking }),
        icon: TrendingDown,
      });
    }
    
    if (trip.events.phoneUsage > 0) {
      insights.push({
        type: 'warning',
        title: t('driving.performance.phoneUsageDetected'),
        message: trip.events.phoneUsage === 1
          ? t('driving.performance.phoneUsageMessage')
          : t('driving.performance.phoneUsageMessage_plural', { count: trip.events.phoneUsage }),
        icon: Smartphone,
      });
    }
    
    if (trip.isNightDriving) {
      insights.push({
        type: 'info',
        title: t('driving.performance.nightDriving'),
        message: t('driving.performance.nightDrivingMessage'),
        icon: Target,
      });
    }
    
    return insights;
  };

  const insights = getPerformanceInsights();

  return (
    <View style={styles.container}>
      {/* Performance Ratings */}
      <Card variant="elevated" style={styles.section}>
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          {t('driving.performance.ratings')}
        </Text>
        
        <View style={styles.performanceGrid}>
          {/* Speed Rating */}
          <View style={[styles.performanceCard, { backgroundColor: speedRating.color + '15' }]}>
            <View style={[styles.performanceIcon, { backgroundColor: speedRating.color + '20' }]}>
              <Navigation size={24} color={speedRating.color} />
            </View>
            <Text style={styles.performanceLabel}>
              {t('driving.performance.speed')}
            </Text>
            <Text style={[styles.performanceValue, { color: speedRating.color }]}>
              {ratings.speed}
            </Text>
            <Badge 
              label={t(`driving.performance.${speedRating.level}`)} 
              variant={speedRating.level === 'excellent' ? 'success' : speedRating.level === 'good' ? 'default' : 'warning'} 
              size="sm"
            />
          </View>

          {/* Smoothness Rating */}
          <View style={[styles.performanceCard, { backgroundColor: smoothnessRating.color + '15' }]}>
            <View style={[styles.performanceIcon, { backgroundColor: smoothnessRating.color + '20' }]}>
              <TrendingUp size={24} color={smoothnessRating.color} />
            </View>
            <Text style={styles.performanceLabel}>
              {t('driving.performance.smoothness')}
            </Text>
            <Text style={[styles.performanceValue, { color: smoothnessRating.color }]}>
              {ratings.smoothness}
            </Text>
            <Badge 
              label={t(`driving.performance.${smoothnessRating.level}`)} 
              variant={smoothnessRating.level === 'excellent' ? 'success' : smoothnessRating.level === 'good' ? 'default' : 'warning'} 
              size="sm"
            />
          </View>

          {/* Safety Rating */}
          <View style={[styles.performanceCard, { backgroundColor: safetyRating.color + '15' }]}>
            <View style={[styles.performanceIcon, { backgroundColor: safetyRating.color + '20' }]}>
              <CheckCircle size={24} color={safetyRating.color} />
            </View>
            <Text style={styles.performanceLabel}>
              {t('driving.performance.safety')}
            </Text>
            <Text style={[styles.performanceValue, { color: safetyRating.color }]}>
              {ratings.safety}
            </Text>
            <Badge 
              label={t(`driving.performance.${safetyRating.level}`)} 
              variant={safetyRating.level === 'excellent' ? 'success' : safetyRating.level === 'good' ? 'default' : 'warning'} 
              size="sm"
            />
          </View>

          {/* Consistency Rating */}
          <View style={[styles.performanceCard, { backgroundColor: consistencyRating.color + '15' }]}>
            <View style={[styles.performanceIcon, { backgroundColor: consistencyRating.color + '20' }]}>
              <Target size={24} color={consistencyRating.color} />
            </View>
            <Text style={styles.performanceLabel}>
              {t('driving.performance.consistency')}
            </Text>
            <Text style={[styles.performanceValue, { color: consistencyRating.color }]}>
              {ratings.consistency}
            </Text>
            <Badge 
              label={t(`driving.performance.${consistencyRating.level}`)} 
              variant={consistencyRating.level === 'excellent' ? 'success' : consistencyRating.level === 'good' ? 'default' : 'warning'} 
              size="sm"
            />
          </View>
        </View>
      </Card>

      {/* Performance Insights */}
      {insights.length > 0 && (
        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            {t('driving.performance.insights')}
          </Text>
          
          <View style={styles.insightsContainer}>
            {insights.map((insight, index) => {
              const InsightIcon = insight.icon;
              const bgColor = insight.type === 'good' 
                ? theme.colors.success + '15'
                : insight.type === 'warning'
                ? theme.colors.warning + '15'
                : theme.colors.primary + '15';
              const borderColor = insight.type === 'good'
                ? theme.colors.success
                : insight.type === 'warning'
                ? theme.colors.warning
                : theme.colors.primary;
              
              return (
                <View 
                  key={index} 
                  style={[
                    styles.insightCard, 
                    { backgroundColor: bgColor, borderLeftColor: borderColor }
                  ]}
                >
                  <View style={styles.insightHeader}>
                    <InsightIcon 
                      size={20} 
                      color={borderColor} 
                      style={styles.insightIcon} 
                    />
                    <Text style={[styles.insightTitle, { color: theme.colors.text }]}>
                      {insight.title}
                    </Text>
                  </View>
                  <Text style={[styles.insightText, { color: theme.colors.textSecondary }]}>
                    {insight.message}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      )}

      {/* Detailed Event Breakdown */}
      {totalEvents > 0 && (
        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            {t('driving.performance.eventBreakdown')}
          </Text>
          
          <View style={styles.eventList}>
            {trip.events.speeding > 0 && (
              <View style={[styles.eventItem, { backgroundColor: '#ef4444' + '15' }]}>
                <View style={[styles.eventIconContainer, { backgroundColor: '#ef4444' + '20' }]}>
                  <Navigation size={20} color="#ef4444" />
                </View>
                <View style={styles.eventContent}>
                  <Text style={[styles.eventTitle, { color: theme.colors.text }]}>
                    {t('driving.trends.speeding')}
                  </Text>
                  <Text style={styles.eventSubtitle}>
                    {t('driving.performance.speedingDescription')}
                  </Text>
                </View>
                <Text style={[styles.eventCount, { color: '#ef4444' }]}>
                  {trip.events.speeding}
                </Text>
              </View>
            )}
            
            {trip.events.hardBraking > 0 && (
              <View style={[styles.eventItem, { backgroundColor: '#f97316' + '15' }]}>
                <View style={[styles.eventIconContainer, { backgroundColor: '#f97316' + '20' }]}>
                  <TrendingDown size={20} color="#f97316" />
                </View>
                <View style={styles.eventContent}>
                  <Text style={[styles.eventTitle, { color: theme.colors.text }]}>
                    {t('driving.trends.braking')}
                  </Text>
                  <Text style={styles.eventSubtitle}>
                    {t('driving.performance.hardBrakingDescription')}
                  </Text>
                </View>
                <Text style={[styles.eventCount, { color: '#f97316' }]}>
                  {trip.events.hardBraking}
                </Text>
              </View>
            )}
            
            {trip.events.rapidAcceleration > 0 && (
              <View style={[styles.eventItem, { backgroundColor: '#eab308' + '15' }]}>
                <View style={[styles.eventIconContainer, { backgroundColor: '#eab308' + '20' }]}>
                  <Zap size={20} color="#eab308" />
                </View>
                <View style={styles.eventContent}>
                  <Text style={[styles.eventTitle, { color: theme.colors.text }]}>
                    {t('driving.trends.acceleration')}
                  </Text>
                  <Text style={styles.eventSubtitle}>
                    {t('driving.performance.rapidAccelerationDescription')}
                  </Text>
                </View>
                <Text style={[styles.eventCount, { color: '#eab308' }]}>
                  {trip.events.rapidAcceleration}
                </Text>
              </View>
            )}
            
            {trip.events.cornering > 0 && (
              <View style={[styles.eventItem, { backgroundColor: '#a855f7' + '15' }]}>
                <View style={[styles.eventIconContainer, { backgroundColor: '#a855f7' + '20' }]}>
                  <CornerDownRight size={20} color="#a855f7" />
                </View>
                <View style={styles.eventContent}>
                  <Text style={[styles.eventTitle, { color: theme.colors.text }]}>
                    {t('driving.calculationModal.factors.cornering')}
                  </Text>
                  <Text style={styles.eventSubtitle}>
                    {t('driving.performance.corneringDescription')}
                  </Text>
                </View>
                <Text style={[styles.eventCount, { color: '#a855f7' }]}>
                  {trip.events.cornering}
                </Text>
              </View>
            )}
            
            {trip.events.phoneUsage > 0 && (
              <View style={[styles.eventItem, { backgroundColor: '#3b82f6' + '15' }]}>
                <View style={[styles.eventIconContainer, { backgroundColor: '#3b82f6' + '20' }]}>
                  <Smartphone size={20} color="#3b82f6" />
                </View>
                <View style={styles.eventContent}>
                  <Text style={[styles.eventTitle, { color: theme.colors.text }]}>
                    {t('driving.calculationModal.factors.distractions')}
                  </Text>
                  <Text style={styles.eventSubtitle}>
                    {t('driving.performance.phoneUsageDescription')}
                  </Text>
                </View>
                <Text style={[styles.eventCount, { color: '#3b82f6' }]}>
                  {trip.events.phoneUsage}
                </Text>
              </View>
            )}
          </View>
        </Card>
      )}
    </View>
  );
};

