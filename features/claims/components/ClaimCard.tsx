import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Claim } from '../types';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useFormatting } from '@/hooks/useFormatting';

interface ClaimCardProps {
  claim: Claim;
  onPress: (claim: Claim) => void;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginVertical: 6,
    shadowColor: theme.colors.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.sm,
  } as const,
  title: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.colors.text,
    flex: 1,
  } as const,
  status: {
    fontSize: 12,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radii.sm,
    overflow: 'hidden' as const,
    fontWeight: '600' as const,
  } as const,
  statusSubmitted: {
    backgroundColor: theme.colors.warning + '20',
    color: theme.colors.warning,
  } as const,
  statusInReview: {
    backgroundColor: theme.colors.info + '20',
    color: theme.colors.info,
  } as const,
  statusApproved: {
    backgroundColor: theme.colors.success + '20',
    color: theme.colors.success,
  } as const,
  statusRejected: {
    backgroundColor: theme.colors.error + '20',
    color: theme.colors.error,
  } as const,
  metaText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  } as const,
  amount: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
  } as const,
}));

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim, onPress }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = useFormatting();

  const getStatusStyle = () => {
    switch (claim.status) {
      case 'submitted':
        return styles.statusSubmitted;
      case 'in-review':
        return styles.statusInReview;
      case 'approved':
        return styles.statusApproved;
      case 'rejected':
        return styles.statusRejected;
      default:
        return styles.statusSubmitted;
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <Pressable onPress={() => onPress(claim)} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{claim.title || claim.description}</Text>
        <Text style={[styles.status, statusStyle]}>
          {t(`claims.status.${claim.status}`) || t(`claims.${claim.status}`)}
        </Text>
      </View>
      
      <Text style={styles.metaText}>
        {t(`policies.types.${claim.policyType}`)} • {formatDate(claim.date, { format: 'short' })}
      </Text>
      
      <Text style={styles.metaText} numberOfLines={2}>
        {claim.description}
      </Text>
      
      <Text style={styles.amount}>
        {formatCurrency(claim.amount)}
      </Text>
    </Pressable>
  );
};