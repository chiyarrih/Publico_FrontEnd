import { useMemo, useState, useEffect } from "react";
import { useDashboardData } from "./useDashboardData";
import useMilestone from "./useMilestone";

export type Alert = { color: string; icon: string; title: string; desc: string; date: string };
export type Kpi = { label: string; value: string | number; delta?: string; up?: boolean };
export type SpendPoint = { m: string; actual: number; budget: number };
export type PieSlice = { name: string; value: number; color: string };
export type Project = { name: string; dept: string; pct: number; color: string; budget?: string; spent?: string };

export function useAgencyDashboard() {
  const [tab, setTab] = useState<"budget" | "proposal">("budget");
  const dashboardData = useDashboardData();
  const { milestone } = useMilestone();
  const milestones = milestone || [];
  
  // Calculate real KPIs from milestone data
  const [annualBudget, setAnnualBudget] = useState("₱0");
  const [monthlySpending, setMonthlySpending] = useState<SpendPoint[]>([]);
  const [statusPie, setStatusPie] = useState<PieSlice[]>([]);
  
  useEffect(() => {
    if (!milestones || !Array.isArray(milestones) || milestones.length === 0) {
      setAnnualBudget("₱0");
      setMonthlySpending([]);
      setStatusPie([]);
      return;
    }
    
    // Calculate annual budget from milestones
    const totalBudget = milestones.reduce((sum, m) => {
      if (!m || !m.totalBudget) return sum;
      return sum + (m.totalBudget || 0);
    }, 0);
    setAnnualBudget(`₱${(totalBudget / 1000000).toFixed(1)}M`);
    
    // Calculate monthly spending from milestones
    const monthly = [
      { m: "Jan", actual: 0, budget: 0 }, { m: "Feb", actual: 0, budget: 0 },
      { m: "Mar", actual: 0, budget: 0 }, { m: "Apr", actual: 0, budget: 0 },
      { m: "May", actual: 0, budget: 0 }, { m: "Jun", actual: 0, budget: 0 },
      { m: "Jul", actual: 0, budget: 0 }, { m: "Aug", actual: 0, budget: 0 },
    ];
    milestones.forEach(m => {
      if (!m || !m.startDate) return;
      const startMonth = new Date(m.startDate).getMonth();
      const avgMonthly = (m.totalBudget || 0) / 8; // Distribute across 8 months
      const currentMonth = new Date().getMonth();
      
      monthly.slice(startMonth, currentMonth + 1).forEach((month, idx) => {
        month.budget += avgMonthly / 1000;
        month.actual += (avgMonthly * 0.85) / 1000; // 85% spent
      });
    });
    setMonthlySpending(monthly);
    
    // Calculate status pie from milestones
    const statusCounts = {
      "On Track": 0,
      "Delayed": 0,
      "At Risk": 0,
      "Completed": 0
    };
    milestones.forEach(m => {
      if (!m) return;
      // Get progress from milestone data
      const progress = m.overallProgress !== undefined && m.overallProgress !== null 
        ? m.overallProgress 
        : 0;
      
      if (m.overallStatus === "Completed") statusCounts.Completed++;
      else if (m.overallStatus === "Delayed") statusCounts.Delayed++;
      else if (progress < 50 && progress > 0) statusCounts["At Risk"]++;
      else if (progress >= 50) statusCounts["On Track"]++;
    });
    
    const total = milestones.length || 1;
    setStatusPie([
      { name: "On Track", value: Math.round((statusCounts["On Track"] / total) * 100), color: "#3b82f6" },
      { name: "Delayed", value: Math.round((statusCounts.Delayed / total) * 100), color: "#ef4444" },
      { name: "At Risk", value: Math.round((statusCounts["At Risk"] / total) * 100), color: "#f59e0b" },
      { name: "Completed", value: Math.round((statusCounts.Completed / total) * 100), color: "#22c55e" },
    ]);
  }, [milestones]);

  // Generate real alerts from milestone data
  const alerts: Alert[] = useMemo(() => {
    if (!milestones || !Array.isArray(milestones)) return [];
    
    const alertList: Alert[] = [];
    
    milestones.forEach(m => {
      if (!m) return;
      const spent = m.phases?.reduce((sum: number, p: any) => {
        if (!p || !p.spent) return sum;
        return sum + (p.spent || 0);
      }, 0) || 0;
      const budget = m.totalBudget || 0;
      const progress = m.overallProgress || 0;
      const status = m.overallStatus || 'Pending';
      
      // Check for budget overruns
      if (budget > 0 && spent > budget) {
        const overrunPercent = Math.round(((spent - budget) / budget) * 100);
        alertList.push({
          color: "bg-rose-50",
          icon: "⚠️",
          title: "Budget Overrun",
          desc: `${m.projectName || 'Project'} is ${overrunPercent}% over budget`,
          date: new Date(m.startDate || Date.now()).toISOString().split('T')[0]
        });
      }
      
      // Check for delayed projects
      if (status === 'Delayed') {
        alertList.push({
          color: "bg-amber-50",
          icon: "🕒",
          title: "Project Delayed",
          desc: `${m.projectName || 'Project'} is behind schedule`,
          date: new Date(m.endDate || Date.now()).toISOString().split('T')[0]
        });
      }
      
      // Check for projects at risk (low progress but should be advanced)
      if (progress < 50 && status !== 'Completed') {
        const monthsSinceStart = Math.floor((Date.now() - new Date(m.startDate || Date.now()).getTime()) / (1000 * 60 * 60 * 24 * 30));
        if (monthsSinceStart >= 3) {
          alertList.push({
            color: "bg-yellow-50",
            icon: "⚠️",
            title: "Project At Risk",
            desc: `${m.projectName || 'Project'} is ${progress}% complete but overdue`,
            date: new Date(m.startDate || Date.now()).toISOString().split('T')[0]
          });
        }
      }
    });
    
    // Limit to top 3 most critical alerts
    return alertList.slice(0, 3);
  }, [milestones]);

  // Calculate monthly allocation from annual budget
  const totalBudget = milestones.reduce((sum, m) => sum + (m.totalBudget || 0), 0);
  const monthlyBudget = totalBudget > 0 ? totalBudget / 12 : 0;
  
  const kpis: Kpi[] = useMemo(() => [
    { label: "Annual Budget",        value: annualBudget },
    { label: "Monthly Allocation",   value: `₱${(monthlyBudget / 1000).toFixed(1)}K`, delta: undefined, up: false },
    { label: "Active Projects",      value: dashboardData.activeProjectsCount },
    { label: "Pending Approvals",    value: dashboardData.pendingApprovalsCount },
  ], [annualBudget, monthlyBudget, dashboardData]);

  const spendingSeries: SpendPoint[] = monthlySpending.length > 0 ? monthlySpending : [
    { m: "Jan", actual: 1200, budget: 1400 }, { m: "Feb", actual: 1350, budget: 1380 },
    { m: "Mar", actual: 1100, budget: 1420 }, { m: "Apr", actual: 1550, budget: 1460 },
    { m: "May", actual: 1260, budget: 1490 }, { m: "Jun", actual: 1380, budget: 1500 },
    { m: "Jul", actual: 1500, budget: 1520 }, { m: "Aug", actual: 1220, budget: 1530 },
  ];

  const projects: Project[] = useMemo(() => {
    if (!milestones || !Array.isArray(milestones)) return [];
    return milestones.slice(0, 4).map(m => {
      if (!m) return null;
      const spent = m.phases?.reduce((sum: number, p: any) => {
        if (!p || !p.spent) return sum;
        return sum + (p.spent || 0);
      }, 0) || 0;
      const budget = m.totalBudget || 0;
      // Use overallProgress if it exists, otherwise calculate from spent/budget
      const pct = (m.overallProgress !== undefined && m.overallProgress !== null) 
        ? m.overallProgress 
        : (budget > 0 ? Math.round((spent / budget) * 100) : 0);
      
      return {
        name: m.projectName || 'Unknown Project',
        dept: m.department || "N/A",
        pct,
        color: pct >= 80 ? "#22c55e" : pct >= 50 ? "#3b82f6" : "#f59e0b",
        budget: `₱${(budget / 1000000).toFixed(1)}M`,
        spent: `₱${(spent / 1000000).toFixed(1)}M`
      };
    }).filter(p => p !== null) as Project[];
  }, [milestones]);

  const submitBudget = (payload: any) => {
    console.log("Budget submitted:", payload);
    alert("Budget submitted (demo) ✅");
  };

  return useMemo(() => ({
    alerts, 
    kpis, 
    spendingSeries, 
    statusPie, 
    projects, 
    tab,
    switchTab: (t: "budget" | "proposal") => setTab(t),
    submitBudget,
    dashboardData,
  }), [tab, dashboardData, kpis, spendingSeries, statusPie, projects, alerts]);
}
