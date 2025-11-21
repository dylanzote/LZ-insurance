import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Calendar,
  ChevronRight,
  Edit2,
  Heart,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  Users
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { EditProfileModal } from '../components/EditProfileModal';
import { TwoStepVerificationModal } from '../components/TwoStepVerificationModal';
import { useProfile } from '../hooks/useProfile';
import type { UserProfile } from '../types';

const { width } = Dimensions.get('window');

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    paddingBottom: 24,
  } as const,
  heroSection: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
    marginBottom: 24,
  } as const,
  profileHeader: {
    alignItems: 'center' as const,
    position: 'relative' as const,
  } as const,
  avatarContainer: {
    position: 'relative' as const,
    marginBottom: 16,
  } as const,
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 4,
    borderColor: theme.colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden' as const,
  } as const,
  avatarText: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: theme.colors.primary,
    letterSpacing: 0.5,
    textAlign: 'center' as const,
    textAlignVertical: 'center' as const,
    includeFontPadding: false,
    lineHeight: 36,
  } as const,
  editAvatarButton: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 3,
    borderColor: theme.colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  } as const,
  userName: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 6,
    textAlign: 'center' as const,
  } as const,
  userEmail: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  } as const,
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  } as const,
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 12,
    letterSpacing: 0.3,
  } as const,
  infoCard: {
    marginBottom: 12,
    overflow: 'hidden' as const,
  } as const,
  infoItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 18,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  infoItemLast: {
    borderBottomWidth: 0,
  } as const,
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  } as const,
  infoContent: {
    flex: 1,
  } as const,
  infoLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500' as const,
  } as const,
  infoValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600' as const,
    lineHeight: 22,
  } as const,
  emptyValue: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontStyle: 'italic' as const,
  } as const,
  securityCard: {
    marginBottom: 12,
    overflow: 'hidden' as const,
  } as const,
  securityItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: 18,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  securityItemLast: {
    borderBottomWidth: 0,
  } as const,
  securityLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  } as const,
  securityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  } as const,
  securityContent: {
    flex: 1,
  } as const,
  securityTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  securityDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  } as const,
  securityBadge: {
    marginLeft: 12,
  } as const,
  chevron: {
    marginLeft: 8,
  } as const,
}));

