import React from "react";
import { Card, LineMini, PieMini, BarMini, Badge, Button } from "../ui/blocks";
import { useAdminDashboard } from "../../controller/hooks/useAdminDashboard";
import { peso } from "../ui/blocks";

export default function Dashboard(){
  const {loading,data}=useAdminDashboard();
  if(loading) return null;

  const { totals, utilizationSeries, categories, depts } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Dagupan City Admin Panel</h1>
        <Button>Generate Report</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card><div className="text-sm text-slate-500">Total Budget for YR</div><div className="mt-1 text-xl font-semibold">{peso(totals.budget)}</div><div className="text-xs text-slate-400">+10% from previous year</div></Card>
        <Card><div className="text-sm text-slate-500">Budget Utilization</div><div className="mt-1 text-xl font-semibold">{totals.utilizationPct}%</div><div className="text-xs text-slate-400">↑ 5.3% from prev.</div></Card>
        <Card><div className="text-sm text-slate-500">Pending Requests</div><div className="mt-1 text-xl font-semibold">{totals.pending}</div><div className="text-xs text-slate-400">3 urgent</div></Card>
        <Card><div className="text-sm text-slate-500">Active Alerts</div><div className="mt-1 text-xl font-semibold">{totals.activeAlerts}</div><div className="text-xs text-slate-400">5 critical</div></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card><div className="mb-2 text-sm font-medium text-slate-700">Budget Utilization Trends</div><LineMini data={utilizationSeries}/></Card>
        <Card><div className="mb-2 text-sm font-medium text-slate-700">Budget Allocation by Category</div><PieMini data={categories}/></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card><div className="mb-2 text-sm font-medium text-slate-700">Department Budget Comparison</div><BarMini data={depts}/></Card>
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-700">Active Projects by Barangay</div>
            <Badge tone="blue">Live</Badge>
          </div>
          <div className="aspect-video w-full rounded-lg border bg-[url('https://tile.openstreetmap.org/5/29/17.png')] bg-cover bg-center" />
          <ul className="mt-3 space-y-1 text-sm">
            <li className="flex items-center justify-between rounded-lg border px-3 py-2"><span>Road Rehabilitation • Bonuan Gueset</span><Badge tone="blue">In Progress</Badge></li>
            <li className="flex items-center justify-between rounded-lg border px-3 py-2"><span>Drainage • Lucao</span><Badge tone="blue">In Progress</Badge></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
