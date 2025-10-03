export interface BudgetFormProps{
    projectName: string,
    category: string,
    department:string
    amountRequested:string,
    endDate: string,
    startDate:string
    objectives?: string; 
    files?: File[];
}

