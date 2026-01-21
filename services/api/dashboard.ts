import { mockPolicies } from './mocks/policies';
import { mockClaims } from './mocks/claims';
import { mockInvoices } from './mocks/billing';

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

