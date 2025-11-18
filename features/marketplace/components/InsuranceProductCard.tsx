import { Button } from '@/components/ui/Button';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import React from 'react';
import { Text, View } from 'react-native';
import { InsuranceProduct } from '../types';

interface InsuranceProductCardProps {
  product: InsuranceProduct;
  onSubscribe: (product: InsuranceProduct) => void;
  isSubscribing?: boolean;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: theme.spacing.md,
  } as const,
  provider: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.xs,
  } as const,
  providerLogo: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  } as const,
  providerName: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500' as const,
  } as const,
  name: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    flex: 1,
  } as const,
  popularBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radii.sm,
    marginLeft: theme.spacing.sm,
  } as const,
  popularText: {
    fontSize: 12,
    color: theme.colors.white,
    fontWeight: '600' as const,
  } as const,
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  } as const,
  price: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  } as const,
  pricePeriod: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  } as const,
  features: {
    marginBottom: theme.spacing.md,
  } as const,
  feature: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  } as const,
  rating: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.md,
  } as const,
  ratingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  } as const,
}));

export const InsuranceProductCard: React.FC<InsuranceProductCardProps> = ({
  product,
  onSubscribe,
  isSubscribing = false,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.provider}>
            <Text style={styles.providerLogo}>{product.providerLogo}</Text>
            <Text style={styles.providerName}>{product.provider}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.name}>{product.name}</Text>
            {product.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>{t('marketplace.popular')}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.rating}>
            <Text>⭐</Text>
            <Text style={styles.ratingText}>{product.rating} {t('marketplace.rating')}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description}>{product.description}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View>
          <Text style={styles.price}>
            ${product.monthlyPremium}
            <Text style={styles.pricePeriod}>/{t('marketplace.month')}</Text>
          </Text>
        </View>
        
        <Button
          title={t('marketplace.getQuote')}
          onPress={() => onSubscribe(product)}
          size="sm"
          loading={isSubscribing}
          disabled={isSubscribing}
        />
      </View>

      <View style={styles.features}>
        {product.features.slice(0, 3).map((feature, index) => (
          <Text key={index} style={styles.feature}>• {feature}</Text>
        ))}
      </View>
    </View>
  );
};
