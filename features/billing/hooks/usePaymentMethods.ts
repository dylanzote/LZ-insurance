import { useState, useEffect } from 'react';
import { billingAPI } from '@/services/api/endpoints';
import type { PaymentMethod, AddPaymentMethodRequest } from '../types';

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await billingAPI.getPaymentMethods();
      setPaymentMethods(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch payment methods'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const addPaymentMethod = async (data: AddPaymentMethodRequest) => {
    try {
      const response = await billingAPI.addPaymentMethod(data);
      await fetchPaymentMethods(); // Refresh list
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add payment method');
    }
  };

  const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    try {
      const response = await billingAPI.updatePaymentMethod(id, updates);
      await fetchPaymentMethods(); // Refresh list
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update payment method');
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      await billingAPI.deletePaymentMethod(id);
      await fetchPaymentMethods(); // Refresh list
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete payment method');
    }
  };

  const refetch = () => {
    fetchPaymentMethods();
  };

  return {
    paymentMethods,
    loading,
    error,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    refetch,
  };
}

