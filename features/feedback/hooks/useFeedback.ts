import { useState, useEffect, useCallback } from 'react';
import { feedbackAPI } from '@/services/api/endpoints';
import type { Feedback, FeedbackFormData, FeedbackStats } from '../types';
import { ApiError } from '@/core/types';
import { extractApiError } from '@/core/utils/errorHelpers';

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackAPI.getAll();
      setFeedbacks(response.data);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await feedbackAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch feedback stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
    fetchStats();
  }, [fetchFeedbacks, fetchStats]);

  const submitFeedback = useCallback(async (data: FeedbackFormData) => {
    try {
      const response = await feedbackAPI.submit(data);
      setFeedbacks(prev => [response.data, ...prev]);
      await fetchStats(); // Refresh stats
      return { success: true, data: response.data };
    } catch (err) {
      const apiError = extractApiError(err);
      setError(apiError);
      throw apiError;
    }
  }, [fetchStats]);

  const deleteFeedback = useCallback(async (id: string) => {
    try {
      await feedbackAPI.delete(id);
      setFeedbacks(prev => prev.filter(f => f.id !== id));
      await fetchStats(); // Refresh stats
      return { success: true };
    } catch (err) {
      const apiError = extractApiError(err);
      setError(apiError);
      throw apiError;
    }
  }, [fetchStats]);

  return {
    feedbacks,
    stats,
    loading,
    error,
    refetch: fetchFeedbacks,
    submitFeedback,
    deleteFeedback,
  };
};

