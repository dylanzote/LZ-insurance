export type BillingStatus = 'paid' | 'pending' | 'overdue' | 'failed' | 'cancelled';
export type PaymentMethodType = 'credit_card' | 'debit_card' | 'bank_account' | 'e_transfer';
export type BillingFrequency = 'monthly' | 'quarterly' | 'annually' | 'one_time';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string; // e.g., "Visa •••• 1234" or "Bank Account •••• 5678"
  isDefault: boolean;
  expiryDate?: string; // For cards: "MM/YY"
  last4?: string; // Last 4 digits
  bankName?: string; // For bank accounts
  accountType?: 'checking' | 'savings'; // For bank accounts
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Invoice {
  id: string;
  policyId: string;
  policyType: 'auto' | 'home' | 'life' | 'health';
  invoiceNumber: string;
  amount: number;
  status: BillingStatus;
  dueDate: string;
  paidDate?: string;
  billingPeriod: {
    start: string;
    end: string;
  };
  frequency: BillingFrequency;
  paymentMethodId?: string;
  description: string;
  lineItems: InvoiceLineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItem {
  description: string;
  amount: number;
  quantity?: number;
}

export interface BillingSummary {
  totalDue: number;
  totalPaid: number;
  upcomingPayments: number;
  overdueAmount: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
}

export interface AddPaymentMethodRequest {
  type: PaymentMethodType;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  accountType?: 'checking' | 'savings';
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  setAsDefault?: boolean;
}

export interface PaymentRequest {
  invoiceId: string;
  paymentMethodId: string;
  amount: number;
}

