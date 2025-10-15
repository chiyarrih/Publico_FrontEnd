import { getProjectMilestoneAsAgency } from "@agency/services/milestoneService";
import { useEffect, useState } from "react";

export default function useMilestone(){
    const [milestone, setMilestone] = useState<any[]>([])

    const fetchMilestones = async () => {
        const data = await getProjectMilestoneAsAgency();
        setMilestone(data);
    }
    useEffect(()=>{
        fetchMilestones()
    }, [milestone])

    return {
        milestone
    }
}