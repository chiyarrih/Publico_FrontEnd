import { useEffect, useState, useCallback } from "react";
import { ContractAlert } from "../../model/types/contractAlerts";
import { getAlertsByAdmin } from "../../services/contractService";
import { getAllAlerts } from "@/features/agency/services/alertsService";

export default function useContractAlerts() {
    const [alerts, setAlerts] = useState<ContractAlert[]>([]);
    const [alertsAll, setAlertsAll] = useState<ContractAlert[]>([]);
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

    const fetchContractAlertsAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllAlerts();
            setAlertsAll(Array.isArray(response) ? response : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch contract alerts');
            setAlertsAll([]); // Ensure alerts is always an array
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContractAlerts();
    }, [fetchContractAlerts]);

    useEffect(() => {
        fetchContractAlertsAll();
    }, [fetchContractAlertsAll]);

    return {
        alerts,
        alertsAll,
        loading,
        error,
        refetch: fetchContractAlerts
    };
}