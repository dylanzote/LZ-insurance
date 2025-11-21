import type { AddPaymentMethodRequest, BillingSummary, Invoice, PaymentMethod, PaymentRequest } from '@/features/billing/types';
import type { ChatMessage } from '@/features/chat/types';
import type { TripData } from '@/features/driving/types';

// ... existing code ...

const mockPolicies = [
  {
    id: '00143088893',
    type: 'auto' as const,
    premium: 187.66,
    termPremium: 2233.00,
    status: 'active' as const,
    startDate: '2025-05-28',
    endDate: '2026-05-28',
    renewalDate: '2026-05-28',
    coverageAmount: 1000000,
    vehicle: 'TESLA  LX 4DR, 2022',
    vehicleDetails: {
      make: 'KIA',
      model: 'FORTE LX 4DR',
      year: 2022,
      type: 'vehicle' as const,
      vin: '3KPF24AD1NE468315',
      licensePlate: 'ABC-1234',
    },
    coverageDetails: {
      liability: 1000000,
      propertyDamage: 1000000,
      directCompensation: 0,
      accidentBenefits: 0,
      uninsuredMotorist: 0,
      collision: 1000,
      comprehensive: 500,
      lienholderProtection: 0,
      familyProtection: 1000000,
    },
    insurer: 'Primmum Insurance Company',
    agency: 'LZ Insurance Direct Agency Inc.',
    nextPayment: 187.66,
    paymentDate: '2025-11-28',
    drivers: [
      { name: 'John Doe', type: 'principal' as const },
    ],
    canRenew: false,
    daysUntilExpiry: 365,
  },
  {
    id: '2',
    type: 'auto' as const,
    premium: 95.00,
    status: 'active' as const,
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    renewalDate: '2025-01-15',
    coverageAmount: 500000,
    vehicle: 'Honda Civic 2020',
    vehicleDetails: {
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      type: 'vehicle' as const,
      vin: '19XFC2F59LE123456',
      licensePlate: 'XYZ-5678',
    },
    canRenew: true,
    daysUntilExpiry: 45,
  },
  {
    id: '3',
    type: 'home' as const,
    premium: 125.50,
    status: 'active' as const,
    startDate: '2024-06-01',
    endDate: '2025-06-01',
    renewalDate: '2025-06-01',
    coverageAmount: 750000,
    property: '225 Citiplace Dr UNIT B, Nepean ON K2E 0C5',
    propertyDetails: {
      address: '225 Citiplace Dr UNIT B',
      city: 'Nepean',
      state: 'ON',
      zipCode: 'K2E 0C5',
    },
    coverageDetails: {
      dwelling: 500000,
      personalProperty: 250000,
      liability: 1000000,
    },
    insurer: 'Primmum Insurance Company',
    agency: 'LZ Insurance Direct Agency Inc.',
    nextPayment: 125.50,
    paymentDate: '2025-12-01',
    canRenew: false,
    daysUntilExpiry: 180,
  },
];

