import { getProjectMilestoneAsAgency } from "@agency/services/milestoneService";
import { useEffect, useState } from "react";

export default function useMilestone(){
    const [milestone, setMilestone] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchMilestones = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getProjectMilestoneAsAgency();
            if (data && Array.isArray(data)) {
                setMilestone(data);
            } else {
                setMilestone([]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch milestones');
            setMilestone([]);
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchMilestones()
    }, []) // Remove milestone from dependency array to prevent infinite loop

    return {
        milestone,
        loading,
        error,
        refetch: fetchMilestones
    }
}