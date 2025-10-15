// src/features/citizen/view/PAGES/Dashboard.tsx
import React, { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { useCitizenDashboard } from "../../controller/hooks/useCitizenDashboard";

/* -------------------- tiny UI helpers (self-contained) -------------------- */
const Card: React.FC<{ title?: React.ReactNode; right?: React.ReactNode; children: React.ReactNode }> = ({
  title, right, children,
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
  pct, color = "blue",
}) => {
  const bar =
    color === "green" ? "bg-emerald-500" :
    color === "amber" ? "bg-amber-500" :
    color === "slate" ? "bg-slate-400" : "bg-blue-600";
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

/* ---------------------------------- helpers ---------------------------------- */
type UiProject = {
  id: string;
  name: string;
  dept?: string;
  budget?: number;
  spent?: number;
  pct: number;
  status: "In Progress" | "Near Completion" | "Just Started";
  barColor: "blue" | "green" | "amber" | "slate";
};

const pctToColor = (pct: number): UiProject["barColor"] =>
  pct >= 80 ? "green" : pct >= 35 ? "blue" : pct >= 10 ? "amber" : "slate";

const pctToStatus = (pct: number): UiProject["status"] =>
  pct >= 80 ? "Near Completion" : pct >= 20 ? "In Progress" : "Just Started";

/* ---------------------------------- page ---------------------------------- */
const ProjectRow: React.FC<{ p: UiProject; compact?: boolean }> = ({ p, compact }) => (
  <div className={`rounded-md border border-slate-200 ${compact ? "px-4 py-3" : "p-4"}`}>
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-slate-900">{p.name}</div>
        <div className="text-xs text-slate-500">
          {p.dept ? `${p.dept} • ` : ""}Budget: {p.budget?.toLocaleString?.("en-PH", { style: "currency", currency: "PHP" }) ?? "—"}
          {" • "}Spent: {p.spent?.toLocaleString?.("en-PH", { style: "currency", currency: "PHP" }) ?? "—"}
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
  const { loading, error, alerts, monthly, categories, projects, ledger } = useCitizenDashboard();

  const [openProjects, setOpenProjects] = useState(false);
  const [openLedger, setOpenLedger] = useState(false);
  const [q, setQ] = useState("");

  // Normalize API -> UI models
  const uiAlerts = alerts?.map((a: any, i: number) => {
    const type = a.type ?? "info";
    const color =
      type === "warning" ? "bg-amber-50" :
      type === "success" ? "bg-emerald-50" :
      type === "danger"  ? "bg-rose-50" :
      "bg-blue-50";
    const icon =
      type === "warning" ? "⚠️" :
      type === "success" ? "✅" :
      type === "danger"  ? "⛔" : "📄";
    return {
      key: a.id ?? i,
      color,
      icon,
      title: a.title ?? a.message ?? "Alert",
      date: a.date ? String(a.date) : "",
      desc: a.description ?? "",
    };
  }) ?? [];

  const uiSpending = (monthly ?? []).map((m: any) => ({
    m: m.month ?? m.m ?? "",
    actual: Number(m.spent ?? m.actual ?? 0),
    budget: Number(m.allocated ?? m.budget ?? 0),
  }));

  const uiAllocation = (categories ?? []).map((c: any) => ({
    name: c.label ?? c.name ?? "—",
    value: Number(c.value ?? 0),
    color: c.color ?? "#3b82f6",
  }));

  const uiProjects: UiProject[] = (projects ?? []).map((p: any) => {
    const spent = Number(p.spent ?? 0);
    const budget = Number(p.budget ?? 0);
    const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : (p.progress ?? 0);
    return {
      id: String(p._id ?? p.id ?? Math.random()),
      name: p.projectName ?? p.name ?? "Untitled",
      dept: p.department ?? p.dept,
      budget: isNaN(budget) ? undefined : budget,
      spent: isNaN(spent) ? undefined : spent,
      pct,
      status: pctToStatus(pct),
      barColor: pctToColor(pct),
    };
  });

  const filteredProjects = useMemo(
    () => uiProjects.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())),
    [q, uiProjects]
  );

  // Ledger rows normalize
  const uiLedger = (ledger?.items ?? ledger ?? []).map((t: any, i: number) => ({
    key: t.id ?? i,
    tx: t.title ?? t.tx ?? "Transaction",
    amount:
      typeof t.amount === "number"
        ? t.amount.toLocaleString("en-PH", { style: "currency", currency: "PHP" })
        : t.amount ?? "—",
    date: t.date ? new Date(t.date).toISOString().slice(0, 10) : t.createdAt?.slice(0, 10) ?? "—",
    status: (t.status ?? "Verified") as "Verified" | "Pending" | "Flagged",
    sig: t.signature ?? t.hash ?? t.sig ?? "—",
  }));

  if (loading) return <div className="p-4">Loading…</div>;
  if (error)   return <div className="p-4 text-red-600">{error}</div>;

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
          {uiAlerts.length === 0 && (
            <div className="rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-600">
              No alerts.
            </div>
          )}
          {uiAlerts.map((a) => (
            <div key={a.key} className={`rounded-md ${a.color} border border-slate-200 px-4 py-3`}>
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
            <LineChart data={uiSpending} margin={{ left: -10, right: 10 }}>
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
              <Pie data={uiAllocation} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                {uiAllocation.map((s, i) => (
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
          {uiProjects.length === 0 && (
            <div className="rounded-md border border-slate-200 p-6 text-center text-sm text-slate-500">
              No projects.
            </div>
          )}
          {uiProjects.slice(0, 4).map((p) => (
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
              {uiLedger.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>No transactions.</td>
                </tr>
              )}
              {uiLedger.map((t) => (
                <tr key={t.key} className="border-t">
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
                {uiLedger.map((t) => (
                  <tr key={t.key} className="border-t">
                    <td className="px-4 py-2">{t.tx}</td>
                    <td className="px-4 py-2">{t.amount}</td>
                    <td className="px-4 py-2">{t.date}</td>
                    <td className="px-4 py-2">{statusToPill(t.status)}</td>
                    <td className="px-4 py-2 text-slate-500">{t.sig}</td>
                  </tr>
                ))}
                {uiLedger.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>No transactions.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* -------------------------- simple modal component -------------------------- */
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