const mockClaims = [
  {
    id: 'claim_1',
    policyId: '00143088893',
    policyType: 'auto' as const,
    title: 'Vehicle Collision',
    description: 'Rear-end collision on Highway 401',
    status: 'submitted' as const,
    category: 'accident',
    amount: 5000,
    incidentDate: '2024-11-15',
    location: 'Highway 401, Toronto, ON',
    createdAt: '2024-11-15T10:30:00Z',
    updatedAt: '2024-11-15T10:30:00Z',
    documents: [],
    images: [],
    timeline: [
      {
        id: 'timeline_1',
        status: 'submitted' as const,
        date: '2024-11-15T10:30:00Z',
        description: 'Claim filed',
      },
    ],
  },
  {
    id: 'claim_2',
    policyId: '3',
    policyType: 'home' as const,
    title: 'Water Damage',
    description: 'Basement flooding due to pipe burst',
    status: 'document-verification' as const,
    category: 'property_damage',
    amount: 15000,
    incidentDate: '2024-11-10',
    location: '225 Citiplace Dr UNIT B, Nepean ON K2E 0C5',
    createdAt: '2024-11-10T14:20:00Z',
    updatedAt: '2024-11-12T09:15:00Z',
    documents: [],
    images: [],
    timeline: [
      {
        id: 'timeline_1',
        status: 'submitted' as const,
        date: '2024-11-10T14:20:00Z',
        description: 'Claim filed',
      },
      {
        id: 'timeline_2',
        status: 'document-verification' as const,
        date: '2024-11-12T09:15:00Z',
        description: 'Documents under review',
      },
    ],
  },
  {
    id: 'claim_3',
    policyId: '00143088893',
    policyType: 'auto' as const,
    title: 'Windshield Replacement',
    description: 'Cracked windshield from road debris',
    status: 'surveyor-assigned' as const,
    category: 'glass_damage',
    amount: 800,
    incidentDate: '2024-11-05',
    location: 'Downtown Toronto, ON',
    createdAt: '2024-11-05T08:00:00Z',
    updatedAt: '2024-11-08T11:30:00Z',
    documents: [],
    images: [],
    timeline: [
      {
        id: 'timeline_1',
        status: 'submitted' as const,
        date: '2024-11-05T08:00:00Z',
        description: 'Claim filed',
      },
      {
        id: 'timeline_2',
        status: 'document-verification' as const,
        date: '2024-11-06T10:00:00Z',
        description: 'Documents verified',
      },
      {
        id: 'timeline_3',
        status: 'surveyor-assigned' as const,
        date: '2024-11-08T11:30:00Z',
        description: 'Surveyor assigned for assessment',
      },
    ],
  },
  {
    id: 'claim_4',
    policyId: '2',
    policyType: 'auto' as const,
    title: 'Theft',
    description: 'Vehicle stolen from parking lot',
    status: 'approved' as const,
    category: 'theft',
    amount: 20000,
    incidentDate: '2024-10-20',
    location: 'Shopping Mall, Ottawa, ON',
    createdAt: '2024-10-20T18:45:00Z',
    updatedAt: '2024-11-01T14:00:00Z',
    documents: [],
    images: [],
    timeline: [
      {
        id: 'timeline_1',
        status: 'submitted' as const,
        date: '2024-10-20T18:45:00Z',
        description: 'Claim filed',
      },
      {
        id: 'timeline_2',
        status: 'document-verification' as const,
        date: '2024-10-22T09:00:00Z',
        description: 'Documents verified',
      },
      {
        id: 'timeline_3',
        status: 'surveyor-assigned' as const,
        date: '2024-10-25T10:30:00Z',
        description: 'Surveyor assigned',
      },
      {
        id: 'timeline_4',
        status: 'assessment' as const,
        date: '2024-10-28T15:00:00Z',
        description: 'Assessment completed',
      },
      {
        id: 'timeline_5',
        status: 'approved' as const,
        date: '2024-11-01T14:00:00Z',
        description: 'Claim approved',
      },
    ],
  },
  {
    id: 'claim_5',
    policyId: '3',
    policyType: 'home' as const,
    title: 'Fire Damage',
    description: 'Kitchen fire causing smoke damage',
    status: 'rejected' as const,
    category: 'fire',
    amount: 30000,
    incidentDate: '2024-09-15',
    location: '225 Citiplace Dr UNIT B, Nepean ON K2E 0C5',
    createdAt: '2024-09-15T12:00:00Z',
    updatedAt: '2024-09-25T16:00:00Z',
    documents: [],
    images: [],
    timeline: [
      {
        id: 'timeline_1',
        status: 'submitted' as const,
        date: '2024-09-15T12:00:00Z',
        description: 'Claim filed',
      },
      {
        id: 'timeline_2',
        status: 'document-verification' as const,
        date: '2024-09-17T09:00:00Z',
        description: 'Documents verified',
      },
      {
        id: 'timeline_3',
        status: 'surveyor-assigned' as const,
        date: '2024-09-20T10:00:00Z',
        description: 'Surveyor assigned',
      },
      {
        id: 'timeline_4',
        status: 'assessment' as const,
        date: '2024-09-22T14:00:00Z',
        description: 'Assessment completed',
      },
      {
        id: 'timeline_5',
        status: 'rejected' as const,
        date: '2024-09-25T16:00:00Z',
        description: 'Claim rejected - Not covered under policy',
      },
    ],
  },
  {
    id: 'claim_6',
    policyId: '00143088893',
    policyType: 'auto' as const,
    title: 'Vandalism',
    description: 'Car keyed and windows broken',
    status: 'in-review' as const,
    category: 'vandalism',
    amount: 3500,
    incidentDate: '2024-11-12',
    location: 'Residential Street, Toronto, ON',
    createdAt: '2024-11-12T07:30:00Z',
    updatedAt: '2024-11-14T13:20:00Z',
    documents: [],
    images: [],
    timeline: [
      {
        id: 'timeline_1',
        status: 'submitted' as const,
        date: '2024-11-12T07:30:00Z',
        description: 'Claim filed',
      },
      {
        id: 'timeline_2',
        status: 'document-verification' as const,
        date: '2024-11-13T09:00:00Z',
        description: 'Documents verified',
      },
      {
        id: 'timeline_3',
        status: 'in-review' as const,
        date: '2024-11-14T13:20:00Z',
        description: 'Under review',
      },
    ],
  },
];

