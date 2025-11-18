import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert } from 'react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/core/theme/useTheme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Shield, X, CheckCircle } from 'lucide-react-native';

interface DriverValidationModalProps {
  visible: boolean;
  onValidate: () => void;
  onCancel: () => void;
  tripDate: string;
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
    maxWidth: 400,
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
  onCancel,
  tripDate,
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
    >
      <View style={styles.modalOverlay}>
        <Card variant="elevated" style={styles.modalContent}>
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
              {new Date(tripDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

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
            <Button
              title={t('common.cancel')}
              variant="outline"
              onPress={handleCancel}
              style={styles.button}
            />
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
        </Card>
      </View>
    </Modal>
  );
};

