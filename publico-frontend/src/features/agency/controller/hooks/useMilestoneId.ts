import { getProjectMilestoneAsAgencyById } from "@agency/services/milestoneService";
import { useEffect, useState } from "react";

// ✅ Allow id to be undefined
export function useMilestoneId({ id }: { id?: string }) {
  const [milestoneId, setMilestoneId] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMilestonesId = async () => {
    if (!id) {
      setMilestoneId(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectMilestoneAsAgencyById({ _id: id });
      if (data) {
        setMilestoneId(data);
      } else {
        setMilestoneId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch milestone');
      setMilestoneId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestonesId();
  }, [id]); // ✅ only run when id changes

  return { 
    milestoneId, 
    loading, 
    error, 
    refetch: fetchMilestonesId 
  };
}
