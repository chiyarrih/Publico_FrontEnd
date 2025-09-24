import { useMemo, useState } from "react";

export type Alert = { color: string; icon: string; title: string; desc: string; date: string };
export type Kpi = { label: string; value: string | number; delta?: string; up?: boolean };
export type SpendPoint = { m: string; actual: number; budget: number };
export type PieSlice = { name: string; value: number; color: string };
export type Project = { name: string; dept: string; pct: number; color: string; budget?: string; spent?: string };

export function useAgencyDashboard() {
  const [tab, setTab] = useState<"budget" | "proposal">("budget");

  const alerts: Alert[] = [
    { color: "bg-rose-50",  icon: "⚠️", title: "Budget Overrun",       desc: "Bridge Repair is 8% over budget", date: "2023-09-15" },
    { color: "bg-amber-50", icon: "🕒", title: "Pending Disbursement", desc: "Q4 infra funds awaiting approval", date: "2023-09-14" },
    { color: "bg-sky-50",   icon: "📄", title: "Document Expiration",  desc: "Contract #TR-2023-45 in 14 days",  date: "2023-09-10" },
  ];

  const kpis: Kpi[] = [
    { label: "Annual Budget",        value: "₱24.5M" },
    { label: "Monthly Allocation",   value: "₱1.3M", delta: "₱150K over this month", up: false },
    { label: "Active Projects",      value: 18 },
    { label: "Pending Approvals",    value: 3 },
  ];

  const spendingSeries: SpendPoint[] = [
    { m: "Jan", actual: 1200, budget: 1400 }, { m: "Feb", actual: 1350, budget: 1380 },
    { m: "Mar", actual: 1100, budget: 1420 }, { m: "Apr", actual: 1550, budget: 1460 },
    { m: "May", actual: 1260, budget: 1490 }, { m: "Jun", actual: 1380, budget: 1500 },
    { m: "Jul", actual: 1500, budget: 1520 }, { m: "Aug", actual: 1220, budget: 1530 },
  ];

  const statusPie: PieSlice[] = [
    { name: "On Track",  value: 65, color: "#3b82f6" },
    { name: "Delayed",   value: 20, color: "#22c55e" },
    { name: "At Risk",   value: 10, color: "#f59e0b" },
    { name: "Completed", value: 5,  color: "#ef4444" },
  ];

  const projects: Project[] = [
    { name: "City Park Renovation",     dept: "Parks & Recreation", pct: 65, color: "#3b82f6", budget: "₱1.2M", spent: "₱780K" },
    { name: "Public Library Expansion", dept: "Education",          pct: 30, color: "#f59e0b", budget: "₱3.5M", spent: "₱1.05M" },
    { name: "Road Infrastructure Repair", dept: "Transportation",   pct: 90, color: "#22c55e", budget: "₱6.8M", spent: "₱5.2M" },
    { name: "Water Treatment Facility", dept: "Utilities",          pct: 10, color: "#94a3b8", budget: "₱3.1M", spent: "₱310K" },
  ];

  const submitBudget = (payload: any) => {
    console.log("Budget submitted:", payload);
    alert("Budget submitted (demo) ✅");
  };

  return useMemo(() => ({
    alerts, kpis, spendingSeries, statusPie, projects, tab,
    switchTab: (t: "budget" | "proposal") => setTab(t),
    submitBudget,
  }), [tab]);
}
