import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'expo-router';
import {
  Bike,
  Car,
  CheckCircle,
  Heart,
  Home,
  Info,
  Plane,
  Stethoscope
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { z } from 'zod';
import { type Coverage } from '../data/coverageData';
import { getCoveragesByType } from '../data/coverageDataByType';
import { annualMileageRanges, months, vehicleMakes, vehicleModelsByMake, vehicleYears } from '../data/vehicleData';
import { useQuotes } from '../hooks/useQuotes';
import type { InsuranceType, QuoteCalculation, QuoteFormData } from '../types';
import { DatePickerField } from './DatePickerField';
import { InfoModal } from './InfoModal';
import { SelectField } from './SelectField';

interface QuoteFormProps {
  onSuccess?: (quoteId: string) => void;
  onCancel?: () => void;
  productId?: string; // Optional product ID from marketplace
  preSelectedType?: InsuranceType; // Optional pre-selected insurance type
}

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: 16,
    paddingBottom: 100,
  } as const,
  stepIndicator: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 24,
    paddingHorizontal: 16,
  } as const,
  step: {
    alignItems: 'center' as const,
    flex: 1,
  } as const,
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
    borderWidth: 2,
  } as const,
  stepNumberActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  } as const,
  stepNumberCompleted: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  } as const,
  stepNumberInactive: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
  } as const,
  stepLabel: {
    fontSize: 11,
    textAlign: 'center' as const,
    marginTop: 4,
  } as const,
  typeGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginHorizontal: -6,
  } as const,
  typeCardWrapper: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  } as const,
  typeCard: {
    width: '100%',
  } as const,
  typeCardSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primaryLight + '20',
  } as const,
  calculationCard: {
    marginTop: 16,
    padding: 16,
  } as const,
  calculationRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 8,
  } as const,
  calculationTotal: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
    marginTop: 8,
  } as const,
  actions: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    padding: 16,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
  } as const,
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  } as const,
}));

const insuranceTypes: Array<{
  type: InsuranceType;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
}> = [
  { type: 'auto', icon: Car, label: 'Auto', color: '#3B82F6' },
  { type: 'home', icon: Home, label: 'Home', color: '#10B981' },
  { type: 'life', icon: Heart, label: 'Life', color: '#EF4444' },
  { type: 'health', icon: Stethoscope, label: 'Health', color: '#8B5CF6' },
  { type: 'travel', icon: Plane, label: 'Travel', color: '#F59E0B' },
  { type: 'motorcycle', icon: Bike, label: 'Motorcycle', color: '#EC4899' },
];

