export interface BudgetFormProps{
    projectName: string,
    category: string,
    department:string
    amountRequested:string,
    endDate: string,
    startDate:string
    objectives: string; 
    files?: File[];
}

export interface Doc  {
  name: string; dept: string; cat: string; date: string; size: string; status: "Verified" | "Pending";
};