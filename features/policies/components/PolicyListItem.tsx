import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronRight, Car, Home } from 'lucide-react-native';
import type { Policy } from '../types';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/core/theme/useTheme';

interface PolicyListItemProps {
  policy: Policy;
  onPress: (policy: Policy) => void;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    marginBottom: 16,
  } as const,
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 20,
  } as const,
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  } as const,
  content: {
    flex: 1,
  } as const,
  policyName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 6,
    lineHeight: 24,
  } as const,
  policyNumber: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  } as const,
  statusRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 8,
  } as const,
  statusText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500' as const,
  } as const,
  chevron: {
    marginLeft: 16,
    opacity: 0.5,
  } as const,
}));

const getTypeIcon = (policy: Policy) => {
  // For motorcycle, we'll use Car icon as fallback since Motorcycle/Bike may not be available
  if (policy.type === 'auto') {
    return Car;
  }
  if (policy.type === 'home') {
    return Home;
  }
  return Car;
};

const getTypeColor = (policy: Policy) => {
  if (policy.type === 'auto') {
    return '#FF6B6B';
  }
  if (policy.type === 'home') {
    return '#4ECDC4';
  }
  return '#3b82f6';
};

export const PolicyListItem: React.FC<PolicyListItemProps> = ({ policy, onPress }) => {
  const styles = useStyles();
  const { t, locale } = useTranslation();
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formatLocale = locale === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(formatLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPolicyDisplayName = () => {
    if (policy.vehicleDetails) {
      const { make, model, year } = policy.vehicleDetails;
      return `${make} ${model} ${year}`;
    }
    if (policy.propertyDetails) {
      const { address, city, state, zipCode } = policy.propertyDetails;
      return [address, city, state, zipCode].filter(Boolean).join(', ');
    }
    return policy.vehicle || policy.property || t(`policies.types.${policy.type}`);
  };

  const Icon = getTypeIcon(policy);
  const iconColor = getTypeColor(policy);

  return (
    <Card
      variant="elevated"
      padding="none"
      style={styles.card}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress(policy)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${getPolicyDisplayName()}, Policy ${policy.id}`}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Icon color={iconColor} size={28} />
        </View>
        <View style={styles.content}>
          <Text variant="h3" weight="bold" style={styles.policyName}>
            {getPolicyDisplayName()}
          </Text>
          <Text variant="caption" style={styles.policyNumber}>
            {t('policies.policyNumber')} {policy.id}
          </Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text variant="caption" style={styles.statusText}>
              {t('policies.active')} until {formatDate(policy.endDate)}
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color={styles.statusText.color} style={styles.chevron} />
      </TouchableOpacity>
    </Card>
  );
};
