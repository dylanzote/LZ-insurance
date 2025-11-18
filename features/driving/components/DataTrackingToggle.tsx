import React from 'react';
import { View, Text, Switch, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/core/theme/useTheme';
import { Card } from '@/components/ui/Card';
import { MapPin, Settings } from 'lucide-react-native';
import { tripTracker } from '@/services/location/tripTracker';

interface DataTrackingToggleProps {
  onToggle?: (enabled: boolean) => void;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    marginBottom: 16,
    padding: 16,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  } as const,
  leftSection: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  } as const,
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  } as const,
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 2,
  } as const,
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  } as const,
  statusContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginLeft: 12,
  } as const,
  statusText: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginRight: 8,
  } as const,
  statusOn: {
    color: theme.colors.success,
  } as const,
  statusOff: {
    color: theme.colors.textSecondary,
  } as const,
  description: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
    marginTop: 8,
  } as const,
  settingsButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 8,
    paddingVertical: 8,
  } as const,
  settingsText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: 6,
  } as const,
}));

export const DataTrackingToggle: React.FC<DataTrackingToggleProps> = ({
  onToggle,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    checkTrackingStatus();
  }, []);

  const checkTrackingStatus = async () => {
    const hasPermissions = await tripTracker.hasPermissions();
    const isTracking = tripTracker.isTrackingActive();
    setIsEnabled(hasPermissions && isTracking);
  };

  const handleToggle = async (value: boolean) => {
    setIsLoading(true);
    try {
      if (value) {
        // Enable tracking
        const hasPermissions = await tripTracker.hasPermissions();
        if (!hasPermissions) {
          const granted = await tripTracker.requestPermissions();
          if (!granted) {
            Alert.alert(
              t('location.permissionDenied.title'),
              t('location.permissionDenied.message'),
              [
                { text: t('common.cancel'), style: 'cancel' },
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
            setIsLoading(false);
            return;
          }
        }
        
        const started = await tripTracker.startTracking();
        if (started) {
          setIsEnabled(true);
          onToggle?.(true);
        } else {
          Alert.alert(
            t('location.trackingError.title'),
            t('location.trackingError.message')
          );
        }
      } else {
        // Disable tracking
        await tripTracker.stopTracking();
        setIsEnabled(false);
        onToggle?.(false);
      }
    } catch (error) {
      console.error('Error toggling tracking:', error);
      Alert.alert(
        t('location.trackingError.title'),
        t('location.trackingError.message')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <MapPin color={theme.colors.primary} size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {t('driving.tracking.title')}
            </Text>
            <Text style={styles.subtitle}>
              {t('driving.tracking.subtitle')}
            </Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, isEnabled ? styles.statusOn : styles.statusOff]}>
            {isEnabled ? t('driving.tracking.on') : t('driving.tracking.off')}
          </Text>
          <Switch
            value={isEnabled}
            onValueChange={handleToggle}
            disabled={isLoading}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
            thumbColor={isEnabled ? theme.colors.white : '#f4f3f4'}
          />
        </View>
      </View>
      
      <Text style={styles.description}>
        {t('driving.tracking.description')}
      </Text>

      {!isEnabled && (
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleOpenSettings}
        >
          <Settings color={theme.colors.primary} size={16} />
          <Text style={styles.settingsText}>
            {t('driving.tracking.openSettings')}
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

