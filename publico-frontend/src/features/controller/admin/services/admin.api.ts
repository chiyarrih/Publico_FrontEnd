import { apiClient } from '../../../../config/api';
import { User } from '../../../../shared/types/auth';
import type { BudgetRequest, TxnRow, AlertRow } from "../../../model/admin/types/admin";

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
        {label:"Jan",allocated:100,used:80},
        {label:"Feb",allocated:120,used:100},
        {label:"Mar",allocated:130,used:110},
        {label:"Apr",allocated:150,used:120},
        {label:"May",allocated:170,used:160},
        {label:"Jun",allocated:170,used:165},
        {label:"Jul",allocated:170,used:168},
      ],
      categories:[
        {name:"Infrastructure",value:35,color:"#0ea5e9"},
        {name:"Health",value:25,color:"#22c55e"},
        {name:"Education",value:20,color:"#f59e0b"},
        {name:"Agriculture",value:10,color:"#ef4444"},
        {name:"Others",value:10,color:"#64748b"},
      ],
      depts:[
        {dept:"Public Works",allocated:95,used:80},
        {dept:"Health",allocated:80,used:72},
        {dept:"Education",allocated:75,used:66},
        {dept:"Tourism",allocated:55,used:38},
        {dept:"Agriculture",allocated:45,used:35},
        {dept:"Trade",allocated:40,used:30},
      ]
    };
  },

  async getBudgetRequests():Promise<BudgetRequest[]>{
    return [
      { id:"PRJ-2023-0125", date:"2023-05-15", dept:"Public Works", project:"Road Rehabilitation - Perez Blvd", amount:2_500_000, status:"Pending" },
      { id:"PRJ-2023-0124", date:"2023-05-14", dept:"Health", project:"Medical Equipment Procurement", amount:1_800_000, status:"Approved" },
      { id:"PRJ-2023-0123", date:"2023-05-13", dept:"Education", project:"School Building Repair", amount:3_200_000, status:"Reviewed" },
      { id:"PRJ-2023-0122", date:"2023-05-12", dept:"Agriculture", project:"Irrigation System Upgrade", amount:1_500_000, status:"Rejected" },
      { id:"PRJ-2023-0121", date:"2023-05-11", dept:"Tourism", project:"Bangus Festival Preparation", amount:950_000, status:"Pending" },
      { id:"PRJ-2023-0120", date:"2023-05-10", dept:"Public Works", project:"Drainage System Improvement", amount:4_200_000, status:"Reviewed" },
      { id:"PRJ-2023-0119", date:"2023-05-09", dept:"Health", project:"COVID Response Supplies", amount:1_200_000, status:"Approved" },
      { id:"PRJ-2023-0118", date:"2023-05-08", dept:"Education", project:"Digital Learning Equipment", amount:2_800_000, status:"Pending" },
    ];
  },

  async getTransactions():Promise<TxnRow[]>{
    return [
      { id:"TX-78945", date:"2023-05-15", dept:"Public Works", project:"Road Rehabilitation", amount:500_000, status:"Completed", hash:"0x7a8b9c6d1e2f" },
      { id:"TX-78946", date:"2023-05-14", dept:"Health", project:"Medical Equipment", amount:350_000, status:"Completed", hash:"0x3e4f5a6b7c8d" },
      { id:"TX-78947", date:"2023-05-13", dept:"Education", project:"School Repairs", amount:420_000, status:"Pending", hash:"0x9a8b7c6d5e4f" },
      { id:"TX-78948", date:"2023-05-12", dept:"Agriculture", project:"Irrigation System", amount:280_000, status:"Completed", hash:"0x1a2b3c4d5e6f" },
      { id:"TX-78949", date:"2023-05-11", dept:"Tourism", project:"Festival Preparation", amount:150_000, status:"Failed", hash:"0xf1e2d3c4b5a6" },
      { id:"TX-78950", date:"2023-05-10", dept:"Public Works", project:"Drainage System", amount:620_000, status:"Completed", hash:"0x6a5b4c3d2e1f" },
      { id:"TX-78951", date:"2023-05-09", dept:"Health", project:"COVID Supplies", amount:280_000, status:"Completed", hash:"0x5e4d3c2b1a0f" },
      { id:"TX-78952", date:"2023-05-08", dept:"Education", project:"Digital Equipment", amount:490_000, status:"Pending", hash:"0x0a1b2c3d4e5f" },
      { id:"TX-78953", date:"2023-05-07", dept:"Agriculture", project:"Farmer Support", amount:320_000, status:"Completed", hash:"0xf5e4d3c2b1a0" },
      { id:"TX-78954", date:"2023-05-06", dept:"Tourism", project:"Marketing Campaign", amount:180_000, status:"Completed", hash:"0xa9b8c7d6e5f4" },
    ];
  },

  async getAlerts():Promise<AlertRow[]>{
    return [
      { id:"AL-01", title:"Budget Overrun Detected", date:"2023-05-15", severity:"High", status:"Open",
        description:"Public Works Department has exceeded their quarterly allocation by 15%" },
      { id:"AL-02", title:"Fund Release Delay", date:"2023-05-14", severity:"Medium", status:"Open",
        description:"Funds for School Building Repair project have been delayed by 7 days" },
      { id:"AL-03", title:"Project Completed", date:"2023-05-13", severity:"Low", status:"Open",
        description:"Medical Equipment Procurement project has been successfully completed" },
      { id:"AL-04", title:"Unauthorized Expense", date:"2023-05-12", severity:"High", status:"Open",
        description:"An unauthorized expense of ₱120,000 was detected in Tourism Department" },
      { id:"AL-05", title:"Approval Process Delayed", date:"2023-05-11", severity:"Medium", status:"Open",
        description:"Irrigation System Upgrade project approval is pending for over 14 days" },
    ];
  }
};
