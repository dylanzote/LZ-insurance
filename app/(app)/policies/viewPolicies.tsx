import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PoliciesListScreen } from '@/features/policies/screens/PoliciesListScreen';

export default function ViewPoliciesPage() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  
  return <PoliciesListScreen typeFilter={type} />;
}

