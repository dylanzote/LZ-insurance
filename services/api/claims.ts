import { mockClaims } from './mocks/claims';

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

