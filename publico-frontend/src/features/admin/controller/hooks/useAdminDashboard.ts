import { useEffect, useState } from "react";
import { api } from "../../services/admin.api";

interface DashboardData {
  totalBudget: number;
  utilization: number;
  pendingRequests: number;
  activeAlerts: number;
  utilizationSeries?: any[];
  categories?: any[];
}

export function useAdminDashboard(){
  const [loading,setLoading]=useState(true);
  const [data,setData]=useState<DashboardData | null>(null);

  useEffect(()=>{ 
    (async()=>{ 
      try {
        setData(await api.getDashboard()); 
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setData({ 
          totalBudget: 0, 
          utilization: 0, 
          pendingRequests: 0, 
          activeAlerts: 0 
        });
      } finally {
        setLoading(false);
      }
    })(); 
  },[]);
  
  return { loading, data };
}
