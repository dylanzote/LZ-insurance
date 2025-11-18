import { useState, useEffect } from 'react';
import { DrivingScore, TripData } from '../types';
import { tripTracker } from '@/services/location/tripTracker';

const mockDrivingScore: DrivingScore = {
  score: 85,
  level: 'good',
  lastUpdated: '2024-01-20',
  trends: {
    speeding: 2,
    braking: 1,
    acceleration: 0,
    phoneUsage: 1,
    mileage: 250,
  },
  tips: [
    'Avoid speeding in residential areas',
    'Smooth braking improves your score',
    'Consider reducing night driving',
  ],
};

const mockTripHistory: TripData[] = [
  {
    id: '1',
    date: '2024-01-20',
    distance: 15.2,
    duration: 25,
    isNightDriving: false,
    score: 88,
    events: { 
      speeding: 0, 
      hardBraking: 1, 
      rapidAcceleration: 0,
      cornering: 0,
      phoneUsage: 0,
    },
  },
  {
    id: '2',
    date: '2024-01-19',
    distance: 22.5,
    duration: 35,
    isNightDriving: false,
    score: 82,
    events: { 
      speeding: 2, 
      hardBraking: 0, 
      rapidAcceleration: 1,
      cornering: 1,
      phoneUsage: 0,
    },
  },
  {
    id: '3',
    date: '2024-01-18',
    distance: 8.7,
    duration: 15,
    isNightDriving: false,
    score: 92,
    events: { 
      speeding: 0, 
      hardBraking: 0, 
      rapidAcceleration: 0,
      cornering: 0,
      phoneUsage: 0,
    },
  },
];

export const useDrivingScore = () => {
  const [score, setScore] = useState<DrivingScore | null>(null);
  const [tripHistory, setTripHistory] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get real trip history from tracker
        const realTripHistory = await tripTracker.getTripHistory();
        
        // Use real trips if available, otherwise use mock data
        const trips = realTripHistory.length > 0 ? realTripHistory : mockTripHistory;
        
        // Calculate driving score from trips
        const calculatedScore = calculateScoreFromTrips(trips);
        
        setScore(calculatedScore);
        setTripHistory(trips);
      } catch (error) {
        console.error('Error loading driving score:', error);
        // Fallback to mock data on error
        setScore(mockDrivingScore);
        setTripHistory(mockTripHistory);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Refresh data every 30 seconds if tracking is active
    const interval = setInterval(() => {
      if (tripTracker.isTrackingActive()) {
        loadData();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const calculateScoreFromTrips = (trips: TripData[]): DrivingScore => {
    if (trips.length === 0) {
      return mockDrivingScore;
    }

    // Calculate average score
    const avgScore = trips.reduce((sum, trip) => sum + trip.score, 0) / trips.length;
    
      // Aggregate events
      const totalSpeeding = trips.reduce((sum, trip) => sum + trip.events.speeding, 0);
      const totalBraking = trips.reduce((sum, trip) => sum + trip.events.hardBraking, 0);
      const totalAcceleration = trips.reduce((sum, trip) => sum + trip.events.rapidAcceleration, 0);
      const totalPhoneUsage = trips.reduce((sum, trip) => sum + trip.events.phoneUsage, 0);
      const totalMileage = trips.reduce((sum, trip) => sum + trip.distance, 0);
    
    // Determine level
    let level: 'excellent' | 'good' | 'fair' | 'poor';
    if (avgScore >= 90) level = 'excellent';
    else if (avgScore >= 75) level = 'good';
    else if (avgScore >= 60) level = 'fair';
    else level = 'poor';
    
    // Generate tips
    const tips: string[] = [];
    if (totalSpeeding > 0) tips.push('Avoid speeding in residential areas');
    if (totalBraking > 0) tips.push('Smooth braking improves your score');
    if (totalAcceleration > 0) tips.push('Gradual acceleration is safer');
    if (tips.length === 0) tips.push('Keep up the great driving!');
    
    return {
      score: Math.round(avgScore),
      level,
      lastUpdated: new Date().toISOString(),
        trends: {
          speeding: totalSpeeding,
          braking: totalBraking,
          acceleration: totalAcceleration,
          phoneUsage: totalPhoneUsage,
          mileage: Math.round(totalMileage),
        },
      tips,
    };
  };

  const refreshScore = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  };

  return {
    score,
    tripHistory,
    loading,
    refreshScore,
  };
};