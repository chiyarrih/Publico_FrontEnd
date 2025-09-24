import React, { useMemo, useState } from "react";
import { Card, Pill, statusToPill, Select } from "../../../shared/ui";

/* types + demo list kept local for clarity */
type Severity = "Low" | "Medium" | "High" | "Critical";
type Status = "Unresolved" | "Pending" | "Under review" | "Resolved";
type AlertType = "Budget" | "Disbursement" | "Document" | "Anomaly" | "Delay" | "Price" | "Amendment";
type Alert = { id: string; type: AlertType; severity: Severity; status: Status; title: string; desc: string; date: string; dept: string; category: string; };

const DATA: Alert[] = [
  { id:"a1", type:"Budget", severity:"Critical", status:"Unresolved", title:"Budget Overrun", desc:"Downtown Bridge Repair Project is 8% over budget", date:"2023-09-15", dept:"Infrastructure", category:"Transportation" },
  { id:"a2", type:"Disbursement", severity:"Medium", status:"Pending", title:"Pending Disbursement", desc:"Q4 infrastructure funds awaiting approval", date:"2023-09-14", dept:"Infrastructure", category:"Finance" },
  { id:"a3", type:"Document", severity:"Low", status:"Pending", title:"Document Expiration", desc:"Contract #TR-2023-45 expires in 14 days", date:"2023-09-10", dept:"Transportation", category:"Legal" },
  { id:"a4", type:"Anomaly", severity:"High", status:"Under review", title:"Spending Pattern Anomaly", desc:"IT Department spending increased by 23% this month", date:"2023-09-08", dept:"IT", category:"Audit" },
  { id:"a5", type:"Delay", severity:"Medium", status:"Unresolved", title:"Project Delay", desc:"City Park Renovation behind schedule by 3 weeks", date:"2023-09-06", dept:"Parks & Recreation", category:"Schedule" },
  { id:"a6", type:"Price", severity:"High", status:"Under review", title:"Price Discrepancy", desc:"IT Infrastructure purchase exceeds market rate by 15%", date:"2023-09-05", dept:"IT", category:"Procurement" },
  { id:"a7", type:"Amendment", severity:"Low", status:"Resolved", title:"Budget Amendment Approved", desc:"Additional $250,000 allocated to Road Infrastructure Repair", date:"2023-09-02", dept:"Transportation", category:"Budget" },
];

const TypeIcon: React.FC<{ t: AlertType }> = ({ t }) => {
  const color = t==="Budget"||t==="Price" ? "text-rose-500" : t==="Document" ? "text-sky-500" : "text-amber-500";
  return <span className={`text-lg ${color}`}>●</span>;
};

export default function Alerts() {
  const [type, setType] = useState<AlertType | "All Types">("All Types");
  const [sev, setSev] = useState<Severity | "All Severities">("All Severities");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(
    () => DATA.filter(a => (type==="All Types"||a.type===type) && (sev==="All Severities"||a.severity===sev)),
    [type, sev]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Smart Contract Alerts</h1>
        <div className="text-xs text-slate-500">Last updated: <span className="font-medium">Just now</span></div>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="text-[12px] text-slate-600">Alert Type</div>
          <Select value={type} onChange={(e)=>setType(e.target.value as any)} className="w-40">
            {["All Types","Budget","Disbursement","Document","Anomaly","Delay","Price","Amendment"].map(t => <option key={t}>{t}</option>)}
          </Select>
          <div className="text-[12px] text-slate-600 sm:ml-4">Severity</div>
          <Select value={sev} onChange={(e)=>setSev(e.target.value as any)} className="w-44">
            {["All Severities","Low","Medium","High","Critical"].map(s => <option key={s}>{s}</option>)}
          </Select>
        </div>
      </Card>

      <div className="space-y-3">
        {list.map(a => (
          <Card key={a.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <TypeIcon t={a.type} />
                <div>
                  <div className="font-medium text-slate-900">{a.title}</div>
                  <div className="mt-1 text-[12px] text-slate-600">{a.desc}</div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{a.date}</span><span>•</span><span>{a.dept}</span><span>•</span><span>{a.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {statusToPill(a.status)}
                <button
                  onClick={() => setOpen(p => (p === a.id ? null : a.id))}
                  className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
                >
                  {open === a.id ? "▴" : "▾"}
                </button>
              </div>
            </div>

            {open === a.id && (
              <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                <div><span className="font-medium">Severity:</span> {a.severity}</div>
                <div><span className="font-medium">Department:</span> {a.dept}</div>
                <div><span className="font-medium">Category:</span> {a.category}</div>
                <div><span className="font-medium">Suggested action:</span> Review supporting documents and approvals.</div>
              </div>
            )}
          </Card>
        ))}

        {list.length === 0 && <Card>No alerts found for the selected filters.</Card>}
      </div>
    </div>
  );
}
