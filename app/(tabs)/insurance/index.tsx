import { Header } from '@/components/layout/Header';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: theme.spacing.md,
  } as const,
  header: {
    marginBottom: theme.spacing.xl,
  } as const,
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  } as const,
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  } as const,
  grid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
  } as const,
  card: {
    width: '48%',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as const,
  cardIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.md,
  } as const,
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    textAlign: 'center' as const,
    marginBottom: theme.spacing.xs,
  } as const,
  cardDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  } as const,
}));

const insuranceFeatures = [
  {
    id: 'policies',
    title: 'My Policies',
    description: 'View and manage your insurance policies',
    icon: '📄',
    route: '/policies/viewPolicies',
  },
  {
    id: 'claims',
    title: 'My Claims',
    description: 'Track and submit insurance claims',
    icon: '🛡️',
    route: '/claims/trackClaim',
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Discover new insurance products',
    icon: '🛒',
    route: '/product/marketplace',
  },
  {
    id: 'new-claim',
    title: 'File Claim',
    description: 'Submit a new insurance claim',
    icon: '➕',
    route: '/claims/new',
  },
];

export default function InsuranceHome() {
  const styles = useStyles();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title={t('insurance.title')} showNotifications={true} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>

        <View style={styles.grid}>
          {insuranceFeatures.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.card}
              onPress={() => router.push(feature.route as any)}
            >
              <Text style={styles.cardIcon}>{feature.icon}</Text>
              <Text style={styles.cardTitle}>{feature.title}</Text>
              <Text style={styles.cardDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      </ScrollView>
    </View>
  );
}