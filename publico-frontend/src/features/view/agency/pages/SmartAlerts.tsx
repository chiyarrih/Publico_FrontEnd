import React from "react";
import { Card } from "../ui/blocks";
import StatusTag from "../ui/StatusTag";

type Alert = { id: string; title: string; detail: string; state: string };

const ALERTS: Alert[] = [
  { id: "s1", title: "Overspend Watch", detail: "Roadworks allocation at 90%.", state: "Under review" },
  { id: "s2", title: "Late Report", detail: "Barangay Paving weekly log missing.", state: "Unresolved" },
  { id: "s3", title: "Document Verified", detail: "Audit trail validated for Q2.", state: "Resolved" },
];

export default function SmartAlerts() {
  return (
    <Card title="Smart Alerts">
      <ul className="space-y-3">
        {ALERTS.map((a) => (
          <li key={a.id} className="flex items-start gap-3">
            <div className="min-w-24"><StatusTag value={a.state} /></div>
            <div>
              <div className="font-medium text-slate-800">{a.title}</div>
              <div className="text-sm text-slate-600">{a.detail}</div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
