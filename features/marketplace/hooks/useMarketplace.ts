import { useState } from 'react';
import { getCoveragesByType } from '@/features/quotes/data/coverageDataByType';
import { InsuranceProduct, SubscriptionRequest } from '../types';

const mockProducts: InsuranceProduct[] = [
  {
    id: '1',
    type: 'auto',
    name: 'Comprehensive Auto Insurance',
    description: 'Complete protection for your vehicle with comprehensive coverage including liability, collision, and comprehensive protection.',
    monthlyPremium: 89.99,
    annualPremium: 1079.88,
    coverage: getCoveragesByType('auto').mandatory
      .concat(getCoveragesByType('auto').recommended.slice(0, 2))
      .map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        description: c.description,
        limit: c.id === 'bodily-injury' || c.id === 'property-damage' ? 1000000 : undefined,
        deductible: c.id === 'collision' || c.id === 'comprehensive' ? 500 : undefined,
        included: c.id === 'accident-benefits' || c.id === 'uninsured-motorist' ? true : undefined,
      })),
    features: ['24/7 Claims Support', 'Mobile App Access', 'Accident Forgiveness', 'Rental Car Coverage', 'Roadside Assistance'],
    rating: 4.8,
    provider: 'LZ Insurance',
    providerLogo: '🏢',
    popular: true,
    coverageDetails: {
      limits: {
        liability: 1000000,
        propertyDamage: 1000000,
        familyProtection: 1000000,
      },
      deductibles: {
        collision: 500,
        comprehensive: 500,
      },
      included: ['accident-benefits', 'uninsured-motorist'],
    },
  },
  {
    id: '2',
    type: 'home',
    name: 'Homeowners Protection Plan',
    description: 'Protect your home and belongings with comprehensive coverage including dwelling, liability, and personal property protection.',
    monthlyPremium: 125.50,
    annualPremium: 1506.00,
    coverage: getCoveragesByType('home').mandatory
      .concat(getCoveragesByType('home').recommended.slice(0, 2))
      .map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        description: c.description,
        limit: c.id === 'dwelling' || c.id === 'personal-property' ? 300000 : c.id === 'liability' ? 500000 : undefined,
        included: c.id === 'medical-payments' ? true : undefined,
      })),
    features: ['Quick Claims Processing', 'Home Repair Network', 'Temporary Housing Coverage', 'Valuables Protection', 'Water Backup Coverage'],
    rating: 4.6,
    provider: 'LZ Insurance',
    providerLogo: '🏠',
    popular: true,
    coverageDetails: {
      limits: {
        dwelling: 300000,
        personalProperty: 150000,
        liability: 500000,
      },
      included: ['medical-payments'],
    },
  },
  {
    id: '3',
    type: 'life',
    name: 'Life Protection Plan',
    description: 'Financial security for your loved ones with flexible term and whole life coverage options.',
    monthlyPremium: 45.75,
    annualPremium: 549.00,
    coverage: getCoveragesByType('life').mandatory
      .concat(getCoveragesByType('life').recommended)
      .map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        description: c.description,
        limit: c.id === 'death-benefit' ? 500000 : undefined,
        included: c.id === 'accelerated-death-benefit' ? true : undefined,
      })),
    features: ['Flexible Payout Options', 'Living Benefits', 'Policy Loans Available', 'Riders Available', 'Waiver of Premium'],
    rating: 4.7,
    provider: 'LZ Insurance',
    providerLogo: '🛡️',
    popular: false,
    coverageDetails: {
      limits: {
        'death-benefit': 500000,
      },
      included: ['accelerated-death-benefit'],
    },
  },
  {
    id: '4',
    type: 'health',
    name: 'Health Shield Plan',
    description: 'Comprehensive health coverage for you and your family with extensive network coverage.',
    monthlyPremium: 299.99,
    annualPremium: 3599.88,
    coverage: getCoveragesByType('health').mandatory
      .concat(getCoveragesByType('health').recommended)
      .map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        description: c.description,
        included: c.id === 'preventive-care' || c.id === 'emergency-services' ? true : undefined,
      })),
    features: ['Network Hospitals Access', 'Telemedicine Services', 'Wellness Programs', 'Family Coverage', 'Prescription Drug Coverage'],
    rating: 4.5,
    provider: 'LZ Insurance',
    providerLogo: '🏥',
    popular: true,
    coverageDetails: {
      included: ['preventive-care', 'emergency-services'],
    },
  },
  {
    id: '5',
    type: 'travel',
    name: 'Travel Protection Plan',
    description: 'Comprehensive travel insurance covering medical emergencies, trip cancellation, and baggage protection.',
    monthlyPremium: 25.00,
    annualPremium: 300.00,
    coverage: getCoveragesByType('travel').mandatory
      .concat(getCoveragesByType('travel').recommended.slice(0, 2))
      .map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        description: c.description,
        limit: c.id === 'emergency-medical' ? 100000 : c.id === 'trip-cancellation' ? 5000 : undefined,
        included: c.id === 'emergency-evacuation' ? true : undefined,
      })),
    features: ['24/7 Travel Assistance', 'Trip Cancellation Coverage', 'Baggage Protection', 'Medical Emergency Coverage', 'Adventure Sports Coverage'],
    rating: 4.6,
    provider: 'LZ Insurance',
    providerLogo: '✈️',
    popular: false,
    coverageDetails: {
      limits: {
        'emergency-medical': 100000,
        'trip-cancellation': 5000,
      },
      included: ['emergency-evacuation'],
    },
  },
  {
    id: '6',
    type: 'motorcycle',
    name: 'Motorcycle Protection Plan',
    description: 'Specialized coverage for motorcycles with comprehensive protection and roadside assistance.',
    monthlyPremium: 65.00,
    annualPremium: 780.00,
    coverage: getCoveragesByType('motorcycle').mandatory
      .concat(getCoveragesByType('motorcycle').recommended.slice(0, 2))
      .map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        description: c.description,
        limit: c.id === 'bodily-injury' || c.id === 'property-damage' ? 500000 : undefined,
        deductible: c.id === 'collision' || c.id === 'comprehensive' ? 500 : undefined,
        included: c.id === 'accident-benefits' ? true : undefined,
      })),
    features: ['Motorcycle-Specific Coverage', 'Roadside Assistance', 'Safety Course Discounts', 'Gear Protection', 'Trip Interruption'],
    rating: 4.7,
    provider: 'LZ Insurance',
    providerLogo: '🏍️',
    popular: false,
    coverageDetails: {
      limits: {
        liability: 500000,
        propertyDamage: 500000,
      },
      deductibles: {
        collision: 500,
        comprehensive: 500,
      },
      included: ['accident-benefits'],
    },
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