// Mock payment methods
const mockPaymentMethods: PaymentMethod[] = [
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

// Mock invoices
const mockInvoices: Invoice[] = [
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

export const authAPI = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'user@example.com' && password === 'password123') {
      return {
        data: {
          user: {
            id: '1',
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1 234 567 8900',
          },
          tokens: {
            accessToken: 'mock_access_token',
            refreshToken: 'mock_refresh_token',
          },
        },
      };
    }
    
    throw new Error('Invalid credentials');
  },

  register: async (userData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: {
        user: {
          id: '1',
          ...userData,
        },
        tokens: {
          accessToken: 'mock_access_token',
          refreshToken: 'mock_refresh_token',
        },
      },
    };
  },

  refreshToken: async (refreshToken: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        accessToken: 'new_mock_access_token',
        refreshToken: 'new_mock_refresh_token',
      },
    };
  },
};

export const policiesAPI = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockPolicies };
  },
  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const policy = mockPolicies.find(p => p.id === id);
    if (!policy) throw new Error('Policy not found');
    return { data: policy };
  },
};

export const claimsAPI = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockClaims };
  },
  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const claim = mockClaims.find(c => c.id === id);
    if (!claim) throw new Error('Claim not found');
    return { data: claim };
  },
  submitClaim: async (claimData: any) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newClaim = {
      id: `claim_${Date.now()}`,
      ...claimData,
      status: 'submitted' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: `timeline_${Date.now()}`,
          status: 'submitted' as const,
          date: new Date().toISOString(),
          description: 'Claim filed',
        },
      ],
    };
    mockClaims.unshift(newClaim);
    return { data: newClaim };
  },
};

