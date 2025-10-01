import { apiClient } from '../../../config/api';

export interface BudgetProject {
  _id?: string;
  projectName: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: string;
}

export class AgencyService {
  // Create budget project
  static async createBudgetProject(data: Omit<BudgetProject, '_id'>): Promise<BudgetProject> {
    return apiClient.post<BudgetProject>('/', data);
  }

  // Get budget projects
  static async getBudgetProjects(): Promise<BudgetProject[]> {
    return apiClient.get<BudgetProject[]>('/');
  }

  // Get budget project by ID
  static async getBudgetProjectById(id: string): Promise<BudgetProject> {
    return apiClient.get<BudgetProject>(`/${id}`);
  }

  // Update budget project
  static async updateBudgetProject(id: string, data: Partial<BudgetProject>): Promise<BudgetProject> {
    return apiClient.put<BudgetProject>(`/${id}`, data);
  }

  // Delete budget project
  static async deleteBudgetProject(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/${id}`);
  }

  // Get crypto balance
  static async getCryptoBalance(address: string): Promise<{
    address: string;
    balanceWei: string;
    balanceEth: string;
  }> {
    return apiClient.get(`/balance/${address}`);
  }
}