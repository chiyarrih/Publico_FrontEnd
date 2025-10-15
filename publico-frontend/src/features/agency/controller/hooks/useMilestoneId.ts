import { getProjectMilestoneAsAgencyById } from "@agency/services/milestoneService";
import { useEffect, useState } from "react";

// ✅ Allow id to be undefined
export  function useMilestoneId({ id }: { id?: string }) {
  const [milestoneId, setMilestoneId] = useState<any[]>([]);

  const fetchMilestonesId = async () => {
    if (!id) return;
    const data = await getProjectMilestoneAsAgencyById({ _id: id });
    setMilestoneId(data);
  };

  useEffect(() => {
    fetchMilestonesId();
  }, [id]); // ✅ only run when id changes

  return { milestoneId };
}
