import { useEffect, useState, useCallback } from "react";
import { ContractAlert } from "../../model/types/contractAlerts";
import { getAlertsByAdmin } from "../../services/contractService";

export default function useContractAlerts() {
    const [alerts, setAlerts] = useState<ContractAlert[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContractAlerts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAlertsByAdmin();
            setAlerts(Array.isArray(response) ? response : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch contract alerts');
            setAlerts([]); // Ensure alerts is always an array
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContractAlerts();
    }, [fetchContractAlerts]);

    return {
        alerts,
        loading,
        error,
        refetch: fetchContractAlerts
    };
}