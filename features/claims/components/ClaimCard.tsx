import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Claim } from '../types';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';

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
    shadowColor: '#000',
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
    backgroundColor: '#fef3c7',
    color: '#d97706',
  } as const,
  statusInReview: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
  } as const,
  statusApproved: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
  } as const,
  statusRejected: {
    backgroundColor: '#fecaca',
    color: '#dc2626',
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
        {t(`policies.types.${claim.policyType}`)} • {new Date(claim.date).toLocaleDateString()}
      </Text>
      
      <Text style={styles.metaText} numberOfLines={2}>
        {claim.description}
      </Text>
      
      <Text style={styles.amount}>
        ${claim.amount.toLocaleString()}
      </Text>
    </Pressable>
  );
};