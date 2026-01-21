import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { CheckCircle, Shield, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { TripMap } from './TripMap';
import { TripData } from '../types';

interface DriverValidationModalProps {
  visible: boolean;
  onValidate: () => void;
  onReject: () => void;
  onCancel: () => void;
  trip: TripData;
}

const useStyles = createThemedStyles((theme) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
  } as const,
  scrollContent: {
    flexGrow: 1,
  } as const,
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden' as const,
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  mapButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  } as const,
  mapButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
    marginLeft: 8,
  } as const,
  locationInfo: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
  } as const,
  locationItem: {
    flex: 1,
  } as const,
  locationLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  } as const,
  locationValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  } as const,
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: theme.colors.text,
    flex: 1,
  } as const,
  closeButton: {
    padding: 8,
  } as const,
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    alignSelf: 'center' as const,
    marginBottom: 24,
  } as const,
  message: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center' as const,
    marginBottom: 16,
    lineHeight: 24,
  } as const,
  tripInfo: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  } as const,
  tripInfoLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  } as const,
  tripInfoValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
  checkboxContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 24,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  } as const,
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  } as const,
  checkboxLabel: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 20,
  } as const,
  buttonContainer: {
    flexDirection: 'row' as const,
    gap: 12,
  } as const,
  button: {
    flex: 1,
  } as const,
  rejectButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as const,
  rejectButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  } as const,
  warningText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginTop: 12,
    fontStyle: 'italic' as const,
  } as const,
}));

export const DriverValidationModal: React.FC<DriverValidationModalProps> = ({
  visible,
  onValidate,
  onReject,
  onCancel,
  trip,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleValidate = () => {
    if (!isConfirmed) {
      Alert.alert(
        t('driving.review.validationRequired'),
        t('driving.review.confirmRequired'),
        [{ text: t('common.ok') }]
      );
      return;
    }
    onValidate();
  };

  const handleReject = () => {
    Alert.alert(
      t('driving.review.rejectTitle'),
      t('driving.review.rejectMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('driving.review.rejectConfirm'),
          style: 'destructive',
          onPress: () => {
            setIsConfirmed(false);
            onReject();
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setIsConfirmed(false);
    onCancel();
  };



  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalOverlay}>
        <Card variant="elevated" style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
            <Text style={styles.title}>
              {t('driving.review.validateDriver')}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
            >
              <X color={theme.colors.textSecondary} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
            <Shield color={theme.colors.primary} size={40} />
          </View>

          <Text style={styles.message}>
            {t('driving.review.validationMessage')}
          </Text>

          <View style={styles.tripInfo}>
            <Text style={styles.tripInfoLabel}>
              {t('driving.review.tripDate')}
            </Text>
            <Text style={styles.tripInfoValue}>
              {new Date(trip.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          {/* Map Section */}
          {trip.startLocation && trip.endLocation && (
            <View style={{ marginBottom: 16 }}>
              <TripMap trip={trip} height={200} showControls={true} />
            </View>
          )}

          {/* Location Info */}
          {trip.startLocation && trip.endLocation && (
            <View style={styles.locationInfo}>
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>
                  {t('driving.review.startLocation')}
                </Text>
                <Text style={styles.locationValue} numberOfLines={2}>
                  {trip.startLocation.address || `${trip.startLocation.latitude.toFixed(4)}, ${trip.startLocation.longitude.toFixed(4)}`}
                </Text>
              </View>
              <View style={styles.locationItem}>
                <Text style={[styles.locationLabel, { textAlign: 'right' as const }]}>
                  {t('driving.review.endLocation')}
                </Text>
                <Text style={[styles.locationValue, { textAlign: 'right' as const }]} numberOfLines={2}>
                  {trip.endLocation.address || `${trip.endLocation.latitude.toFixed(4)}, ${trip.endLocation.longitude.toFixed(4)}`}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsConfirmed(!isConfirmed)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, isConfirmed && styles.checkboxChecked]}>
              {isConfirmed && (
                <CheckCircle color={theme.colors.white} size={16} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              {t('driving.review.confirmStatement')}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton, { borderColor: theme.colors.error }]}
              onPress={handleReject}
              activeOpacity={0.7}
            >
              <Text style={[styles.rejectButtonText, { color: theme.colors.error }]}>
                {t('driving.review.reject')}
              </Text>
            </TouchableOpacity>
            <Button
              title={t('driving.review.confirm')}
              onPress={handleValidate}
              style={styles.button}
              disabled={!isConfirmed}
            />
          </View>

            <Text style={styles.warningText}>
              {t('driving.review.warning')}
            </Text>
          </ScrollView>
        </Card>
      </View>
    </Modal>
  );
};

