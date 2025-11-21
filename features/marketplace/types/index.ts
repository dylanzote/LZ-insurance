import type { InsuranceType } from '@/features/quotes/types';

export interface InsuranceProduct {
  id: string;
  type: InsuranceType; // Now matches quote types including 'motorcycle'
  name: string;
  description: string;
  monthlyPremium: number;
  annualPremium: number;
  coverage: CoverageItem[];
  features: string[];
  rating: number;
  provider: string;
  providerLogo: string;
  popular: boolean;
  coverageDetails?: {
    limits?: Record<string, number>;
    deductibles?: Record<string, number>;
    included?: string[];
  };
}

export interface CoverageItem {
  id: string;
  name: string;
  category: 'mandatory' | 'recommended' | 'optional';
  limit?: number;
  deductible?: number;
  included?: boolean;
  description?: string;
}

import type { QuotePersonalInfo, QuoteDetails } from '@/features/quotes/types';

export interface SubscriptionRequest {
  productId: string;
  personalInfo: QuotePersonalInfo;
  details: QuoteDetails; // Now matches quote details structure
}