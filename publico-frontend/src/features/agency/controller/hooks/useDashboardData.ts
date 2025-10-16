import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/dashboardService';
import type { Milestone, BudgetRequest } from '../../model/types/dashboard';

interface DashboardData {
  activeProjectsCount: number;
  pendingApprovalsCount: number;
  approvedMilestones: Milestone[];
  pendingRequests: BudgetRequest[];
  isLoading: boolean;
  error: string | null;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    activeProjectsCount: 0,
    pendingApprovalsCount: 0,
    approvedMilestones: [],
    pendingRequests: [],
    isLoading: true,
    error: null,
  });

  const fetchData = async () => {
    try {
      setData((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const stats = await getDashboardStats();
      
      setData({
        activeProjectsCount: stats.activeProjectsCount,
        pendingApprovalsCount: stats.pendingApprovalsCount,
        approvedMilestones: stats.approvedMilestones,
        pendingRequests: stats.pendingRequests,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error in useDashboardData:', error);
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load dashboard data',
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    ...data,
    refresh: fetchData,
  };
};
