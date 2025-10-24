import { useEffect, useState } from "react";
import { getAlertsByAgency } from "../../services/alertsService";
import { ContractAlert } from "@/features/admin/model/types/contractAlerts";
;

export default function useContractAlerts() {
    const [alerts, setAlerts] = useState<ContractAlert[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContractAlerts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAlertsByAgency();
            setAlerts(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch contract alerts');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchContractAlerts();
    }, []);

    return {
        alerts,
        loading,
        error,
        refetch: fetchContractAlerts
    };
}