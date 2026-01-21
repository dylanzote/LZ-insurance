import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useFormatting } from '@/hooks/useFormatting';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircle,
  Bike,
  Car,
  Heart,
  Home,
  Plane,
  Stethoscope
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  View,
} from 'react-native';
import { useQuotes } from '../hooks/useQuotes';
import type { InsuranceType, Quote } from '../types';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: 16,
  } as const,
  section: {
    marginBottom: 24,
  } as const,
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 12,
  } as const,
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  premiumCard: {
    padding: 20,
    backgroundColor: theme.colors.primaryLight + '10',
    borderRadius: 16,
    marginBottom: 24,
  } as const,
  actions: {
    padding: 16,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as const,
}));

const getTypeIcon = (type: InsuranceType) => {
  switch (type) {
    case 'auto':
      return Car;
    case 'motorcycle':
      return Bike;
    case 'home':
      return Home;
    case 'life':
      return Heart;
    case 'health':
      return Stethoscope;
    case 'travel':
      return Plane;
    default:
      return null;
  }
};

export const QuoteDetailScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuote, convertToPolicy, deleteQuote } = useQuotes();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const { formatCurrency, formatNumber } = useFormatting();

  useEffect(() => {
    loadQuote();
  }, [id]);

  const loadQuote = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getQuote(id);
      setQuote(data);
    } catch (error: any) {
      Alert.alert(t('common.error'), error?.message || t('quotes.detail.loadError'));
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToPolicy = async () => {
    if (!quote) return;
    
    Alert.alert(
      t('quotes.detail.convertTitle'),
      t('quotes.detail.convertMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('quotes.detail.convert'),
          onPress: async () => {
            try {
              setConverting(true);
              await convertToPolicy(quote.id);
              Alert.alert(
                t('quotes.detail.convertSuccess'),
                t('quotes.detail.convertSuccessMessage'),
                [
                  {
                    text: t('common.ok'),
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch (error: any) {
              Alert.alert(t('common.error'), error?.message || t('quotes.detail.convertError'));
            } finally {
              setConverting(false);
            }
          },
        },
      ]
    );
  };

  const handleDelete = async () => {
    if (!quote) return;
    
    Alert.alert(
      t('quotes.detail.deleteTitle'),
      t('quotes.detail.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteQuote(quote.id);
              router.back();
            } catch (error: any) {
              Alert.alert(t('common.error'), error?.message || t('quotes.detail.deleteError'));
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title={t('quotes.detail.title')} showNotifications={true} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (!quote) {
    return (
      <View style={styles.container}>
        <Header title={t('quotes.detail.title')} showNotifications={true} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <AlertCircle size={48} color={theme.colors.error} style={{ marginBottom: 16 }} />
          <Text variant="body" color={theme.colors.textSecondary}>
            {t('quotes.detail.notFound')}
          </Text>
        </View>
      </View>
    );
  }

  const Icon = getTypeIcon(quote.type);

  const renderDetailRow = (label: string, value: string | number | boolean | undefined, formatter?: (val: any) => string) => {
    if (value === undefined || value === null || value === '') return null;
    const displayValue = formatter ? formatter(value) : String(value);
    return (
      <View style={styles.infoRow}>
        <Text variant="body" color={theme.colors.textSecondary}>
          {label}
        </Text>
        <Text variant="body" weight="semibold" style={{ flex: 1, textAlign: 'right' }}>
          {displayValue}
        </Text>
      </View>
    );
  };

  const renderAutoDetails = (details: any) => (
    <>
      {renderDetailRow(t('quotes.form.vehicleYear'), details.vehicleYear)}
      {renderDetailRow(t('quotes.form.vehicleMake'), details.vehicleMake)}
      {renderDetailRow(t('quotes.form.vehicleModel'), details.vehicleModel)}
      {renderDetailRow(t('quotes.form.vehicleCondition'), details.vehicleCondition, (val) => t(`quotes.form.condition.${val}`))}
      {renderDetailRow(t('quotes.form.ownershipType'), details.ownershipType, (val) => t(`quotes.form.ownership.${val}`))}
      {details.purchaseMonth && details.purchaseYear && renderDetailRow(
        t('quotes.form.purchaseMonth'),
        `${details.purchaseMonth}/${details.purchaseYear}`
      )}
      {renderDetailRow(t('quotes.form.annualMileage'), details.annualMileage)}
      {renderDetailRow(t('quotes.form.commuteToWork'), details.commuteToWork, (val) => val ? t('common.yes') : t('common.no'))}
      {renderDetailRow(t('quotes.form.coverageStartDate'), details.coverageStartDate, (val) => new Date(val).toLocaleDateString())}
      {renderDetailRow(t('quotes.form.winterTires'), details.winterTires, (val) => val ? t('common.yes') : t('common.no'))}
      {renderDetailRow(t('quotes.form.antiTheftSystem'), details.antiTheftSystem, (val) => val ? t('common.yes') : t('common.no'))}
      {renderDetailRow(t('quotes.form.lzAdvantage'), details.lzAdvantageEnrolled, (val) => val ? t('common.yes') : t('common.no'))}
    </>
  );

  const renderHomeDetails = (details: any) => (
    <>
      {renderDetailRow(t('quotes.form.propertyType'), details.propertyType, (val) => t(`quotes.form.property.${val}`))}
      {renderDetailRow(t('quotes.form.propertyValue'), (val) => formatCurrency(val))}
      {renderDetailRow(t('quotes.form.squareFootage'), details.squareFootage)}
      {renderDetailRow(t('quotes.form.yearBuilt'), details.yearBuilt)}
      {renderDetailRow(t('quotes.form.numberOfStories'), details.numberOfStories)}
      {renderDetailRow(t('quotes.form.numberOfBedrooms'), details.numberOfBedrooms)}
      {renderDetailRow(t('quotes.form.numberOfBathrooms'), details.numberOfBathrooms)}
      {renderDetailRow(t('quotes.form.roofType'), details.roofType, (val) => t(`quotes.form.roof.${val}`))}
      {renderDetailRow(t('quotes.form.roofAge'), details.roofAge, (val) => `${val} years`)}
      {renderDetailRow(t('quotes.form.constructionType'), details.constructionType, (val) => t(`quotes.form.construction.${val}`))}
      {renderDetailRow(t('quotes.form.occupancyType'), details.occupancyType, (val) => t(`quotes.form.occupancy.${val}`))}
      {details.securityFeatures && details.securityFeatures.length > 0 && (
        <View style={styles.infoRow}>
          <Text variant="body" color={theme.colors.textSecondary}>
            {t('quotes.form.securityFeatures')}
          </Text>
          <Text variant="body" weight="semibold" style={{ flex: 1, textAlign: 'right' }}>
            {details.securityFeatures.map((f: string) => t(`quotes.form.security.${f}`)).join(', ')}
          </Text>
        </View>
      )}
      {renderDetailRow(t('quotes.form.deductible'), details.deductible, (val) => formatCurrency(val))}
    </>
  );

  const renderLifeDetails = (details: any) => (
    <>
      {renderDetailRow(t('quotes.form.coverageAmount'), details.coverageAmount, (val) => formatCurrency(val))}
      {renderDetailRow(t('quotes.form.policyType'), details.policyType, (val) => t(`quotes.form.policy.${val}`))}
      {renderDetailRow(t('quotes.form.termLength'), details.termLength, (val) => `${val} years`)}
      {renderDetailRow(t('quotes.form.beneficiaries'), details.beneficiaries)}
      {renderDetailRow(t('quotes.form.healthStatus'), details.healthStatus, (val) => t(`quotes.form.health.${val}`))}
      {renderDetailRow(t('quotes.form.smoker'), details.smoker, (val) => val ? t('common.yes') : t('common.no'))}
      {renderDetailRow(t('quotes.form.height'), details.height)}
      {renderDetailRow(t('quotes.form.weight'), details.weight, (val) => `${val} lbs`)}
      {renderDetailRow(t('quotes.form.occupation'), details.occupation)}
      {renderDetailRow(t('quotes.form.preExistingConditions'), details.preExistingConditions, (val) => val ? t('common.yes') : t('common.no'))}
      {renderDetailRow(t('quotes.form.familyHistory'), details.familyHistory)}
    </>
  );

  const renderHealthDetails = (details: any) => (
    <>
      {renderDetailRow(t('quotes.form.familySize'), details.familySize)}
      {renderDetailRow(t('quotes.form.age'), details.age)}
      {renderDetailRow(t('quotes.form.planType'), details.planType, (val) => t(`quotes.form.plan.${val}`))}
      {renderDetailRow(t('quotes.form.coverageLevel'), details.coverageLevel, (val) => t(`quotes.form.coverage.${val}`))}
      {renderDetailRow(t('quotes.form.preExistingConditions'), details.preExistingConditions, (val) => val ? t('common.yes') : t('common.no'))}
      {renderDetailRow(t('quotes.form.currentInsurance'), details.currentInsurance, (val) => val ? t('common.yes') : t('common.no'))}
    </>
  );

  const renderTravelDetails = (details: any) => (
    <>
      {renderDetailRow(t('quotes.form.destination'), details.destination)}
      {renderDetailRow(t('quotes.form.tripType'), details.tripType, (val) => t(`quotes.form.trip.${val}`))}
      {details.travelDates?.departure && renderDetailRow(
        t('quotes.form.departureDate'),
        details.travelDates.departure,
        (val) => new Date(val).toLocaleDateString()
      )}
      {details.travelDates?.return && renderDetailRow(
        t('quotes.form.returnDate'),
        details.travelDates.return,
        (val) => new Date(val).toLocaleDateString()
      )}
      {renderDetailRow(t('quotes.form.tripDuration'), details.tripDuration, (val) => `${val} days`)}
      {renderDetailRow(t('quotes.form.travelers'), details.travelers)}
      {renderDetailRow(t('quotes.form.coverageLevel'), details.coverageLevel, (val) => t(`quotes.form.coverage.${val}`))}
      {renderDetailRow(t('quotes.form.cancellationCoverage'), details.cancellationCoverage, (val) => val ? t('common.yes') : t('common.no'))}
      {renderDetailRow(t('quotes.form.medicalCoverage'), details.medicalCoverage, (val) => val ? t('common.yes') : t('common.no'))}
      {renderDetailRow(t('quotes.form.baggageCoverage'), details.baggageCoverage, (val) => val ? t('common.yes') : t('common.no'))}
    </>
  );

  const renderMotorcycleDetails = (details: any) => (
    <>
      {renderDetailRow(t('quotes.form.vehicleYear'), details.vehicleYear)}
      {renderDetailRow(t('quotes.form.vehicleMake'), details.vehicleMake)}
      {renderDetailRow(t('quotes.form.vehicleModel'), details.vehicleModel)}
      {renderDetailRow(t('quotes.form.engineSize'), details.engineSize)}
      {renderDetailRow(t('quotes.form.vehicleCondition'), details.vehicleCondition, (val) => t(`quotes.form.condition.${val}`))}
      {renderDetailRow(t('quotes.form.ownershipType'), details.ownershipType, (val) => t(`quotes.form.ownership.${val}`))}
      {renderDetailRow(t('quotes.form.annualMileage'), details.annualMileage)}
      {renderDetailRow(t('quotes.form.usageType'), details.usageType, (val) => t(`quotes.form.usage.${val}`))}
      {renderDetailRow(t('quotes.form.safetyCourse'), details.safetyCourse, (val) => val ? t('common.yes') : t('common.no'))}
      {renderDetailRow(t('quotes.form.storageLocation'), details.storageLocation, (val) => t(`quotes.form.storage.${val}`))}
      {renderDetailRow(t('quotes.form.ridingExperience'), details.ridingExperience, (val) => `${val} years`)}
    </>
  );

  return (
    <View style={styles.container}>
      <Header title={t('quotes.detail.title')} showNotifications={true} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Status Badge */}
        <View style={{ marginBottom: 16 }}>
          <Badge
            variant={
              quote.status === 'approved'
                ? 'success'
                : quote.status === 'pending'
                ? 'warning'
                : 'default'
            }
            size="lg"
            label={t(`quotes.status.${quote.status}`)}
          />
        </View>

        {/* Premium Card */}
        <Card variant="elevated" style={styles.premiumCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            {Icon && (
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: theme.colors.primaryLight + '30',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}
              >
                <Icon size={28} color={theme.colors.primary} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text variant="h2" weight="bold">
                {t(`quotes.types.${quote.type}`)}
              </Text>
              <Text variant="body" color={theme.colors.textSecondary}>
                {t('quotes.detail.quoteNumber')}: {quote.id}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
            }}
          >
            <View>
              <Text variant="caption" color={theme.colors.textSecondary}>
                {t('quotes.monthlyPremium')}
              </Text>
              <Text variant="h2" weight="bold" color={theme.colors.primary}>
                {formatCurrency(quote.monthlyPremium)}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="caption" color={theme.colors.textSecondary}>
                {t('quotes.annualPremium')}
              </Text>
              <Text variant="h3" weight="semibold">
                {formatCurrency(quote.annualPremium)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Personal Information */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>{t('quotes.detail.personalInfo')}</Text>
          <View style={styles.infoRow}>
            <Text variant="body" color={theme.colors.textSecondary}>
              {t('auth.firstName')}
            </Text>
            <Text variant="body" weight="semibold">
              {quote.personalInfo.firstName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="body" color={theme.colors.textSecondary}>
              {t('auth.lastName')}
            </Text>
            <Text variant="body" weight="semibold">
              {quote.personalInfo.lastName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="body" color={theme.colors.textSecondary}>
              {t('auth.email')}
            </Text>
            <Text variant="body" weight="semibold">
              {quote.personalInfo.email}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="body" color={theme.colors.textSecondary}>
              {t('auth.phoneNumber')}
            </Text>
            <Text variant="body" weight="semibold">
              {quote.personalInfo.phone}
            </Text>
          </View>
        </Card>

        {/* Quote Details */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>{t('quotes.detail.quoteDetails')}</Text>
          <View style={styles.infoRow}>
            <Text variant="body" color={theme.colors.textSecondary}>
              {t('quotes.detail.createdAt')}
            </Text>
            <Text variant="body" weight="semibold">
              {new Date(quote.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="body" color={theme.colors.textSecondary}>
              {t('quotes.detail.expiresAt')}
            </Text>
            <Text variant="body" weight="semibold">
              {new Date(quote.expiresAt).toLocaleDateString()}
            </Text>
          </View>
          {quote.coverageAmount && (
            <View style={styles.infoRow}>
              <Text variant="body" color={theme.colors.textSecondary}>
                {t('quotes.detail.coverageAmount')}
              </Text>
              <Text variant="body" weight="semibold">
                {formatCurrency(quote.coverageAmount)}
              </Text>
            </View>
          )}
          {quote.deductible && (
            <View style={styles.infoRow}>
              <Text variant="body" color={theme.colors.textSecondary}>
                {t('quotes.detail.deductible')}
              </Text>
              <Text variant="body" weight="semibold">
                {formatCurrency(quote.deductible)}
              </Text>
            </View>
          )}
        </Card>

        {/* Detailed Quote Information */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>{t('quotes.detail.detailedInfo')}</Text>
          {(() => {
            if (!quote.details || Object.keys(quote.details).length === 0) {
              return (
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <Text variant="body" color={theme.colors.textSecondary}>
                    {t('quotes.detail.noDetailsAvailable')}
                  </Text>
                </View>
              );
            }

            const details = quote.details as any;
            let hasAnyData = false;
            let renderedContent: React.ReactNode = null;

            if (quote.type === 'auto') {
              renderedContent = renderAutoDetails(details);
              hasAnyData = !!(details.vehicleYear || details.vehicleMake || details.vehicleModel || details.vehicleCondition || details.ownershipType);
            } else if (quote.type === 'home') {
              renderedContent = renderHomeDetails(details);
              hasAnyData = !!(details.propertyType || details.propertyValue || details.squareFootage || details.yearBuilt);
            } else if (quote.type === 'life') {
              renderedContent = renderLifeDetails(details);
              hasAnyData = !!(details.coverageAmount || details.policyType || details.termLength || details.healthStatus);
            } else if (quote.type === 'health') {
              renderedContent = renderHealthDetails(details);
              hasAnyData = !!(details.familySize || details.age || details.planType || details.coverageLevel);
            } else if (quote.type === 'travel') {
              renderedContent = renderTravelDetails(details);
              hasAnyData = !!(details.destination || details.tripDuration || details.travelers || details.tripType);
            } else if (quote.type === 'motorcycle') {
              renderedContent = renderMotorcycleDetails(details);
              hasAnyData = !!(details.vehicleYear || details.vehicleMake || details.vehicleModel || details.engineSize);
            }

            if (!hasAnyData) {
              return (
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <Text variant="body" color={theme.colors.textSecondary}>
                    {t('quotes.detail.noDetailsAvailable')}
                  </Text>
                </View>
              );
            }

            return renderedContent;
          })()}
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          {quote.status === 'approved' && !quote.convertedToPolicyId && (
            <Button
              title={t('quotes.detail.convertToPolicy')}
              onPress={handleConvertToPolicy}
              loading={converting}
              disabled={converting}
              style={{ marginBottom: 12 }}
            />
          )}
          {quote.status !== 'converted' && (
            <Button
              title={t('quotes.detail.delete')}
              variant="outline"
              onPress={handleDelete}
              style={{ borderColor: theme.colors.error }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

