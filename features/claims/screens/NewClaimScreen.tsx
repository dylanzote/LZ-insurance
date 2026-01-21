import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormInput } from '@/components/ui/FormInput';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { ClaimFormData, claimFormSchema } from '@/core/utils/validation';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useTranslation } from '@/hooks/useTranslation';
import { claimsAPI } from '@/services/api/endpoints';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import {
  Activity,
  AlertCircle,
  Camera,
  CheckCircle,
  FileText,
  Heart,
  Home,
  Image as ImageIcon,
  MapPin,
  Navigation,
  Shield,
  Trash2,
  Upload,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { ClaimCategory } from '../types';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: isTablet ? 24 : 16,
    paddingBottom: 32,
  } as const,
  headerCard: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 16,
  } as const,
  welcomeText: {
    fontSize: 14,
    color: theme.colors.primaryDark,
    marginBottom: 8,
    fontWeight: '600' as const,
  } as const,
  title: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 8,
  } as const,
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  } as const,
  stepIndicator: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 32,
    paddingHorizontal: isTablet ? 32 : 16,
  } as const,
  step: {
    alignItems: 'center' as const,
    flex: 1,
    maxWidth: isTablet ? 200 : 80,
  } as const,
  stepNumber: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
    borderWidth: 3,
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
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  } as const,
  stepText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    marginTop: 4,
  } as const,
  stepTextActive: {
    color: theme.colors.primary,
  } as const,
  stepTextInactive: {
    color: theme.colors.textSecondary,
  } as const,
  stepLine: {
    height: 3,
    backgroundColor: theme.colors.border,
    flex: 1,
    marginHorizontal: 8,
    alignSelf: 'center' as const,
    marginTop: isTablet ? 24 : 20,
    borderRadius: 2,
  } as const,
  stepLineActive: {
    backgroundColor: theme.colors.primary,
  } as const,
  formCard: {
    marginBottom: 24,
    padding: isTablet ? 28 : 20,
  } as const,
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 8,
  } as const,
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  } as const,
  policyGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginBottom: 24,
  } as const,
  policyCard: {
    width: isTablet ? '31%' : '48%',
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center' as const,
    minHeight: 140,
    justifyContent: 'center' as const,
  } as const,
  policyCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  } as const,
  policyIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  } as const,
  policyIconContainerSelected: {
    backgroundColor: theme.colors.primary,
  } as const,
  policyName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 6,
    textAlign: 'center' as const,
  } as const,
  policyDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 16,
  } as const,
  categoryGrid: {
    marginBottom: 24,
  } as const,
  categoryCard: {
    backgroundColor: theme.colors.surface,
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  categoryCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  } as const,
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  } as const,
  categoryContent: {
    flex: 1,
  } as const,
  categoryName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  categoryDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  } as const,
  checkIcon: {
    marginLeft: 8,
  } as const,
  input: {
    marginBottom: 20,
  } as const,
  locationInputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    gap: 8,
  } as const,
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 0,
  } as const,
  useCurrentLocationButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start' as const,
  } as const,
  useCurrentLocationText: {
    marginLeft: 6,
    color: theme.colors.primary,
    fontWeight: '600' as const,
  } as const,
  uploadSection: {
    marginBottom: 24,
  } as const,
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 12,
  } as const,
  uploadCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed' as const,
    padding: isTablet ? 40 : 32,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as const,
  uploadCardHalf: {
    flex: 1,
    padding: isTablet ? 24 : 20,
    marginHorizontal: 6,
  } as const,
  photoButtonsRow: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 8,
  } as const,
  uploadIcon: {
    marginBottom: 12,
  } as const,
  uploadText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 6,
    textAlign: 'center' as const,
  } as const,
  uploadSubtext: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  } as const,
  uploadCardDisabled: {
    opacity: 0.5,
  } as const,
  uploadCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '400' as const,
  } as const,
  imagesGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: 16,
    gap: 12,
  } as const,
  imageItem: {
    width: (width - 64) / 3,
    height: (width - 64) / 3,
    borderRadius: 12,
    overflow: 'hidden' as const,
    position: 'relative' as const,
  } as const,
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover' as const,
  } as const,
  removeButton: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    backgroundColor: theme.colors.error,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: theme.colors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  } as const,
  documentsList: {
    marginTop: 16,
    gap: 12,
  } as const,
  documentItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  } as const,
  documentName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  documentSize: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  } as const,
  removeDocumentButton: {
    padding: 4,
  } as const,
  reviewImagesScroll: {
    marginTop: 12,
  } as const,
  reviewImageItem: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden' as const,
  } as const,
  reviewImagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover' as const,
  } as const,
  reviewDocumentsList: {
    marginTop: 12,
    gap: 8,
  } as const,
  reviewDocumentItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
  } as const,
  reviewDocumentName: {
    fontSize: 13,
    color: theme.colors.text,
    marginLeft: 8,
    flex: 1,
  } as const,
  reviewCard: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  reviewLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600' as const,
  } as const,
  reviewValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
  buttonRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: 32,
    gap: 12,
  } as const,
  navButton: {
    flex: 1,
  } as const,
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginBottom: 24,
    overflow: 'hidden' as const,
  } as const,
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  } as const,
}));

