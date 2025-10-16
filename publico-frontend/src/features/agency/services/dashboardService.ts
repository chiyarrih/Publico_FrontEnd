import { apiClient } from '../../../config/api';
import type { Milestone, BudgetRequest, DashboardStats } from '../model/types/dashboard';

export const getApprovedMilestones = async (): Promise<Milestone[]> => {
  try {
    const token = localStorage.getItem('publico_auth_token');
    const user = localStorage.getItem('publico_user_data');
    
    if (!token || !user) throw new Error('Authentication required');
    
    const userData = JSON.parse(user);
    const agencyId = userData.user.user_id;
    
    const response = await fetch(
      `http://localhost:5000/milestone/agency/projects/${agencyId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch approved milestones');
    }

    const data = await response.json();
    
    // Filter for approved/in-progress milestones
    return data.filter(
      (m: Milestone) => 
        m.overallStatus === 'In Progress' || 
        m.overallStatus === 'Planning'
    );
  } catch (error) {
    console.error('Error fetching approved milestones:', error);
    return [];
  }
};

export const getPendingBudgetRequests = async (): Promise<BudgetRequest[]> => {
  try {
    const token = localStorage.getItem('publico_auth_token');
    const user = localStorage.getItem('publico_user_data');
    
    if (!token || !user) throw new Error('Authentication required');
    
    const userData = JSON.parse(user);
    const agencyId = userData.user.user_id;
    
    const response = await fetch(
      `http://localhost:5000/agency/projects/${agencyId}?status=Pending`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pending budget requests');
    }

    const data = await response.json();
    
    // Return only pending requests
    return data.data?.filter((req: BudgetRequest) => req.status === 'Pending') || [];
  } catch (error) {
    console.error('Error fetching pending budget requests:', error);
    return [];
  }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [approvedMilestones, pendingRequests] = await Promise.all([
      getApprovedMilestones(),
      getPendingBudgetRequests(),
    ]);

    return {
      activeProjectsCount: approvedMilestones.length,
      pendingApprovalsCount: pendingRequests.length,
      approvedMilestones,
      pendingRequests,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      activeProjectsCount: 0,
      pendingApprovalsCount: 0,
      approvedMilestones: [],
      pendingRequests: [],
    };
  }
};
