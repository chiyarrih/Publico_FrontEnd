export interface Milestone {
  _id: string;
  projectId: string;
  agencyId: string;
  projectName: string;
  department: string;
  totalBudget: number;
  totalBudgetEth: number;
  overallProgress: number;
  overallStatus: 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  startDate: string;
  endDate: string;
  targetDate: string;
  proposedBy: string;
  approvedBy: string;
  phases: Phase[];
  createdAt: string;
  updatedAt: string;
}

export interface Phase {
  phaseNumber: number;
  phaseName: string;
  description: string;
  targetDate: string;
  budget: number;
  budgetEth: number;
  spent: number;
  spentEth: number;
  progress: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
  budgetReleased: boolean;
  budgetReleaseDate?: string;
  budgetReleaseTxHash?: string;
  completionDate?: string;
}

export interface BudgetRequest {
  _id: string;
  agencyId: string;
  projectId: string;
  projectName: string;
  category: 'Infrastructure' | 'Education' | 'Health' | 'Other';
  department: string;
  amountRequested: number;
  timeline: string;
  fileUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  address?: string;
  isFunded: boolean;
  startDate: string;
  endDate: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  activeProjectsCount: number;
  pendingApprovalsCount: number;
  approvedMilestones: Milestone[];
  pendingRequests: BudgetRequest[];
}