export const dashboardAPI = {
  getSummary: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const activePolicies = mockPolicies.filter(p => p.status === 'active');
    const totalCoverage = activePolicies.reduce((sum, p) => sum + p.coverageAmount, 0);
    
    // Calculate coverage breakdown by type
    const coverageBreakdown = activePolicies.reduce((acc, policy) => {
      const type = policy.type.toUpperCase();
      if (!acc[type]) {
        acc[type] = {
          type: policy.type,
          amount: 0,
          policyCount: 0,
        };
      }
      acc[type].amount += policy.coverageAmount;
      acc[type].policyCount += 1;
      return acc;
    }, {} as Record<string, { type: string; amount: number; policyCount: number }>);

    // Generate recent activity from policies, claims, and invoices
    const recentActivity = [
      // Recent policies
      ...mockPolicies.slice(0, 2).map((policy, index) => ({
        id: `activity_policy_${policy.id}`,
        type: 'policy' as const,
        description: `${policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} policy ${policy.status === 'active' ? 'active' : 'renewed'}`,
        date: policy.startDate || new Date(Date.now() - (index + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: policy.premium,
      })),
      // Recent claims
      ...mockClaims.slice(0, 2).map((claim, index) => ({
        id: `activity_claim_${claim.id}`,
        type: 'claim' as const,
        description: `Claim ${claim.status === 'approved' ? 'approved' : claim.status === 'rejected' ? 'rejected' : 'submitted'}: ${claim.title}`,
        date: claim.createdAt || claim.incidentDate || new Date(Date.now() - (index + 3) * 7 * 24 * 60 * 60 * 1000).toISOString(),
        amount: claim.amount,
      })),
      // Recent payments (from invoices)
      ...mockInvoices.filter(inv => inv.status === 'paid').slice(0, 2).map((invoice, index) => ({
        id: `activity_payment_${invoice.id}`,
        type: 'payment' as const,
        description: `Payment received for ${invoice.policyType} policy`,
        date: invoice.paidDate || invoice.createdAt || new Date(Date.now() - (index + 5) * 14 * 24 * 60 * 60 * 1000).toISOString(),
        amount: invoice.amount,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    return {
      data: {
        totalPolicies: mockPolicies.length,
        activePolicies: activePolicies.length,
        pendingClaims: mockClaims.filter(c => c.status === 'submitted' || c.status === 'in-review').length,
        totalCoverage,
        coverageBreakdown: Object.values(coverageBreakdown),
        recentActivity,
      },
    };
  },
};

export const profileAPI = {
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: {
        id: '1',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1 234 567 8900',
        phone: '+1 234 567 8900',
        address: '123 Main Street, Toronto, ON M5H 2N2',
        dateOfBirth: '1990-01-15',
        maritalStatus: 'single',
        gender: 'male',
      },
    };
  },
  updateProfile: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: {
        id: '1',
        ...data,
      },
    };
  },
  changePassword: async (data: { currentPassword: string; newPassword: string; confirmPassword?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (data.currentPassword !== 'password123') {
      throw new Error('Current password is incorrect');
    }
    return {
      data: {
        success: true,
        message: 'Password changed successfully',
      },
    };
  },

  // Send verification code for two-step verification
  sendVerificationCode: async (method: 'sms' | 'email') => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: {
        success: true,
        message: `Verification code sent via ${method}`,
        method,
      },
    };
  },

  // Verify two-step verification code
  verifyTwoStepCode: async (code: string, method: 'sms' | 'email') => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Mock: accept any 6-digit code
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      throw new Error('Invalid verification code');
    }
    return {
      data: {
        success: true,
        message: 'Two-step verification enabled',
        method,
      },
    };
  },

  // Disable two-step verification
  disableTwoStepVerification: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: {
        success: true,
        message: 'Two-step verification disabled',
      },
    };
  },
};

