import React, { useState } from 'react';
import { View, ScrollView, Alert, Switch, TouchableOpacity } from 'react-native';
import { Edit2, Lock, LogOut } from 'lucide-react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useProfile } from '../hooks/useProfile';
import { useTheme } from '@/core/theme/useTheme';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EditProfileModal } from '../components/EditProfileModal';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: theme.spacing.md,
  } as const,
  headerCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radii.xl,
    overflow: 'hidden' as const,
  } as const,
  header: {
    alignItems: 'center' as const,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
  } as const,
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.md,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  } as const,
  avatarText: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: theme.colors.primary,
  } as const,
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  } as const,
  userEmail: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  } as const,
  section: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.radii.lg,
    overflow: 'hidden' as const,
  } as const,
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
  sectionButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  sectionButtonLast: {
    borderBottomWidth: 0,
  } as const,
  sectionButtonText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  } as const,
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  infoRowLast: {
    borderBottomWidth: 0,
  } as const,
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  } as const,
  infoValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500' as const,
    flex: 1,
    textAlign: 'right' as const,
  } as const,
  switchContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  logoutButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  } as const,
}));

export const ProfileScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { profile, isLoading, isLoadingProfile, handleLogout, updateProfile } = useProfile();
  const { theme, isDark, toggle, mode, setMode } = useTheme();
  const { locale, setLocale } = useLanguage();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const confirmLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.confirmLogout'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.logout'), style: 'destructive', onPress: handleLogout },
      ]
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleThemeToggle = (value: boolean) => {
    toggle();
  };

  const getThemeDisplayName = () => {
    switch (mode) {
      case 'light': return t('profile.light');
      case 'dark': return t('profile.dark');
      case 'system': return t('profile.system');
      default: return t('profile.system');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoadingProfile) {
    return (
      <View style={styles.container}>
        <Header title={t('profile.title')} showNotifications={true} />
        <LoadingSpinner message={t('common.loading')} />
      </View>
    );
  }

  const displayUser = profile || {
    id: 'N/A',
    email: 'N/A',
    firstName: 'User',
    lastName: 'Name',
  };

  return (
    <View style={styles.container}>
      <Header title={t('profile.title')} showNotifications={true} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Header */}
          <Card variant="elevated" padding="none" style={styles.headerCard}>
            <View style={styles.header}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(displayUser.firstName || 'U', displayUser.lastName || 'S')}
                </Text>
              </View>
              <Text variant="h2" weight="bold" style={styles.userName}>
                {displayUser.firstName} {displayUser.lastName}
              </Text>
              <Text variant="body" style={styles.userEmail}>{displayUser.email}</Text>
            </View>
          </Card>

          {/* Personal Information */}
          <Card variant="elevated" padding="none" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="body" weight="semibold" style={styles.sectionTitle}>
                {t('profile.personalInformation')}
              </Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(true)}
                activeOpacity={0.7}
              >
                <Edit2 size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                {t('profile.firstName')}
              </Text>
              <Text variant="bodySmall" style={styles.infoValue}>
                {displayUser.firstName}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                {t('profile.lastName')}
              </Text>
              <Text variant="bodySmall" style={styles.infoValue}>
                {displayUser.lastName}
              </Text>
            </View>
            {displayUser.phone && (
              <View style={styles.infoRow}>
                <Text variant="bodySmall" style={styles.infoLabel}>
                  {t('profile.phoneNumber')}
                </Text>
                <Text variant="bodySmall" style={styles.infoValue}>
                  {displayUser.phone}
                </Text>
              </View>
            )}
            {displayUser.address && (
              <View style={styles.infoRow}>
                <Text variant="bodySmall" style={styles.infoLabel}>
                  {t('profile.address')}
                </Text>
                <Text variant="bodySmall" style={styles.infoValue}>
                  {displayUser.address}
                </Text>
              </View>
            )}
            {displayUser.dateOfBirth && (
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text variant="bodySmall" style={styles.infoLabel}>
                  {t('profile.dateOfBirth')}
                </Text>
                <Text variant="bodySmall" style={styles.infoValue}>
                  {formatDate(displayUser.dateOfBirth)}
                </Text>
              </View>
            )}
          </Card>

          {/* Account Information */}
          <Card variant="elevated" padding="none" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="body" weight="semibold" style={styles.sectionTitle}>
                {t('profile.accountInformation')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                {t('profile.userId')}
              </Text>
              <Text variant="bodySmall" style={styles.infoValue}>
                {displayUser.id}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                {t('profile.email')}
              </Text>
              <Text variant="bodySmall" style={styles.infoValue}>
                {displayUser.email}
              </Text>
            </View>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                {t('profile.status')}
              </Text>
              <Badge label={t('profile.active')} variant="success" size="sm" />
            </View>
          </Card>

          {/* Security */}
          <Card variant="elevated" padding="none" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="body" weight="semibold" style={styles.sectionTitle}>
                {t('profile.security')}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.sectionButton, styles.sectionButtonLast]}
              onPress={() => setPasswordModalVisible(true)}
              activeOpacity={0.7}
            >
              <Lock size={20} color={theme.colors.primary} />
              <Text variant="body" style={styles.sectionButtonText}>
                {t('profile.changePassword')}
              </Text>
              <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                →
              </Text>
            </TouchableOpacity>
          </Card>

          {/* App Settings */}
          <Card variant="elevated" padding="none" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="body" weight="semibold" style={styles.sectionTitle}>
                {t('profile.appSettings')}
              </Text>
            </View>
            <View style={styles.switchContainer}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                {t('profile.darkMode')}
              </Text>
              <Switch
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                {t('profile.currentTheme')}
              </Text>
              <Text variant="bodySmall" style={styles.infoValue}>
                {getThemeDisplayName()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                {t('profile.currentLanguage')}
              </Text>
              <Text variant="bodySmall" style={styles.infoValue}>
                {locale === 'en' ? 'English' : 'Français'}
              </Text>
            </View>
            <View style={styles.switchContainer}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                {t('profile.switchToFrench')}
              </Text>
              <Switch
                value={locale === 'fr'}
                onValueChange={(value) => setLocale(value ? 'fr' : 'en')}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor={locale === 'fr' ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                {t('profile.appVersion')}
              </Text>
              <Text variant="bodySmall" style={styles.infoValue}>
                1.0.0
              </Text>
            </View>
          </Card>

          <Button
            title={isLoading ? t('profile.loggingOut') : t('profile.logout')}
            variant="outline"
            onPress={confirmLogout}
            disabled={isLoading}
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        profile={profile}
        onUpdate={updateProfile}
      />
      <ChangePasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      />
    </View>
  );
};
