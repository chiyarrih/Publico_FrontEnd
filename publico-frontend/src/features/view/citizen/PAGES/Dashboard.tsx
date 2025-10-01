import React from "react";
import { Card, Progress, statusToPill } from "../../../../shared/ui";
import {
  dashboardAlerts,
  spending,
  allocation,
  keyProjects,
  recentTx,
  Project,
} from "../../../controller/citizen/data/demo";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ---------- Small reusable project row ---------- */
const ProjectRow: React.FC<{ p: Project }> = ({ p }) => (
  <div className="rounded-md border border-slate-200 p-4">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-slate-900">{p.name}</div>
        <div className="text-xs text-slate-500">
          {p.dept} • Budget: {p.budget} • Spent: {p.spent}
        </div>
      </div>
      {p.status && statusToPill(p.status)}
    </div>
    <div className="mt-3 space-y-1">
      <Progress pct={p.pct} color={p.barColor} />
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{p.pct}%</span>
        <button className="text-blue-600 hover:underline">View Details</button>
      </div>
    </div>
  </div>
);

/* ---------- Main dashboard ---------- */
export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Alerts */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <span className="text-amber-500">◎</span>
            <span>Smart Contract Alerts</span>
          </div>
        }
      >
        <div className="space-y-3">
          {dashboardAlerts.map((a, i) => (
            <div
              key={i}
              className={`rounded-md ${a.color} border border-slate-200 px-4 py-3`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-2 font-medium text-slate-900">
                  {a.icon} {a.title}
                </span>
                <span>{a.date}</span>
              </div>
              <div className="mt-1 text-sm text-slate-600">{a.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Monthly Spending vs Allocation">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={spending} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual Spending"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="budget"
                name="Allocated Budget"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Budget Allocation by Category">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={allocation}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {allocation.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Projects */}
      <Card
        title="Key Projects"
        right={
          <button className="text-sm text-blue-600 hover:underline">
            View All Projects
          </button>
        }
      >
        <div className="space-y-4">
          {keyProjects.map((p, i) => (
            <ProjectRow key={i} p={p} />
          ))}
        </div>
      </Card>

      {/* Transactions */}
      <Card
        title="Recent Blockchain Transactions"
        right={
          <button className="text-sm text-blue-600 hover:underline">
            View Complete Ledger
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="px-4 py-2 font-medium">Transaction</th>
                <th className="px-4 py-2 font-medium">Amount</th>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Signature</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((t, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{t.tx}</td>
                  <td className="px-4 py-2">{t.amount}</td>
                  <td className="px-4 py-2">{t.date}</td>
                  <td className="px-4 py-2">{statusToPill(t.status)}</td>
                  <td className="px-4 py-2 text-slate-500">{t.sig}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
