export interface CoverageBreakdown {
  type: string;
  amount: number;
  policyCount: number;
}

export interface DashboardStats {
  totalPolicies: number;
  activePolicies: number;
  pendingClaims: number;
  totalCoverage: number;
  coverageBreakdown: CoverageBreakdown[];
  recentActivity?: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: 'policy' | 'claim' | 'payment';
  description: string;
  date: string;
  amount?: number;
}