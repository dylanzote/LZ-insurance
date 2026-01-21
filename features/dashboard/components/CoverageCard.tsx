import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useFormatting } from '@/hooks/useFormatting';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CoverageCardProps {
  type: string;
  amount: number;
  policyCount: number;
  onPress: () => void;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    shadowColor: theme.colors.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  } as const,
  leftSection: {
    flex: 1,
  } as const,
  type: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
    textTransform: 'capitalize' as const,
  } as const,
  policyCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  } as const,
  amount: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.primary,
  } as const,
}));

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'auto': return '🚗';
    case 'home': return '🏠';
    case 'life': return '🛡️';
    case 'health': return '🏥';
    default: return '📄';
  }
};

export const CoverageCard: React.FC<CoverageCardProps> = ({
  type,
  amount,
  policyCount,
  onPress,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { formatCurrency } = useFormatting();

  // Get translated type name, fallback to capitalized type if translation not found
  const typeName = t(`policies.types.${type.toLowerCase()}`) || type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.leftSection}>
        <Text style={styles.type}>
          {getTypeIcon(type.toLowerCase())} {typeName}
        </Text>
        <Text style={styles.policyCount}>
          {policyCount} {policyCount === 1 ? t('dashboard.policies').slice(0, -1) : t('dashboard.policies')}
        </Text>
      </View>
      <Text style={styles.amount}>
        {formatCurrency(amount)}
      </Text>
    </TouchableOpacity>
  );
};