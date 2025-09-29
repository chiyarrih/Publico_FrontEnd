import React from "react";
import type { Kpi } from "../../../agency/hooks/useAgencyDashboard";

const KpiRow: React.FC<{ items: Kpi[] }> = ({ items }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {items.map((k, i) => (
      <div key={i} className="card p-3">
        <div className="text-[12px] text-slate-500">{k.label}</div>
        <div className="mt-1 text-lg font-semibold text-slate-900">{k.value}</div>
        {k.delta && (
          <div className={`text-xs ${k.up ? "text-emerald-600" : "text-rose-600"}`}>{k.delta}</div>
        )}
      </div>
    ))}
  </div>
);
export default KpiRow;
