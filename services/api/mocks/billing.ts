import type { Invoice, PaymentMethod } from '@/features/billing/types';

export let mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'credit_card',
    label: 'Visa •••• 1234',
    isDefault: true,
    expiryDate: '12/25',
    last4: '1234',
    billingAddress: {
      street: '123 Main St',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'M5H 2N2',
    },
  },
  {
    id: 'pm_2',
    type: 'bank_account',
    label: 'Bank Account •••• 5678',
    isDefault: false,
    last4: '5678',
    bankName: 'TD Canada Trust',
    accountType: 'checking',
  },
];

export let mockInvoices: Invoice[] = [
  {
    id: 'inv_1',
    policyId: '00143088893',
    policyType: 'auto',
    invoiceNumber: 'INV-2024-001',
    amount: 187.66,
    status: 'paid',
    dueDate: '2024-10-28',
    paidDate: '2024-10-25',
    billingPeriod: {
      start: '2024-10-01',
      end: '2024-10-31',
    },
    frequency: 'monthly',
    paymentMethodId: 'pm_1',
    description: 'Monthly premium - KIA FORTE LX 4DR, 2022',
    lineItems: [
      { description: 'Monthly Premium', amount: 187.66 },
    ],
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-10-25T10:30:00Z',
  },
  {
    id: 'inv_2',
    policyId: '00143088893',
    policyType: 'auto',
    invoiceNumber: 'INV-2024-002',
    amount: 187.66,
    status: 'pending',
    dueDate: '2024-11-28',
    billingPeriod: {
      start: '2024-11-01',
      end: '2024-11-30',
    },
    frequency: 'monthly',
    paymentMethodId: 'pm_1',
    description: 'Monthly premium - KIA FORTE LX 4DR, 2022',
    lineItems: [
      { description: 'Monthly Premium', amount: 187.66 },
    ],
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z',
  },
  {
    id: 'inv_3',
    policyId: '3',
    policyType: 'home',
    invoiceNumber: 'INV-2024-003',
    amount: 125.50,
    status: 'paid',
    dueDate: '2024-11-01',
    paidDate: '2024-10-28',
    billingPeriod: {
      start: '2024-11-01',
      end: '2024-11-30',
    },
    frequency: 'monthly',
    paymentMethodId: 'pm_1',
    description: 'Monthly premium - 225 Citiplace Dr UNIT B',
    lineItems: [
      { description: 'Monthly Premium', amount: 125.50 },
    ],
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-10-28T14:20:00Z',
  },
  {
    id: 'inv_4',
    policyId: '2',
    policyType: 'auto',
    invoiceNumber: 'INV-2024-004',
    amount: 95.00,
    status: 'overdue',
    dueDate: '2024-10-15',
    billingPeriod: {
      start: '2024-10-01',
      end: '2024-10-31',
    },
    frequency: 'monthly',
    paymentMethodId: 'pm_2',
    description: 'Monthly premium - Honda Civic 2020',
    lineItems: [
      { description: 'Monthly Premium', amount: 95.00 },
    ],
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-10-15T00:00:00Z',
  },
];

