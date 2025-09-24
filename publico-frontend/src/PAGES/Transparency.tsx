import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";

/* ---------- demo data ---------- */
const statusData = [
  { name: "Completed", value: 35, color: "#3b82f6" },
  { name: "In Progress", value: 45, color: "#22c55e" },
  { name: "Planning", value: 15, color: "#f59e0b" },
  { name: "On Hold", value: 5,  color: "#ef4444" },
];

const projects = [
  { name: "City Park Renovation",       dept: "Parks & Recreation • $1.2M", pct: 65, color: "#3b82f6" },
  { name: "Public Library Expansion",    dept: "Education • $3.5M",         pct: 30, color: "#f59e0b" },
  { name: "Road Infrastructure Repair",  dept: "Transportation • $6.8M",     pct: 90, color: "#22c55e" },
  { name: "Water Treatment Facility",    dept: "Utilities • $3.1M",          pct: 10, color: "#94a3b8" },
];

/* ---------- components ---------- */
const BarRow: React.FC<{ name: string; dept: string; pct: number; color: string }> = ({ name, dept, pct, color }) => (
  <div className="space-y-1">
    <div className="text-[13px] text-slate-900">{name}</div>
    <div className="text-[11px] text-slate-500">{dept}</div>
    <div className="mt-1 flex items-center gap-2">
      <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="text-[11px] text-slate-500 w-10 text-right">{pct}%</div>
    </div>
  </div>
);

const Transparency: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Transparency Portal</h1>
        <div className="flex items-center gap-2 text-sm">
          <select className="rounded border border-slate-300 bg-white px-2 py-1">
            <option>All Departments</option>
            <option>Parks & Recreation</option>
            <option>Education</option>
            <option>Transportation</option>
            <option>Utilities</option>
          </select>
          <select className="rounded border border-slate-300 bg-white px-2 py-1">
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Yearly</option>
          </select>
        </div>
      </div>

      {/* Project Status + Key Projects */}
      <div className="card p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Pie + title */}
          <div>
            <div className="text-sm font-semibold text-slate-900 mb-3">Project Status Overview</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} label>
                      {statusData.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="self-center space-y-2 text-[12px]">
                {statusData.map((s) => (
                  <li key={s.name} className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-slate-600">
                      {s.name}: <span className="text-slate-900 font-medium">{s.value}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Key Projects with slim bars */}
          <div>
            <div className="text-sm font-semibold text-slate-900 mb-3">Key Projects</div>
            <div className="space-y-4">
              {projects.map((p) => (
                <BarRow key={p.name} name={p.name} dept={p.dept} pct={p.pct} color={p.color} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Blockchain Verification</div>
          <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] px-2 py-0.5">
            100% Verified
          </span>
        </div>

        <p className="text-sm text-slate-600 mt-2">
          All data presented in this portal is verified and secured on the blockchain. Each transaction,
          budget allocation, and project update is immutably recorded to ensure complete transparency.
        </p>

        <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between text-[12px] text-slate-600 mb-2">
            <span>Latest Block Hash</span>
            <span>Updated 3 minutes ago</span>
          </div>
          <input
            readOnly
            value="0xa1f0c8d2a9b0ee98f1a21b3c7af7e2a0e4cef7fbcedf7acb5f1e3df45c0b6ef6"
            className="w-full rounded border border-slate-300 bg-white px-2 py-2 text-[12px] font-mono text-slate-700"
          />
          <p className="mt-2 text-[12px] text-slate-500">
            You can verify this data on the public blockchain explorer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Transparency;
