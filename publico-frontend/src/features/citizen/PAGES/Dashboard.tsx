import React from "react";
import { Card, Progress, statusToPill } from "../../../shared/ui";
import {
  dashboardAlerts, spending, allocation, keyProjects, recentTx, Project
} from "../data/demo";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const ProjectRow: React.FC<{ p: Project }> = ({ p }) => (
  <div className="rounded border border-slate-200 p-3">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-slate-900">{p.name}</div>
        <div className="text-xs text-slate-500">{p.dept} • Budget: {p.budget} • Spent: {p.spent}</div>
      </div>
      {p.status && statusToPill(p.status)}
    </div>
    <div className="mt-3 space-y-1">
      <Progress pct={p.pct} color={p.barColor} />
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{p.pct}%</span><button className="text-blue-600 hover:underline">View Details</button>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <Card title={<><span className="text-amber-500">◎</span> Smart Contract Alerts</>}>
        <div className="space-y-2">
          {dashboardAlerts.map((a, i) => (
            <div key={i} className={`rounded ${a.color} px-3 py-2 border border-slate-100`}>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-2 font-medium text-slate-900"><span>{a.icon}</span>{a.title}</span>
                <span>{a.date}</span>
              </div>
              <div className="text-[12px] text-slate-600">{a.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Monthly Spending vs. Allocation">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={spending} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip />
              <Line type="monotone" dataKey="actual" name="Actual Spending" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="budget" name="Allocated Budget" stroke="#94a3b8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Budget Allocation by Category">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={allocation} dataKey="value" cx="50%" cy="50%" outerRadius={90} label>
                {allocation.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Key Projects" right={<button className="text-sm text-blue-600 hover:underline">View All Projects</button>}>
        <div className="space-y-3">{keyProjects.map((p, i) => <ProjectRow key={i} p={p} />)}</div>
      </Card>

      <Card title="Recent Blockchain Transactions" right={<button className="text-sm text-blue-600 hover:underline">View Complete Transaction Ledger</button>}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="px-3 py-2 font-medium">Transaction</th>
                <th className="px-3 py-2 font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Signature</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((t, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2">{t.tx}</td>
                  <td className="px-3 py-2">{t.amount}</td>
                  <td className="px-3 py-2">{t.date}</td>
                  <td className="px-3 py-2">{statusToPill(t.status)}</td>
                  <td className="px-3 py-2 text-slate-500">{t.sig}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
