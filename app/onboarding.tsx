import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useRouter } from 'expo-router';
import { Car, Shield, TrendingUp, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  scrollView: {
    flex: 1,
  } as const,
  scrollContent: {
    flexGrow: 1,
  } as const,
  slideContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: theme.spacing.xl,
  } as const,
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: theme.spacing.xl,
  } as const,
  title: {
    marginBottom: theme.spacing.md,
    textAlign: 'center' as const,
  } as const,
  description: {
    textAlign: 'center' as const,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  } as const,
  footer: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  } as const,
  paginationContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  } as const,
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  } as const,
  paginationDotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  } as const,
  skipButton: {
    position: 'absolute' as const,
    top: Platform.OS === 'ios' ? 60 : 40,
    right: theme.spacing.lg,
    zIndex: 10,
  } as const,
  skipText: {
    fontSize: 16,
  } as const,
}));

const slides = [
  {
    id: 1,
    icon: Shield,
    title: 'Welcome to LZ Insurance',
    description: 'Your trusted partner for comprehensive insurance coverage. Protect what matters most with our reliable and affordable plans.',
  },
  {
    id: 2,
    icon: Car,
    title: 'Drive with Confidence',
    description: 'Track your driving habits and earn rewards for safe driving. The better you drive, the more you save on your premiums.',
  },
  {
    id: 3,
    icon: TrendingUp,
    title: 'Real-Time Insights',
    description: 'Monitor your policies, file claims, and track everything in real-time from your mobile device.',
  },
  {
    id: 4,
    icon: Zap,
    title: 'Quick & Easy Claims',
    description: 'File claims instantly and track their progress. Get support 24/7 from our dedicated team.',
  },
];

export default function OnboardingScreen() {
  const styles = useStyles();
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useOnboarding();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/auth/register');
  };

  const handleGetStarted = async () => {
    await completeOnboarding();
    router.replace('/auth/register');
  };

  const handleSignIn = async () => {
    await completeOnboarding();
    router.replace('/auth/login');
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Skip Button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text 
            variant="body" 
            color={theme.colors.primary} 
            weight="semibold"
            style={styles.skipText}
          >
            Skip
          </Text>
        </TouchableOpacity>
      )}

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.slideContainer}>
          <View style={styles.iconContainer}>
            <Icon size={60} color={theme.colors.primary} />
          </View>
          
          <Text 
            variant="h1" 
            weight="bold" 
            style={styles.title}
          >
            {currentSlideData.title}
          </Text>
          
          <Text 
            variant="body" 
            color={theme.colors.textSecondary} 
            style={styles.description}
          >
            {currentSlideData.description}
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={
                index === currentSlide
                  ? styles.paginationDotActive
                  : styles.paginationDot
              }
            />
          ))}
        </View>

        {/* Buttons */}
        {isLastSlide ? (
          <>
            <Button
              title="Create Account"
              onPress={handleGetStarted}
              size="lg"
            />
            <Button
              title="Sign In"
              onPress={handleSignIn}
              variant="outline"
              size="lg"
            />
          </>
        ) : (
          <Button
            title="Next"
            onPress={handleNext}
            size="lg"
          />
        )}
      </View>
    </View>
  );
}

