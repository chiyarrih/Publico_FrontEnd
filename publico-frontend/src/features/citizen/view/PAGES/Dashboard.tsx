import React, { useMemo, useState } from "react";
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

/* -------------------- tiny UI helpers (self-contained) -------------------- */
const Card: React.FC<{ title?: React.ReactNode; right?: React.ReactNode; children: React.ReactNode }> = ({
  title,
  right,
  children,
}) => (
  <div className="rounded-xl border border-slate-200 bg-white">
    {(title || right) && (
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="text-sm font-semibold text-slate-700">{title}</div>
        {right}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

const Progress: React.FC<{ pct: number; color?: "blue" | "green" | "amber" | "slate" }> = ({
  pct,
  color = "blue",
}) => {
  const bar =
    color === "green" ? "bg-emerald-500" : color === "amber" ? "bg-amber-500" : color === "slate" ? "bg-slate-400" : "bg-blue-600";
  return (
    <div className="h-2 w-full rounded-full bg-slate-100">
      <div className={`h-2 rounded-full ${bar}`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  );
};

function statusToPill(status: string) {
  const map: Record<string, string> = {
    Verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Flagged: "bg-rose-50 text-rose-700 border-rose-200",
    "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
    "Near Completion": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Just Started": "bg-slate-50 text-slate-600 border-slate-200",
  };
  const cls = map[status] ?? "bg-slate-50 text-slate-600 border-slate-200";
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>{status}</span>;
}

/* -------------------------- demo data (local) -------------------------- */
type Project = {
  id: string;
  name: string;
  dept: string;
  budget: string;
  spent: string;
  pct: number;
  status: "In Progress" | "Near Completion" | "Just Started";
  barColor: "blue" | "green" | "amber" | "slate";
};

const keyProjects: Project[] = [
  { id: "city-park-renovation", name: "City Park Renovation", dept: "Parks & Recreation", budget: "₱1.2M", spent: "₱780K", pct: 65, status: "In Progress", barColor: "blue" },
  { id: "public-library-expansion", name: "Public Library Expansion", dept: "Education", budget: "₱3.5M", spent: "₱1.05M", pct: 30, status: "In Progress", barColor: "amber" },
  { id: "road-infrastructure-repair", name: "Road Infrastructure Repair", dept: "Transportation", budget: "₱6.8M", spent: "₱5.2M", pct: 90, status: "Near Completion", barColor: "green" },
  { id: "water-treatment-facility", name: "Water Treatment Facility", dept: "Utilities", budget: "₱3.1M", spent: "₱310K", pct: 10, status: "Just Started", barColor: "slate" },
];

type Tx = { tx: string; amount: string; date: string; status: "Verified" | "Pending" | "Flagged"; sig: string };
const recentTx: Tx[] = [
  { tx: "Equipment Purchase - Parks Dept", amount: "₱24,500", date: "2023-09-15", status: "Verified", sig: "0x7e9f...6b1" },
  { tx: "Contractor Payment - Library Project", amount: "₱156,000", date: "2023-09-12", status: "Pending", sig: "0xb3dc...7b2" },
  { tx: "Office Supplies - Administration", amount: "₱3,450", date: "2023-09-10", status: "Verified", sig: "0x0c54...05b" },
  { tx: "IT Infrastructure - City Hall", amount: "₱87,200", date: "2023-09-05", status: "Flagged", sig: "0x3e2b...e4a" },
];

const dashboardAlerts = [
  { color: "bg-amber-50", icon: "⚠️", title: "Downtown Bridge Repair Project is 8% over budget", date: "2023-09-14", desc: "" },
  { color: "bg-yellow-50", icon: "⏳", title: "Pending Disbursement", date: "2023-09-10", desc: "Q4 infrastructure funds awaiting approval" },
  { color: "bg-blue-50", icon: "📄", title: "Document Expiration", date: "2023-09-01", desc: "Contract #TR-2023-45 expires in 14 days" },
];

const spending = [
  { m: "Jan", actual: 1200, budget: 1100 },
  { m: "Feb", actual: 1300, budget: 1200 },
  { m: "Mar", actual: 1150, budget: 1250 },
  { m: "Apr", actual: 1600, budget: 1300 },
  { m: "May", actual: 1350, budget: 1400 },
  { m: "Jun", actual: 1500, budget: 1450 },
  { m: "Jul", actual: 1550, budget: 1500 },
  { m: "Aug", actual: 1250, budget: 1550 },
];

const allocation = [
  { name: "Infrastructure", value: 35, color: "#3b82f6" },
  { name: "Health", value: 25, color: "#22c55e" },
  { name: "Education", value: 20, color: "#f59e0b" },
  { name: "Admin", value: 15, color: "#ef4444" },
  { name: "Misc", value: 5, color: "#94a3b8" },
];

/* -------------------------- simple modal components -------------------------- */
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center">
    <div className="absolute inset-0 bg-black/30" onClick={onClose} />
    <div className="relative z-[101] w-full max-w-4xl rounded-xl border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <div className="text-sm font-semibold text-slate-700">{title}</div>
        <button onClick={onClose} className="rounded p-1 hover:bg-slate-100" aria-label="Close">✕</button>
      </div>
      <div className="max-h-[70vh] overflow-auto p-5">{children}</div>
    </div>
  </div>
);

/* ---------------------------------- page ---------------------------------- */
const ProjectRow: React.FC<{ p: Project; compact?: boolean }> = ({ p, compact }) => (
  <div className={`rounded-md border border-slate-200 ${compact ? "px-4 py-3" : "p-4"}`}>
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-slate-900">{p.name}</div>
        <div className="text-xs text-slate-500">
          {p.dept} • Budget: {p.budget} • Spent: {p.spent}
        </div>
      </div>
      {statusToPill(p.status)}
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

export default function Dashboard() {
  const [openProjects, setOpenProjects] = useState(false);
  const [openLedger, setOpenLedger] = useState(false);

  // for the modal's quick search
  const [q, setQ] = useState("");
  const filteredProjects = useMemo(
    () => keyProjects.filter(p => p.name.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

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
            <div key={i} className={`rounded-md ${a.color} border border-slate-200 px-4 py-3`}>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-2 font-medium text-slate-900">
                  {a.icon} {a.title}
                </span>
                <span>{a.date}</span>
              </div>
              {a.desc && <div className="mt-1 text-sm text-slate-600">{a.desc}</div>}
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
              <Line type="monotone" dataKey="actual" name="Actual Spending" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="budget" name="Allocated Budget" stroke="#94a3b8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Budget Allocation by Category">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={allocation} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                {allocation.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Key Projects */}
      <Card
        title="Key Projects"
        right={
          <button className="text-sm text-blue-600 hover:underline" onClick={() => setOpenProjects(true)}>
            View All Projects
          </button>
        }
      >
        <div className="space-y-4">
          {keyProjects.map((p) => (
            <ProjectRow key={p.id} p={p} />
          ))}
        </div>
      </Card>

      {/* Transactions */}
      <Card
        title="Recent Blockchain Transactions"
        right={
          <button className="text-sm text-blue-600 hover:underline" onClick={() => setOpenLedger(true)}>
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

      {/* ---------- Modals ---------- */}
      {openProjects && (
        <Modal title="All Projects" onClose={() => setOpenProjects(false)}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50" onClick={() => setQ("")}>
              Clear
            </button>
          </div>
          <div className="space-y-3">
            {filteredProjects.map((p) => (
              <ProjectRow key={p.id} p={p} compact />
            ))}
            {filteredProjects.length === 0 && (
              <div className="rounded-md border border-slate-200 p-6 text-center text-sm text-slate-500">No projects found.</div>
            )}
          </div>
        </Modal>
      )}

      {openLedger && (
        <Modal title="Complete Ledger" onClose={() => setOpenLedger(false)}>
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
        </Modal>
      )}
    </div>
  );
}
