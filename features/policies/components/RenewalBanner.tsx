import React from 'react';
import { View, Text, Alert } from 'react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useBusinessConfig } from '@/core/config/store';
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
  const business = useBusinessConfig();

  const handleRenew = () => {
    Alert.alert(
      t('policies.renewal.confirmTitle'),
      t('policies.renewal.confirmMessage', { type: policy.type }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('policies.renewal.renew'), 
          style: 'default',
          onPress: () => onRenew(policy.id)
        },
      ]
    );
  };

  const renewalThreshold = business.paymentGracePeriod || 30;
  if (!policy.canRenew && policy.daysUntilExpiry > renewalThreshold) {
    return null;
  }

  const getMessage = () => {
    if (policy.daysUntilExpiry <= 0) {
      return t('policies.renewal.expired');
    } else if (policy.daysUntilExpiry <= 7) {
      return t('policies.renewal.expiresSoon', { days: policy.daysUntilExpiry });
    } else {
      return t('policies.renewal.expiresIn', { days: policy.daysUntilExpiry });
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