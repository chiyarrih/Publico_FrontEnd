import { useEffect, useState } from 'react';
import { AdminService } from '../../services/admin.api';

export function usePendingBudgetCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const c = await AdminService.getPendingBudgetCount();
        if (isMounted) setCount(c);
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to load pending count');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return { count, loading, error };
}

export default usePendingBudgetCount;

