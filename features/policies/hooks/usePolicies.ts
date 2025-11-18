import { useState, useEffect } from 'react';
import { Policy } from '../types';
import { policiesAPI } from '@/services/api/endpoints';

export const usePolicies = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await policiesAPI.getAll();
      
      // Add renewal logic to policies
      const policiesWithRenewal = response.data.map((policy: Policy) => ({
        ...policy,
        canRenew: policy.status === 'active' && policy.daysUntilExpiry < 30,
        daysUntilExpiry: calculateDaysUntilExpiry(policy.endDate),
      }));
      
      setPolicies(policiesWithRenewal);
    } catch (err) {
      setError('Failed to fetch policies');
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysUntilExpiry = (endDate: string): number => {
    const today = new Date();
    const expiryDate = new Date(endDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renewPolicy = async (policyId: string) => {
    try {
      // Simulate renewal API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPolicies(prevPolicies => 
        prevPolicies.map(policy => 
          policy.id === policyId 
            ? { 
                ...policy, 
                status: 'active',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                canRenew: false,
                daysUntilExpiry: 365
              }
            : policy
        )
      );
      
      return true;
    } catch (error) {
      throw new Error('Failed to renew policy');
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  return {
    policies,
    loading,
    error,
    refetch: fetchPolicies,
    renewPolicy,
  };
};