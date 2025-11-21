import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormInput } from '@/components/ui/FormInput';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useTranslation } from '@/hooks/useTranslation';
import {
  AlertCircle,
  Bug,
  Heart,
  HelpCircle,
  Lightbulb,
  Star,
  TrendingUp
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import { z } from 'zod';
import type { FeedbackCategory, FeedbackFormData } from '../types';

interface FeedbackFormProps {
  onSubmit: (data: FeedbackFormData) => Promise<void>;
  onCancel?: () => void;
}

const feedbackSchema = z.object({
  category: z.enum(['bug', 'feature', 'improvement', 'complaint', 'compliment', 'other']),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  rating: z.number().min(1).max(5).optional(),
});

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  keyboardView: {
    flex: 1,
  } as const,
  scrollContent: {
    flexGrow: 1,
  } as const,
  content: {
    padding: 24,
    paddingBottom: 24,
  } as const,
  header: {
    alignItems: 'center',
    marginBottom: 32,
  } as const,
  headerTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  } as const,
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  } as const,
  section: {
    marginBottom: 28,
  } as const,
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 16,
  } as const,
  categoryGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginHorizontal: -6,
  } as const,
  categoryCardWrapper: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  } as const,
  categoryCard: {
    minHeight: 130,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  } as const,
  categoryCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}08`,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  } as const,
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
  } as const,
  categoryIconSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  } as const,
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.colors.text,
    textAlign: 'center' as const,
    lineHeight: 18,
  } as const,
  categoryLabelSelected: {
    color: theme.colors.primary,
    fontWeight: '700' as const,
  } as const,
  ratingContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
  starsContainer: {
    flexDirection: 'row' as const,
    gap: 4,
  } as const,
  starButton: {
    padding: 6,
  } as const,
  starText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  } as const,
  formSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  actions: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  } as const,
  actionButton: {
    flex: 1,
  } as const,
  optionalBadge: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500' as const,
    marginLeft: 8,
  } as const,
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500' as const,
  } as const,
}));

const categories: Array<{
  value: FeedbackCategory;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: [string, string];
}> = [
  { 
    value: 'bug', 
    label: 'Bug Report', 
    icon: Bug, 
    color: '#ef4444',
    gradient: ['#fef2f2', '#fee2e2']
  },
  { 
    value: 'feature', 
    label: 'Feature Request', 
    icon: Lightbulb, 
    color: '#3b82f6',
    gradient: ['#eff6ff', '#dbeafe']
  },
  { 
    value: 'improvement', 
    label: 'Improvement', 
    icon: TrendingUp, 
    color: '#10b981',
    gradient: ['#ecfdf5', '#d1fae5']
  },
  { 
    value: 'complaint', 
    label: 'Complaint', 
    icon: AlertCircle, 
    color: '#f59e0b',
    gradient: ['#fffbeb', '#fef3c7']
  },
  { 
    value: 'compliment', 
    label: 'Compliment', 
    icon: Heart, 
    color: '#ec4899',
    gradient: ['#fdf2f8', '#fce7f3']
  },
  { 
    value: 'other', 
    label: 'Other', 
    icon: HelpCircle, 
    color: '#6b7280',
    gradient: ['#f9fafb', '#f3f4f6']
  },
];

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, onCancel }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { bottom } = useSafeArea();
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const titleInputLayoutRef = useRef<View>(null);
  const messageInputLayoutRef = useRef<View>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useFormValidation({
    schema: feedbackSchema,
    defaultValues: {
      category: 'other' as FeedbackCategory,
      title: '',
      message: '',
      rating: undefined,
    },
  });

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardDidShowListener = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleCategorySelect = (category: FeedbackCategory) => {
    setSelectedCategory(category);
    setValue('category', category);
  };

  const handleStarPress = (value: number) => {
    setRating(value);
    setValue('rating', value);
  };


  const handleFormSubmit = async (data: any) => {
    if (!selectedCategory) {
      Alert.alert(t('feedback.form.categoryRequired'), t('feedback.form.categoryRequiredMessage'));
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        category: selectedCategory,
        title: data.title,
        message: data.message,
        rating: rating > 0 ? rating : undefined,
      });
      reset();
      setSelectedCategory(null);
      setRating(0);
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'An error occurred';
      console.error('Error submitting feedback:', errorMessage);
      // Ensure error is properly handled - don't render error objects
      if (error?.message) {
        Alert.alert(
          t('common.error'),
          typeof error.message === 'string' ? error.message : String(error.message)
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToInput = (inputRef: React.RefObject<View | null>, delay: number = 100) => {
    setTimeout(() => {
      if (inputRef.current && scrollViewRef.current) {
        inputRef.current.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            // Calculate scroll position: input Y position minus some padding
            const padding = Platform.OS === 'ios' ? 120 : 100;
            const scrollOffset = Math.max(0, y - padding);
            scrollViewRef.current?.scrollTo({
              y: scrollOffset,
              animated: true,
            });
          },
          () => {
            // Fallback: scroll to end if measureLayout fails
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }
        );
      }
    }, delay);
  };

  const handleTitleFocus = () => {
    const delay = Platform.OS === 'ios' ? 350 : 150;
    scrollToInput(titleInputLayoutRef, delay);
  };

  const handleMessageFocus = () => {
    const delay = Platform.OS === 'ios' ? 350 : 150;
    scrollToInput(messageInputLayoutRef, delay);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      enabled={Platform.OS === 'ios'}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { 
            paddingBottom: Platform.OS === 'ios' 
              ? Math.max(bottom + 40, keyboardHeight + 40)
              : bottom + 40 + (keyboardHeight > 0 ? keyboardHeight : 0)
          }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        bounces={Platform.OS === 'ios'}
        nestedScrollEnabled={true}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {t('feedback.title')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {t('feedback.form.subtitle')}
            </Text>
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('feedback.form.category')} *
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.value;
                return (
                  <View key={category.value} style={styles.categoryCardWrapper}>
                    <TouchableOpacity
                      onPress={() => handleCategorySelect(category.value)}
                      activeOpacity={0.8}
                    >
                      <Card
                        variant="elevated"
                        style={[
                          styles.categoryCard,
                          ...(isSelected ? [styles.categoryCardSelected] : []),
                        ]}
                      >
                        <View style={[
                          styles.categoryIcon,
                          isSelected && styles.categoryIconSelected
                        ]}>
                          <Icon 
                            size={24} 
                            color={isSelected ? '#FFFFFF' : category.color} 
                          />
                        </View>
                        <Text 
                          style={[
                            styles.categoryLabel,
                            isSelected && styles.categoryLabelSelected
                          ]}
                          numberOfLines={2}
                          adjustsFontSizeToFit
                          minimumFontScale={0.8}
                        >
                          {t(`feedback.categories.${category.value}`)}
                        </Text>
                      </Card>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            {errors.category && errors.category.message && (
              <Text style={styles.errorText}>
                {String(errors.category.message)}
              </Text>
            )}
          </View>

          {/* Rating (Optional) */}
          <View style={styles.section}>
            <View style={styles.ratingContainer}>
              <View>
                <Text style={styles.ratingLabel}>
                  {t('feedback.form.rating')}
                </Text>
                <Text style={styles.optionalBadge}>
                  {t('feedback.form.optional')}
                </Text>
              </View>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => handleStarPress(value)}
                    style={styles.starButton}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`${t('feedback.form.rate')} ${value} ${t('feedback.form.stars')}`}
                  >
                    <Star
                      size={32}
                      color={value <= rating ? '#fbbf24' : theme.colors.border}
                      fill={value <= rating ? '#fbbf24' : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Form Inputs */}
          <View style={styles.section}>
            <View style={styles.formSection}>
              {/* Title */}
              <View 
                ref={titleInputLayoutRef}
                style={{ marginBottom: 20 }}
                collapsable={false}
              >
                <FormInput
                  control={control}
                  name="title"
                  label={t('feedback.form.title')}
                  placeholder={t('feedback.form.titlePlaceholder')}
                  error={errors.title}
                  autoCapitalize="words"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onFocus={handleTitleFocus}
                />
              </View>

              {/* Message */}
              <View 
                ref={messageInputLayoutRef}
                collapsable={false}
              >
                <FormInput
                  control={control}
                  name="message"
                  label={t('feedback.form.message')}
                  placeholder={t('feedback.form.messagePlaceholder')}
                  error={errors.message}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  returnKeyType="done"
                  onFocus={handleMessageFocus}
                />
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {onCancel && (
              <Button
                title={t('common.cancel')}
                variant="outline"
                onPress={onCancel}
                style={styles.actionButton}
                disabled={isSubmitting}
              />
            )}
            <Button
              title={isSubmitting ? t('feedback.form.submitting') : t('feedback.form.submit')}
              onPress={handleSubmit(handleFormSubmit)}
              style={styles.actionButton}
              loading={isSubmitting}
              disabled={isSubmitting || !selectedCategory}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};