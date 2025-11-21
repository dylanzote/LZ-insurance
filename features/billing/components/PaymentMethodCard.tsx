import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { Building2, CreditCard, MoreVertical } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import type { PaymentMethod } from '../types';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onPress?: (paymentMethod: PaymentMethod) => void;
  onEdit?: (paymentMethod: PaymentMethod) => void;
  showActions?: boolean;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    marginBottom: 16,
    padding: 20,
  } as const,
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  } as const,
  content: {
    flex: 1,
  } as const,
  label: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 6,
  } as const,
  details: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  } as const,
  badgeContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  actions: {
    marginLeft: 12,
  } as const,
}));

const getPaymentIcon = (type: PaymentMethod['type']) => {
  switch (type) {
    case 'credit_card':
    case 'debit_card':
      return CreditCard;
    case 'bank_account':
    case 'e_transfer':
      return Building2;
    default:
      return CreditCard;
  }
};

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  onPress,
  onEdit,
  showActions = false,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const Icon = getPaymentIcon(paymentMethod.type);

  return (
    <Card variant="elevated" style={styles.card}>
      <TouchableOpacity
        onPress={() => onPress?.(paymentMethod)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={paymentMethod.label}
      >
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Icon size={28} color={styles.label.color} />
          </View>
          <View style={styles.content}>
            <Text variant="h3" weight="bold" style={styles.label}>
              {paymentMethod.label}
            </Text>
            {paymentMethod.expiryDate && (
              <Text variant="body" style={styles.details}>
                {t('billing.paymentMethod.expires')} {paymentMethod.expiryDate}
              </Text>
            )}
            {paymentMethod.bankName && (
              <Text variant="body" style={styles.details}>
                {paymentMethod.bankName}
                {paymentMethod.accountType && ` • ${t(`billing.paymentMethod.accountType.${paymentMethod.accountType}`)}`}
              </Text>
            )}
            <View style={styles.badgeContainer}>
              {paymentMethod.isDefault && (
                <Badge
                  variant="success"
                  label={t('billing.paymentMethod.default')}
                  size="sm"
                />
              )}
            </View>
          </View>
          {showActions && onEdit && (
            <TouchableOpacity
              onPress={() => onEdit(paymentMethod)}
              style={styles.actions}
              accessibilityRole="button"
              accessibilityLabel={t('billing.paymentMethod.edit')}
            >
              <MoreVertical size={20} color={styles.details.color} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );
};

