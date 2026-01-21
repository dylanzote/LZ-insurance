/**
 * FeatureGate Component
 * 
 * Conditionally renders children based on feature flags.
 * Useful for hiding/showing features without code changes.
 */

import React from 'react';
import { useFeatureFlags } from '@/core/config/store';

interface FeatureGateProps {
  feature: keyof ReturnType<typeof useFeatureFlags>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that only renders children if the feature is enabled
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback = null,
}) => {
  const features = useFeatureFlags();
  
  if (features[feature]) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

/**
 * Hook to check if a feature is enabled
 */
export const useFeatureEnabled = (feature: keyof ReturnType<typeof useFeatureFlags>): boolean => {
  const features = useFeatureFlags();
  return features[feature];
};

