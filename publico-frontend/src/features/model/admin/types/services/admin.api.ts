import { apiClient } from '../../../config/api';
import { User } from '../../../shared/types/auth';
import type { BudgetRequest, TxnRow, AlertRow } from "../../model/admin/types/admin";

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

  // Budget management endpoints would go here
  // ... other admin-specific methods
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
      { id:"PRJ-2023-0185", date:"2023-07-15", dept:"Public Works", project:"Road Rehabilitation – Perez Blvd", amount:2_500_000, status:"Pending" },
      { id:"PRJ-2023-0178", date:"2023-06-21", dept:"Health",       project:"Medical Equipment Procurement",    amount:1_200_000, status:"Approved" },
      { id:"PRJ-2023-0162", date:"2023-06-11", dept:"Education",    project:"School Building Repair",           amount:900_000,   status:"Reviewed" },
      { id:"PRJ-2023-0152", date:"2023-05-27", dept:"Agriculture",  project:"Irrigation System Upgrade",        amount:1_800_000, status:"Pending" },
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
