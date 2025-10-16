import React from "react";
import { Card, LineMini, PieMini, BarMini, Badge, Button } from "../ui/blocks";
import { useAdminDashboard } from "../../controller/hooks/useAdminDashboard";
import { usePendingBudgetCount } from "../../controller/hooks/usePendingBudgetCount";
import { peso } from "../ui/blocks";
import { BarangayProjectsMap } from "../components/BarangayProjectsMap";

// KPI Card Icons
const KpiIcon = ({ children, bg }: { children: React.ReactNode; bg: string }) => (
  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}>
    {children}
  </div>
);

const Icons = {
  budget: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  percent: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
      <circle cx="7" cy="7" r="2" />
      <circle cx="17" cy="17" r="2" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  ),
  clipboard: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
    </svg>
  ),
  alert: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

export default function Dashboard() {
  const { loading, data } = useAdminDashboard();
  const { count: pendingCount } = usePendingBudgetCount();
  if (loading) return null;

  const { totals, utilizationSeries, categories, depts } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Dagupan City Admin Panel</h1>
        <Button>Generate Report</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-start gap-3">
            <KpiIcon bg="bg-sky-500">{Icons.budget}</KpiIcon>
            <div className="flex-1">
              <div className="text-xs font-medium text-slate-500">Total Budget for FY 2023</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{peso(totals.budget)}</div>
              <div className="mt-1 text-xs text-slate-400">+10% from previous year</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <KpiIcon bg="bg-emerald-500">{Icons.percent}</KpiIcon>
            <div className="flex-1">
              <div className="text-xs font-medium text-slate-500">Budget Utilization</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{totals.utilizationPct}%</div>
              <div className="mt-1 text-xs text-emerald-600">+2.5% from last month</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <KpiIcon bg="bg-amber-500">{Icons.clipboard}</KpiIcon>
            <div className="flex-1">
              <div className="text-xs font-medium text-slate-500">Pending Requests</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{pendingCount}</div>
              <div className="mt-1 text-xs text-slate-400">3 urgent</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <KpiIcon bg="bg-rose-500">{Icons.alert}</KpiIcon>
            <div className="flex-1">
              <div className="text-xs font-medium text-slate-500">Active Alerts</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{totals.activeAlerts}</div>
              <div className="mt-1 text-xs text-rose-600">2 critical</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 text-base font-semibold text-slate-800">Budget Utilization Trends</div>
          <LineMini data={utilizationSeries} />
        </Card>
        <Card>
          <div className="mb-3 text-base font-semibold text-slate-800">Budget Allocation by Category</div>
          <PieMini data={categories} />
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 text-base font-semibold text-slate-800">Department Budget Comparison</div>
          <BarMini data={depts} />
        </Card>
        <BarangayProjectsMap />
      </div>
    </div>
  );
}
