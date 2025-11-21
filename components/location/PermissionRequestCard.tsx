import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { tripTracker } from '@/services/location/tripTracker';
import { AlertCircle, MapPin, Shield } from 'lucide-react-native';
import React from 'react';
import { Alert, AppState, Linking, Platform, Text, View } from 'react-native';

interface PermissionRequestCardProps {
  onPermissionGranted?: () => void;
  onDismiss?: () => void;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    marginBottom: 16,
    padding: 20,
  } as const,
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  } as const,
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  } as const,
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
    flex: 1,
  } as const,
  message: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  } as const,
  benefitsList: {
    marginBottom: 16,
  } as const,
  benefitItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  } as const,
  benefitIcon: {
    marginRight: 8,
  } as const,
  benefitText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  } as const,
  actions: {
    flexDirection: 'row' as const,
    gap: 12,
  } as const,
  actionButton: {
    flex: 1,
  } as const,
  warningContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  } as const,
  warningText: {
    fontSize: 12,
    color: theme.colors.warning,
    marginLeft: 8,
    flex: 1,
  } as const,
}));

export const PermissionRequestCard: React.FC<PermissionRequestCardProps> = ({
  onPermissionGranted,
  onDismiss,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isRequesting, setIsRequesting] = React.useState(false);

  // Listen for app state changes (when user returns from settings)
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: string) => {
    if (nextAppState === 'active') {
      // User returned from settings, check permissions again
      await checkPermissionsAfterSettings();
    }
  };

  const checkPermissionsAfterSettings = async () => {
    try {
      const hasPermissions = await tripTracker.hasPermissions();
      if (hasPermissions) {
        // Permissions granted, start tracking
        const started = await tripTracker.startTracking();
        if (started) {
          onPermissionGranted?.();
        }
      }
    } catch (error) {
      console.error('Error checking permissions after settings:', error);
    }
  };

  const handleEnableTracking = async () => {
    setIsRequesting(true);
    try {
      const granted = await tripTracker.requestPermissions();
      
      if (granted) {
        const started = await tripTracker.startTracking();
        if (started) {
          onPermissionGranted?.();
        } else {
          Alert.alert(
            t('location.trackingError.title'),
            t('location.trackingError.message'),
            [{ text: t('common.ok') }]
          );
        }
      } else {
        // Permission denied - show settings prompt
        Alert.alert(
          t('location.permissionDenied.title'),
          t('location.permissionDenied.message'),
          [
            {
              text: t('common.notNow'),
              style: 'cancel',
              onPress: onDismiss,
            },
            {
              text: t('location.permissionDenied.openSettings'),
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error enabling tracking:', error);
      Alert.alert(
        t('location.trackingError.title'),
        t('location.trackingError.message'),
        [{ text: t('common.ok') }]
      );
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MapPin color={theme.colors.primary} size={24} />
        </View>
        <Text style={styles.title}>{t('location.permissionRequest.title')}</Text>
      </View>

      <View style={styles.warningContainer}>
        <AlertCircle color={theme.colors.warning} size={16} />
        <Text style={styles.warningText}>
          {t('location.permissionRequest.warning')}
        </Text>
      </View>

      <Text style={styles.message}>
        {t('location.permissionRequest.message')}
      </Text>

      <View style={styles.benefitsList}>
        <View style={styles.benefitItem}>
          <Shield color={theme.colors.primary} size={16} style={styles.benefitIcon} />
          <Text style={styles.benefitText}>
            {t('location.permissionRequest.benefit1')}
          </Text>
        </View>
        <View style={styles.benefitItem}>
          <Shield color={theme.colors.primary} size={16} style={styles.benefitIcon} />
          <Text style={styles.benefitText}>
            {t('location.permissionRequest.benefit2')}
          </Text>
        </View>
        <View style={styles.benefitItem}>
          <Shield color={theme.colors.primary} size={16} style={styles.benefitIcon} />
          <Text style={styles.benefitText}>
            {t('location.permissionRequest.benefit3')}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        {onDismiss && (
          <Button
            title={t('common.notNow')}
            variant="outline"
            onPress={onDismiss}
            style={styles.actionButton}
            disabled={isRequesting}
          />
        )}
        <Button
          title={isRequesting ? t('common.loading') : t('location.permissionRequest.enable')}
          onPress={handleEnableTracking}
          style={styles.actionButton}
          disabled={isRequesting}
        />
      </View>
    </Card>
  );
};

