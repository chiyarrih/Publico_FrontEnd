export type RequestStatus = "Pending" | "Approved" | "Reviewed" | "Rejected";
export type TxStatus = "Completed" | "Pending" | "Failed";
export type AlertSeverity = "High" | "Medium" | "Low";

export interface BudgetRequest {
  id:string; date:string; dept:string; project:string; amount:number; status:RequestStatus;
}
export interface TxnRow {
  id:string; date:string; dept:string; project:string; amount:number; status:TxStatus; hash:string;
}
export interface AlertRow {
  id:string; title:string; date:string; severity:AlertSeverity; description:string; status:"Open"|"Resolved";
}