const policyTypes = [
  {
    id: 'auto',
    name: 'Auto Insurance',
    description: 'Vehicle accidents, theft, damage',
    icon: Shield,
    color: '#FF6B6B',
  },
  {
    id: 'home',
    name: 'Home Insurance',
    description: 'Property damage, theft, disasters',
    icon: Home,
    color: '#4ECDC4',
  },
  {
    id: 'life',
    name: 'Life Insurance',
    description: 'Life coverage claims',
    icon: Heart,
    color: '#FFD93D',
  },
  {
    id: 'health',
    name: 'Health Insurance',
    description: 'Medical expenses, treatments',
    icon: Activity,
    color: '#6BCB77',
  },
];

const claimCategories: ClaimCategory[] = [
  {
    id: 'auto_accident',
    name: 'Car Accident',
    description: 'Collision with another vehicle or object',
    policyType: 'auto',
  },
  {
    id: 'theft',
    name: 'Theft or Vandalism',
    description: 'Stolen vehicle or vandalism damage',
    policyType: 'auto',
  },
  {
    id: 'weather',
    name: 'Weather Damage',
    description: 'Hail, flood, or storm damage',
    policyType: 'auto',
  },
  {
    id: 'fire',
    name: 'Fire Damage',
    description: 'Fire, smoke, or explosion damage',
    policyType: 'home',
  },
  {
    id: 'water',
    name: 'Water Damage',
    description: 'Flood, leak, or water-related damage',
    policyType: 'home',
  },
  {
    id: 'theft_home',
    name: 'Home Theft',
    description: 'Burglary or theft from property',
    policyType: 'home',
  },
];

