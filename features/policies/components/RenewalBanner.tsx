import React from 'react';
import { View, Text, Alert } from 'react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { Policy } from '../types';

interface RenewalBannerProps {
  policy: Policy;
  onRenew: (policyId: string) => Promise<void>;
  loading?: boolean;
}

const useStyles = createThemedStyles((theme) => ({
  banner: {
    backgroundColor: theme.colors.warning + '20',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginVertical: theme.spacing.sm,
  } as const,
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.warning,
    marginBottom: theme.spacing.xs,
  } as const,
  message: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  } as const,
  button: {
    alignSelf: 'flex-start' as const,
  } as const,
}));

export const RenewalBanner: React.FC<RenewalBannerProps> = ({ 
  policy, 
  onRenew, 
  loading = false 
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleRenew = () => {
    Alert.alert(
      'Renew Policy',
      `Are you sure you want to renew your ${policy.type} policy?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Renew', 
          style: 'default',
          onPress: () => onRenew(policy.id)
        },
      ]
    );
  };

  if (!policy.canRenew && policy.daysUntilExpiry > 30) {
    return null;
  }

  const getMessage = () => {
    if (policy.daysUntilExpiry <= 0) {
      return 'Your policy has expired. Renew now to maintain coverage.';
    } else if (policy.daysUntilExpiry <= 7) {
      return `Your policy expires in ${policy.daysUntilExpiry} days. Renew now to avoid lapse in coverage.`;
    } else {
      return `Your policy expires in ${policy.daysUntilExpiry} days. Consider renewing early.`;
    }
  };

  return (
    <View style={styles.banner}>
      <Text style={styles.title}>Renewal Required</Text>
      <Text style={styles.message}>{getMessage()}</Text>
      <Button
        title={loading ? 'Renewing...' : 'Renew Now'}
        onPress={handleRenew}
        loading={loading}
        size="sm"
        style={styles.button}
      />
    </View>
  );
};