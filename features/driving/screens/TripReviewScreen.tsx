import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { tripsAPI } from '@/services/api/endpoints';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircle,
  Clock,
  CornerDownRight,
  MapPin,
  Moon,
  Smartphone,
  Zap
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { DriverValidationModal } from '../components/DriverValidationModal';
import { TripData } from '../types';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: 16,
  } as const,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 40,
  } as const,
  card: {
    marginBottom: 16,
    padding: 20,
  } as const,
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 16,
  } as const,
  tripHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 20,
  } as const,
  tripInfo: {
    flex: 1,
  } as const,
  tripDate: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 8,
  } as const,
  tripDetails: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 16,
    marginTop: 8,
  } as const,
  detailItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  detailText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  } as const,
  scoreBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center' as const,
  } as const,
  scoreLabel: {
    fontSize: 12,
    color: theme.colors.warning || '#d97706',
    marginBottom: 4,
  } as const,
  scoreValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: theme.colors.warning || '#d97706',
  } as const,
  eventsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as const,
  eventItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  } as const,
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fee2e2',
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
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  eventCount: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.colors.error || '#dc2626',
  } as const,
  noEvents: {
    textAlign: 'center' as const,
    color: theme.colors.textSecondary,
    fontSize: 14,
    padding: 20,
  } as const,
  nightDrivingBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start' as const,
    marginTop: 8,
  } as const,
  nightDrivingText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  } as const,
  actionButton: {
    marginTop: 24,
  } as const,
}));

export const TripReviewScreen: React.FC = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showValidation, setShowValidation] = useState(true);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    if (tripId) {
      loadTrip();
    }
  }, [tripId]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      const response = await tripsAPI.getAll();
      const foundTrip = response.data.find((t: TripData) => t.id === tripId);
      if (foundTrip) {
        setTrip(foundTrip);
      }
    } catch (error) {
      console.error('Error loading trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = () => {
    setIsValidated(true);
    setShowValidation(false);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleConfirmReview = async () => {
    if (!trip) return;
    
    try {
      await tripsAPI.reviewTrip(trip.id, true);
      router.back();
    } catch (error) {
      console.error('Error confirming review:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title={t('driving.review.title')} showNotifications={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.container}>
        <Header title={t('driving.review.title')} showNotifications={true} />
        <View style={styles.loadingContainer}>
          <Text style={{ color: styles.noEvents.color }}>
            {t('driving.review.tripNotFound')}
          </Text>
          <Button
            title={t('common.back')}
            onPress={() => router.back()}
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    );
  }

  const hasEvents = 
    trip.events.speeding > 0 ||
    trip.events.hardBraking > 0 ||
    trip.events.rapidAcceleration > 0 ||
    trip.events.cornering > 0 ||
    trip.events.phoneUsage > 0;

  return (
    <View style={styles.container}>
      <Header title={t('driving.review.title')} showNotifications={true} />
      
      <DriverValidationModal
        visible={showValidation && !isValidated}
        onValidate={handleValidate}
        onCancel={handleCancel}
        tripDate={trip.date}
      />

      {isValidated && (
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            {/* Trip Header */}
            <Card variant="elevated" style={styles.card}>
              <View style={styles.tripHeader}>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripDate}>
                    {new Date(trip.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  <View style={styles.tripDetails}>
                    <View style={styles.detailItem}>
                      <MapPin color={theme.colors.textSecondary} size={16} />
                      <Text style={styles.detailText}>
                        {trip.distance.toFixed(1)} km
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Clock color={theme.colors.textSecondary} size={16} />
                      <Text style={styles.detailText}>
                        {trip.duration} {t('driving.review.minutes')}
                      </Text>
                    </View>
                  </View>
                  {trip.isNightDriving && (
                    <View style={styles.nightDrivingBadge}>
                      <Moon color={theme.colors.textSecondary} size={14} />
                      <Text style={styles.nightDrivingText}>
                        {t('driving.review.nightDriving')}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreLabel}>
                    {t('driving.review.tripScore')}
                  </Text>
                  <Text style={styles.scoreValue}>{trip.score}</Text>
                </View>
              </View>
            </Card>

            {/* Driving Events */}
            <Card variant="elevated" style={styles.card}>
              <Text style={styles.sectionTitle}>
                {t('driving.review.drivingEvents')}
              </Text>

              {hasEvents ? (
                <View style={styles.eventsSection}>
                  {trip.events.speeding > 0 && (
                    <View style={styles.eventItem}>
                      <View style={styles.eventIcon}>
                        <AlertCircle color={theme.colors.error || '#dc2626'} size={20} />
                      </View>
                      <View style={styles.eventContent}>
                        <Text style={styles.eventTitle}>
                          {t('driving.trends.speeding')}
                        </Text>
                      </View>
                      <Text style={styles.eventCount}>
                        {trip.events.speeding}
                      </Text>
                    </View>
                  )}

                  {trip.events.hardBraking > 0 && (
                    <View style={styles.eventItem}>
                      <View style={styles.eventIcon}>
                        <AlertCircle color={theme.colors.error || '#dc2626'} size={20} />
                      </View>
                      <View style={styles.eventContent}>
                        <Text style={styles.eventTitle}>
                          {t('driving.trends.braking')}
                        </Text>
                      </View>
                      <Text style={styles.eventCount}>
                        {trip.events.hardBraking}
                      </Text>
                    </View>
                  )}

                  {trip.events.rapidAcceleration > 0 && (
                    <View style={styles.eventItem}>
                      <View style={styles.eventIcon}>
                        <Zap color={theme.colors.error || '#dc2626'} size={20} />
                      </View>
                      <View style={styles.eventContent}>
                        <Text style={styles.eventTitle}>
                          {t('driving.trends.acceleration')}
                        </Text>
                      </View>
                      <Text style={styles.eventCount}>
                        {trip.events.rapidAcceleration}
                      </Text>
                    </View>
                  )}

                  {trip.events.cornering > 0 && (
                    <View style={styles.eventItem}>
                      <View style={styles.eventIcon}>
                        <CornerDownRight color={theme.colors.error || '#dc2626'} size={20} />
                      </View>
                      <View style={styles.eventContent}>
                        <Text style={styles.eventTitle}>
                          {t('driving.calculationModal.factors.cornering')}
                        </Text>
                      </View>
                      <Text style={styles.eventCount}>
                        {trip.events.cornering}
                      </Text>
                    </View>
                  )}

                  {trip.events.phoneUsage > 0 && (
                    <View style={styles.eventItem}>
                      <View style={styles.eventIcon}>
                        <Smartphone color={theme.colors.error || '#dc2626'} size={20} />
                      </View>
                      <View style={styles.eventContent}>
                        <Text style={styles.eventTitle}>
                          {t('driving.calculationModal.factors.distractions')}
                        </Text>
                      </View>
                      <Text style={styles.eventCount}>
                        {trip.events.phoneUsage}
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.eventsSection}>
                  <Text style={styles.noEvents}>
                    {t('driving.review.noEvents')}
                  </Text>
                </View>
              )}
            </Card>

            {/* Confirm Review Button */}
            <Button
              title={t('driving.review.confirmReview')}
              onPress={handleConfirmReview}
              style={styles.actionButton}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

