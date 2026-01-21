import type { TripData } from '@/features/driving/types';

// Driving trips mocks
const initialTrips: TripData[] = [
  {
    id: 'trip_1',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    distance: 12.5,
    duration: 25,
    isNightDriving: false,
    score: 95,
    events: {
      speeding: 0,
      hardBraking: 0,
      rapidAcceleration: 0,
      cornering: 0,
      phoneUsage: 0,
    },
  },
  {
    id: 'trip_2',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    distance: 8.3,
    duration: 20,
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
    id: 'trip_3',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    distance: 15.7,
    duration: 30,
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
  {
    id: 'trip_4',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    distance: 22.1,
    duration: 40,
    isNightDriving: true,
    score: 85,
    events: {
      speeding: 1,
      hardBraking: 0,
      rapidAcceleration: 0,
      cornering: 0,
      phoneUsage: 0,
    },
  },
  {
    id: 'trip_5',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    distance: 18.9,
    duration: 30,
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

let mockTrips: TripData[] = [...initialTrips];

// Start with two existing trips that require review
// Add createdAt and locations for review deadline and map display
let mockTripsToReview: TripData[] = [
  {
    ...initialTrips[1],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    startLocation: {
      latitude: 45.5017,
      longitude: -73.5673,
      address: '123 Main St, Montreal, QC',
    },
    endLocation: {
      latitude: 45.5088,
      longitude: -73.5878,
      address: '456 Oak Ave, Montreal, QC',
    },
    events: {
      ...initialTrips[1].events,
      hardBraking: 1, // This trip has hard braking event
    },
  },
  {
    ...initialTrips[3],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    startLocation: {
      latitude: 45.5017,
      longitude: -73.5673,
      address: '789 Pine Rd, Montreal, QC',
    },
    endLocation: {
      latitude: 45.5150,
      longitude: -73.5700,
      address: '321 Elm St, Montreal, QC',
    },
    events: {
      ...initialTrips[3].events,
      speeding: 1, // This trip has speeding event
    },
  },
];

export const tripsAPI = {
  // Get trips that need review
  getTripsToReview: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const sorted = [...mockTripsToReview].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return {
      data: sorted,
    };
  },

  // Get all trips
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const sorted = [...mockTrips].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return {
      data: sorted,
    };
  },

  submitTrip: async (tripData: TripData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const id = tripData.id || `trip_${Date.now()}`;
    const normalizedTrip: TripData = { ...tripData, id };

    const existingIndex = mockTrips.findIndex(trip => trip.id === id);
    if (existingIndex !== -1) {
      mockTrips[existingIndex] = normalizedTrip;
    } else {
      mockTrips.unshift(normalizedTrip);
      mockTripsToReview.unshift(normalizedTrip);
    }

    return {
      data: {
        ...normalizedTrip,
        synced: true,
        syncedAt: new Date().toISOString(),
      },
    };
  },

  reviewTrip: async (tripId: string, reviewed: boolean = true) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Remove from trips to review
    mockTripsToReview = mockTripsToReview.filter(trip => trip.id !== tripId);
    
    // If rejected, don't add to reviewed trips (don't register it)
    if (!reviewed) {
      // Also remove from all trips if it was rejected
      mockTrips = mockTrips.filter(trip => trip.id !== tripId);
      return {
        data: {
          id: tripId,
          reviewed: false,
          rejected: true,
          rejectedAt: new Date().toISOString(),
        },
      };
    }
    
    // If confirmed, keep it in mockTrips (already there)
    return {
      data: {
        id: tripId,
        reviewed: true,
        reviewedAt: new Date().toISOString(),
      },
    };
  },
};

