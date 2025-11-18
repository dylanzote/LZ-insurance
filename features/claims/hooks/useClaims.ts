import { useState, useEffect } from 'react';
import { Claim } from '../types';
import { claimsAPI } from '@/services/api/endpoints';

export const useClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await claimsAPI.getAll();
      setClaims(response.data);
    } catch (err) {
      setError('Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return {
    claims,
    loading,
    error,
    refetch: fetchClaims,
  };
};