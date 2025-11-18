export interface DrivingScore {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  lastUpdated: string;
  trends: {
    speeding: number;
    braking: number;
    acceleration: number;
    phoneUsage: number;
    mileage: number;
  };
  tips: string[];
}

export interface TripData {
  id: string;
  date: string;
  distance: number;
  score: number;
  duration: number; // Duration in minutes
  isNightDriving: boolean; // True if trip occurred between 11 PM - 5 AM
  events: {
    speeding: number; // Speed relative to posted limit
    hardBraking: number;
    rapidAcceleration: number;
    cornering: number; // Quick direction changes at speed
    phoneUsage: number; // Phone use detected
  };
}