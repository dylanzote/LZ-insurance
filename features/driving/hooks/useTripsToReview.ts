import { useState, useEffect } from 'react';
import { TripData } from '../types';
import { tripsAPI } from '@/services/api/endpoints';

export const useTripsToReview = () => {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTripsToReview = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tripsAPI.getTripsToReview();
      setTrips(response.data);
    } catch (err) {
      setError('Failed to load trips to review');
      console.error('Error fetching trips to review:', err);
    } finally {
      setLoading(false);
    }
  };

  const reviewTrip = async (tripId: string) => {
    try {
      await tripsAPI.reviewTrip(tripId, true);
      // Remove reviewed trip from list
      setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
    } catch (err) {
      console.error('Error reviewing trip:', err);
    }
  };

  useEffect(() => {
    fetchTripsToReview();
  }, []);

  return {
    trips,
    loading,
    error,
    refetch: fetchTripsToReview,
    reviewTrip,
  };
};

