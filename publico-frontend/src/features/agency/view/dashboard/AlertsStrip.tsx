import React from "react";
import type { Alert } from "../../controller/hooks/useAgencyDashboard";

const AlertsStrip: React.FC<{ items: Alert[] }> = ({ items }) => (
  <div className="card p-3 divide-y">
    {items.map((a, i) => {
      const Icon = a.icon;
      return (
        <div key={i} className={`flex items-start justify-between gap-3 py-2 ${i === 0 ? "pt-0" : ""}`}>
          <div className="flex items-start gap-3">
            <span className="text-lg">
              <Icon />
            </span>
          </div>
          <span className="text-[12px] text-slate-500">{a.date}</span>
        </div>
      );
    })}
  </div>
);

export default AlertsStrip;
