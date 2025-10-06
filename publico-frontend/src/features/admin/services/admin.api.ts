import { apiClient } from '../../../config/api';
import { User, Admin } from '../../../shared/types/auth';
import type { BudgetRequest, TxnRow, AlertRow, BudgetProposal } from "../model/types/admin";

export class AdminService {
  // Get all citizens
  static async getAllCitizens(): Promise<{ citizens: User[] }> {
    return apiClient.get<{ citizens: User[] }>('/auth/getAll');
  }

  // Get crypto balance
  static async getCryptoBalance(address: string): Promise<{
    address: string;
    balanceWei: string;
    balanceEth: string;
  }> {
    return apiClient.get(`/balance/${address}`);
  }

  // Get all budget proposals for admin
  static async getAllBudgetProposals(
    page: number = 1, 
    limit: number = 10, 
    status?: string
  ): Promise<{
    data: BudgetProposal[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    const statusParam = status && status !== 'All' ? `&status=${status}` : '';
    return apiClient.get(`/agency/projects/all?page=${page}&limit=${limit}${statusParam}`);
  }

  // Get all budget projects (for milestone creation)
  static async getBudgetProjects(): Promise<BudgetProposal[]> {
    const response = await apiClient.get<{ data: BudgetProposal[] }>('/agency/projects/all');
    return response.data || [];
  }
  
  // Delete budget proposal
  static async deleteBudgetProposal(id: string): Promise<{ message: string }> {
    return apiClient.delete(`/agency/projects/${id}`);
  }

  // Approve budget proposal
  static async approveBudgetProposal(id: string): Promise<{ message: string; proposal: BudgetProposal }> {
    return apiClient.put(`/agency/projects/${id}/approve`);
  }

  // Reject budget proposal
  static async rejectBudgetProposal(id: string, reason?: string): Promise<{ message: string }> {
    return apiClient.put(`/agency/projects/${id}/reject`, reason ? { reason } : undefined);
  }

  // Get single budget proposal
  static async getBudgetProposal(id: string): Promise<BudgetProposal> {
    return apiClient.get(`/agency/projects/${id}`);
  }

  // Admin Profile Management
  // Get admin profile by email
  static async getAdminProfile(email: string): Promise<Admin> {
    return apiClient.get<Admin>(`/admin/auth/management/fetch/${email}`);
  }

  // Get admin profile by ID
  static async getAdminProfileById(userId: string): Promise<Admin> {
    return apiClient.get<Admin>(`/auth/profile/${userId}`);
  }

  // Update admin profile
  static async updateAdminProfile(userId: string, data: Partial<Admin>): Promise<Admin> {
    return apiClient.put<Admin>(`/auth/profile/${userId}`, data);
  }

  // Change admin password
  static async changeAdminPassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/auth/changePassword/${userId}`, {
      currentPassword,
      newPassword
    });
  }
}

// Keep legacy api object for backward compatibility
export const api = {
  async getDashboard(){
    return {
      totals:{ budget:120_500_000, utilizationPct:78, pending:14, activeAlerts:5 },
      utilizationSeries:[
        {label:"Jan",allocated:400,used:320},
        {label:"Feb",allocated:400,used:360},
        {label:"Mar",allocated:400,used:390},
        {label:"Apr",allocated:450,used:410},
        {label:"May",allocated:500,used:460},
        {label:"Jun",allocated:550,used:520},
        {label:"Jul",allocated:600,used:550},
        {label:"Aug",allocated:620,used:590},
        {label:"Sep",allocated:660,used:630},
      ],
      categories:[
        {name:"Infrastructure",value:35,color:"#0ea5e9"},
        {name:"Health",value:25,color:"#10b981"},
        {name:"Education",value:20,color:"#f59e0b"},
        {name:"Agriculture",value:10,color:"#f97316"},
        {name:"Others",value:10,color:"#8b5cf6"},
      ],
      depts:[
        {dept:"Public Works",allocated:4200,used:3050},
        {dept:"Health",allocated:3000,used:2800},
        {dept:"Education",allocated:2800,used:2350},
        {dept:"Agriculture",allocated:2000,used:1400},
        {dept:"Tourism",allocated:1500,used:1000},
      ]
    };
  },

  async getBudgetRequests():Promise<BudgetRequest[]>{
    return [
      { id:"PRJ-2023-0125", date:"2023-05-15", dept:"Public Works", project:"Road Rehabilitation - Perez Blvd", amount:2_500_000, status:"Pending" },
      { id:"PRJ-2023-0124", date:"2023-05-14", dept:"Health",       project:"Medical Equipment Procurement",    amount:1_800_000, status:"Approved" },
      { id:"PRJ-2023-0123", date:"2023-05-13", dept:"Education",    project:"School Building Repair",           amount:3_200_000, status:"Reviewed" },
      { id:"PRJ-2023-0122", date:"2023-05-12", dept:"Agriculture",  project:"Irrigation System Upgrade",        amount:1_500_000, status:"Rejected" },
      { id:"PRJ-2023-0121", date:"2023-05-11", dept:"Tourism",      project:"Bangus Festival Preparation",      amount:950_000,   status:"Pending" },
      { id:"PRJ-2023-0120", date:"2023-05-10", dept:"Public Works", project:"Drainage System Improvement",      amount:4_200_000, status:"Reviewed" },
      { id:"PRJ-2023-0119", date:"2023-05-09", dept:"Health",       project:"COVID Response Supplies",          amount:1_200_000, status:"Approved" },
      { id:"PRJ-2023-0118", date:"2023-05-08", dept:"Education",    project:"Digital Learning Equipment",       amount:2_800_000, status:"Pending" },
    ];
  },

  async getTransactions():Promise<TxnRow[]>{
    return [
      { id:"TX-78445", date:"2023-05-15", dept:"Public Works", project:"Road Rehabilitation", amount:500_000,  status:"Completed", hash:"ce41d…eaf7" },
      { id:"TX-78447", date:"2023-05-14", dept:"Health",       project:"Medical Equipment",  amount:1_300_000, status:"Completed", hash:"c01bd…1aaf" },
      { id:"TX-78448", date:"2023-05-13", dept:"Education",    project:"School Repairs",     amount:800_000,   status:"Pending",   hash:"a9db2…cc91" },
      { id:"TX-78452", date:"2023-05-11", dept:"Tourism",      project:"Marketing",          amount:150_000,   status:"Failed",    hash:"f3a77…912c" },
    ];
  },

  async getAlerts():Promise<AlertRow[]>{
    return [
      { id:"AL-01", title:"Budget Overrun Detected", date:"2023-05-15", severity:"High",   status:"Open",
        description:"Public Works has exceeded their quarterly allocation by 15%." },
      { id:"AL-02", title:"Fund Release Delay",      date:"2023-05-14", severity:"Medium", status:"Open",
        description:"Funds for School Building Repair delayed by 7 days." },
      { id:"AL-03", title:"Project Completed",       date:"2023-05-13", severity:"Low",    status:"Open",
        description:"Medical Equipment Procurement completed." },
    ];
  }
};
