import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Info } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text as RNText, TouchableOpacity, View } from 'react-native';
import { InfoModal } from '@/features/quotes/components/InfoModal';
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
  const { theme } = useTheme();
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [infoModalContent, setInfoModalContent] = useState<React.ReactNode>(null);

  const showInfoModal = (title: string, content: React.ReactNode) => {
    setInfoModalTitle(title);
    setInfoModalContent(content);
    setInfoModalVisible(true);
  };

  const mandatoryCoverages = product.coverage.filter(c => c.category === 'mandatory');
  const recommendedCoverages = product.coverage.filter(c => c.category === 'recommended');
  const optionalCoverages = product.coverage.filter(c => c.category === 'optional');

  return (
    <>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <View style={styles.provider}>
              <RNText style={styles.providerLogo}>{product.providerLogo}</RNText>
              <RNText style={styles.providerName}>{product.provider}</RNText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text variant="h3" weight="bold" style={{ flex: 1 }}>
                {product.name}
              </Text>
              {product.popular && (
                <View style={styles.popularBadge}>
                  <RNText style={styles.popularText}>{t('marketplace.popular')}</RNText>
                </View>
              )}
            </View>
            
            <View style={styles.rating}>
              <RNText>⭐</RNText>
              <RNText style={styles.ratingText}>{product.rating} {t('marketplace.rating')}</RNText>
            </View>
          </View>
        </View>

        <Text variant="body" color={theme.colors.textSecondary} style={{ marginBottom: 16 }}>
          {product.description}
        </Text>

        {/* Coverage Summary */}
        {product.coverage.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text variant="body" weight="semibold" style={{ marginBottom: 8 }}>
              {t('marketplace.coverageIncludes')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
              {product.coverage.slice(0, 4).map((coverage) => (
                <TouchableOpacity
                  key={coverage.id}
                  style={{
                    marginHorizontal: 4,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                  }}
                  onPress={() => showInfoModal(
                    coverage.name,
                    <View>
                      <Text variant="body" style={{ marginBottom: 8 }}>
                        {coverage.description || coverage.name}
                      </Text>
                      {coverage.limit && (
                        <Text variant="caption" color={theme.colors.textSecondary}>
                          {t('quotes.form.limit')}: ${coverage.limit.toLocaleString()}
                        </Text>
                      )}
                      {coverage.deductible && (
                        <Text variant="caption" color={theme.colors.textSecondary}>
                          {t('quotes.form.deductible')}: ${coverage.deductible.toLocaleString()}
                        </Text>
                      )}
                      {coverage.included && (
                        <Text variant="caption" color={theme.colors.success}>
                          {t('quotes.form.included')}
                        </Text>
                      )}
                    </View>
                  )}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RNText style={{ fontSize: 12, color: theme.colors.text, marginRight: 4 }}>
                      {coverage.name}
                    </RNText>
                    <Info size={12} color={theme.colors.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
          <View>
            <Text variant="h2" weight="bold" color={theme.colors.primary}>
              ${product.monthlyPremium.toFixed(2)}
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              /{t('marketplace.month')} • ${product.annualPremium.toFixed(2)}/{t('marketplace.year')}
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
            <RNText key={index} style={styles.feature}>• {feature}</RNText>
          ))}
        </View>
      </Card>

      <InfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        title={infoModalTitle}
        content={infoModalContent}
      />
    </>
  );
};
