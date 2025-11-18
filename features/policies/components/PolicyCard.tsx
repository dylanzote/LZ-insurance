import React, { memo, useMemo } from 'react';
import { View, Pressable } from 'react-native';
import type { Policy } from '../types';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { RenewalBanner } from './RenewalBanner';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';

interface PolicyCardProps {
  policy: Policy;
  onPress: (policy: Policy) => void;
  onLongPress?: (policy: Policy) => void;
  onRenew?: (policyId: string) => Promise<void>; 
  renewing?: boolean;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.sm,
  },
  type: {
    fontSize: 16,
    fontWeight: '700' as const,
    textTransform: 'capitalize' as const,
    color: theme.colors.text,
  },
  status: {
    fontSize: 12,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radii.sm,
    overflow: 'hidden' as const,
    fontWeight: '600' as const,
  },
  statusActive: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  statusExpired: {
    backgroundColor: '#fecaca',
    color: '#dc2626',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
  statusCancelled: {
    backgroundColor: '#e5e7eb',
    color: '#6b7280',
  },
  metaRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginTop: theme.spacing.xs,
  },
  metaText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  expiryText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  expiryWarning: {
    color: '#dc2626',
  },
  expiryNormal: {
    color: '#d97706',
  },
  expiryGood: {
    color: '#16a34a',
  },
  renewalSection: {
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
  },
}));

export const PolicyCard: React.FC<PolicyCardProps> = memo(({ 
  policy, 
  onPress, 
  onLongPress, 
  onRenew, 
  renewing = false  
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const statusVariant = useMemo(() => {
    switch (policy.status) {
      case 'active':
        return 'success' as const;
      case 'expired':
        return 'error' as const;
      case 'pending':
        return 'warning' as const;
      case 'cancelled':
        return 'default' as const;
      default:
        return 'default' as const;
    }
  }, [policy.status]);

  const expiryInfo = useMemo(() => {
    if (policy.daysUntilExpiry <= 0) {
      return { message: 'Expired', variant: 'error' as const, color: styles.expiryWarning.color };
    } else if (policy.daysUntilExpiry === 1) {
      return { message: 'Expires tomorrow', variant: 'error' as const, color: styles.expiryWarning.color };
    } else if (policy.daysUntilExpiry <= 7) {
      return { message: `Expires in ${policy.daysUntilExpiry} days`, variant: 'error' as const, color: styles.expiryWarning.color };
    } else if (policy.daysUntilExpiry <= 30) {
      return { message: `Expires in ${policy.daysUntilExpiry} days`, variant: 'warning' as const, color: styles.expiryNormal.color };
    } else {
      return { 
        message: `Expires ${new Date(policy.endDate).toLocaleDateString()}`, 
        variant: 'success' as const, 
        color: styles.expiryGood.color 
      };
    }
  }, [policy.daysUntilExpiry, policy.endDate, styles]);

  const handlePress = () => onPress(policy);
  const handleLongPress = () => onLongPress?.(policy);

  return (
    <Card
      onPress={handlePress}
      variant="elevated"
      padding="md"
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={`${policy.type} policy, ${policy.status}`}
      accessibilityHint="Press to view policy details"
    >
      <View style={styles.header}>
        <Text variant="h4" weight="bold" style={{ textTransform: 'capitalize' }}>
          {String(policy.type || '')}
        </Text>
        <Badge 
          label={String(t(`policies.${policy.status}`) || '')} 
          variant={statusVariant}
          size="sm"
        />
      </View>

      <View style={styles.metaRow}>
        <Text variant="bodySmall" color={styles.metaText.color}>
          {String(t('policies.premium') || 'Premium')}: ${typeof policy.premium === 'number' ? policy.premium.toFixed(2) : '0.00'}/month
        </Text>
        <Text 
          variant="caption" 
          weight="medium"
          color={expiryInfo.color}
        >
          {String(expiryInfo.message || '')}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Text variant="bodySmall" color={styles.metaText.color}>
          {String(t('policies.coverage') || 'Coverage')}: ${typeof policy.coverageAmount === 'number' ? policy.coverageAmount.toLocaleString() : '0'}
        </Text>
        <Text variant="caption" color={styles.metaText.color}>
          Since {String(new Date(policy.startDate).toLocaleDateString() || '')}
        </Text>
      </View>

      {/* Renewal Banner - Only show for policies that need renewal */}
      {(policy.canRenew || policy.daysUntilExpiry <= 30) && onRenew && (
        <View style={styles.renewalSection}>
          <RenewalBanner 
            policy={policy} 
            onRenew={onRenew}
            loading={renewing}
          />
        </View>
      )}
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.policy.id === nextProps.policy.id &&
    prevProps.policy.status === nextProps.policy.status &&
    prevProps.policy.daysUntilExpiry === nextProps.policy.daysUntilExpiry &&
    prevProps.renewing === nextProps.renewing
  );
});

PolicyCard.displayName = 'PolicyCard';