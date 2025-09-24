import React from "react";
import { Card, AlertsList } from "../ui";
import { useAgencyDashboard } from "../hooks/useAgencyDashboard";

export default function SmartAlerts() {
  const { alerts } = useAgencyDashboard();
  return (
    <div className="space-y-4">
      <Card title="Filters">
        <div className="flex flex-wrap gap-2">
          <select className="h-8 rounded border border-slate-300 px-2 text-sm"><option>All severities</option><option>High</option><option>Medium</option><option>Low</option></select>
          <select className="h-8 rounded border border-slate-300 px-2 text-sm"><option>All types</option><option>Budget</option><option>Disbursement</option><option>Document</option></select>
          <input className="h-8 rounded border border-slate-300 px-2 text-sm" placeholder="Search…" />
        </div>
      </Card>
      <AlertsList items={alerts} />
    </div>
  );
}
