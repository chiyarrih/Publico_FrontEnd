export type RequestStatus = "Pending" | "Approved" | "Reviewed" | "Rejected";
export type TxStatus = "Completed" | "Pending" | "Failed";
export type AlertSeverity = "High" | "Medium" | "Low";

export interface BudgetRequest {
  id:string; date:string; dept:string; project:string; amount:number; status:RequestStatus;
}

export interface BudgetProposal {
  _id: string;
  agencyId: {
    _id: string;
    name?: string;
    email?: string;
  };
  projectId: string;
  projectName: string;
  category: string;
  department: string;
  amountRequested: number;
  timeline: string;
  fileUrl: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
  approvalDate?: string;
  blockchainTxHash?: string;
  address: string;
  privateKey: string;
  createdAt: string;
}

export interface TxnRow {
  id:string; date:string; dept:string; project:string; amount:number; status:TxStatus; hash:string;
}
export interface AlertRow {
  id:string; title:string; date:string; severity:AlertSeverity; description:string; status:"Open"|"Resolved";
}
