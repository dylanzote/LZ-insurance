import React, { useState } from 'react';
import { View, ScrollView, Switch, TouchableOpacity, Alert, Linking } from 'react-native';
import {
  Moon,
  Sun,
  Smartphone,
  Globe,
  Bell,
  MapPin,
  Shield,
  Database,
  Lock,
  Info,
  FileText,
  ExternalLink,
  ChevronRight,
} from 'lucide-react-native';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/core/theme/useTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { tripTracker } from '@/services/location/tripTracker';
import { ThemeSelectorModal } from '../components/ThemeSelectorModal';
import { LanguageSelectorModal } from '../components/LanguageSelectorModal';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: 16,
  } as const,
  section: {
    marginBottom: 24,
  } as const,
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 16,
  } as const,
  settingCard: {
    padding: 20,
    marginBottom: 16,
  } as const,
  settingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  settingRowLast: {
    borderBottomWidth: 0,
  } as const,
  settingLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  } as const,
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  } as const,
  settingContent: {
    flex: 1,
  } as const,
  settingLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  settingDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  } as const,
  settingValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 8,
  } as const,
  versionCard: {
    padding: 20,
    alignItems: 'center' as const,
  } as const,
  versionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  } as const,
}));

export const SettingsScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme, mode, setMode, isDark } = useTheme();
  const { locale, setLocale } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  React.useEffect(() => {
    checkLocationTrackingStatus();
  }, []);

  const checkLocationTrackingStatus = async () => {
    try {
      const status = await Location.getForegroundPermissionsAsync();
      const isTracking = tripTracker.isTrackingActive();
      setLocationTrackingEnabled(status.granted && isTracking);
    } catch (error) {
      console.error('Error checking location tracking:', error);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setMode(newTheme);
  };

  const handleLanguageChange = (newLocale: 'en' | 'fr') => {
    setLocale(newLocale);
  };

  const handleLocationTrackingToggle = async (value: boolean) => {
    try {
      if (value) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          await tripTracker.startTracking();
          setLocationTrackingEnabled(true);
        } else {
          Alert.alert(
            t('settings.location.permissionDenied'),
            t('settings.location.permissionMessage')
          );
          setLocationTrackingEnabled(false);
        }
      } else {
        await tripTracker.stopTracking();
        setLocationTrackingEnabled(false);
      }
    } catch (error) {
      console.error('Error toggling location tracking:', error);
      Alert.alert(t('settings.location.error'), t('settings.location.errorMessage'));
    }
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open URL:', err);
      Alert.alert(t('settings.error.openLink'), t('settings.error.openLinkMessage'));
    });
  };

  const getThemeDisplayName = () => {
    if (mode === 'system') return t('settings.theme.system');
    return mode === 'dark' ? t('settings.theme.dark') : t('settings.theme.light');
  };

  const getLanguageDisplayName = () => {
    return locale === 'en' ? 'English' : 'Français';
  };

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  return (
    <View style={styles.container}>
      <Header title={t('settings.title')} showNotifications={true} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Appearance Settings */}
        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            {t('settings.appearance.title')}
          </Text>
          <Card variant="elevated" style={styles.settingCard}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setThemeModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Sun size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text variant="body" weight="semibold" style={styles.settingLabel}>
                    {t('settings.appearance.theme')}
                  </Text>
                  <Text variant="caption" style={styles.settingDescription}>
                    {t('settings.appearance.themeDescription')}
                  </Text>
                </View>
              </View>
              <Text variant="bodySmall" style={styles.settingValue}>
                {getThemeDisplayName()}
              </Text>
              <ChevronRight size={20} color={styles.settingValue.color} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setLanguageModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Globe size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text variant="body" weight="semibold" style={styles.settingLabel}>
                    {t('settings.appearance.language')}
                  </Text>
                  <Text variant="caption" style={styles.settingDescription}>
                    {t('settings.appearance.languageDescription')}
                  </Text>
                </View>
              </View>
              <Text variant="bodySmall" style={styles.settingValue}>
                {getLanguageDisplayName()}
              </Text>
              <ChevronRight size={20} color={styles.settingValue.color} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Notifications & Location */}
        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            {t('settings.notifications.title')}
          </Text>
          <Card variant="elevated" style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Bell size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text variant="body" weight="semibold" style={styles.settingLabel}>
                    {t('settings.notifications.pushNotifications')}
                  </Text>
                  <Text variant="caption" style={styles.settingDescription}>
                    {t('settings.notifications.pushDescription')}
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
            <View style={[styles.settingRow, styles.settingRowLast]}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <MapPin size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text variant="body" weight="semibold" style={styles.settingLabel}>
                    {t('settings.notifications.locationTracking')}
                  </Text>
                  <Text variant="caption" style={styles.settingDescription}>
                    {t('settings.notifications.locationDescription')}
                  </Text>
                </View>
              </View>
              <Switch
                value={locationTrackingEnabled}
                onValueChange={handleLocationTrackingToggle}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor={locationTrackingEnabled ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
          </Card>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            {t('settings.privacy.title')}
          </Text>
          <Card variant="elevated" style={styles.settingCard}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => handleOpenLink('https://example.com/privacy')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Shield size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text variant="body" weight="semibold" style={styles.settingLabel}>
                    {t('settings.privacy.privacyPolicy')}
                  </Text>
                  <Text variant="caption" style={styles.settingDescription}>
                    {t('settings.privacy.privacyPolicyDescription')}
                  </Text>
                </View>
              </View>
              <ExternalLink size={18} color={styles.settingValue.color} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => handleOpenLink('https://example.com/terms')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <FileText size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text variant="body" weight="semibold" style={styles.settingLabel}>
                    {t('settings.privacy.termsOfService')}
                  </Text>
                  <Text variant="caption" style={styles.settingDescription}>
                    {t('settings.privacy.termsDescription')}
                  </Text>
                </View>
              </View>
              <ExternalLink size={18} color={styles.settingValue.color} />
            </TouchableOpacity>
            <View style={[styles.settingRow, styles.settingRowLast]}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Database size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text variant="body" weight="semibold" style={styles.settingLabel}>
                    {t('settings.privacy.dataManagement')}
                  </Text>
                  <Text variant="caption" style={styles.settingDescription}>
                    {t('settings.privacy.dataManagementDescription')}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={styles.settingValue.color} />
            </View>
          </Card>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            {t('settings.about.title')}
          </Text>
          <Card variant="elevated" style={styles.settingCard}>
            <TouchableOpacity
              style={[styles.settingRow, styles.settingRowLast]}
              onPress={() => Alert.alert(t('settings.about.appName'), t('settings.about.appDescription'))}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Info size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text variant="body" weight="semibold" style={styles.settingLabel}>
                    {t('settings.about.about')}
                  </Text>
                  <Text variant="caption" style={styles.settingDescription}>
                    {t('settings.about.aboutDescription')}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={styles.settingValue.color} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Version */}
        <Card variant="elevated" style={styles.versionCard}>
          <Text variant="caption" style={styles.versionText}>
            {t('settings.about.version')} {appVersion}
          </Text>
        </Card>
      </ScrollView>

      {/* Modals */}
      <ThemeSelectorModal
        visible={themeModalVisible}
        onClose={() => setThemeModalVisible(false)}
        onSelect={handleThemeChange}
      />
      <LanguageSelectorModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        onSelect={handleLanguageChange}
      />
    </View>
  );
};

