import type { AddPaymentMethodRequest, BillingSummary, Invoice, PaymentMethod, PaymentRequest } from '@/features/billing/types';
import type { ChatMessage } from '@/features/chat/types';

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

    return {
      data: {
        totalPolicies: mockPolicies.length,
        activePolicies: activePolicies.length,
        pendingClaims: mockClaims.filter(c => c.status === 'submitted' || c.status === 'in-review').length,
        totalCoverage,
        coverageBreakdown: Object.values(coverageBreakdown),
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
        phone: '+1 234 567 8900',
        address: '123 Main Street, Toronto, ON M5H 2N2',
        dateOfBirth: '1990-01-15',
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
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
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
};

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
    // Simple keyword-based responses
    const lowerMessage = userMessage.toLowerCase();
    let response = "I understand. Let me help you with that.";
    
    if (lowerMessage.includes('claim')) {
      response = "I can help you with your claim. You can file a new claim or track an existing one from the Claims section.";
    } else if (lowerMessage.includes('policy') || lowerMessage.includes('coverage')) {
      response = "I can help you with your policies. You can view all your policies and their details from the Policies section.";
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('billing')) {
      response = "For billing questions, you can view your invoices and payment methods in the Billing section.";
    } else if (lowerMessage.includes('premium') || lowerMessage.includes('price')) {
      response = "Your premium depends on various factors. Check your policy details for specific amounts.";
    }
    
    return {
      id: `msg_${Date.now()}`,
      text: response,
      sender: 'agent',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'text',
    };
  },
  getChatSession: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      agentName: 'Sarah Johnson',
      status: 'online' as const,
    };
  },
};

export const tripsAPI = {
  // Get trips that need review
  getTripsToReview: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: 'trip_review_1',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          distance: 25.3,
          duration: 45,
          isNightDriving: false,
          score: 75,
          events: {
            speeding: 2,
            hardBraking: 1,
            rapidAcceleration: 0,
            cornering: 0,
            phoneUsage: 0,
          },
        },
        {
          id: 'trip_review_2',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          distance: 18.7,
          duration: 35,
          isNightDriving: true,
          score: 68,
          events: {
            speeding: 3,
            hardBraking: 2,
            rapidAcceleration: 1,
            cornering: 1,
            phoneUsage: 1,
          },
        },
      ],
    };
  },

  // Get all trips
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
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
      ],
    };
  },

  submitTrip: async (tripData: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Trip submitted to backend:', tripData);
    return {
      data: {
        id: tripData.id || `trip_${Date.now()}`,
        ...tripData,
        synced: true,
        syncedAt: new Date().toISOString(),
      },
    };
  },

  reviewTrip: async (tripId: string, reviewed: boolean = true) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: {
        id: tripId,
        reviewed,
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