export const feedbackAPI = {
  // Get all feedbacks for the current user
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [...mockFeedbacks],
    };
  },

  // Get feedback statistics
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const total = mockFeedbacks.length;
    const byCategory: Record<string, number> = {
      bug: 0,
      feature: 0,
      improvement: 0,
      complaint: 0,
      compliment: 0,
      other: 0,
    };
    let totalRating = 0;
    let ratingCount = 0;
    let resolved = 0;
    let pending = 0;

    mockFeedbacks.forEach(feedback => {
      byCategory[feedback.category] = (byCategory[feedback.category] || 0) + 1;
      if (feedback.rating) {
        totalRating += feedback.rating;
        ratingCount++;
      }
      if (feedback.status === 'resolved') {
        resolved++;
      } else if (feedback.status === 'in-review' || feedback.status === 'submitted') {
        pending++;
      }
    });

    return {
      data: {
        total,
        byCategory,
        averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
        resolved,
        pending,
      },
    };
  },

  // Submit new feedback
  submit: async (data: {
    category: string;
    title: string;
    message: string;
    rating?: number;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newFeedback = {
      id: `feedback_${Date.now()}`,
      userId: '1',
      category: data.category as any,
      title: data.title,
      message: data.message,
      rating: data.rating ?? 0,
      status: 'submitted' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockFeedbacks.unshift(newFeedback);
    return {
      data: newFeedback,
    };
  },

  // Delete feedback
  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockFeedbacks.findIndex(f => f.id === id);
    if (index > -1) {
      mockFeedbacks.splice(index, 1);
    }
    return {
      data: { success: true },
    };
  },
};

// Mock feedback data
const mockFeedbacks = [
  {
    id: 'feedback_1',
    userId: '1',
    category: 'feature' as const,
    title: 'Dark mode support',
    message: 'Would love to see dark mode support in the app. It would be easier on the eyes during night time usage.',
    rating: 5,
    status: 'resolved' as const,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    response: 'Thank you for your feedback! Dark mode has been implemented and is now available in the app settings.',
    respondedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'feedback_2',
    userId: '1',
    category: 'improvement' as const,
    title: 'Faster claim processing',
    message: 'The claim submission process could be streamlined. Currently it takes too many steps.',
    rating: 4,
    status: 'in-review' as const,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'feedback_3',
    userId: '1',
    category: 'compliment' as const,
    title: 'Great app design!',
    message: 'I really love the modern design and user-friendly interface. Keep up the great work!',
    rating: 5,
    status: 'submitted' as const,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const chatAPI = {
  getMessages: async (sessionId?: string): Promise<ChatMessage[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 'msg_1',
        text: 'Hello! How can I help you today?',
        sender: 'agent',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: true,
        type: 'text',
      },
    ];
  },
  getChatSession: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      agentName: 'Sarah Johnson',
      status: 'online' as const,
    };
  },
  sendMessage: async (message: string, sessionId?: string): Promise<ChatMessage> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: `msg_${Date.now()}`,
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      read: true,
      type: 'text',
    };
  },
  getAgentResponse: async (userMessage: string, sessionId?: string): Promise<ChatMessage> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Import the getAgentResponse function from mockChat
    const { getAgentResponse } = await import('@/features/chat/data/mockChat');
    const responseText = getAgentResponse(userMessage);
    
    return {
      id: `msg_${Date.now()}`,
      text: responseText,
      sender: 'agent',
      timestamp: new Date().toISOString(),
      read: true,
      type: 'text',
    };
  },
};

// Driving trips mocks
const initialTrips: TripData[] = [
  {
    id: 'trip_1',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    distance: 12.5,
    duration: 25,
    isNightDriving: false,
    score: 95,
    events: {
      speeding: 0,
      hardBraking: 0,
      rapidAcceleration: 0,
      cornering: 0,
      phoneUsage: 0,
    },
  },
  {
    id: 'trip_2',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    distance: 8.3,
    duration: 20,
    isNightDriving: false,
    score: 88,
    events: {
      speeding: 0,
      hardBraking: 1,
      rapidAcceleration: 0,
      cornering: 0,
      phoneUsage: 0,
    },
  },
  {
    id: 'trip_3',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    distance: 15.7,
    duration: 30,
    isNightDriving: false,
    score: 92,
    events: {
      speeding: 0,
      hardBraking: 0,
      rapidAcceleration: 0,
      cornering: 0,
      phoneUsage: 0,
    },
  },
  {
    id: 'trip_4',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    distance: 22.1,
    duration: 40,
    isNightDriving: true,
    score: 85,
    events: {
      speeding: 1,
      hardBraking: 0,
      rapidAcceleration: 0,
      cornering: 0,
      phoneUsage: 0,
    },
  },
  {
    id: 'trip_5',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    distance: 18.9,
    duration: 30,
    isNightDriving: false,
    score: 92,
    events: {
      speeding: 0,
      hardBraking: 0,
      rapidAcceleration: 0,
      cornering: 0,
      phoneUsage: 0,
    },
  },
];

