export interface VehicleDetails {
  make: string;
  model: string;
  year: number;
  type: 'vehicle' | 'motorcycle';
  vin?: string;
  licensePlate?: string;
}

export interface PropertyDetails {
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface Driver {
  name: string;
  type: 'principal' | 'secondary';
}

export interface Policy {
  id: string;
  type: 'auto' | 'home' | 'life' | 'health';
  premium: number; // Monthly premium
  termPremium?: number; // Total term premium
  status: 'active' | 'expired' | 'pending' | 'cancelled';
  startDate: string;
  endDate: string;
  renewalDate: string;
  coverageAmount: number;
  vehicle?: string; // Legacy field
  vehicleDetails?: VehicleDetails; // New detailed field
  property?: string; // Legacy field
  propertyDetails?: PropertyDetails; // New detailed field
  beneficiary?: string;
  canRenew: boolean;
  daysUntilExpiry: number;
  insurer?: string; // Insurance company name
  agency?: string; // Agency name
  nextPayment?: number; // Next payment amount
  paymentDate?: string; // Next payment date
  drivers?: Driver[]; // List of drivers
  coverageDetails?: {
    liability?: number;
    collision?: number;
    comprehensive?: number;
    medical?: number;
    uninsuredMotorist?: number;
    personalProperty?: number;
    dwelling?: number;
    [key: string]: number | undefined;
  };
}

export interface PolicyListProps {
  policies: Policy[];
  onPolicyPress: (policy: Policy) => void;
}
