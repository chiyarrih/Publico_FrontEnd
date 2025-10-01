import { useEffect, useState } from "react";
import { api } from "../services/admin.api";

export function useAdminDashboard(){
  const [loading,setLoading]=useState(true);
  const [data,setData]=useState<any>(null);

  useEffect(()=>{ (async()=>{ setData(await api.getDashboard()); setLoading(false); })(); },[]);
  return { loading, data };
}