let mockTrips: TripData[] = [...initialTrips];

// Start with two existing trips that require review
// Add createdAt and locations for review deadline and map display
let mockTripsToReview: TripData[] = [
  {
    ...initialTrips[1],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    startLocation: {
      latitude: 45.5017,
      longitude: -73.5673,
      address: '123 Main St, Montreal, QC',
    },
    endLocation: {
      latitude: 45.5088,
      longitude: -73.5878,
      address: '456 Oak Ave, Montreal, QC',
    },
    events: {
      ...initialTrips[1].events,
      hardBraking: 1, // This trip has hard braking event
    },
  },
  {
    ...initialTrips[3],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    startLocation: {
      latitude: 45.5017,
      longitude: -73.5673,
      address: '789 Pine Rd, Montreal, QC',
    },
    endLocation: {
      latitude: 45.5150,
      longitude: -73.5700,
      address: '321 Elm St, Montreal, QC',
    },
    events: {
      ...initialTrips[3].events,
      speeding: 1, // This trip has speeding event
    },
  },
];

export const tripsAPI = {
  // Get trips that need review
  getTripsToReview: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const sorted = [...mockTripsToReview].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return {
      data: sorted,
    };
  },

  // Get all trips
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const sorted = [...mockTrips].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return {
      data: sorted,
    };
  },

  submitTrip: async (tripData: TripData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const id = tripData.id || `trip_${Date.now()}`;
    const normalizedTrip: TripData = { ...tripData, id };

    const existingIndex = mockTrips.findIndex(trip => trip.id === id);
    if (existingIndex !== -1) {
      mockTrips[existingIndex] = normalizedTrip;
    } else {
      mockTrips.unshift(normalizedTrip);
      mockTripsToReview.unshift(normalizedTrip);
    }

    return {
      data: {
        ...normalizedTrip,
        synced: true,
        syncedAt: new Date().toISOString(),
      },
    };
  },

  reviewTrip: async (tripId: string, reviewed: boolean = true) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Remove from trips to review
    mockTripsToReview = mockTripsToReview.filter(trip => trip.id !== tripId);
    
    // If rejected, don't add to reviewed trips (don't register it)
    if (!reviewed) {
      // Also remove from all trips if it was rejected
      mockTrips = mockTrips.filter(trip => trip.id !== tripId);
      return {
        data: {
          id: tripId,
          reviewed: false,
          rejected: true,
          rejectedAt: new Date().toISOString(),
        },
      };
    }
    
    // If confirmed, keep it in mockTrips (already there)
    return {
      data: {
        id: tripId,
        reviewed: true,
        reviewedAt: new Date().toISOString(),
      },
    };
  },
};

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

// Quotes API
let mockQuotes: any[] = [];