export const ProfileScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { profile, user, isLoadingProfile, updateProfile } = useProfile();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [twoStepModalVisible, setTwoStepModalVisible] = useState(false);
  // Two-step verification status (in production, fetch from API)
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);
  const [twoStepMethod, setTwoStepMethod] = useState<'sms' | 'email' | null>(null);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoadingProfile) {
    return (
      <View style={styles.container}>
        <Header title={t('profile.title')} showNotifications={true} />
        <LoadingSpinner message={t('common.loading')} />
      </View>
    );
  }

  // Use profile data if available, otherwise fallback to user from auth context
  // This ensures we always have data and makes it easy to integrate with real APIs
  // In production, profileAPI.getProfile() will be replaced with real API call
  const displayUser: UserProfile | null = profile || (user ? {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phoneNumber,
    address: undefined, // Not available in auth user, will be fetched from profile API
    dateOfBirth: undefined, // Not available in auth user, will be fetched from profile API
    maritalStatus: undefined, // Not available in auth user, will be fetched from profile API
    gender: undefined, // Not available in auth user, will be fetched from profile API
  } : null);

  // If no user data at all, show error state
  if (!displayUser) {
    return (
      <View style={styles.container}>
        <Header title={t('profile.title')} showNotifications={true} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text variant="body" style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
            {t('profile.loadError')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t('profile.title')} showNotifications={true} />
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Hero Section with Profile Header */}
        <View style={styles.heroSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(displayUser.firstName || 'U', displayUser.lastName || 'S')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editAvatarButton}
                onPress={() => setEditModalVisible(true)}
                activeOpacity={0.8}
              >
                <Edit2 size={18} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
            <Text variant="h2" weight="bold" style={styles.userName}>
              {displayUser.firstName} {displayUser.lastName}
            </Text>
            <Text variant="body" style={styles.userEmail}>
              {displayUser.email}
            </Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            {t('profile.personalInformation')}
          </Text>
          
          <Card variant="elevated" style={styles.infoCard}>
            {/* Full Name */}
            <TouchableOpacity 
              style={styles.infoItem}
              onPress={() => setEditModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <User size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {t('profile.fullName')}
                </Text>
                <Text style={styles.infoValue}>
                  {displayUser.firstName} {displayUser.lastName}
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {/* Email */}
            <View style={styles.infoItem}>
              <View style={styles.iconWrapper}>
                <Mail size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {t('profile.email')}
                </Text>
                <Text style={styles.infoValue}>
                  {displayUser.email}
                </Text>
              </View>
            </View>

            {/* Phone Number */}
            <TouchableOpacity 
              style={styles.infoItem}
              onPress={() => setEditModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Phone size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {t('profile.phoneNumber')}
                </Text>
                {displayUser.phone ? (
                  <Text style={styles.infoValue}>
                    {displayUser.phone}
                  </Text>
                ) : (
                  <Text style={styles.emptyValue}>
                    {t('profile.notProvided')}
                  </Text>
                )}
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {/* Address */}
            {displayUser.address && (
              <TouchableOpacity 
                style={styles.infoItem}
                onPress={() => setEditModalVisible(true)}
                activeOpacity={0.7}
              >
                <View style={styles.iconWrapper}>
                  <MapPin size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>
                    {t('profile.address')}
                  </Text>
                  <Text style={styles.infoValue} numberOfLines={2}>
                    {displayUser.address}
                  </Text>
                </View>
                <ChevronRight size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}

            {/* Date of Birth */}
            {displayUser.dateOfBirth && (
              <View style={styles.infoItem}>
                <View style={styles.iconWrapper}>
                  <Calendar size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>
                    {t('profile.dateOfBirth')}
                  </Text>
                  <Text style={styles.infoValue}>
                    {formatDate(displayUser.dateOfBirth)}
                  </Text>
                </View>
              </View>
            )}

            {/* Marital Status */}
            <TouchableOpacity 
              style={styles.infoItem}
              onPress={() => setEditModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Heart size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {t('quotes.form.maritalStatus')}
                </Text>
                {displayUser.maritalStatus ? (
                  <Text style={styles.infoValue}>
                    {t(`quotes.form.marital.${displayUser.maritalStatus}`)}
                  </Text>
                ) : (
                  <Text style={styles.emptyValue}>
                    {t('profile.notProvided')}
                  </Text>
                )}
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {/* Gender */}
            <TouchableOpacity 
              style={[styles.infoItem, styles.infoItemLast]}
              onPress={() => setEditModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Users size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {t('quotes.form.gender')}
                </Text>
                {displayUser.gender ? (
                  <Text style={styles.infoValue}>
                    {t(`quotes.form.genderOptions.${displayUser.gender}`)}
                  </Text>
                ) : (
                  <Text style={styles.emptyValue}>
                    {t('profile.notProvided')}
                  </Text>
                )}
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            {t('profile.security')}
          </Text>
          
          <Card variant="elevated" style={styles.securityCard}>
            {/* Change Password */}
            <TouchableOpacity
              style={styles.securityItem}
              onPress={() => setPasswordModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.securityLeft}>
                <View style={styles.securityIcon}>
                  <Lock size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.securityContent}>
                  <Text style={styles.securityTitle}>
                    {t('profile.changePassword')}
                  </Text>
                  <Text style={styles.securityDescription}>
                    {t('profile.changePasswordDescription')}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {/* Two-Step Verification */}
            <TouchableOpacity
              style={[styles.securityItem, styles.securityItemLast]}
              onPress={() => setTwoStepModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.securityLeft}>
                <View style={styles.securityIcon}>
                  <Shield size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.securityContent}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={styles.securityTitle}>
                      {t('profile.twoStepVerification')}
                    </Text>
                    {twoStepEnabled && (
                      <Badge 
                        label={t('profile.enabled')} 
                        variant="success" 
                        size="sm"
                        style={styles.securityBadge}
                      />
                    )}
                  </View>
                  <Text style={styles.securityDescription}>
                    {twoStepEnabled 
                      ? t('profile.twoStepEnabledDescription', { method: twoStepMethod === 'sms' ? 'SMS' : 'Email' })
                      : t('profile.twoStepDescription')
                    }
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </Card>
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
      <TwoStepVerificationModal
        visible={twoStepModalVisible}
        onClose={() => setTwoStepModalVisible(false)}
        enabled={twoStepEnabled}
        method={twoStepMethod}
        onToggle={(enabled, method) => {
          setTwoStepEnabled(enabled);
          setTwoStepMethod(method);
        }}
      />
    </View>
  );
};
