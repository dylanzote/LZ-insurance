import { useState, useEffect } from 'react';
import { billingAPI } from '@/services/api/endpoints';
import type { Invoice, BillingSummary } from '../types';

export function useBilling(policyId?: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await billingAPI.getInvoices(policyId);
      setInvoices(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch invoices'));
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const data = await billingAPI.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch billing summary:', err);
    }
  };

  useEffect(() => {
    fetchInvoices();
    if (!policyId) {
      fetchSummary();
    }
  }, [policyId]);

  const refetch = () => {
    fetchInvoices();
    if (!policyId) {
      fetchSummary();
    }
  };

  return {
    invoices,
    summary,
    loading,
    error,
    refetch,
  };
}

