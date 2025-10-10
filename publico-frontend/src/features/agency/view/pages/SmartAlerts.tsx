import React from "react";

type State = "Unresolved" | "Pending" | "Under review" | "Resolved";
const alerts = [
  { title: "Budget Overrun", meta: "Downtown Bridge Repair Project is 8% over budget", state: "Unresolved" as State, date: "2023-09-15", dept: "Transportation" },
  { title: "Pending Disbursement", meta: "Q4 infrastructure funds awaiting approval", state: "Pending" as State, date: "2023-09-14", dept: "Infrastructure" },
  { title: "Document Expiration", meta: "Contract #TR-2023-45 expires in 14 days", state: "Under review" as State, date: "2023-09-10", dept: "Transportation" },
  { title: "Spending Pattern Anomaly", meta: "IT spending increased by 22% this month", state: "Under review" as State, date: "2023-09-08", dept: "IT" },
  { title: "Project Delay", meta: "City Park Renovation behind schedule by 3 weeks", state: "Unresolved" as State, date: "2023-09-05", dept: "Parks & Recreation" },
  { title: "Price Discrepancy", meta: "Purchase exceeds market rate by 15%", state: "Under review" as State, date: "2023-09-03", dept: "IT" },
];

const Chip: React.FC<{ s: State }> = ({ s }) => {
  const map: Record<State, string> = {
    Unresolved: "bg-rose-100 text-rose-700",
    Pending: "bg-amber-100 text-amber-700",
    "Under review": "bg-blue-100 text-blue-700",
    Resolved: "bg-emerald-100 text-emerald-700",
  };
  return <span className={`text-xs px-2 py-0.5 rounded ${map[s]}`}>{s}</span>;
};

export default function SmartAlerts() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Smart Contract Alerts</div>
          <div className="text-xs text-slate-500">Last updated: <b>Just now</b></div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <select className="h-9 rounded border border-slate-300 px-2 text-sm"><option>All Types</option></select>
          <select className="h-9 rounded border border-slate-300 px-2 text-sm"><option>All Severities</option></select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg divide-y">
        {alerts.map((a,i)=>(
          <div key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{a.title}</div>
              <Chip s={a.state}/>
            </div>
            <div className="text-sm text-slate-600 mt-1">{a.meta}</div>
            <div className="text-xs text-slate-500 mt-1">{a.date} • {a.dept}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
