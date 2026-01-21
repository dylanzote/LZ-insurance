import { mockPolicies } from './mocks/policies';

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