export const NewClaimScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { bottom } = useSafeArea();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPolicyType, setSelectedPolicyType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
    getValues,
  } = useFormValidation({
    schema: claimFormSchema,
    defaultValues: {
      policyId: '',
      policyType: 'auto',
      title: '',
      description: '',
      incidentDate: new Date().toISOString().split('T')[0],
      amount: '',
      location: '',
      category: '',
      documents: [],
      images: [],
    },
  });

  const formData = watch();
  
  // Watch step 2 specific fields for validation
  const title = watch('title');
  const description = watch('description');
  const incidentDate = watch('incidentDate');
  const location = watch('location');
  const amount = watch('amount');
  
  // Watch images and documents
  const images = watch('images');
  const documents = watch('documents');

  const steps = [
    { number: 1, title: 'Policy', icon: Shield },
    { number: 2, title: 'Details', icon: FileText },
    { number: 3, title: 'Documents', icon: Upload },
    { number: 4, title: 'Review', icon: CheckCircle },
  ];

  const filteredCategories = claimCategories.filter(
    category => category.policyType === selectedPolicyType
  );

  const progressPercentage = (currentStep / 4) * 100;

  const handlePolicyTypeSelect = (policyType: string) => {
    setSelectedPolicyType(policyType);
    setValue('policyType', policyType as any);
    setSelectedCategory('');
    setValue('category', '');
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setValue('category', categoryId);
  };

  const handleNextStep = async () => {
    if (currentStep === 2) {
      // Trigger validation for step 2 fields
      const isStep2Valid = await trigger(['title', 'description', 'incidentDate', 'location', 'amount']);
      if (!isStep2Valid) {
        return;
      }
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('claims.location.permissionDenied'),
          t('claims.location.permissionMessage')
        );
        setIsGettingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Format address
      const addressParts = [
        address.streetNumber,
        address.street,
        address.city,
        address.region,
        address.postalCode,
        address.country,
      ].filter(Boolean);

      const formattedAddress = addressParts.join(', ') || 
        `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
      
      setValue('location', formattedAddress, { shouldValidate: true });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        t('claims.location.error'),
        t('claims.location.errorMessage')
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handlePickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('claims.upload.permissionDenied'),
          t('claims.upload.permissionMessage')
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const currentImages = images || [];
        const newImages = result.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type || 'image',
          name: asset.fileName || `image_${Date.now()}.jpg`,
          size: asset.fileSize || 0,
        }));
        
        const updatedImages = [...currentImages, ...newImages].slice(0, 10); // Max 10 images
        setValue('images', updatedImages, { shouldValidate: true });
        
        if (result.assets.length + currentImages.length > 10) {
          Alert.alert(
            t('claims.upload.maxImages'),
            t('claims.upload.maxImagesMessage')
          );
        }
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert(
        t('claims.upload.error'),
        t('claims.upload.errorMessage')
      );
    }
  };

  const handleTakePicture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('claims.upload.cameraPermissionDenied'),
          t('claims.upload.cameraPermissionMessage')
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const currentImages = images || [];
        if (currentImages.length >= 10) {
          Alert.alert(
            t('claims.upload.maxImages'),
            t('claims.upload.maxImagesMessage')
          );
          return;
        }

        const asset = result.assets[0];
        const newImage = {
          uri: asset.uri,
          type: asset.type || 'image',
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          size: asset.fileSize || 0,
        };
        
        const updatedImages = [...currentImages, newImage];
        setValue('images', updatedImages, { shouldValidate: true });
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert(
        t('claims.upload.error'),
        t('claims.upload.errorMessage')
      );
    }
  };

  const handlePickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const currentDocuments = documents || [];
        const newDocuments = result.assets.map(asset => ({
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType || 'application/pdf',
          size: asset.size || 0,
        }));
        
        const updatedDocuments = [...currentDocuments, ...newDocuments];
        setValue('documents', updatedDocuments, { shouldValidate: true });
      }
    } catch (error) {
      console.error('Error picking documents:', error);
      Alert.alert(
        t('claims.upload.error'),
        t('claims.upload.errorMessage')
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = images || [];
    const updatedImages = currentImages.filter((_: any, i: number) => i !== index);
    setValue('images', updatedImages, { shouldValidate: true });
  };

  const handleRemoveDocument = (index: number) => {
    const currentDocuments = documents || [];
    const updatedDocuments = currentDocuments.filter((_: any, i: number) => i !== index);
    setValue('documents', updatedDocuments, { shouldValidate: true });
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ClaimFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare claim data with all form fields
      const claimData = {
        ...data,
        policyId: data.policyId || '1', // Use first policy as default if not selected
        policyType: selectedPolicyType || data.policyType,
        category: selectedCategory || data.category,
        images: images || [],
        documents: documents || [],
      };

      // Submit claim to API
      const response = await claimsAPI.submitClaim(claimData);
      
      // Show success message and navigate
      Alert.alert(
        t('claims.submitSuccess.title'),
        t('claims.submitSuccess.message'),
        [
          {
            text: t('claims.submitSuccess.viewClaims'),
            onPress: () => {
              // Navigate to claims list
              router.push('/(app)/claims/trackClaim' as any);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting claim:', error);
      Alert.alert(
        t('claims.submitError.title'), 
        t('claims.submitError.message')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async () => {
    // Get current form values
    const formValues = getValues();
    
    // Validate required fields manually
    if (!isStep1Valid || !isStep2Valid) {
      Alert.alert(
        t('errors.validation'),
        t('errors.required')
      );
      return;
    }

    // Call onSubmit with form values
    await onSubmit(formValues as ClaimFormData);
  };

  const renderStep1 = () => (
    <View>
      <Text variant="body" style={styles.sectionDescription}>
        {t('claims.step1.description')}
      </Text>
      
      <View style={styles.policyGrid}>
        {policyTypes.map((policy) => {
          const Icon = policy.icon;
          const isSelected = selectedPolicyType === policy.id;
          return (
            <TouchableOpacity
              key={policy.id}
              style={[
                styles.policyCard,
                isSelected && styles.policyCardSelected,
              ]}
              onPress={() => handlePolicyTypeSelect(policy.id)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.policyIconContainer,
                isSelected && styles.policyIconContainerSelected,
              ]}>
                <Icon 
                  color={isSelected ? theme.colors.white : theme.colors.primary} 
                  size={28} 
                />
              </View>
              <Text style={styles.policyName}>{policy.name}</Text>
              <Text style={styles.policyDescription}>{policy.description}</Text>
              {isSelected && (
                <CheckCircle 
                  color={theme.colors.primary} 
                  size={20} 
                  style={{ marginTop: 8 }} 
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedPolicyType && (
        <View style={styles.categoryGrid}>
          <Text variant="h3" style={styles.sectionTitle}>
            {t('claims.step1.selectCategory')}
          </Text>
          <Text variant="body" style={styles.sectionDescription}>
            {t('claims.step1.categoryDescription')}
          </Text>
          
          {filteredCategories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardSelected,
                ]}
                onPress={() => handleCategorySelect(category.id)}
                activeOpacity={0.7}
              >
                <View style={styles.categoryIcon}>
                  <AlertCircle 
                    color={isSelected ? theme.colors.primary : theme.colors.textSecondary} 
                    size={20} 
                  />
                </View>
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
                {isSelected && (
                  <CheckCircle 
                    color={theme.colors.primary} 
                    size={24} 
                    style={styles.checkIcon} 
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text variant="body" style={styles.sectionDescription}>
        {t('claims.step2.description')}
      </Text>

      <FormInput
        control={control}
        name="title"
        label={t('claims.step2.titleLabel')}
        placeholder={t('claims.step2.titlePlaceholder')}
        style={styles.input}
        error={errors.title}
      />

      <FormInput
        control={control}
        name="incidentDate"
        label={t('claims.step2.dateLabel')}
        placeholder={t('claims.step2.datePlaceholder')}
        style={styles.input}
        error={errors.incidentDate}
      />

      <View style={styles.input}>
        <View style={styles.locationInputContainer}>
          <FormInput
            control={control}
            name="location"
            label={t('claims.step2.locationLabel')}
            placeholder={t('claims.step2.locationPlaceholder')}
            style={{ flex: 1, marginBottom: 0 }}
            error={errors.location}
          />
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleGetCurrentLocation}
            disabled={isGettingLocation}
            activeOpacity={0.7}
          >
            {isGettingLocation ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Navigation color={theme.colors.primary} size={20} />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.useCurrentLocationButton}
          onPress={handleGetCurrentLocation}
          disabled={isGettingLocation}
        >
          <MapPin color={theme.colors.primary} size={16} />
          <Text variant="caption" style={styles.useCurrentLocationText}>
            {t('claims.location.useCurrent')}
          </Text>
        </TouchableOpacity>
      </View>

      <FormInput
        control={control}
        name="amount"
        label={t('claims.step2.amountLabel')}
        placeholder={t('claims.step2.amountPlaceholder')}
        style={styles.input}
        keyboardType="decimal-pad"
        error={errors.amount}
      />

      <FormInput
        control={control}
        name="description"
        label={t('claims.step2.descriptionLabel')}
        placeholder={t('claims.step2.descriptionPlaceholder')}
        style={styles.input}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        error={errors.description}
      />
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text variant="body" style={styles.sectionDescription}>
        {t('claims.step3.description')}
      </Text>

      <View style={styles.uploadSection}>
        <Text style={styles.uploadTitle}>
          {t('claims.step3.photosTitle')}
          {images && images.length > 0 && (
            <Text style={styles.uploadCount}> ({images.length}/10)</Text>
          )}
        </Text>
        <View style={styles.photoButtonsRow}>
          <TouchableOpacity 
            style={[styles.uploadCard, styles.uploadCardHalf, images && images.length >= 10 && styles.uploadCardDisabled]} 
            activeOpacity={0.7}
            onPress={handlePickImages}
            disabled={images && images.length >= 10}
          >
            <ImageIcon 
              color={theme.colors.primary} 
              size={40} 
              style={styles.uploadIcon} 
            />
            <Text style={styles.uploadText}>
              {t('claims.step3.uploadPhotos')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.uploadCard, styles.uploadCardHalf, images && images.length >= 10 && styles.uploadCardDisabled]} 
            activeOpacity={0.7}
            onPress={handleTakePicture}
            disabled={images && images.length >= 10}
          >
            <Camera 
              color={theme.colors.primary} 
              size={40} 
              style={styles.uploadIcon} 
            />
            <Text style={styles.uploadText}>
              {t('claims.step3.takePhoto')}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.uploadSubtext}>
          {t('claims.step3.photosHint')}
        </Text>
        
        {images && images.length > 0 && (
          <View style={styles.imagesGrid}>
            {images.map((image: any, index: number) => (
              <View key={index} style={styles.imageItem}>
                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Trash2 color={theme.colors.white} size={16} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.uploadSection}>
        <Text style={styles.uploadTitle}>
          {t('claims.step3.documentsTitle')}
          {documents && documents.length > 0 && (
            <Text style={styles.uploadCount}> ({documents.length})</Text>
          )}
        </Text>
        <TouchableOpacity 
          style={styles.uploadCard} 
          activeOpacity={0.7}
          onPress={handlePickDocuments}
        >
          <Upload 
            color={theme.colors.primary} 
            size={48} 
            style={styles.uploadIcon} 
          />
          <Text style={styles.uploadText}>
            {t('claims.step3.uploadDocuments')}
          </Text>
          <Text style={styles.uploadSubtext}>
            {t('claims.step3.documentsHint')}
          </Text>
        </TouchableOpacity>
        
        {documents && documents.length > 0 && (
          <View style={styles.documentsList}>
            {documents.map((doc: any, index: number) => (
              <View key={index} style={styles.documentItem}>
                <FileText color={theme.colors.primary} size={20} />
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName} numberOfLines={1}>
                    {doc.name}
                  </Text>
                  <Text style={styles.documentSize}>
                    {(doc.size / 1024).toFixed(1)} KB
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeDocumentButton}
                  onPress={() => handleRemoveDocument(index)}
                >
                  <X color={theme.colors.error} size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const renderStep4 = () => {
    const selectedPolicy = policyTypes.find(p => p.id === selectedPolicyType);
    const selectedCategoryData = claimCategories.find(c => c.id === selectedCategory);

    return (
      <View>
        <Text variant="body" style={styles.sectionDescription}>
          {t('claims.step4.description')}
        </Text>

        <View style={styles.reviewCard}>
          <Text style={styles.reviewLabel}>
            {t('claims.step4.policyType')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {selectedPolicy && (
              <>
                <selectedPolicy.icon 
                  color={theme.colors.primary} 
                  size={20} 
                  style={{ marginRight: 8 }} 
                />
                <Text style={styles.reviewValue}>{selectedPolicy.name}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.reviewCard}>
          <Text style={styles.reviewLabel}>
            {t('claims.step4.category')}
          </Text>
          <Text style={styles.reviewValue}>
            {selectedCategoryData?.name || '-'}
          </Text>
        </View>

        <View style={styles.reviewCard}>
          <Text style={styles.reviewLabel}>
            {t('claims.step4.title')}
          </Text>
          <Text style={styles.reviewValue}>
            {formData.title || '-'}
          </Text>
        </View>

        <View style={styles.reviewCard}>
          <Text style={styles.reviewLabel}>
            {t('claims.step4.date')}
          </Text>
          <Text style={styles.reviewValue}>
            {formData.incidentDate ? new Date(formData.incidentDate).toLocaleDateString() : '-'}
          </Text>
        </View>

        <View style={styles.reviewCard}>
          <Text style={styles.reviewLabel}>
            {t('claims.step4.location')}
          </Text>
          <Text style={styles.reviewValue}>
            {formData.location || '-'}
          </Text>
        </View>

        {formData.amount && (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>
              {t('claims.step4.amount')}
            </Text>
            <Text style={styles.reviewValue}>
              ${formData.amount}
            </Text>
          </View>
        )}

        {formData.description && (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>
              {t('claims.step2.descriptionLabel')}
            </Text>
            <Text style={styles.reviewValue}>
              {formData.description}
            </Text>
          </View>
        )}

        {/* Images Review */}
        {images && images.length > 0 && (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>
              {t('claims.step4.photos')} ({images.length})
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.reviewImagesScroll}
            >
              {images.map((image: any, index: number) => (
                <View key={index} style={styles.reviewImageItem}>
                  <Image 
                    source={{ uri: image.uri }} 
                    style={styles.reviewImagePreview} 
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Documents Review */}
        {documents && documents.length > 0 && (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>
              {t('claims.step4.documents')} ({documents.length})
            </Text>
            <View style={styles.reviewDocumentsList}>
              {documents.map((doc: any, index: number) => (
                <View key={index} style={styles.reviewDocumentItem}>
                  <FileText color={theme.colors.primary} size={18} />
                  <Text style={styles.reviewDocumentName} numberOfLines={1}>
                    {doc.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  const isStep1Valid = selectedPolicyType && selectedCategory;
  
  // Step 2 validation - check if all required fields are filled
  const isStep2Valid = Boolean(
    title?.trim() &&
    description?.trim() &&
    incidentDate &&
    location?.trim() &&
    amount?.trim() &&
    !errors.title &&
    !errors.description &&
    !errors.incidentDate &&
    !errors.location &&
    !errors.amount
  );
  
  // Step 3 validation - documents and images are optional, so step 3 is always valid
  const isStep3Valid = true; // Step 3 is optional, user can proceed without uploading
  
  // Step 4 validation - all required steps (1 and 2) must be valid
  const isStep4Valid = isStep1Valid && isStep2Valid;
  
  const isStepValid = currentStep === 1 
    ? isStep1Valid 
    : currentStep === 2 
    ? isStep2Valid 
    : currentStep === 3
    ? isStep3Valid
    : currentStep === 4
    ? isStep4Valid
    : isValid;

  return (
    <View style={styles.container}>
      <Header title={t('claims.newClaim')} showNotifications={true} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.container}
          contentContainerStyle={{ paddingBottom: bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Welcome Card */}
            <Card variant="elevated" style={styles.headerCard}>
              <Text style={styles.welcomeText}>
                {t('claims.welcome')}
              </Text>
              <Text variant="h1" style={styles.title}>
                {t('claims.newClaim')}
              </Text>
              <Text variant="body" style={styles.subtitle}>
                {t('claims.welcomeDescription')}
              </Text>
            </Card>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>

            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <React.Fragment key={step.number}>
                    <View style={styles.step}>
                      <View
                        style={[
                          styles.stepNumber,
                          isCompleted && styles.stepNumberCompleted,
                          isActive && styles.stepNumberActive,
                          !isActive && !isCompleted && styles.stepNumberInactive,
                        ]}
                      >
                        {isCompleted ? (
                          <CheckCircle color={theme.colors.white} size={isTablet ? 24 : 20} />
                        ) : (
                          <Text
                            style={{
                              color: isActive ? theme.colors.white : theme.colors.textSecondary,
                              fontWeight: '700',
                              fontSize: isTablet ? 18 : 16,
                            }}
                          >
                            {step.number}
                          </Text>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.stepText,
                          isActive || isCompleted
                            ? styles.stepTextActive
                            : styles.stepTextInactive,
                        ]}
                        numberOfLines={2}
                      >
                        {step.title}
                      </Text>
                    </View>
                    {index < steps.length - 1 && (
                      <View 
                        style={[
                          styles.stepLine,
                          isCompleted && styles.stepLineActive,
                        ]} 
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </View>

            {/* Form Content */}
            <Card variant="elevated" style={styles.formCard}>
              <Text variant="h2" style={styles.sectionTitle}>
                {steps[currentStep - 1]?.title}
              </Text>
              {renderCurrentStep()}
            </Card>

            {/* Navigation Buttons */}
            <View style={styles.buttonRow}>
              {currentStep > 1 && (
                <Button
                  title={t('common.back')}
                  variant="outline"
                  onPress={handlePrevStep}
                  style={styles.navButton}
                />
              )}
              
              {currentStep < 4 ? (
                <Button
                  title={t('common.continue')}
                  onPress={handleNextStep}
                  disabled={!isStepValid}
                  style={styles.navButton}
                />
              ) : (
                <Button
                  title={isSubmitting ? t('claims.submitting') : t('claims.submit')}
                  onPress={handleFormSubmit}
                  disabled={!isStepValid || isSubmitting}
                  style={styles.navButton}
                  loading={isSubmitting}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
