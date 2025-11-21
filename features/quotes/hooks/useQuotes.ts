import { useState, useEffect, useCallback } from 'react';
import { quotesAPI } from '@/services/api/endpoints';
import type { Quote, QuoteFormData, QuoteCalculation } from '../types';
import { ApiError } from '@/core/types';
import { extractApiError } from '@/core/utils/errorHelpers';

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await quotesAPI.getAll();
      setQuotes(response.data);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const createQuote = useCallback(async (data: QuoteFormData) => {
    try {
      const response = await quotesAPI.create(data);
      setQuotes(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      const apiError = extractApiError(err);
      setError(apiError);
      throw apiError;
    }
  }, []);

  const calculateQuote = useCallback(async (data: QuoteFormData): Promise<QuoteCalculation> => {
    try {
      const response = await quotesAPI.calculate(data);
      return response.data;
    } catch (err) {
      const apiError = extractApiError(err);
      setError(apiError);
      throw apiError;
    }
  }, []);

  const getQuote = useCallback(async (id: string) => {
    try {
      const response = await quotesAPI.getById(id);
      return response.data;
    } catch (err) {
      const apiError = extractApiError(err);
      setError(apiError);
      throw apiError;
    }
  }, []);

  const convertToPolicy = useCallback(async (quoteId: string) => {
    try {
      const response = await quotesAPI.convertToPolicy(quoteId);
      // Update quote status
      setQuotes(prev => prev.map(q => 
        q.id === quoteId 
          ? { ...q, status: 'converted', convertedToPolicyId: response.data.policyId }
          : q
      ));
      return { success: true, data: response.data };
    } catch (err) {
      const apiError = extractApiError(err);
      setError(apiError);
      throw apiError;
    }
  }, []);

  const deleteQuote = useCallback(async (id: string) => {
    try {
      await quotesAPI.delete(id);
      setQuotes(prev => prev.filter(q => q.id !== id));
      return { success: true };
    } catch (err) {
      const apiError = extractApiError(err);
      setError(apiError);
      throw apiError;
    }
  }, []);

  return {
    quotes,
    loading,
    error,
    refetch: fetchQuotes,
    createQuote,
    calculateQuote,
    getQuote,
    convertToPolicy,
    deleteQuote,
  };
};

