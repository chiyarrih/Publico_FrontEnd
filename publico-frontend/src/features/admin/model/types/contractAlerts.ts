export type ContractAlert = {
    id: string;
    alertType: string;
    severity: string;
    description: string;
    relatedAdmin: string;
    timestamp: string;
    resolved: boolean;
}