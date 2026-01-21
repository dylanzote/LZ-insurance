import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Shield, Lock, Eye, Database, FileText, Mail, Phone, AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { ScrollView, TouchableOpacity, View, Linking } from 'react-native';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: theme.spacing.md,
  } as const,
  section: {
    marginBottom: theme.spacing.xl,
  } as const,
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  sectionIcon: {
    marginRight: theme.spacing.sm,
  } as const,
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  } as const,
  bulletPoint: {
    fontSize: 15,
    lineHeight: 24,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.md,
  } as const,
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  } as const,
  highlightBox: {
    backgroundColor: theme.colors.primaryLight + '10',
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    marginBottom: theme.spacing.md,
  } as const,
  contactRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  } as const,
  contactIcon: {
    marginRight: theme.spacing.md,
  } as const,
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline' as const,
  } as const,
}));

export default function PrivacyScreen() {
  const { theme } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();

  const handleEmailPress = () => {
    Linking.openURL('mailto:privacy@lzinsurance.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:1-800-LZ-PRIVACY');
  };

  return (
    <View style={styles.container}>
      <Header title={t('privacy.title')} showNotifications={true} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Introduction */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.highlightBox}>
            <Text variant="body" weight="semibold" style={{ marginBottom: 8 }}>
              {t('privacy.lastUpdated')}
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              {t('privacy.lastUpdatedDate')}
            </Text>
          </View>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.introduction')}
          </Text>
        </Card>

        {/* Information We Collect */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionTitle}>
            <Database size={24} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text variant="h3" weight="bold">
              {t('privacy.informationWeCollect')}
            </Text>
          </View>
          
          <Text variant="subtitle" weight="semibold" style={styles.subtitle}>
            {t('privacy.personalInformation')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            • {t('privacy.personalInfo1')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            • {t('privacy.personalInfo2')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            • {t('privacy.personalInfo3')}
          </Text>

          <Text variant="subtitle" weight="semibold" style={styles.subtitle}>
            {t('privacy.insuranceInformation')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            • {t('privacy.insuranceInfo1')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            • {t('privacy.insuranceInfo2')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            • {t('privacy.insuranceInfo3')}
          </Text>

          <Text variant="subtitle" weight="semibold" style={styles.subtitle}>
            {t('privacy.usageData')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            • {t('privacy.usageData1')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            • {t('privacy.usageData2')}
          </Text>
        </Card>

        {/* How We Use Your Information */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionTitle}>
            <Eye size={24} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text variant="h3" weight="bold">
              {t('privacy.howWeUse')}
            </Text>
          </View>
          
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.usePurpose1')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.usePurpose2')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.usePurpose3')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.usePurpose4')}
          </Text>
        </Card>

        {/* Security Measures */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionTitle}>
            <Lock size={24} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text variant="h3" weight="bold">
              {t('privacy.securityMeasures')}
            </Text>
          </View>
          
          <Text variant="subtitle" weight="semibold" style={styles.subtitle}>
            {t('privacy.dataEncryption')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.encryptionDesc')}
          </Text>

          <Text variant="subtitle" weight="semibold" style={styles.subtitle}>
            {t('privacy.accessControls')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.accessControlsDesc')}
          </Text>

          <Text variant="subtitle" weight="semibold" style={styles.subtitle}>
            {t('privacy.securityAudits')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.auditsDesc')}
          </Text>

          <Text variant="subtitle" weight="semibold" style={styles.subtitle}>
            {t('privacy.multiFactorAuth')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.mfaDesc')}
          </Text>
        </Card>

        {/* Your Rights */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionTitle}>
            <FileText size={24} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text variant="h3" weight="bold">
              {t('privacy.yourRights')}
            </Text>
          </View>
          
          <Text variant="body" style={styles.paragraph}>
            <Text variant="body" weight="semibold">• {t('privacy.rightAccess')}</Text>
            {'\n'}  {t('privacy.rightAccessDesc')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            <Text variant="body" weight="semibold">• {t('privacy.rightCorrection')}</Text>
            {'\n'}  {t('privacy.rightCorrectionDesc')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            <Text variant="body" weight="semibold">• {t('privacy.rightDeletion')}</Text>
            {'\n'}  {t('privacy.rightDeletionDesc')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            <Text variant="body" weight="semibold">• {t('privacy.rightPortability')}</Text>
            {'\n'}  {t('privacy.rightPortabilityDesc')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            <Text variant="body" weight="semibold">• {t('privacy.rightObjection')}</Text>
            {'\n'}  {t('privacy.rightObjectionDesc')}
          </Text>
        </Card>

        {/* Data Sharing */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionTitle}>
            <Shield size={24} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text variant="h3" weight="bold">
              {t('privacy.dataSharing')}
            </Text>
          </View>
          
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.sharingPolicy1')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.sharingPolicy2')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.sharingPolicy3')}
          </Text>
        </Card>

        {/* Data Retention */}
        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" weight="bold" style={{ marginBottom: 12 }}>
            {t('privacy.dataRetention')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.retentionPolicy1')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.retentionPolicy2')}
          </Text>
        </Card>

        {/* Cookies and Tracking */}
        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" weight="bold" style={{ marginBottom: 12 }}>
            {t('privacy.cookiesTracking')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.cookiesDesc1')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.cookiesDesc2')}
          </Text>
        </Card>

        {/* Children's Privacy */}
        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" weight="bold" style={{ marginBottom: 12 }}>
            {t('privacy.childrenPrivacy')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.childrenDesc')}
          </Text>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" weight="bold" style={{ marginBottom: 12 }}>
            {t('privacy.changes')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.changesDesc')}
          </Text>
        </Card>

        {/* Data Breach Notification */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionTitle}>
            <AlertTriangle size={24} color={theme.colors.warning} style={styles.sectionIcon} />
            <Text variant="h3" weight="bold">
              {t('privacy.dataBreach')}
            </Text>
          </View>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.breachPolicy1')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.breachPolicy2')}
          </Text>
          <Text variant="body" style={styles.paragraph}>
            {t('privacy.breachPolicy3')}
          </Text>
        </Card>

        {/* Contact Information */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionTitle}>
            <Mail size={24} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text variant="h3" weight="bold">
              {t('privacy.contactUs')}
            </Text>
          </View>
          
          <Text variant="body" style={{ marginBottom: 16 }}>
            {t('privacy.contactDesc')}
          </Text>

          <TouchableOpacity style={styles.contactRow} onPress={handleEmailPress}>
            <Mail size={20} color={theme.colors.primary} style={styles.contactIcon} />
            <Text variant="body" style={styles.link}>
              privacy@lzinsurance.com
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={handlePhonePress}>
            <Phone size={20} color={theme.colors.primary} style={styles.contactIcon} />
            <Text variant="body" style={styles.link}>
              1-800-LZ-PRIVACY (1-800-597-7482)
            </Text>
          </TouchableOpacity>

          <Text variant="body" style={{ marginTop: 16, color: theme.colors.textSecondary }}>
            {t('privacy.contactHours')}
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

