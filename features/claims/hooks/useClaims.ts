import { claimsAPI } from '@/services/api/endpoints';
import { useEffect, useState } from 'react';
import { Claim } from '../types';

export const useClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await claimsAPI.getAll();
      // Map API response to include required 'date' field
      const mappedClaims = response.data.map((claim: any) => ({
        ...claim,
        date: claim.date || claim.createdAt || claim.incidentDate,
      }));
      setClaims(mappedClaims);
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