export const quotesAPI = {
  // Get all quotes
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: mockQuotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    };
  },

  // Get quote by ID
  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const quote = mockQuotes.find(q => q.id === id);
    if (!quote) throw new Error('Quote not found');
    return { data: quote };
  },

  // Calculate quote
  calculate: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Base premium calculation based on type
    let basePremium = 0;
    const discounts: any[] = [];
    const adjustments: any[] = [];

    switch (data.type) {
      case 'auto':
        basePremium = 1200; // Annual base
        if (data.details?.coverageLevel === 'premium') {
          adjustments.push({ name: 'Premium Coverage', amount: 400 });
        } else if (data.details?.coverageLevel === 'basic') {
          discounts.push({ name: 'Basic Coverage', amount: -200, percentage: -16.67 });
        }
        if (data.details?.deductible && data.details.deductible >= 1000) {
          discounts.push({ name: 'High Deductible', amount: -150, percentage: -12.5 });
        }
        break;
      case 'motorcycle':
        basePremium = 800; // Annual base - typically cheaper than auto
        if (data.details?.coverageLevel === 'premium') {
          adjustments.push({ name: 'Premium Coverage', amount: 300 });
        } else if (data.details?.coverageLevel === 'basic') {
          discounts.push({ name: 'Basic Coverage', amount: -150, percentage: -18.75 });
        }
        if (data.details?.deductible && data.details.deductible >= 1000) {
          discounts.push({ name: 'High Deductible', amount: -120, percentage: -15 });
        }
        break;
      case 'home':
        basePremium = 1500;
        if (data.details?.coverageLevel === 'premium') {
          adjustments.push({ name: 'Premium Coverage', amount: 500 });
        } else if (data.details?.coverageLevel === 'basic') {
          discounts.push({ name: 'Basic Coverage', amount: -300, percentage: -20 });
        }
        break;
      case 'life':
        basePremium = (data.details?.coverageAmount || 500000) * 0.001; // 0.1% of coverage
        if (data.details?.healthStatus === 'excellent') {
          discounts.push({ name: 'Excellent Health', amount: -basePremium * 0.2, percentage: -20 });
        }
        if (!data.details?.smoker) {
          discounts.push({ name: 'Non-Smoker', amount: -basePremium * 0.15, percentage: -15 });
        }
        break;
      case 'health':
        basePremium = data.details?.familySize && data.details.familySize > 1 
          ? 6000 
          : 3600;
        if (data.details?.coverageLevel === 'basic') {
          discounts.push({ name: 'Basic Plan', amount: -600, percentage: -10 });
        }
        break;
      case 'travel':
        basePremium = (data.details?.tripDuration || 7) * 15;
        if (data.details?.travelers && data.details.travelers > 1) {
          adjustments.push({ name: 'Multiple Travelers', amount: (data.details.travelers - 1) * 50 });
        }
        break;
    }

    const discountTotal = discounts.reduce((sum, d) => sum + d.amount, 0);
    const adjustmentTotal = adjustments.reduce((sum, a) => sum + a.amount, 0);
    const subtotal = basePremium + discountTotal + adjustmentTotal;
    const taxes = subtotal * 0.08; // 8% tax
    const total = subtotal + taxes;
    const monthlyPremium = total / 12;
    const annualPremium = total;

    return {
      data: {
        basePremium,
        discounts,
        adjustments,
        subtotal,
        taxes,
        total,
        monthlyPremium: Math.round(monthlyPremium * 100) / 100,
        annualPremium: Math.round(annualPremium * 100) / 100,
      },
    };
  },

  // Create quote
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calculate quote first
    const calculation = await quotesAPI.calculate(data);
    
    const newQuote = {
      id: `quote_${Date.now()}`,
      userId: '1',
      type: data.type,
      status: 'pending' as const,
      personalInfo: data.personalInfo,
      details: data.details,
      monthlyPremium: calculation.data.monthlyPremium,
      annualPremium: calculation.data.annualPremium,
      coverageAmount: data.details?.coverageAmount,
      deductible: data.details?.deductible,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockQuotes.unshift(newQuote);
    return { data: newQuote };
  },

  // Convert quote to policy
  convertToPolicy: async (quoteId: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const quote = mockQuotes.find(q => q.id === quoteId);
    if (!quote) throw new Error('Quote not found');
    
    // In real app, this would create a policy
    const policyId = `POL-${Date.now()}`;
    quote.status = 'converted';
    quote.convertedToPolicyId = policyId;
    quote.updatedAt = new Date().toISOString();
    
    return {
      data: {
        success: true,
        policyId,
        message: 'Quote converted to policy successfully',
      },
    };
  },

  // Delete quote
  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockQuotes.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quote not found');
    mockQuotes.splice(index, 1);
    return { data: { success: true } };
  },
};
