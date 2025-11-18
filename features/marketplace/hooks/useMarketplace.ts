import { useState } from 'react';
import { InsuranceProduct, SubscriptionRequest } from '../types';

const mockProducts: InsuranceProduct[] = [
  {
    id: '1',
    type: 'auto',
    name: 'Comprehensive Auto Insurance',
    description: 'Complete protection for your vehicle with comprehensive coverage',
    monthlyPremium: 89.99,
    coverage: ['Collision', 'Liability', 'Comprehensive', 'Roadside Assistance'],
    features: ['24/7 Claims', 'Mobile App', 'Accident Forgiveness', 'Rental Car Coverage'],
    rating: 4.8,
    provider: 'SafeDrive Insurance',
    providerLogo: '🏢',
    popular: true,
  },
  {
    id: '2',
    type: 'home',
    name: 'Homeowners Protection',
    description: 'Protect your home and belongings with our comprehensive policy',
    monthlyPremium: 125.50,
    coverage: ['Property Damage', 'Theft', 'Natural Disasters', 'Liability'],
    features: ['Quick Claims', 'Home Repair Network', 'Temporary Housing', 'Valuables Coverage'],
    rating: 4.6,
    provider: 'HomeGuard Insurance',
    providerLogo: '🏠',
    popular: true,
  },
  {
    id: '3',
    type: 'life',
    name: 'Life Protection Plan',
    description: 'Financial security for your loved ones with flexible coverage options',
    monthlyPremium: 45.75,
    coverage: ['Death Benefit', 'Critical Illness', 'Disability', 'Accidental Death'],
    features: ['Flexible Payouts', 'Living Benefits', 'Policy Loans', 'Riders Available'],
    rating: 4.7,
    provider: 'LifeSecure Insurance',
    providerLogo: '🛡️',
    popular: false,
  },
  {
    id: '4',
    type: 'health',
    name: 'Health Shield Plan',
    description: 'Comprehensive health coverage for you and your family',
    monthlyPremium: 299.99,
    coverage: ['Hospitalization', 'Outpatient Care', 'Prescription Drugs', 'Dental & Vision'],
    features: ['Network Hospitals', 'Telemedicine', 'Wellness Programs', 'Family Coverage'],
    rating: 4.5,
    provider: 'HealthFirst Insurance',
    providerLogo: '🏥',
    popular: true,
  },
];

export const useMarketplace = () => {
  const [products, setProducts] = useState<InsuranceProduct[]>(mockProducts);
  const [loading, setLoading] = useState(false);

  const subscribeToProduct = async (request: SubscriptionRequest) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would create a new policy
      return {
        success: true,
        policyId: `POL-${Date.now()}`,
        message: 'Subscription successful! Your policy is being processed.',
      };
    } catch (error) {
      throw new Error('Failed to subscribe to insurance product');
    } finally {
      setLoading(false);
    }
  };

  const getProductsByType = (type: string) => {
    return products.filter(product => product.type === type);
  };

  return {
    products,
    loading,
    subscribeToProduct,
    getProductsByType,
  };
};