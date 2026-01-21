import type { AddPaymentMethodRequest, BillingSummary, Invoice, PaymentMethod, PaymentRequest } from '@/features/billing/types';
import { mockInvoices, mockPaymentMethods } from './mocks/billing';

export const billingAPI = {
  // Get billing summary
  getSummary: async (): Promise<BillingSummary> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const pendingInvoices = mockInvoices.filter(inv => inv.status === 'pending');
    const paidInvoices = mockInvoices.filter(inv => inv.status === 'paid');
    const overdueInvoices = mockInvoices.filter(inv => inv.status === 'overdue');
    
    return {
      totalDue: pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      totalPaid: paidInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      upcomingPayments: pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      overdueAmount: overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      nextPaymentDate: pendingInvoices[0]?.dueDate,
      nextPaymentAmount: pendingInvoices[0]?.amount,
    };
  },

  // Get all invoices
  getInvoices: async (policyId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let invoices = [...mockInvoices];
    if (policyId) {
      invoices = invoices.filter(inv => inv.policyId === policyId);
    }
    return { data: invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
  },

  // Get invoice by ID
  getInvoiceById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const invoice = mockInvoices.find(inv => inv.id === id);
    if (!invoice) throw new Error('Invoice not found');
    return { data: invoice };
  },

  // Get payment methods
  getPaymentMethods: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: [...mockPaymentMethods] };
  },

  // Add payment method
  addPaymentMethod: async (data: AddPaymentMethodRequest) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: data.type,
      label: data.type === 'credit_card' || data.type === 'debit_card'
        ? `${data.type === 'credit_card' ? 'Visa' : 'Debit'} •••• ${data.cardNumber?.slice(-4) || '0000'}`
        : `Bank Account •••• ${data.accountNumber?.slice(-4) || '0000'}`,
      isDefault: data.setAsDefault || false,
      expiryDate: data.expiryDate,
      last4: data.cardNumber?.slice(-4) || data.accountNumber?.slice(-4),
      bankName: data.bankName,
      accountType: data.accountType,
      billingAddress: data.billingAddress,
    };
    
    // If setting as default, unset other defaults
    if (data.setAsDefault) {
      mockPaymentMethods.forEach(pm => { pm.isDefault = false; });
    }
    
    mockPaymentMethods.push(newMethod);
    return { data: newMethod };
  },

  // Update payment method
  updatePaymentMethod: async (id: string, updates: Partial<PaymentMethod>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const method = mockPaymentMethods.find(pm => pm.id === id);
    if (!method) throw new Error('Payment method not found');
    
    Object.assign(method, updates);
    
    // If setting as default, unset other defaults
    if (updates.isDefault) {
      mockPaymentMethods.forEach(pm => {
        if (pm.id !== id) pm.isDefault = false;
      });
    }
    
    return { data: method };
  },

  // Delete payment method
  deletePaymentMethod: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPaymentMethods.findIndex(pm => pm.id === id);
    if (index === -1) throw new Error('Payment method not found');
    mockPaymentMethods.splice(index, 1);
    return { data: { success: true } };
  },

  // Process payment
  processPayment: async (request: PaymentRequest) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const invoice = mockInvoices.find(inv => inv.id === request.invoiceId);
    if (!invoice) throw new Error('Invoice not found');
    
    // Simulate payment processing
    invoice.status = 'paid';
    invoice.paidDate = new Date().toISOString();
    invoice.paymentMethodId = request.paymentMethodId;
    invoice.updatedAt = new Date().toISOString();
    
    return {
      data: {
        success: true,
        transactionId: `txn_${Date.now()}`,
        invoice: invoice,
      },
    };
  },

  // Get invoices by policy
  getInvoicesByPolicy: async (policyId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const invoices = mockInvoices.filter(inv => inv.policyId === policyId);
    return { data: invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
  },
};

