import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'expo-router';
import { FileText, Plus, Shield, ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

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
  featuresGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    gap: 12,
  } as const,
  featureCard: {
    width: '48%',
    marginBottom: 12,
  } as const,
  featureCardContent: {
    padding: 20,
    alignItems: 'center' as const,
    minHeight: 160,
    justifyContent: 'center' as const,
  } as const,
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  } as const,
  featureTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.colors.text,
    textAlign: 'center' as const,
    marginBottom: 6,
  } as const,
  featureDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 18,
  } as const,
}));

const getFeatureIcon = (iconName: string) => {
  switch (iconName) {
    case 'document-text':
      return FileText;
    case 'shield-checkmark':
      return Shield;
    case 'storefront':
      return ShoppingBag;
    case 'add-circle':
      return Plus;
    default:
      return FileText;
  }
};

export const InsuranceHomeScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const router = useRouter();

  const insuranceFeatures = [
    {
      id: 'policies',
      title: t('insurance.myPolicies'),
      description: t('insurance.features.policiesDescription'),
      icon: 'document-text',
      color: '#FF6B6B',
      route: '/policies/viewPolicies',
    },
    {
      id: 'claims',
      title: t('insurance.myClaims'),
      description: t('insurance.features.claimsDescription'),
      icon: 'shield-checkmark',
      color: '#4ECDC4',
      route: '/claims/trackClaim',
    },
    {
      id: 'marketplace',
      title: t('insurance.marketplace'),
      description: t('insurance.features.marketplaceDescription'),
      icon: 'storefront',
      color: '#45B7D1',
      route: '/product/marketplace',
    },
    {
      id: 'new-claim',
      title: t('insurance.fileClaim'),
      description: t('insurance.features.fileClaimDescription'),
      icon: 'add-circle',
      color: '#96CEB4',
      route: '/claims/new',
    },
  ];

  return (
    <View style={styles.container}>
      <Header title={t('insurance.title')} showNotifications={true} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text variant="h3" weight="bold" style={styles.sectionTitle}>
              {t('insurance.features.title')}
            </Text>
            <View style={styles.featuresGrid}>
              {insuranceFeatures.map((feature) => {
                const Icon = getFeatureIcon(feature.icon);
                return (
                  <Card
                    key={feature.id}
                    variant="elevated"
                    style={styles.featureCard}
                  >
                    <TouchableOpacity
                      style={styles.featureCardContent}
                      onPress={() => router.push(feature.route as any)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.featureIcon,
                          { backgroundColor: feature.color + '20' },
                        ]}
                      >
                        <Icon size={28} color={feature.color} />
                      </View>
                      <Text variant="body" weight="semibold" style={styles.featureTitle}>
                        {feature.title}
                      </Text>
                      <Text variant="caption" style={styles.featureDescription}>
                        {feature.description}
                      </Text>
                    </TouchableOpacity>
                  </Card>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

