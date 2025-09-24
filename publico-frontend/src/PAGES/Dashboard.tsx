import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

/* -------------------- Demo data -------------------- */
const alerts = [
  {
    color: "bg-rose-50",
    icon: "⚠️",
    title: "Budget Overrun",
    desc: "Downtown Bridge Repair Project is 8% over budget",
    date: "2023-09-15",
  },
  {
    color: "bg-amber-50",
    icon: "🕒",
    title: "Pending Disbursement",
    desc: "Q4 infrastructure funds awaiting approval",
    date: "2023-09-14",
  },
  {
    color: "bg-sky-50",
    icon: "📄",
    title: "Document Expiration",
    desc: "Contract #TR-2023-45 expires in 14 days",
    date: "2023-09-10",
  },
];

const spending = [
  { m: "Jan", actual: 1200, budget: 1400 },
  { m: "Feb", actual: 1350, budget: 1380 },
  { m: "Mar", actual: 1100, budget: 1420 },
  { m: "Apr", actual: 1550, budget: 1460 },
  { m: "May", actual: 1260, budget: 1490 },
  { m: "Jun", actual: 1380, budget: 1500 },
  { m: "Jul", actual: 1500, budget: 1520 },
  { m: "Aug", actual: 1220, budget: 1530 },
];

const allocation = [
  { name: "Education", value: 35, color: "#3b82f6" },
  { name: "Infrastructure", value: 25, color: "#22c55e" },
  { name: "Health", value: 20, color: "#f59e0b" },
  { name: "Flood Control", value: 15, color: "#ef4444" },
  { name: "Other", value: 5, color: "#64748b" },
];

type Project = {
  name: string;
  dept: string;
  budget: string;
  spent: string;
  barColor: string;
  pct: number;
  status?: "In Progress" | "Near Completion" | "Just Started" | "Anomaly";
};

const keyProjects: Project[] = [
  {
    name: "City Park Renovation",
    dept: "Parks & Recreation",
    budget: "$1.2M",
    spent: "$780K",
    barColor: "#3b82f6",
    pct: 65,
    status: "In Progress",
  },
  {
    name: "Public Library Expansion",
    dept: "Education",
    budget: "$3.5M",
    spent: "$1.05M",
    barColor: "#f59e0b",
    pct: 30,
    status: "In Progress",
  },
  {
    name: "Road Infrastructure Repair",
    dept: "Transportation",
    budget: "$6.8M",
    spent: "$5.2M",
    barColor: "#22c55e",
    pct: 90,
    status: "Near Completion",
  },
  {
    name: "Water Treatment Facility",
    dept: "Utilities",
    budget: "$3.1M",
    spent: "$310K",
    barColor: "#64748b",
    pct: 10,
    status: "Just Started",
  },
];

const transactions = [
  { tx: "Equipment Purchase - Parks Dept", amount: "$24,500", date: "2023-09-15", status: "Verified", sig: "0x7e9f…6b1" },
  { tx: "Contractor Payment - Library Project", amount: "$156,000", date: "2023-09-12", status: "Pending",  sig: "0xb3dc…7b2" },
  { tx: "Office Supplies - Administration", amount: "$3,450", date: "2023-09-10", status: "Verified", sig: "0x0c54…05b" },
  { tx: "IT Infrastructure - City Hall", amount: "$87,200", date: "2023-09-05", status: "Flagged",  sig: "0x3e2b…e4a" },
];

/* -------------------- Small helpers -------------------- */
const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    Verified: "pill pill-green",
    Pending: "pill pill-yellow",
    Flagged: "pill pill-red",
    "In Progress": "pill pill-blue",
    "Near Completion": "pill pill-green",
    "Just Started": "pill pill-gray",
    Anomaly: "pill pill-red",
  };
  return <span className={map[status] ?? "pill pill-gray"}>{status}</span>;
};

const ProjectRow: React.FC<{ p: Project }> = ({ p }) => (
  <div className="rounded border border-slate-200 p-3">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-slate-900">{p.name}</div>
        <div className="text-xs text-slate-500">
          {p.dept} • Budget: {p.budget} • Spent: {p.spent}
        </div>
      </div>
      {p.status && <StatusPill status={p.status} />}
    </div>
    <div className="mt-3 space-y-1">
      <div className="progress">
        <div
          className="progress-bar"
          style={{
            width: `${p.pct}%`,
            backgroundColor: p.barColor,
          }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{p.pct}%</span>
        <button className="text-blue-600 hover:underline">View Details</button>
      </div>
    </div>
  </div>
);

/* -------------------- Page -------------------- */
const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header line (title + controls) */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        <div className="flex items-center gap-3 text-sm">
          <select className="rounded border border-slate-300 bg-white px-2 py-1">
            <option>Monthly View</option>
            <option>Quarterly View</option>
            <option>Yearly View</option>
          </select>
          <div className="text-slate-500">Last updated: 9/23/2025</div>
        </div>
      </div>

      {/* Smart Contract Alerts */}
      <div className="card p-0">
        <div className="px-5 py-3 border-b">
          <div className="section-title">
            <span className="text-amber-500">◎</span> Smart Contract Alerts
          </div>
        </div>
        <div className="p-3 space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className={`rounded ${a.color} px-3 py-2 border border-slate-100`}>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-900 flex items-center gap-2">
                  <span>{a.icon}</span> {a.title}
                </span>
                <span>{a.date}</span>
              </div>
              <div className="text-[12px] text-slate-600">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending vs Allocation (Line chart) */}
        <div className="card p-5">
          <div className="section-title mb-3">Monthly Spending vs. Allocation</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={spending} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="actual" name="Actual Spending" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="budget" name="Allocated Budget" stroke="#94a3b8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Allocation by Category (Pie) */}
        <div className="card p-5">
          <div className="section-title mb-3">Budget Allocation by Category</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={allocation} dataKey="value" cx="50%" cy="50%" outerRadius={90} label>
                {allocation.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Projects */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="section-title">Key Projects</div>
          <button className="text-blue-600 text-sm hover:underline">View All Projects</button>
        </div>
        <div className="space-y-3">
          {keyProjects.map((p, i) => (
            <ProjectRow key={i} p={p} />
          ))}
        </div>
      </div>

      {/* Recent Blockchain Transactions */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="section-title">Recent Blockchain Transactions</div>
          <button className="text-blue-600 text-sm hover:underline">
            View Complete Transaction Ledger
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 px-3 font-medium">Transaction</th>
                <th className="py-2 px-3 font-medium">Amount</th>
                <th className="py-2 px-3 font-medium">Date</th>
                <th className="py-2 px-3 font-medium">Status</th>
                <th className="py-2 px-3 font-medium">Signature</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 px-3">{t.tx}</td>
                  <td className="py-2 px-3">{t.amount}</td>
                  <td className="py-2 px-3">{t.date}</td>
                  <td className="py-2 px-3">
                    <StatusPill status={t.status} />
                  </td>
                  <td className="py-2 px-3 text-slate-500">{t.sig}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