export const QuoteForm: React.FC<QuoteFormProps> = ({ onSuccess, onCancel, productId, preSelectedType }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { bottom } = useSafeArea();
  const router = useRouter();
  const { createQuote, calculateQuote } = useQuotes();
  const { profile } = useProfile();
  const scrollViewRef = useRef<ScrollView>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<InsuranceType | null>(preSelectedType || null);
  const [formData, setFormData] = useState<Partial<QuoteFormData>>({});
  const [detailsData, setDetailsData] = useState<any>({});
  const [calculation, setCalculation] = useState<QuoteCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [infoModalContent, setInfoModalContent] = useState<React.ReactNode>(null);
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedCoverages, setSelectedCoverages] = useState<Record<string, boolean>>({});
  const [coverageAmounts, setCoverageAmounts] = useState<Record<string, number>>({});
  const [maritalStatus, setMaritalStatus] = useState<string>('');
  const [gender, setGender] = useState<string>('');

  const totalSteps = 4;

  // Auto-select type if provided from marketplace
  React.useEffect(() => {
    if (preSelectedType && !selectedType) {
      setSelectedType(preSelectedType);
      setFormData(prev => ({ ...prev, type: preSelectedType }));
      setCurrentStep(2); // Skip type selection, go directly to details
    }
  }, [preSelectedType]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useFormValidation({
    schema: personalInfoSchema,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const handleTypeSelect = (type: InsuranceType) => {
    setSelectedType(type);
    setFormData(prev => ({ ...prev, type }));
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!selectedType) {
        Alert.alert(t('quotes.form.selectType'));
        return;
      }
      setCurrentStep(2); // Go to Details
    } else if (currentStep === 2) {
      // Save details and go to Personal Info
      setFormData(prev => ({
        ...prev,
        details: detailsData,
      }));
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Save personal info and calculate quote
      const personalInfoData = {
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        dateOfBirth: profile?.dateOfBirth || '',
        maritalStatus,
        gender,
      };
      
      setFormData(prev => ({
        ...prev,
        personalInfo: personalInfoData as any,
      }));
      
      setIsCalculating(true);
      try {
        const calc = await calculateQuote({
          type: selectedType!,
          personalInfo: personalInfoData as any,
          details: detailsData,
        });
        setCalculation(calc);
        setCurrentStep(4);
      } catch (error: any) {
        Alert.alert(t('common.error'), error?.message || t('quotes.form.calculationError'));
      } finally {
        setIsCalculating(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const handleSubmitQuote = async () => {
    setIsSubmitting(true);
    try {
      const result = await createQuote({
        type: selectedType!,
        personalInfo: formData.personalInfo as any,
        details: detailsData, // Use detailsData directly instead of formData.details
      });
      
      Alert.alert(
        t('quotes.form.success'),
        t('quotes.form.successMessage'),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              if (onSuccess) {
                onSuccess(result.data.id);
              } else {
                router.back();
              }
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(t('common.error'), error?.message || t('quotes.form.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {[1, 2, 3, 4].map((step) => {
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          const stepLabels = [
            t('quotes.form.steps.type'),
            t('quotes.form.steps.personal'),
            t('quotes.form.steps.details'),
            t('quotes.form.steps.review'),
          ];

          return (
            <View key={step} style={styles.step}>
              <View
                style={[
                  styles.stepNumber,
                  isActive && styles.stepNumberActive,
                  isCompleted && styles.stepNumberCompleted,
                  !isActive && !isCompleted && styles.stepNumberInactive,
                ]}
              >
                {isCompleted ? (
                  <CheckCircle size={20} color="#FFFFFF" />
                ) : (
                  <Text
                    style={{
                      color: isActive ? '#FFFFFF' : theme.colors.textSecondary,
                      fontWeight: '600',
                    }}
                  >
                    {step}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
                numberOfLines={2}
              >
                {stepLabels[step - 1]}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderTypeSelection = () => {
    return (
      <View>
        <Text variant="h3" weight="bold" style={{ marginBottom: 16 }}>
          {t('quotes.form.selectInsuranceType')}
        </Text>
        <View style={styles.typeGrid}>
          {insuranceTypes.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedType === item.type;
            return (
              <View key={item.type} style={styles.typeCardWrapper}>
                <TouchableOpacity
                  onPress={() => handleTypeSelect(item.type)}
                  activeOpacity={0.7}
                >
                  <Card
                    variant="elevated"
                    style={[
                      {
                        padding: 16,
                        alignItems: 'center',
                        minHeight: 120,
                        justifyContent: 'center',
                      },
                      ...(isSelected ? [styles.typeCardSelected] : []),
                    ]}
                  >
                    <Icon size={32} color={item.color} style={{ marginBottom: 8 }} />
                    <Text
                      variant="body"
                      weight={isSelected ? 'semibold' : 'regular'}
                      style={{
                        textAlign: 'center',
                        fontSize: 15,
                        color: isSelected ? theme.colors.primary : theme.colors.text,
                      }}
                      numberOfLines={1}
                    >
                      {t(`quotes.types.${item.type}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderPersonalInfo = () => {
    return (
      <View>
        <Text variant="h3" weight="bold" style={{ marginBottom: 16 }}>
          {t('quotes.form.personalInformation')}
        </Text>
        <Text variant="body" color={theme.colors.textSecondary} style={{ marginBottom: 16 }}>
          {t('quotes.form.personalInfoNote')}
        </Text>

        {/* Read-only profile information */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 }}>
            {t('auth.firstName')}
          </Text>
          <View style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 12,
            padding: 12,
          }}>
            <Text style={{ fontSize: 16, color: theme.colors.text }}>
              {profile?.firstName || t('quotes.form.notProvided')}
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 }}>
            {t('auth.lastName')}
          </Text>
          <View style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 12,
            padding: 12,
          }}>
            <Text style={{ fontSize: 16, color: theme.colors.text }}>
              {profile?.lastName || t('quotes.form.notProvided')}
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 }}>
            {t('auth.email')}
          </Text>
          <View style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 12,
            padding: 12,
          }}>
            <Text style={{ fontSize: 16, color: theme.colors.text }}>
              {profile?.email || t('quotes.form.notProvided')}
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 }}>
            {t('auth.phoneNumber')}
          </Text>
          <View style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 12,
            padding: 12,
          }}>
            <Text style={{ fontSize: 16, color: theme.colors.text }}>
              {profile?.phone || t('quotes.form.notProvided')}
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 }}>
            {t('profile.address')}
          </Text>
          <View style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 12,
            padding: 12,
          }}>
            <Text style={{ fontSize: 16, color: theme.colors.text }}>
              {profile?.address || t('quotes.form.notProvided')}
            </Text>
          </View>
        </View>

        {/* Date of Birth */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 }}>
            {t('profile.dateOfBirth')}
          </Text>
          <View style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 12,
            padding: 12,
          }}>
            <Text style={{ fontSize: 16, color: theme.colors.text }}>
              {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : t('quotes.form.notProvided')}
            </Text>
          </View>
        </View>

        {/* Marital Status */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
            {t('quotes.form.maritalStatus')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
            {['single', 'married', 'divorced', 'widowed'].map((status) => (
              <TouchableOpacity
                key={status}
                style={{ width: '48%', margin: '1%', marginHorizontal: 6, marginBottom: 12 }}
                onPress={() => setMaritalStatus(status)}
              >
                <Card
                  variant="elevated"
                  style={{
                    padding: 12,
                    alignItems: 'center',
                    borderWidth: maritalStatus === status ? 2 : 0,
                    borderColor: maritalStatus === status ? theme.colors.primary : 'transparent',
                    backgroundColor: maritalStatus === status ? theme.colors.primaryLight + '20' : theme.colors.card,
                  }}
                >
                  <Text
                    variant="body"
                    weight={maritalStatus === status ? 'semibold' : 'regular'}
                    color={maritalStatus === status ? theme.colors.primary : theme.colors.text}
                  >
                    {t(`quotes.form.marital.${status}`)}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gender */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
            {t('quotes.form.gender')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
            {['male', 'female', 'other', 'prefer-not-to-say'].map((g) => (
              <TouchableOpacity
                key={g}
                style={{ width: '48%', margin: '1%', marginHorizontal: 6, marginBottom: 12 }}
                onPress={() => setGender(g)}
              >
                <Card
                  variant="elevated"
                  style={{
                    padding: 12,
                    alignItems: 'center',
                    borderWidth: gender === g ? 2 : 0,
                    borderColor: gender === g ? theme.colors.primary : 'transparent',
                    backgroundColor: gender === g ? theme.colors.primaryLight + '20' : theme.colors.card,
                  }}
                >
                  <Text
                    variant="body"
                    weight={gender === g ? 'semibold' : 'regular'}
                    color={gender === g ? theme.colors.primary : theme.colors.text}
                  >
                    {t(`quotes.form.genderOptions.${g}`)}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderDetails = () => {
    if (!selectedType) return null;

    const updateDetails = (field: string, value: any) => {
      setDetailsData((prev: any) => ({
        ...prev,
        [field]: value,
      }));
    };

    const renderInput = (label: string, placeholder: string, value: string, onChangeText: (text: string) => void, keyboardType: 'default' | 'numeric' = 'default') => (
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
          {label}
        </Text>
        <TextInput
          style={{
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 12,
            padding: 12,
            color: theme.colors.text,
            fontSize: 16,
          }}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    );

    const availableModels = detailsData.vehicleMake 
      ? (vehicleModelsByMake[detailsData.vehicleMake] || []).map(model => ({ value: model, label: model }))
      : [];

    const yearOptions = vehicleYears.map(year => ({ value: year, label: year }));
    const makeOptions = vehicleMakes.map(make => ({ value: make, label: make }));
    const monthOptions = months.map(m => ({ value: m.value, label: m.label }));
    const currentYear = new Date().getFullYear();
    const yearOptionsForPurchase = Array.from({ length: 30 }, (_, i) => currentYear - i).map(y => ({ value: String(y), label: String(y) }));

    const renderAutoDetails = () => (
      <View>
        <Text variant="h3" weight="bold" style={{ marginBottom: 16 }}>
          {t('quotes.form.vehicleDetails')}
        </Text>

        {/* Vehicle Year */}
        <SelectField
          label={t('quotes.form.vehicleYear')}
          value={detailsData.vehicleYear}
          placeholder={t('quotes.form.selectYear')}
          options={yearOptions}
          onSelect={(value) => updateDetails('vehicleYear', value)}
        />

        {/* Vehicle Make */}
        <SelectField
          label={t('quotes.form.vehicleMake')}
          value={detailsData.vehicleMake}
          placeholder={t('quotes.form.selectMake')}
          options={makeOptions}
          onSelect={(value) => {
            updateDetails('vehicleMake', value);
            updateDetails('vehicleModel', undefined);
          }}
        />

        {/* Vehicle Model */}
        {detailsData.vehicleMake && (
          <SelectField
            label={t('quotes.form.vehicleModel')}
            value={detailsData.vehicleModel}
            placeholder={t('quotes.form.selectModel')}
            options={availableModels}
            onSelect={(value) => updateDetails('vehicleModel', value)}
          />
        )}

        {/* Vehicle Condition */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, flex: 1 }}>
              {t('quotes.form.vehicleCondition')}
            </Text>
            <TouchableOpacity
              onPress={() => showInfoModal(
                t('quotes.form.vehicleCondition'),
                <View>
                  <Text style={{ fontSize: 15, color: theme.colors.text, marginBottom: 12, lineHeight: 22 }}>
                    {t('quotes.form.vehicleConditionTip1')}
                  </Text>
                  <Text style={{ fontSize: 15, color: theme.colors.text, marginBottom: 12, lineHeight: 22 }}>
                    {t('quotes.form.vehicleConditionTip2')}
                  </Text>
                  <Text style={{ fontSize: 15, color: theme.colors.text, lineHeight: 22 }}>
                    {t('quotes.form.vehicleConditionTip3')}
                  </Text>
                </View>
              )}
            >
              <Info size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
            {['new', 'used', 'demo'].map((condition) => (
              <TouchableOpacity
                key={condition}
                style={{ width: '31%', margin: '1%', marginHorizontal: 6 }}
                onPress={() => updateDetails('vehicleCondition', condition)}
              >
                <Card
                  variant="elevated"
                  style={{
                    padding: 12,
                    alignItems: 'center',
                    borderWidth: detailsData.vehicleCondition === condition ? 2 : 0,
                    borderColor: detailsData.vehicleCondition === condition ? theme.colors.primary : 'transparent',
                    backgroundColor: detailsData.vehicleCondition === condition ? theme.colors.primaryLight + '20' : theme.colors.card,
                  }}
                >
                  <Text
                    variant="body"
                    weight={detailsData.vehicleCondition === condition ? 'semibold' : 'regular'}
                    color={detailsData.vehicleCondition === condition ? theme.colors.primary : theme.colors.text}
                  >
                    {t(`quotes.form.condition.${condition}`)}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ownership Type */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
            {t('quotes.form.ownershipType')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
            {['owned', 'leased', 'financed'].map((type) => (
              <TouchableOpacity
                key={type}
                style={{ width: '31%', margin: '1%', marginHorizontal: 6 }}
                onPress={() => updateDetails('ownershipType', type)}
              >
                <Card
                  variant="elevated"
                  style={{
                    padding: 12,
                    alignItems: 'center',
                    borderWidth: detailsData.ownershipType === type ? 2 : 0,
                    borderColor: detailsData.ownershipType === type ? theme.colors.primary : 'transparent',
                    backgroundColor: detailsData.ownershipType === type ? theme.colors.primaryLight + '20' : theme.colors.card,
                  }}
                >
                  <Text
                    variant="body"
                    weight={detailsData.ownershipType === type ? 'semibold' : 'regular'}
                    color={detailsData.ownershipType === type ? theme.colors.primary : theme.colors.text}
                  >
                    {t(`quotes.form.ownership.${type}`)}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date of Purchase */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <SelectField
              label={t('quotes.form.purchaseMonth')}
              value={detailsData.purchaseMonth}
              placeholder={t('quotes.form.selectMonth')}
              options={monthOptions}
              onSelect={(value) => updateDetails('purchaseMonth', value)}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <SelectField
              label={t('quotes.form.purchaseYear')}
              value={detailsData.purchaseYear}
              placeholder={t('quotes.form.selectYear')}
              options={yearOptionsForPurchase}
              onSelect={(value) => updateDetails('purchaseYear', value)}
            />
          </View>
        </View>

        {/* Annual Mileage */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, flex: 1 }}>
              {t('quotes.form.annualMileage')}
            </Text>
            <TouchableOpacity
              onPress={() => showInfoModal(
                t('quotes.form.howToEstimate'),
                <View>
                  <Text style={{ fontSize: 15, color: theme.colors.text, marginBottom: 12, lineHeight: 22 }}>
                    {t('quotes.form.estimateTip1')}
                  </Text>
                  <Text style={{ fontSize: 15, color: theme.colors.text, marginBottom: 12, lineHeight: 22 }}>
                    {t('quotes.form.estimateTip2')}
                  </Text>
                  <Text style={{ fontSize: 15, color: theme.colors.text, marginBottom: 12, lineHeight: 22 }}>
                    {t('quotes.form.estimateTip3')}
                  </Text>
                  <Text style={{ fontSize: 15, color: theme.colors.text, lineHeight: 22 }}>
                    {t('quotes.form.estimateTip4')}
                  </Text>
                </View>
              )}
            >
              <Info size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          {annualMileageRanges.map((range) => (
            <TouchableOpacity
              key={range.value}
              style={{ marginBottom: 8 }}
              onPress={() => updateDetails('annualMileage', range.value)}
            >
              <Card
                variant="elevated"
                style={{
                  padding: 16,
                  borderWidth: detailsData.annualMileage === range.value ? 2 : 0,
                  borderColor: detailsData.annualMileage === range.value ? theme.colors.primary : 'transparent',
                  backgroundColor: detailsData.annualMileage === range.value ? theme.colors.primaryLight + '20' : theme.colors.card,
                }}
              >
                <Text
                  variant="body"
                  weight={detailsData.annualMileage === range.value ? 'semibold' : 'regular'}
                  color={detailsData.annualMileage === range.value ? theme.colors.primary : theme.colors.text}
                >
                  {range.label}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Commute to Work/School */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, flex: 1 }}>
              {t('quotes.form.commuteToWork')}
            </Text>
            <TouchableOpacity
              onPress={() => showInfoModal(
                t('quotes.form.commuteToWork'),
                <View>
                  <Text style={{ fontSize: 15, color: theme.colors.text, marginBottom: 12, lineHeight: 22 }}>
                    {t('quotes.form.commuteTip1')}
                  </Text>
                  <Text style={{ fontSize: 15, color: theme.colors.text, marginBottom: 12, lineHeight: 22 }}>
                    {t('quotes.form.commuteTip2')}
                  </Text>
                  <Text style={{ fontSize: 15, color: theme.colors.text, lineHeight: 22 }}>
                    {t('quotes.form.commuteTip3')}
                  </Text>
                </View>
              )}
            >
              <Info size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', marginHorizontal: -6 }}>
            {[true, false].map((commute) => (
              <TouchableOpacity
                key={String(commute)}
                style={{ flex: 1, marginHorizontal: 6 }}
                onPress={() => updateDetails('commuteToWork', commute)}
              >
                <Card
                  variant="elevated"
                  style={{
                    padding: 12,
                    alignItems: 'center',
                    borderWidth: detailsData.commuteToWork === commute ? 2 : 0,
                    borderColor: detailsData.commuteToWork === commute ? theme.colors.primary : 'transparent',
                    backgroundColor: detailsData.commuteToWork === commute ? theme.colors.primaryLight + '20' : theme.colors.card,
                  }}
                >
                  <Text
                    variant="body"
                    weight={detailsData.commuteToWork === commute ? 'semibold' : 'regular'}
                    color={detailsData.commuteToWork === commute ? theme.colors.primary : theme.colors.text}
                  >
                    {commute ? t('common.yes') : t('common.no')}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Coverage Start Date */}
        <DatePickerField
          label={t('quotes.form.coverageStartDate')}
          value={detailsData.coverageStartDate}
          placeholder={t('quotes.form.selectDate')}
          onSelect={(date) => updateDetails('coverageStartDate', date)}
          minimumDate={new Date()}
        />

        {/* Savings Information */}
        <Text variant="h3" weight="bold" style={{ marginBottom: 16, marginTop: 24 }}>
          {t('quotes.form.savingsInfo')}
        </Text>

        {/* Winter Tires */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
            {t('quotes.form.winterTires')}
          </Text>
          <View style={{ flexDirection: 'row', marginHorizontal: -6 }}>
            {[true, false].map((hasTires) => (
              <TouchableOpacity
                key={String(hasTires)}
                style={{ flex: 1, marginHorizontal: 6 }}
                onPress={() => updateDetails('winterTires', hasTires)}
              >
                <Card
                  variant="elevated"
                  style={{
                    padding: 12,
                    alignItems: 'center',
                    borderWidth: detailsData.winterTires === hasTires ? 2 : 0,
                    borderColor: detailsData.winterTires === hasTires ? theme.colors.primary : 'transparent',
                    backgroundColor: detailsData.winterTires === hasTires ? theme.colors.primaryLight + '20' : theme.colors.card,
                  }}
                >
                  <Text
                    variant="body"
                    weight={detailsData.winterTires === hasTires ? 'semibold' : 'regular'}
                    color={detailsData.winterTires === hasTires ? theme.colors.primary : theme.colors.text}
                  >
                    {hasTires ? t('common.yes') : t('common.no')}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Anti-theft System */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
            {t('quotes.form.antiTheftSystem')}
          </Text>
          <View style={{ flexDirection: 'row', marginHorizontal: -6 }}>
            {[true, false].map((hasSystem) => (
              <TouchableOpacity
                key={String(hasSystem)}
                style={{ flex: 1, marginHorizontal: 6 }}
                onPress={() => {
                  updateDetails('antiTheftSystem', hasSystem);
                  if (!hasSystem) {
                    updateDetails('antiTheftSystemWithin30Days', undefined);
                  }
                }}
              >
                <Card
                  variant="elevated"
                  style={{
                    padding: 12,
                    alignItems: 'center',
                    borderWidth: detailsData.antiTheftSystem === hasSystem ? 2 : 0,
                    borderColor: detailsData.antiTheftSystem === hasSystem ? theme.colors.primary : 'transparent',
                    backgroundColor: detailsData.antiTheftSystem === hasSystem ? theme.colors.primaryLight + '20' : theme.colors.card,
                  }}
                >
                  <Text
                    variant="body"
                    weight={detailsData.antiTheftSystem === hasSystem ? 'semibold' : 'regular'}
                    color={detailsData.antiTheftSystem === hasSystem ? theme.colors.primary : theme.colors.text}
                  >
                    {hasSystem ? t('common.yes') : t('common.no')}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
          {detailsData.antiTheftSystem === false && (
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
                {t('quotes.form.antiTheftWithin30Days')}
              </Text>
              <View style={{ flexDirection: 'row', marginHorizontal: -6 }}>
                {[true, false].map((willInstall) => (
                  <TouchableOpacity
                    key={String(willInstall)}
                    style={{ flex: 1, marginHorizontal: 6 }}
                    onPress={() => updateDetails('antiTheftSystemWithin30Days', willInstall)}
                  >
                    <Card
                      variant="elevated"
                      style={{
                        padding: 12,
                        alignItems: 'center',
                        borderWidth: detailsData.antiTheftSystemWithin30Days === willInstall ? 2 : 0,
                        borderColor: detailsData.antiTheftSystemWithin30Days === willInstall ? theme.colors.primary : 'transparent',
                        backgroundColor: detailsData.antiTheftSystemWithin30Days === willInstall ? theme.colors.primaryLight + '20' : theme.colors.card,
                      }}
                    >
                      <Text
                        variant="body"
                        weight={detailsData.antiTheftSystemWithin30Days === willInstall ? 'semibold' : 'regular'}
                        color={detailsData.antiTheftSystemWithin30Days === willInstall ? theme.colors.primary : theme.colors.text}
                      >
                        {willInstall ? t('common.yes') : t('common.no')}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={{ marginTop: 8 }}
                onPress={() => showInfoModal(
                  t('quotes.form.antiTheftRequirements'),
                  <View>
                    <Text style={{ fontSize: 15, color: theme.colors.text, marginBottom: 12, lineHeight: 22 }}>
                      {t('quotes.form.antiTheftReq1')}
                    </Text>
                    <Text style={{ fontSize: 15, color: theme.colors.text, lineHeight: 22 }}>
                      {t('quotes.form.antiTheftReq2')}
                    </Text>
                  </View>
                )}
              >
                <Text style={{ fontSize: 12, color: theme.colors.primary, textDecorationLine: 'underline' }}>
                  {t('quotes.form.viewRequirements')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* LZ Advantage */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, flex: 1 }}>
              {t('quotes.form.lzAdvantage')}
            </Text>
            <TouchableOpacity
              onPress={() => showInfoModal(
                t('quotes.form.lzAdvantage'),
                <View>
                  <Text style={{ fontSize: 15, color: theme.colors.text, marginBottom: 12, lineHeight: 22 }}>
                    {t('quotes.form.lzAdvantageDesc1')}
                  </Text>
                  <Text style={{ fontSize: 15, color: theme.colors.text, marginBottom: 12, lineHeight: 22 }}>
                    {t('quotes.form.lzAdvantageDesc2')}
                  </Text>
                  <Text style={{ fontSize: 15, color: theme.colors.text, marginBottom: 12, lineHeight: 22 }}>
                    {t('quotes.form.lzAdvantageDesc3')}
                  </Text>
                  <Text style={{ fontSize: 15, color: theme.colors.text, marginBottom: 12, lineHeight: 22 }}>
                    {t('quotes.form.lzAdvantageDesc4')}
                  </Text>
                  <Text style={{ fontSize: 15, color: theme.colors.text, lineHeight: 22 }}>
                    {t('quotes.form.lzAdvantageDesc5')}
                  </Text>
                </View>
              )}
            >
              <Info size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <Card variant="elevated" style={{ padding: 16, marginBottom: 12, backgroundColor: theme.colors.primaryLight + '10' }}>
            <Text style={{ fontSize: 14, color: theme.colors.text, lineHeight: 20, marginBottom: 12 }}>
              {t('quotes.form.lzAdvantagePromo')}
            </Text>
            <View style={{ flexDirection: 'row', marginHorizontal: -6 }}>
              {[true, false].map((enroll) => (
                <TouchableOpacity
                  key={String(enroll)}
                  style={{ flex: 1, marginHorizontal: 6 }}
                  onPress={() => updateDetails('lzAdvantageEnrolled', enroll)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.lzAdvantageEnrolled === enroll ? 2 : 0,
                      borderColor: detailsData.lzAdvantageEnrolled === enroll ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.lzAdvantageEnrolled === enroll ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.lzAdvantageEnrolled === enroll ? 'semibold' : 'regular'}
                      color={detailsData.lzAdvantageEnrolled === enroll ? theme.colors.primary : theme.colors.text}
                    >
                      {enroll ? t('common.yes') : t('common.no')}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </View>

        {/* Driver License Info */}
        <Text variant="h3" weight="bold" style={{ marginBottom: 16, marginTop: 24 }}>
          {t('quotes.form.driverLicenseInfo')}
        </Text>

        {renderInput(
          t('quotes.form.driverLicenseNumber'),
          'A1234-56789-12345',
          detailsData.driverLicenseNumber || '',
          (text) => updateDetails('driverLicenseNumber', text)
        )}

        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            {renderInput(
              t('quotes.form.driverLicenseProvince'),
              'Ontario',
              detailsData.driverLicenseProvince || '',
              (text) => updateDetails('driverLicenseProvince', text)
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            {renderInput(
              t('quotes.form.driverLicenseExpiry'),
              'MM/YYYY',
              detailsData.driverLicenseExpiry || '',
              (text) => updateDetails('driverLicenseExpiry', text)
            )}
          </View>
        </View>

        <InfoModal
          visible={infoModalVisible}
          onClose={() => setInfoModalVisible(false)}
          title={infoModalTitle}
          content={infoModalContent}
        />
      </View>
    );

    const renderMotorcycleDetails = () => {
      const availableModels = detailsData.vehicleMake 
        ? (vehicleModelsByMake[detailsData.vehicleMake] || []).map(model => ({ value: model, label: model }))
        : [];
      const yearOptions = vehicleYears.map(year => ({ value: year, label: year }));
      const makeOptions = vehicleMakes.map(make => ({ value: make, label: make }));
      const monthOptions = months.map(m => ({ value: m.value, label: m.label }));
      const currentYear = new Date().getFullYear();
      const yearOptionsForPurchase = Array.from({ length: 30 }, (_, i) => currentYear - i).map(y => ({ value: String(y), label: String(y) }));

      return (
        <View>
          <Text variant="h3" weight="bold" style={{ marginBottom: 16 }}>
            {t('quotes.form.motorcycleDetails')}
          </Text>

          {/* Vehicle Year */}
          <SelectField
            label={t('quotes.form.vehicleYear')}
            value={detailsData.vehicleYear}
            placeholder={t('quotes.form.selectYear')}
            options={yearOptions}
            onSelect={(value) => updateDetails('vehicleYear', value)}
          />

          {/* Vehicle Make */}
          <SelectField
            label={t('quotes.form.vehicleMake')}
            value={detailsData.vehicleMake}
            placeholder={t('quotes.form.selectMake')}
            options={makeOptions}
            onSelect={(value) => {
              updateDetails('vehicleMake', value);
              updateDetails('vehicleModel', undefined);
            }}
          />

          {/* Vehicle Model */}
          {detailsData.vehicleMake && (
            <SelectField
              label={t('quotes.form.vehicleModel')}
              value={detailsData.vehicleModel}
              placeholder={t('quotes.form.selectModel')}
              options={availableModels}
              onSelect={(value) => updateDetails('vehicleModel', value)}
            />
          )}

          {/* Engine Size */}
          {renderInput(
            t('quotes.form.engineSize'),
            '883',
            detailsData.engineSize || '',
            (text) => updateDetails('engineSize', text)
          )}

          {/* Vehicle Condition */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.vehicleCondition')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['new', 'used', 'demo'].map((condition) => (
                <TouchableOpacity
                  key={condition}
                  style={{ width: '31%', margin: '1%', marginHorizontal: 6 }}
                  onPress={() => updateDetails('vehicleCondition', condition)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.vehicleCondition === condition ? 2 : 0,
                      borderColor: detailsData.vehicleCondition === condition ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.vehicleCondition === condition ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.vehicleCondition === condition ? 'semibold' : 'regular'}
                      color={detailsData.vehicleCondition === condition ? theme.colors.primary : theme.colors.text}
                    >
                      {t(`quotes.form.condition.${condition}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ownership Type */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.ownershipType')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['owned', 'leased', 'financed'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{ width: '31%', margin: '1%', marginHorizontal: 6 }}
                  onPress={() => updateDetails('ownershipType', type)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.ownershipType === type ? 2 : 0,
                      borderColor: detailsData.ownershipType === type ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.ownershipType === type ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.ownershipType === type ? 'semibold' : 'regular'}
                      color={detailsData.ownershipType === type ? theme.colors.primary : theme.colors.text}
                    >
                      {t(`quotes.form.ownership.${type}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date of Purchase */}
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <SelectField
                label={t('quotes.form.purchaseMonth')}
                value={detailsData.purchaseMonth}
                placeholder={t('quotes.form.selectMonth')}
                options={monthOptions}
                onSelect={(value) => updateDetails('purchaseMonth', value)}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <SelectField
                label={t('quotes.form.purchaseYear')}
                value={detailsData.purchaseYear}
                placeholder={t('quotes.form.selectYear')}
                options={yearOptionsForPurchase}
                onSelect={(value) => updateDetails('purchaseYear', value)}
              />
            </View>
          </View>

          {/* Annual Mileage */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.annualMileage')}
            </Text>
            {annualMileageRanges.map((range) => (
              <TouchableOpacity
                key={range.value}
                style={{ marginBottom: 8 }}
                onPress={() => updateDetails('annualMileage', range.value)}
              >
                <Card
                  variant="elevated"
                  style={{
                    padding: 16,
                    borderWidth: detailsData.annualMileage === range.value ? 2 : 0,
                    borderColor: detailsData.annualMileage === range.value ? theme.colors.primary : 'transparent',
                    backgroundColor: detailsData.annualMileage === range.value ? theme.colors.primaryLight + '20' : theme.colors.card,
                  }}
                >
                  <Text
                    variant="body"
                    weight={detailsData.annualMileage === range.value ? 'semibold' : 'regular'}
                    color={detailsData.annualMileage === range.value ? theme.colors.primary : theme.colors.text}
                  >
                    {range.label}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Usage Type */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.usageType')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['commute', 'recreational', 'both'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{ width: '31%', margin: '1%', marginHorizontal: 6 }}
                  onPress={() => updateDetails('usageType', type)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.usageType === type ? 2 : 0,
                      borderColor: detailsData.usageType === type ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.usageType === type ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.usageType === type ? 'semibold' : 'regular'}
                      color={detailsData.usageType === type ? theme.colors.primary : theme.colors.text}
                      style={{ fontSize: 12, textAlign: 'center' }}
                    >
                      {t(`quotes.form.usage.${type}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Safety Course */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.safetyCourse')}
            </Text>
            <View style={{ flexDirection: 'row', marginHorizontal: -6 }}>
              {[true, false].map((completed) => (
                <TouchableOpacity
                  key={String(completed)}
                  style={{ flex: 1, marginHorizontal: 6 }}
                  onPress={() => updateDetails('safetyCourse', completed)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.safetyCourse === completed ? 2 : 0,
                      borderColor: detailsData.safetyCourse === completed ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.safetyCourse === completed ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.safetyCourse === completed ? 'semibold' : 'regular'}
                      color={detailsData.safetyCourse === completed ? theme.colors.primary : theme.colors.text}
                    >
                      {completed ? t('common.yes') : t('common.no')}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Storage Location */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.storageLocation')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['garage', 'driveway', 'street', 'other'].map((location) => (
                <TouchableOpacity
                  key={location}
                  style={{ width: '48%', margin: '1%', marginHorizontal: 6, marginBottom: 12 }}
                  onPress={() => updateDetails('storageLocation', location)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.storageLocation === location ? 2 : 0,
                      borderColor: detailsData.storageLocation === location ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.storageLocation === location ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.storageLocation === location ? 'semibold' : 'regular'}
                      color={detailsData.storageLocation === location ? theme.colors.primary : theme.colors.text}
                    >
                      {t(`quotes.form.storage.${location}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Riding Experience */}
          {renderInput(
            t('quotes.form.ridingExperience'),
            '5',
            detailsData.ridingExperience?.toString() || '',
            (text) => updateDetails('ridingExperience', text ? parseInt(text) : undefined),
            'numeric'
          )}

          {/* Coverage Start Date */}
          <DatePickerField
            label={t('quotes.form.coverageStartDate')}
            value={detailsData.coverageStartDate}
            placeholder={t('quotes.form.selectDate')}
            onSelect={(date) => updateDetails('coverageStartDate', date)}
            minimumDate={new Date()}
          />

          {/* Driver License Info */}
          <Text variant="h3" weight="bold" style={{ marginBottom: 16, marginTop: 24 }}>
            {t('quotes.form.driverLicenseInfo')}
          </Text>

          {renderInput(
            t('quotes.form.driverLicenseNumber'),
            'A1234-56789-12345',
            detailsData.driverLicenseNumber || '',
            (text) => updateDetails('driverLicenseNumber', text)
          )}

          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              {renderInput(
                t('quotes.form.driverLicenseProvince'),
                'Ontario',
                detailsData.driverLicenseProvince || '',
                (text) => updateDetails('driverLicenseProvince', text)
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              {renderInput(
                t('quotes.form.driverLicenseExpiry'),
                'MM/YYYY',
                detailsData.driverLicenseExpiry || '',
                (text) => updateDetails('driverLicenseExpiry', text)
              )}
            </View>
          </View>
        </View>
      );
    };


    const renderHomeDetails = () => {
      const yearOptions = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => ({ value: String(y), label: String(y) }));
      const squareFootageOptions = [
        { value: '500-1000', label: '500 - 1,000 sq ft' },
        { value: '1001-1500', label: '1,001 - 1,500 sq ft' },
        { value: '1501-2000', label: '1,501 - 2,000 sq ft' },
        { value: '2001-2500', label: '2,001 - 2,500 sq ft' },
        { value: '2501-3000', label: '2,501 - 3,000 sq ft' },
        { value: '3001+', label: '3,001+ sq ft' },
      ];

      return (
        <View>
          <Text variant="h3" weight="bold" style={{ marginBottom: 16 }}>
            {t('quotes.form.propertyDetails')}
          </Text>

          {/* Property Type */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.propertyType')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['house', 'condo', 'apartment', 'townhouse'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{ width: '48%', margin: '1%', marginHorizontal: 6, marginBottom: 12 }}
                  onPress={() => updateDetails('propertyType', type)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.propertyType === type ? 2 : 0,
                      borderColor: detailsData.propertyType === type ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.propertyType === type ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.propertyType === type ? 'semibold' : 'regular'}
                      color={detailsData.propertyType === type ? theme.colors.primary : theme.colors.text}
                    >
                      {t(`quotes.form.property.${type}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Property Value */}
          {renderInput(
            t('quotes.form.propertyValue'),
            '250000',
            detailsData.propertyValue?.toString() || '',
            (text) => updateDetails('propertyValue', text ? parseInt(text) : undefined),
            'numeric'
          )}

          {/* Square Footage */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.squareFootage')}
            </Text>
            {squareFootageOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={{ marginBottom: 8 }}
                onPress={() => updateDetails('squareFootage', option.value)}
              >
                <Card
                  variant="elevated"
                  style={{
                    padding: 16,
                    borderWidth: detailsData.squareFootage === option.value ? 2 : 0,
                    borderColor: detailsData.squareFootage === option.value ? theme.colors.primary : 'transparent',
                    backgroundColor: detailsData.squareFootage === option.value ? theme.colors.primaryLight + '20' : theme.colors.card,
                  }}
                >
                  <Text
                    variant="body"
                    weight={detailsData.squareFootage === option.value ? 'semibold' : 'regular'}
                    color={detailsData.squareFootage === option.value ? theme.colors.primary : theme.colors.text}
                  >
                    {option.label}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Year Built */}
          <SelectField
            label={t('quotes.form.yearBuilt')}
            value={detailsData.yearBuilt?.toString()}
            placeholder={t('quotes.form.selectYear')}
            options={yearOptions}
            onSelect={(value) => updateDetails('yearBuilt', parseInt(value))}
          />

          {/* Number of Stories */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.numberOfStories')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['1', '2', '3', '4+'].map((stories) => (
                <TouchableOpacity
                  key={stories}
                  style={{ width: '23%', margin: '1%', marginHorizontal: 6 }}
                  onPress={() => updateDetails('numberOfStories', parseInt(stories) || 4)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.numberOfStories === (parseInt(stories) || 4) ? 2 : 0,
                      borderColor: detailsData.numberOfStories === (parseInt(stories) || 4) ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.numberOfStories === (parseInt(stories) || 4) ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.numberOfStories === (parseInt(stories) || 4) ? 'semibold' : 'regular'}
                      color={detailsData.numberOfStories === (parseInt(stories) || 4) ? theme.colors.primary : theme.colors.text}
                    >
                      {stories}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bedrooms and Bathrooms */}
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              {renderInput(
                t('quotes.form.numberOfBedrooms'),
                '3',
                detailsData.numberOfBedrooms?.toString() || '',
                (text) => updateDetails('numberOfBedrooms', text ? parseInt(text) : undefined),
                'numeric'
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              {renderInput(
                t('quotes.form.numberOfBathrooms'),
                '2',
                detailsData.numberOfBathrooms?.toString() || '',
                (text) => updateDetails('numberOfBathrooms', text ? parseInt(text) : undefined),
                'numeric'
              )}
            </View>
          </View>

          {/* Roof Type */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.roofType')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['asphalt', 'metal', 'tile', 'slate', 'wood'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{ width: '31%', margin: '1%', marginHorizontal: 6, marginBottom: 12 }}
                  onPress={() => updateDetails('roofType', type)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.roofType === type ? 2 : 0,
                      borderColor: detailsData.roofType === type ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.roofType === type ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.roofType === type ? 'semibold' : 'regular'}
                      color={detailsData.roofType === type ? theme.colors.primary : theme.colors.text}
                      style={{ fontSize: 12 }}
                    >
                      {t(`quotes.form.roof.${type}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Roof Age */}
          {renderInput(
            t('quotes.form.roofAge'),
            '10',
            detailsData.roofAge?.toString() || '',
            (text) => updateDetails('roofAge', text ? parseInt(text) : undefined),
            'numeric'
          )}

          {/* Construction Type */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.constructionType')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['wood', 'brick', 'concrete', 'steel'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{ width: '48%', margin: '1%', marginHorizontal: 6, marginBottom: 12 }}
                  onPress={() => updateDetails('constructionType', type)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.constructionType === type ? 2 : 0,
                      borderColor: detailsData.constructionType === type ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.constructionType === type ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.constructionType === type ? 'semibold' : 'regular'}
                      color={detailsData.constructionType === type ? theme.colors.primary : theme.colors.text}
                    >
                      {t(`quotes.form.construction.${type}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Occupancy Type */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.occupancyType')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['owner-occupied', 'rental', 'vacation'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{ width: '31%', margin: '1%', marginHorizontal: 6 }}
                  onPress={() => updateDetails('occupancyType', type)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.occupancyType === type ? 2 : 0,
                      borderColor: detailsData.occupancyType === type ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.occupancyType === type ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.occupancyType === type ? 'semibold' : 'regular'}
                      color={detailsData.occupancyType === type ? theme.colors.primary : theme.colors.text}
                      style={{ fontSize: 12, textAlign: 'center' }}
                    >
                      {t(`quotes.form.occupancy.${type}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Security Features */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.securityFeatures')}
            </Text>
            {['smoke-detectors', 'security-system', 'fire-alarm', 'sprinkler-system', 'deadbolts', 'security-cameras'].map((feature) => {
              const features = detailsData.securityFeatures || [];
              const isSelected = features.includes(feature);
              return (
                <TouchableOpacity
                  key={feature}
                  style={{ marginBottom: 8 }}
                  onPress={() => {
                    const updated = isSelected
                      ? features.filter((f: string) => f !== feature)
                      : [...features, feature];
                    updateDetails('securityFeatures', updated);
                  }}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 16,
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: isSelected ? theme.colors.primary : 'transparent',
                      backgroundColor: isSelected ? theme.colors.primaryLight + '20' : theme.colors.card,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}>
                      {isSelected && <CheckCircle size={16} color="#FFFFFF" />}
                    </View>
                    <Text
                      variant="body"
                      weight={isSelected ? 'semibold' : 'regular'}
                      color={isSelected ? theme.colors.primary : theme.colors.text}
                    >
                      {t(`quotes.form.security.${feature}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Coverage Start Date */}
          <DatePickerField
            label={t('quotes.form.coverageStartDate')}
            value={detailsData.coverageStartDate}
            placeholder={t('quotes.form.selectDate')}
            onSelect={(date) => updateDetails('coverageStartDate', date)}
            minimumDate={new Date()}
          />

          {/* Deductible */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.deductible')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {[500, 1000, 1500, 2500, 5000].map((deductible) => (
                <TouchableOpacity
                  key={deductible}
                  style={{ width: '31%', margin: '1%', marginHorizontal: 6, marginBottom: 12 }}
                  onPress={() => updateDetails('deductible', deductible)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.deductible === deductible ? 2 : 0,
                      borderColor: detailsData.deductible === deductible ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.deductible === deductible ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.deductible === deductible ? 'semibold' : 'regular'}
                      color={detailsData.deductible === deductible ? theme.colors.primary : theme.colors.text}
                    >
                      ${deductible}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      );
    };

    const renderLifeDetails = () => {
      const coverageAmountOptions = [
        { value: '100000', label: '$100,000' },
        { value: '250000', label: '$250,000' },
        { value: '500000', label: '$500,000' },
        { value: '1000000', label: '$1,000,000' },
        { value: '2000000', label: '$2,000,000' },
        { value: '5000000', label: '$5,000,000' },
      ];
      const termLengthOptions = [
        { value: '10', label: '10 years' },
        { value: '15', label: '15 years' },
        { value: '20', label: '20 years' },
        { value: '30', label: '30 years' },
      ];

      return (
        <View>
          <Text variant="h3" weight="bold" style={{ marginBottom: 16 }}>
            {t('quotes.form.lifeInsuranceDetails')}
          </Text>

          {/* Coverage Amount */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.coverageAmount')}
            </Text>
            {coverageAmountOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={{ marginBottom: 8 }}
                onPress={() => updateDetails('coverageAmount', parseInt(option.value))}
              >
                <Card
                  variant="elevated"
                  style={{
                    padding: 16,
                    borderWidth: detailsData.coverageAmount === parseInt(option.value) ? 2 : 0,
                    borderColor: detailsData.coverageAmount === parseInt(option.value) ? theme.colors.primary : 'transparent',
                    backgroundColor: detailsData.coverageAmount === parseInt(option.value) ? theme.colors.primaryLight + '20' : theme.colors.card,
                  }}
                >
                  <Text
                    variant="body"
                    weight={detailsData.coverageAmount === parseInt(option.value) ? 'semibold' : 'regular'}
                    color={detailsData.coverageAmount === parseInt(option.value) ? theme.colors.primary : theme.colors.text}
                  >
                    {option.label}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Policy Type */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.policyType')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['term', 'whole', 'universal'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{ width: '31%', margin: '1%', marginHorizontal: 6 }}
                  onPress={() => updateDetails('policyType', type)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.policyType === type ? 2 : 0,
                      borderColor: detailsData.policyType === type ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.policyType === type ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.policyType === type ? 'semibold' : 'regular'}
                      color={detailsData.policyType === type ? theme.colors.primary : theme.colors.text}
                      style={{ fontSize: 12, textAlign: 'center' }}
                    >
                      {t(`quotes.form.policy.${type}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Term Length (only for term life) */}
          {detailsData.policyType === 'term' && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
                {t('quotes.form.termLength')}
              </Text>
              {termLengthOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={{ marginBottom: 8 }}
                  onPress={() => updateDetails('termLength', parseInt(option.value))}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 16,
                      borderWidth: detailsData.termLength === parseInt(option.value) ? 2 : 0,
                      borderColor: detailsData.termLength === parseInt(option.value) ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.termLength === parseInt(option.value) ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.termLength === parseInt(option.value) ? 'semibold' : 'regular'}
                      color={detailsData.termLength === parseInt(option.value) ? theme.colors.primary : theme.colors.text}
                    >
                      {option.label}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Number of Beneficiaries */}
          {renderInput(
            t('quotes.form.beneficiaries'),
            '1',
            detailsData.beneficiaries?.toString() || '',
            (text) => updateDetails('beneficiaries', text ? parseInt(text) : undefined),
            'numeric'
          )}

          {/* Health Status */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.healthStatus')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['excellent', 'good', 'fair', 'poor'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={{ width: '48%', margin: '1%', marginHorizontal: 6, marginBottom: 12 }}
                  onPress={() => updateDetails('healthStatus', status)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.healthStatus === status ? 2 : 0,
                      borderColor: detailsData.healthStatus === status ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.healthStatus === status ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.healthStatus === status ? 'semibold' : 'regular'}
                      color={detailsData.healthStatus === status ? theme.colors.primary : theme.colors.text}
                    >
                      {t(`quotes.form.health.${status}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Smoker */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.smoker')}
            </Text>
            <View style={{ flexDirection: 'row', marginHorizontal: -6 }}>
              {[true, false].map((isSmoker) => (
                <TouchableOpacity
                  key={String(isSmoker)}
                  style={{ flex: 1, marginHorizontal: 6 }}
                  onPress={() => updateDetails('smoker', isSmoker)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.smoker === isSmoker ? 2 : 0,
                      borderColor: detailsData.smoker === isSmoker ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.smoker === isSmoker ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.smoker === isSmoker ? 'semibold' : 'regular'}
                      color={detailsData.smoker === isSmoker ? theme.colors.primary : theme.colors.text}
                    >
                      {isSmoker ? t('common.yes') : t('common.no')}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Height and Weight */}
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              {renderInput(
                t('quotes.form.height'),
                '5\'10"',
                detailsData.height || '',
                (text) => updateDetails('height', text)
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              {renderInput(
                t('quotes.form.weight'),
                '170',
                detailsData.weight?.toString() || '',
                (text) => updateDetails('weight', text ? parseInt(text) : undefined),
                'numeric'
              )}
            </View>
          </View>

          {/* Occupation */}
          {renderInput(
            t('quotes.form.occupation'),
            'Software Engineer',
            detailsData.occupation || '',
            (text) => updateDetails('occupation', text)
          )}

          {/* Pre-existing Conditions */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.preExistingConditions')}
            </Text>
            <View style={{ flexDirection: 'row', marginHorizontal: -6 }}>
              {[true, false].map((hasConditions) => (
                <TouchableOpacity
                  key={String(hasConditions)}
                  style={{ flex: 1, marginHorizontal: 6 }}
                  onPress={() => updateDetails('preExistingConditions', hasConditions)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.preExistingConditions === hasConditions ? 2 : 0,
                      borderColor: detailsData.preExistingConditions === hasConditions ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.preExistingConditions === hasConditions ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.preExistingConditions === hasConditions ? 'semibold' : 'regular'}
                      color={detailsData.preExistingConditions === hasConditions ? theme.colors.primary : theme.colors.text}
                    >
                      {hasConditions ? t('common.yes') : t('common.no')}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Family History */}
          {renderInput(
            t('quotes.form.familyHistory'),
            'Heart disease, diabetes',
            detailsData.familyHistory || '',
            (text) => updateDetails('familyHistory', text)
          )}

          {/* Coverage Start Date */}
          <DatePickerField
            label={t('quotes.form.coverageStartDate')}
            value={detailsData.coverageStartDate}
            placeholder={t('quotes.form.selectDate')}
            onSelect={(date) => updateDetails('coverageStartDate', date)}
            minimumDate={new Date()}
          />
        </View>
      );
    };

    const renderHealthDetails = () => {
      return (
        <View>
          <Text variant="h3" weight="bold" style={{ marginBottom: 16 }}>
            {t('quotes.form.healthInsuranceDetails')}
          </Text>

          {/* Family Size */}
          {renderInput(
            t('quotes.form.familySize'),
            '2',
            detailsData.familySize?.toString() || '',
            (text) => updateDetails('familySize', text ? parseInt(text) : undefined),
            'numeric'
          )}

          {/* Age */}
          {renderInput(
            t('quotes.form.age'),
            '35',
            detailsData.age?.toString() || '',
            (text) => updateDetails('age', text ? parseInt(text) : undefined),
            'numeric'
          )}

          {/* Plan Type */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.planType')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['hmo', 'ppo', 'epo', 'pos'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{ width: '48%', margin: '1%', marginHorizontal: 6, marginBottom: 12 }}
                  onPress={() => updateDetails('planType', type)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.planType === type ? 2 : 0,
                      borderColor: detailsData.planType === type ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.planType === type ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.planType === type ? 'semibold' : 'regular'}
                      color={detailsData.planType === type ? theme.colors.primary : theme.colors.text}
                    >
                      {t(`quotes.form.plan.${type}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Coverage Level */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.coverageLevel')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['basic', 'standard', 'premium'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={{ width: '31%', margin: '1%', marginHorizontal: 6 }}
                  onPress={() => updateDetails('coverageLevel', level)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.coverageLevel === level ? 2 : 0,
                      borderColor: detailsData.coverageLevel === level ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.coverageLevel === level ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.coverageLevel === level ? 'semibold' : 'regular'}
                      color={detailsData.coverageLevel === level ? theme.colors.primary : theme.colors.text}
                    >
                      {t(`quotes.form.coverage.${level}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pre-existing Conditions */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.preExistingConditions')}
            </Text>
            <View style={{ flexDirection: 'row', marginHorizontal: -6 }}>
              {[true, false].map((hasConditions) => (
                <TouchableOpacity
                  key={String(hasConditions)}
                  style={{ flex: 1, marginHorizontal: 6 }}
                  onPress={() => updateDetails('preExistingConditions', hasConditions)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.preExistingConditions === hasConditions ? 2 : 0,
                      borderColor: detailsData.preExistingConditions === hasConditions ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.preExistingConditions === hasConditions ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.preExistingConditions === hasConditions ? 'semibold' : 'regular'}
                      color={detailsData.preExistingConditions === hasConditions ? theme.colors.primary : theme.colors.text}
                    >
                      {hasConditions ? t('common.yes') : t('common.no')}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Current Insurance */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.currentInsurance')}
            </Text>
            <View style={{ flexDirection: 'row', marginHorizontal: -6 }}>
              {[true, false].map((hasInsurance) => (
                <TouchableOpacity
                  key={String(hasInsurance)}
                  style={{ flex: 1, marginHorizontal: 6 }}
                  onPress={() => updateDetails('currentInsurance', hasInsurance)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.currentInsurance === hasInsurance ? 2 : 0,
                      borderColor: detailsData.currentInsurance === hasInsurance ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.currentInsurance === hasInsurance ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.currentInsurance === hasInsurance ? 'semibold' : 'regular'}
                      color={detailsData.currentInsurance === hasInsurance ? theme.colors.primary : theme.colors.text}
                    >
                      {hasInsurance ? t('common.yes') : t('common.no')}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Coverage Start Date */}
          <DatePickerField
            label={t('quotes.form.coverageStartDate')}
            value={detailsData.coverageStartDate}
            placeholder={t('quotes.form.selectDate')}
            onSelect={(date) => updateDetails('coverageStartDate', date)}
            minimumDate={new Date()}
          />
        </View>
      );
    };

    const renderTravelDetails = () => {
      return (
        <View>
          <Text variant="h3" weight="bold" style={{ marginBottom: 16 }}>
            {t('quotes.form.travelInsuranceDetails')}
          </Text>

          {/* Destination */}
          {renderInput(
            t('quotes.form.destination'),
            'Paris, France',
            detailsData.destination || '',
            (text) => updateDetails('destination', text)
          )}

          {/* Trip Type */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.tripType')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['leisure', 'business', 'adventure', 'cruise'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{ width: '48%', margin: '1%', marginHorizontal: 6, marginBottom: 12 }}
                  onPress={() => updateDetails('tripType', type)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.tripType === type ? 2 : 0,
                      borderColor: detailsData.tripType === type ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.tripType === type ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.tripType === type ? 'semibold' : 'regular'}
                      color={detailsData.tripType === type ? theme.colors.primary : theme.colors.text}
                    >
                      {t(`quotes.form.trip.${type}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Travel Dates */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.travelDates')}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <DatePickerField
                  label={t('quotes.form.departureDate')}
                  value={detailsData.travelDates?.departure}
                  placeholder={t('quotes.form.selectDate')}
                  onSelect={(date) => updateDetails('travelDates', {
                    ...(detailsData.travelDates || {}),
                    departure: date,
                  })}
                  minimumDate={new Date()}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <DatePickerField
                  label={t('quotes.form.returnDate')}
                  value={detailsData.travelDates?.return}
                  placeholder={t('quotes.form.selectDate')}
                  onSelect={(date) => updateDetails('travelDates', {
                    ...(detailsData.travelDates || {}),
                    return: date,
                  })}
                  minimumDate={detailsData.travelDates?.departure ? new Date(detailsData.travelDates.departure) : new Date()}
                />
              </View>
            </View>
          </View>

          {/* Trip Duration */}
          {renderInput(
            t('quotes.form.tripDuration'),
            '7',
            detailsData.tripDuration?.toString() || '',
            (text) => updateDetails('tripDuration', text ? parseInt(text) : undefined),
            'numeric'
          )}

          {/* Number of Travelers */}
          {renderInput(
            t('quotes.form.travelers'),
            '2',
            detailsData.travelers?.toString() || '',
            (text) => updateDetails('travelers', text ? parseInt(text) : undefined),
            'numeric'
          )}

          {/* Coverage Level */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.coverageLevel')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {['basic', 'standard', 'premium'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={{ width: '31%', margin: '1%', marginHorizontal: 6 }}
                  onPress={() => updateDetails('coverageLevel', level)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: detailsData.coverageLevel === level ? 2 : 0,
                      borderColor: detailsData.coverageLevel === level ? theme.colors.primary : 'transparent',
                      backgroundColor: detailsData.coverageLevel === level ? theme.colors.primaryLight + '20' : theme.colors.card,
                    }}
                  >
                    <Text
                      variant="body"
                      weight={detailsData.coverageLevel === level ? 'semibold' : 'regular'}
                      color={detailsData.coverageLevel === level ? theme.colors.primary : theme.colors.text}
                    >
                      {t(`quotes.form.coverage.${level}`)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Coverages */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
              {t('quotes.form.additionalTravelCoverage')}
            </Text>
            {[
              { key: 'cancellationCoverage', label: t('quotes.form.cancellationCoverage') },
              { key: 'medicalCoverage', label: t('quotes.form.medicalCoverage') },
              { key: 'baggageCoverage', label: t('quotes.form.baggageCoverage') },
            ].map(({ key, label }) => {
              const isSelected = detailsData[key as keyof typeof detailsData] === true;
              return (
                <TouchableOpacity
                  key={key}
                  style={{ marginBottom: 8 }}
                  onPress={() => updateDetails(key, !isSelected)}
                >
                  <Card
                    variant="elevated"
                    style={{
                      padding: 16,
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: isSelected ? theme.colors.primary : 'transparent',
                      backgroundColor: isSelected ? theme.colors.primaryLight + '20' : theme.colors.card,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}>
                      {isSelected && <CheckCircle size={16} color="#FFFFFF" />}
                    </View>
                    <Text
                      variant="body"
                      weight={isSelected ? 'semibold' : 'regular'}
                      color={isSelected ? theme.colors.primary : theme.colors.text}
                    >
                      {label}
                    </Text>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    };

    switch (selectedType) {
      case 'auto':
        return renderAutoDetails();
      case 'home':
        return renderHomeDetails();
      case 'life':
        return renderLifeDetails();
      case 'health':
        return renderHealthDetails();
      case 'travel':
        return renderTravelDetails();
      default:
        return null;
    }
  };

  const showInfoModal = (title: string, content: React.ReactNode) => {
    setInfoModalTitle(title);
    setInfoModalContent(content);
    setInfoModalVisible(true);
  };

  const handleRecalculate = async () => {
    setIsCalculating(true);
    try {
      const personalInfoData = {
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        dateOfBirth: profile?.dateOfBirth || '',
        maritalStatus,
        gender,
      };
      
      const calc = await calculateQuote({
        type: selectedType!,
        personalInfo: personalInfoData as any,
        details: detailsData,
      });
      setCalculation(calc);
      Alert.alert(t('common.success'), t('quotes.form.recalculated'));
    } catch (error: any) {
      Alert.alert(t('common.error'), error?.message || t('quotes.form.calculationError'));
    } finally {
      setIsCalculating(false);
    }
  };

  const renderCoverageItem = (coverage: Coverage, showLimit?: boolean, showDeductible?: boolean) => {
    const isSelected = selectedCoverages[coverage.id] || coverage.category === 'mandatory';
    const selectedAmount = coverageAmounts[coverage.id] || coverage.price || 0;
    const displayPrice = paymentFrequency === 'monthly' 
      ? (selectedAmount / 12).toFixed(2)
      : selectedAmount.toFixed(2);
    const priceLabel = paymentFrequency === 'monthly' ? '/month' : '/year';

    // Determine if it's a limit, deductible, or included (similar to policy detail screen)
    const isLimit = showLimit || ['liability', 'propertyDamage', 'uninsuredMotorist', 'dwelling', 'personalProperty', 'familyProtection', 'death-benefit', 'emergency-medical'].includes(coverage.id);
    const isDeductible = showDeductible || ['collision', 'comprehensive', 'directCompensation'].includes(coverage.id);
    const isIncluded = selectedAmount === 0 && ['accidentBenefits', 'uninsuredMotorist', 'preventive-care'].includes(coverage.id);

    let subLabel = '';
    if (isLimit) subLabel = t('quotes.form.limit');
    else if (isDeductible) subLabel = t('quotes.form.deductible');
    else if (isIncluded) subLabel = t('quotes.form.included');

    return (
      <View key={coverage.id} style={{ marginBottom: 12 }}>
        <Card variant="elevated" style={{
          padding: 16,
          borderWidth: isSelected ? 2 : 0,
          borderColor: isSelected ? theme.colors.primary : 'transparent',
          backgroundColor: isSelected ? theme.colors.primaryLight + '10' : theme.colors.card,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={{ flex: 1 }}>
                  <Text variant="body" weight="semibold">
                    {coverage.name}
                  </Text>
                  {subLabel && (
                    <Text variant="caption" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
                      {subLabel}
                    </Text>
                  )}
                </View>
                {coverage.price && !isIncluded && (
                  <Text variant="body" weight="semibold" color={theme.colors.primary}>
                    +${displayPrice}{priceLabel}
                  </Text>
                )}
                {isIncluded && (
                  <Text variant="body" weight="semibold" color={theme.colors.success}>
                    {t('quotes.form.included')}
                  </Text>
                )}
              </View>
              <Text variant="caption" color={theme.colors.textSecondary} numberOfLines={2}>
                {coverage.description}
              </Text>
              {isSelected && coverage.amountOptions && coverage.amountOptions.length > 0 && (
                <View style={{ marginTop: 12 }}>
                  <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 6 }}>
                    {t('quotes.form.selectAmount')}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 }}>
                    {coverage.amountOptions.map((amount) => {
                      const isAmountSelected = coverageAmounts[coverage.id] === amount;
                      return (
                        <TouchableOpacity
                          key={amount}
                          style={{ margin: 4 }}
                          onPress={() => setCoverageAmounts(prev => ({
                            ...prev,
                            [coverage.id]: amount,
                          }))}
                        >
                          <View style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: isAmountSelected ? theme.colors.primary : theme.colors.border,
                            backgroundColor: isAmountSelected ? theme.colors.primaryLight + '20' : theme.colors.surface,
                          }}>
                            <Text style={{
                              fontSize: 12,
                              color: isAmountSelected ? theme.colors.primary : theme.colors.text,
                              fontWeight: isAmountSelected ? '600' : '400',
                            }}>
                              ${amount}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
              <TouchableOpacity
                onPress={() => showInfoModal(
                  coverage.name,
                  <View>
                    <Text style={{ fontSize: 15, color: theme.colors.text, marginBottom: 12, lineHeight: 22 }}>
                      {coverage.description}
                    </Text>
                    {coverage.example && (
                      <View style={{
                        backgroundColor: theme.colors.primaryLight + '10',
                        padding: 12,
                        borderRadius: 8,
                        marginTop: 8,
                      }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.primary, marginBottom: 6 }}>
                          {t('quotes.form.example')}
                        </Text>
                        <Text style={{ fontSize: 14, color: theme.colors.text, lineHeight: 20 }}>
                          {coverage.example}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                style={{ marginRight: 8 }}
              >
                <Info size={20} color={theme.colors.primary} />
              </TouchableOpacity>
              {coverage.category !== 'mandatory' && (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCoverages(prev => ({
                      ...prev,
                      [coverage.id]: !prev[coverage.id],
                    }));
                    if (!selectedCoverages[coverage.id] && coverage.price) {
                      setCoverageAmounts(prev => ({
                        ...prev,
                        [coverage.id]: coverage.price!,
                      }));
                    }
                  }}
                >
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {isSelected && <CheckCircle size={16} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Card>
      </View>
    );
  };

  const renderReview = () => {
    if (!calculation) return null;

    const firstName = profile?.firstName || '';
    const finalPremium = paymentFrequency === 'monthly' 
      ? calculation.monthlyPremium 
      : calculation.annualPremium;
    
    const coverages = getCoveragesByType(selectedType || 'auto');
    const allSelectableCoverages = [...coverages.recommended, ...coverages.optional];
    
    const selectedCoverageTotal = Object.entries(selectedCoverages)
      .filter(([id, selected]) => selected)
      .reduce((sum, [id]) => {
        const coverage = allSelectableCoverages.find(c => c.id === id);
        const amount = coverageAmounts[id] || coverage?.price || 0;
        return sum + amount;
      }, 0);
    
    const totalPremium = finalPremium + (selectedCoverageTotal / (paymentFrequency === 'monthly' ? 12 : 1));

    return (
      <View>
        <Text variant="h3" weight="bold" style={{ marginBottom: 8 }}>
          {firstName ? t('quotes.form.quoteReady', { firstName }) : t('quotes.form.reviewQuote')}
        </Text>
        <Text variant="body" color={theme.colors.textSecondary} style={{ marginBottom: 24 }}>
          {t('quotes.form.reviewDescription')}
        </Text>

        {/* Payment Frequency Selection */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 12 }}>
            {t('quotes.form.paymentFrequency')}
          </Text>
          <View style={{ flexDirection: 'row', marginHorizontal: -6 }}>
            {['monthly', 'yearly'].map((freq) => (
              <TouchableOpacity
                key={freq}
                style={{ flex: 1, marginHorizontal: 6 }}
                onPress={() => setPaymentFrequency(freq as 'monthly' | 'yearly')}
              >
                <Card
                  variant="elevated"
                  style={{
                    padding: 16,
                    alignItems: 'center',
                    borderWidth: paymentFrequency === freq ? 2 : 0,
                    borderColor: paymentFrequency === freq ? theme.colors.primary : 'transparent',
                    backgroundColor: paymentFrequency === freq ? theme.colors.primaryLight + '20' : theme.colors.card,
                  }}
                >
                  <Text
                    variant="body"
                    weight={paymentFrequency === freq ? 'semibold' : 'regular'}
                    color={paymentFrequency === freq ? theme.colors.primary : theme.colors.text}
                  >
                    {t(`quotes.form.${freq}`)}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recalculate Button */}
        <TouchableOpacity
          onPress={handleRecalculate}
          disabled={isCalculating}
          style={{
            marginBottom: 24,
            padding: 12,
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text variant="body" color={theme.colors.primary} weight="semibold">
            {t('quotes.form.recalculateQuote')}
          </Text>
        </TouchableOpacity>

        {/* Coverages - Dynamic based on insurance type */}
        {(() => {
          const coverages = getCoveragesByType(selectedType || 'auto');
          const isAutoOrMotorcycle = selectedType === 'auto' || selectedType === 'motorcycle';
          
          return (
            <>
              {/* Mandatory Coverages */}
              {coverages.mandatory.length > 0 && (
                <>
                  <Text variant="h3" weight="bold" style={{ marginBottom: 16, marginTop: 8 }}>
                    {t('quotes.form.mandatoryCoverages')}
                  </Text>
                  {coverages.mandatory.map((coverage) => renderCoverageItem(
                    coverage,
                    isAutoOrMotorcycle && ['liability', 'propertyDamage', 'uninsuredMotorist', 'familyProtection'].includes(coverage.id),
                    false
                  ))}
                </>
              )}

              {/* Recommended Coverages */}
              {coverages.recommended.length > 0 && (
                <>
                  <Text variant="h3" weight="bold" style={{ marginBottom: 16, marginTop: 24 }}>
                    {t('quotes.form.recommendedCoverages')}
                  </Text>
                  {coverages.recommended.map((coverage) => renderCoverageItem(
                    coverage,
                    false,
                    isAutoOrMotorcycle && ['collision', 'comprehensive', 'directCompensation'].includes(coverage.id)
                  ))}
                </>
              )}

              {/* Optional Coverages */}
              {coverages.optional.length > 0 && (
                <>
                  <Text variant="h3" weight="bold" style={{ marginBottom: 16, marginTop: 24 }}>
                    {t('quotes.form.optionalCoverages')}
                  </Text>
                  {coverages.optional.map((coverage) => renderCoverageItem(coverage, false, false))}
                </>
              )}
            </>
          );
        })()}

        {/* Quote Summary */}
        <Card variant="elevated" style={[styles.calculationCard, { marginTop: 24 }]}>
          <Text variant="h3" weight="bold" style={{ marginBottom: 16 }}>
            {t('quotes.form.quoteSummary')}
          </Text>
          <View style={styles.calculationRow}>
            <Text variant="body">{t('quotes.form.basePremium')}</Text>
            <Text variant="body" weight="semibold">
              ${calculation.basePremium.toFixed(2)}
            </Text>
          </View>
          {calculation.discounts.length > 0 && (
            <>
              {calculation.discounts.map((discount, index) => (
                <View key={index} style={styles.calculationRow}>
                  <Text variant="body" color={theme.colors.success}>
                    {discount.name}
                  </Text>
                  <Text variant="body" color={theme.colors.success} weight="semibold">
                    -${Math.abs(discount.amount).toFixed(2)}
                  </Text>
                </View>
              ))}
            </>
          )}
          {calculation.adjustments.length > 0 && (
            <>
              {calculation.adjustments.map((adjustment, index) => (
                <View key={index} style={styles.calculationRow}>
                  <Text variant="body">{adjustment.name}</Text>
                  <Text variant="body" weight="semibold">
                    +${adjustment.amount.toFixed(2)}
                  </Text>
                </View>
              ))}
            </>
          )}
          {selectedCoverageTotal > 0 && (
            <View style={styles.calculationRow}>
              <Text variant="body">{t('quotes.form.additionalCoverages')}</Text>
              <Text variant="body" weight="semibold">
                +${(selectedCoverageTotal / (paymentFrequency === 'monthly' ? 12 : 1)).toFixed(2)}
              </Text>
            </View>
          )}
          <View style={[styles.calculationRow, styles.calculationTotal, { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border }]}>
            <Text variant="h3" weight="bold">
              {paymentFrequency === 'monthly' ? t('quotes.form.monthlyPremium') : t('quotes.form.annualPremium')}
            </Text>
            <Text variant="h3" weight="bold" color={theme.colors.primary}>
              ${totalPremium.toFixed(2)}
            </Text>
          </View>
          {paymentFrequency === 'monthly' && (
            <View style={styles.calculationRow}>
              <Text variant="body" color={theme.colors.textSecondary}>
                {t('quotes.form.annualPremium')}
              </Text>
              <Text variant="body" color={theme.colors.textSecondary}>
                ${(totalPremium * 12).toFixed(2)}
              </Text>
            </View>
          )}
        </Card>

        <InfoModal
          visible={infoModalVisible}
          onClose={() => setInfoModalVisible(false)}
          title={infoModalTitle}
          content={infoModalContent}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        enabled={Platform.OS === 'ios'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStepIndicator()}

          <Card variant="elevated" style={{ padding: 20, marginBottom: 16 }}>
            {currentStep === 1 && renderTypeSelection()}
            {currentStep === 2 && renderPersonalInfo()}
            {currentStep === 3 && renderDetails()}
            {currentStep === 4 && renderReview()}
          </Card>
        </ScrollView>

        <View style={[styles.actions, { paddingBottom: bottom + 16 }]}>
          <Button
            title={t('common.back')}
            variant="outline"
            onPress={handleBack}
            style={styles.actionButton}
            disabled={isSubmitting || isCalculating}
          />
          {currentStep < totalSteps ? (
            <Button
              title={t('common.continue')}
              onPress={handleNext}
              style={styles.actionButton}
              loading={isCalculating}
              disabled={isSubmitting || isCalculating}
            />
          ) : (
            <Button
              title={t('quotes.form.submitQuote')}
              onPress={handleSubmitQuote}
              style={styles.actionButton}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

