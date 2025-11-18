import { useState, useEffect } from 'react';
import { DashboardStats, RecentActivity } from '../types';
import { dashboardAPI } from '@/services/api/endpoints';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getSummary();
      setStats(response.data);
      setRecentActivity(response.data.recentActivity || []);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    recentActivity,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};