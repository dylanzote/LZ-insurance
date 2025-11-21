export type InsuranceType = 'auto' | 'home' | 'life' | 'health' | 'travel' | 'motorcycle';

export type QuoteStatus = 'draft' | 'pending' | 'approved' | 'expired' | 'converted';

export interface QuotePersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface AutoQuoteDetails {
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleCondition?: 'new' | 'used' | 'demo';
  ownershipType?: 'owned' | 'leased' | 'financed';
  purchaseMonth?: string;
  purchaseYear?: string;
  annualMileage?: string; // Range like '0-5000', '5001-10000', etc.
  commuteToWork?: boolean;
  coverageStartDate?: string;
  winterTires?: boolean;
  antiTheftSystem?: boolean;
  antiTheftSystemWithin30Days?: boolean;
  lzAdvantageEnrolled?: boolean;
  driverLicenseNumber?: string;
  driverLicenseProvince?: string;
  driverLicenseExpiry?: string;
}

export interface HomeQuoteDetails {
  propertyType?: 'house' | 'condo' | 'apartment' | 'townhouse';
  propertyValue?: number;
  squareFootage?: number;
  yearBuilt?: number;
  address?: string;
  numberOfStories?: number;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  roofType?: 'asphalt' | 'metal' | 'tile' | 'slate' | 'wood';
  roofAge?: number;
  constructionType?: 'wood' | 'brick' | 'concrete' | 'steel';
  occupancyType?: 'owner-occupied' | 'rental' | 'vacation';
  securityFeatures?: string[]; // smoke detectors, security system, etc.
  coverageStartDate?: string;
  deductible?: number;
  additionalCoverage?: string[];
}

export interface LifeQuoteDetails {
  coverageAmount?: number;
  termLength?: number;
  policyType?: 'term' | 'whole' | 'universal';
  beneficiaries?: number;
  healthStatus?: 'excellent' | 'good' | 'fair' | 'poor';
  smoker?: boolean;
  occupation?: string;
  height?: string; // in inches or cm
  weight?: number; // in lbs or kg
  preExistingConditions?: boolean;
  familyHistory?: string; // heart disease, cancer, etc.
  coverageStartDate?: string;
}

export interface HealthQuoteDetails {
  familySize?: number;
  age?: number;
  coverageLevel?: 'basic' | 'standard' | 'premium';
  planType?: 'hmo' | 'ppo' | 'epo' | 'pos';
  preExistingConditions?: boolean;
  preferredProviders?: string[];
  currentInsurance?: boolean;
  coverageStartDate?: string;
  dependents?: Array<{
    name: string;
    age: number;
    relationship: string;
  }>;
}

export interface TravelQuoteDetails {
  destination?: string;
  tripDuration?: number;
  tripStartDate?: string;
  travelers?: number;
  coverageLevel?: 'basic' | 'standard' | 'premium';
  activities?: string[];
  tripType?: 'leisure' | 'business' | 'adventure' | 'cruise';
  cancellationCoverage?: boolean;
  medicalCoverage?: boolean;
  baggageCoverage?: boolean;
  travelDates?: {
    departure?: string;
    return?: string;
  };
}

export interface MotorcycleQuoteDetails {
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  engineSize?: string;
  vehicleCondition?: 'new' | 'used' | 'demo';
  ownershipType?: 'owned' | 'leased' | 'financed';
  purchaseMonth?: string;
  purchaseYear?: string;
  annualMileage?: string;
  usageType?: 'commute' | 'recreational' | 'both';
  coverageStartDate?: string;
  safetyCourse?: boolean;
  storageLocation?: 'garage' | 'driveway' | 'street' | 'other';
  driverLicenseNumber?: string;
  driverLicenseProvince?: string;
  driverLicenseExpiry?: string;
  ridingExperience?: number; // years
}

export type QuoteDetails = 
  | AutoQuoteDetails 
  | MotorcycleQuoteDetails
  | HomeQuoteDetails 
  | LifeQuoteDetails 
  | HealthQuoteDetails 
  | TravelQuoteDetails;

export interface Quote {
  id: string;
  userId: string;
  type: InsuranceType;
  status: QuoteStatus;
  personalInfo: QuotePersonalInfo;
  details: QuoteDetails;
  monthlyPremium: number;
  annualPremium: number;
  coverageAmount?: number;
  deductible?: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  convertedToPolicyId?: string;
}

export interface QuoteFormData {
  type: InsuranceType;
  personalInfo: QuotePersonalInfo;
  details: QuoteDetails;
}

export interface QuoteCalculation {
  basePremium: number;
  discounts: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
  adjustments: Array<{
    name: string;
    amount: number;
  }>;
  subtotal: number;
  taxes: number;
  total: number;
  monthlyPremium: number;
  annualPremium: number;
}

