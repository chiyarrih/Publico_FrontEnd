import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getDashboardAlerts,
  getMonthlySpending,
  getBudgetByCategory,
  getKeyProjects,
  fetchLedger,
  fetchProjectsProposed,
} from "../data/dashboardService";

type Status = "idle" | "loading" | "success" | "error";

export function useCitizenDashboard() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const [alerts, setAlerts] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any>({ items: [], total: 0 });

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const [a, m, c, p, l] = await Promise.all([
        getDashboardAlerts(),         // /agency/alerts
        getMonthlySpending(),         // /agency/analytics/monthly
        getBudgetByCategory(),        // /agency/analytics/categories
        getKeyProjects(5),            // /agency/projects/:id?page=1&limit=5
        fetchLedger(1, 5),            // /api/ledgers/:id?page=1&limit=5
      ]);

      setAlerts(a || []);
      setMonthly(m || []);
      setCategories(c || []);
      setProjects(p?.items || p || []); // accept either shape
      setLedger(l || { items: [], total: 0 });

      setStatus("success");
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load dashboard");
      setStatus("error");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const loading = status === "loading";
  return useMemo(
    () => ({ loading, status, error, alerts, monthly, categories, projects, ledger, reload: load }),
    [loading, status, error, alerts, monthly, categories, projects, ledger, load]
  );
}
