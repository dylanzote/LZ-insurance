import { Card } from '@/components/ui/Card';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { TripData } from '../types';
import { TripMap } from './TripMap';

interface TripReviewCardProps {
  trip: TripData;
  onReview?: (tripId: string) => void;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    marginBottom: 12,
    padding: 16,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 12,
  } as const,
  leftSection: {
    flex: 1,
  } as const,
  date: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  details: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 8,
    gap: 16,
  } as const,
  detailItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  detailText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  } as const,
  scoreBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  scoreText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: theme.colors.warning || '#d97706',
    marginLeft: 4,
  } as const,
  eventsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as const,
  eventsTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  } as const,
  eventsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 4,
  } as const,
  eventLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  } as const,
  eventValue: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.colors.error || '#dc2626',
  } as const,
  reviewButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    alignItems: 'center' as const,
  } as const,
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.white,
  } as const,
}));

export const TripReviewCard: React.FC<TripReviewCardProps> = ({
  trip,
  onReview,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const hasEvents = trip.events.speeding > 0 || trip.events.hardBraking > 0 || trip.events.rapidAcceleration > 0;

  // Calculate days left for review (max 6 days)
  const calculateDaysLeft = (): number | null => {
    const createdAt = trip.createdAt ? new Date(trip.createdAt) : new Date(trip.date);
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeft = 6 - daysSinceCreation;
    return daysLeft >= 0 ? daysLeft : null;
  };

  const daysLeft = calculateDaysLeft();

  return (
    <Card variant="elevated" style={styles.card}>
      {/* Trip Map Preview */}
      {trip.startLocation && trip.endLocation && (
        <View style={{ marginBottom: 12 }}>
          <TripMap trip={trip} height={150} showControls={false} />
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>
            {new Date(trip.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <MapPin color={theme.colors.textSecondary} size={14} />
              <Text style={styles.detailText}>
                {trip.distance.toFixed(1)} km
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Clock color={theme.colors.textSecondary} size={14} />
              <Text style={styles.detailText}>
                {new Date(trip.date).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
          {daysLeft !== null && (
            <View style={[styles.detailItem, { marginTop: 8 }]}>
              <Calendar color={daysLeft <= 2 ? theme.colors.error : theme.colors.warning} size={14} />
              <Text style={[styles.detailText, { 
                color: daysLeft <= 2 ? theme.colors.error : theme.colors.warning,
                fontWeight: '600' as const,
              }]}>
                {daysLeft === 0 
                  ? t('driving.tripsToReview.expiresToday')
                  : t('driving.tripsToReview.daysLeft', { count: daysLeft })}
              </Text>
            </View>
          )}
        </View>
        {/* Score hidden until validation - shown in review screen */}
      </View>

      {hasEvents && (
        <View style={styles.eventsContainer}>
          <Text style={styles.eventsTitle}>
            {t('driving.tripsToReview.events')}
          </Text>
          {trip.events.speeding > 0 && (
            <View style={styles.eventsRow}>
              <Text style={styles.eventLabel}>
                {t('driving.trends.speeding')}
              </Text>
              <Text style={styles.eventValue}>
                {trip.events.speeding}
              </Text>
            </View>
          )}
          {trip.events.hardBraking > 0 && (
            <View style={styles.eventsRow}>
              <Text style={styles.eventLabel}>
                {t('driving.trends.braking')}
              </Text>
              <Text style={styles.eventValue}>
                {trip.events.hardBraking}
              </Text>
            </View>
          )}
          {trip.events.rapidAcceleration > 0 && (
            <View style={styles.eventsRow}>
              <Text style={styles.eventLabel}>
                {t('driving.trends.acceleration')}
              </Text>
              <Text style={styles.eventValue}>
                {trip.events.rapidAcceleration}
              </Text>
            </View>
          )}
        </View>
      )}

      {onReview && (
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => onReview(trip.id)}
        >
          <Text style={styles.reviewButtonText}>
            {t('driving.tripsToReview.review')}
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

