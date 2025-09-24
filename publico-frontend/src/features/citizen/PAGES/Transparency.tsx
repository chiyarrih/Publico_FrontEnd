import React from "react";
import { Card, Progress } from "../../../shared/ui";
import { statusData, transpoProjects } from "../data/demo";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const BarRow: React.FC<{ name: string; dept: string; pct: number; color: string }> = ({ name, dept, pct, color }) => (
  <div className="space-y-1">
    <div className="text-[13px] text-slate-900">{name}</div>
    <div className="text-[11px] text-slate-500">{dept}</div>
    <div className="mt-1 flex items-center gap-2">
      <Progress pct={pct} color={color} />
      <div className="w-10 text-right text-[11px] text-slate-500">{pct}%</div>
    </div>
  </div>
);

export default function Transparency() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-3 text-sm font-semibold text-slate-900">Project Status Overview</div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <span className="text-slate-600">{s.name}: <span className="font-medium text-slate-900">{s.value}%</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold text-slate-900">Key Projects</div>
            <div className="space-y-4">
              {transpoProjects.map((p) => <BarRow key={p.name} {...p} />)}
            </div>
          </div>
        </div>
      </Card>

      <Card title="Blockchain Verification" right={<span className="pill pill-green text-[11px]">100% Verified</span>}>
        <p className="mt-2 text-sm text-slate-600">
          All data presented in this portal is verified and secured on the blockchain. Each transaction,
          budget allocation, and project update is immutably recorded to ensure complete transparency.
        </p>

        <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between text-[12px] text-slate-600">
            <span>Latest Block Hash</span><span>Updated 3 minutes ago</span>
          </div>
          <input
            readOnly
            value="0xa1f0c8d2a9b0ee98f1a21b3c7af7e2a0e4cef7fbcedf7acb5f1e3df45c0b6ef6"
            className="w-full rounded border border-slate-300 bg-white px-2 py-2 font-mono text-[12px] text-slate-700"
          />
          <p className="mt-2 text-[12px] text-slate-500">You can verify this data on the public blockchain explorer.</p>
        </div>
      </Card>
    </div>
  );
}
