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
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-slate-500">Dagupan City Government Transparency Portal</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-blue-700">Last updated: Just now</span>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              {Icons.budget}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Total Budget FY 2023</p>
              <p className="text-2xl font-bold text-slate-900 mb-1">{peso(totals.budget)}</p>
              <div className="flex items-center gap-1 text-xs">
                <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-emerald-600 font-medium">+10%</span>
                <span className="text-slate-500">from previous year</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              {Icons.percent}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Budget Utilization</p>
              <p className="text-2xl font-bold text-slate-900 mb-1">{totals.utilizationPct}%</p>
              <div className="flex items-center gap-1 text-xs">
                <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-emerald-600 font-medium">+2.5%</span>
                <span className="text-slate-500">from last month</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              {Icons.clipboard}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Pending Requests</p>
              <p className="text-2xl font-bold text-slate-900 mb-1">{pendingCount}</p>
              <div className="flex items-center gap-1 text-xs">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                  3 urgent
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              {Icons.alert}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Active Alerts</p>
              <p className="text-2xl font-bold text-slate-900 mb-1">{totals.activeAlerts}</p>
              <div className="flex items-center gap-1 text-xs">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                  2 critical
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Budget Utilization Trends</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly spending vs allocation</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          <LineMini data={utilizationSeries} />
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Budget Allocation</h3>
              <p className="text-xs text-slate-500 mt-0.5">Distribution by category</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          <PieMini data={categories} />
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Department Comparison</h3>
              <p className="text-xs text-slate-500 mt-0.5">Budget allocation across departments</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          <BarMini data={depts} />
        </Card>
        <BarangayProjectsMap />
      </div>
    </div>
  );
}
