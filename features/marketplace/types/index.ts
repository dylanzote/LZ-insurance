export interface InsuranceProduct {
  id: string;
  type: 'auto' | 'home' | 'life' | 'health' | 'travel';
  name: string;
  description: string;
  monthlyPremium: number;
  coverage: string[];
  features: string[];
  rating: number;
  provider: string;
  providerLogo: string;
  popular: boolean;
}

export interface SubscriptionRequest {
  productId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  coverageDetails: any;
}