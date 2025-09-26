import type { BudgetRequest, TxnRow, AlertRow } from "../types/admin";

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
