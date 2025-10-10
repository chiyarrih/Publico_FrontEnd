import React from "react";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from "recharts";
import type { Alert, Kpi, SpendPoint, PieSlice, Project } from "../../controller/hooks/useAgencyDashboard";

/* -------- Card -------- */
export const Card: React.FC<React.PropsWithChildren<{ title?: React.ReactNode; right?: React.ReactNode; className?: string }>> =
({ title, right, className = "", children }) => (
  <div className={`card p-4 ${className}`}>
    {(title || right) && (
      <div className="mb-3 flex items-center justify-between">
        <div className="section-title">{title}</div>
        {right}
      </div>
    )}
    {children}
  </div>
);

/* -------- Alerts -------- */
export const AlertsList: React.FC<{ items: Alert[] }> = ({ items }) => (
  <Card title="Smart Contract Alerts">
    <div className="space-y-2">
      {items.map((a, i) => (
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
  </Card>
);

/* -------- KPIs -------- */
export const KpiRow: React.FC<{ items: Kpi[] }> = ({ items }) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
    {items.map((k, i) => (
      <Card key={i}>
        <div className="text-[12px] text-slate-500">{k.label}</div>
        <div className="mt-1 text-lg font-semibold text-slate-900">{k.value}</div>
        {k.delta && <div className={`text-xs ${k.up ? "text-emerald-600" : "text-rose-600"}`}>{k.delta}</div>}
      </Card>
    ))}
  </div>
);

/* -------- Charts -------- */
export const SpendVsAlloc: React.FC<{ data: SpendPoint[] }> = ({ data }) => (
  <Card title="Monthly Spending vs. Allocation">
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ left: -10, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip />
        <Line type="monotone" dataKey="actual" name="Actual"    stroke="#2563eb" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="budget" name="Allocated" stroke="#94a3b8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

export const StatusPie: React.FC<{ data: PieSlice[]; title?: string }> = ({ data, title = "Project Status Overview" }) => (
  <Card title={title}>
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={90} label>
          {data.map((s, i) => <Cell key={i} fill={s.color} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

/* -------- Projects -------- */
const Progress: React.FC<{ pct: number; color: string }> = ({ pct, color }) => (
  <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
    <div className="h-2" style={{ width: `${pct}%`, backgroundColor: color }} />
  </div>
);

const ProjectRow: React.FC<{ p: Project }> = ({ p }) => (
  <div className="rounded border border-slate-200 p-3">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-slate-900">{p.name}</div>
        <div className="text-[12px] text-slate-500">
          {p.dept}{p.budget ? ` • Budget: ${p.budget}` : ""}{p.spent ? ` • Spent: ${p.spent}` : ""}
        </div>
      </div>
      <span className="text-xs text-slate-500">{p.pct}%</span>
    </div>
    <div className="mt-2"><Progress pct={p.pct} color={p.color} /></div>
  </div>
);

export const ProjectList: React.FC<{ items: Project[] }> = ({ items }) => (
  <Card title="Key Projects" right={<button className="text-sm text-blue-600 hover:underline">View All Projects</button>}>
    <div className="space-y-3">{items.map((p, i) => <ProjectRow key={i} p={p} />)}</div>
  </Card>
);

/* -------- Budget Form -------- */
type BudgetFormData = { dept: string; amount: string; start: string; end: string; note: string };
export const BudgetForm: React.FC<{ onSubmit: (payload: BudgetFormData) => void }> = ({ onSubmit }) => {
  const [f, setF] = React.useState<BudgetFormData>({ dept: "Transportation", amount: "", start: "", end: "", note: "" });
  const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setF(s=>({ ...s, [e.target.name]: e.target.value }));
  const submit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(f); };

  return (
    <Card title="Budget Submission">
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <label className="text-xs col-span-2">
          <span className="mb-1 block text-slate-700">Department</span>
          <select name="dept" value={f.dept} onChange={onChange} className="h-9 w-full rounded border border-slate-300 px-2 text-sm">
            <option>Transportation</option><option>Education</option><option>Health</option><option>IT</option><option>Finance</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="mb-1 block text-slate-700">Amount (₱)</span>
          <input name="amount" value={f.amount} onChange={onChange} placeholder="1,500,000" className="h-9 w-full rounded border border-slate-300 px-2 text-sm" />
        </label>
        <label className="text-xs">
          <span className="mb-1 block text-slate-700">Start Date</span>
          <input type="date" name="start" value={f.start} onChange={onChange} className="h-9 w-full rounded border border-slate-300 px-2 text-sm" />
        </label>
        <label className="text-xs">
          <span className="mb-1 block text-slate-700">End Date</span>
          <input type="date" name="end" value={f.end} onChange={onChange} className="h-9 w-full rounded border border-slate-300 px-2 text-sm" />
        </label>
        <label className="text-xs col-span-2">
          <span className="mb-1 block text-slate-700">Notes</span>
          <textarea name="note" rows={4} value={f.note} onChange={onChange} className="w-full rounded border border-slate-300 px-2 py-2 text-sm" />
        </label>
        <div className="col-span-2">
          <button className="h-9 rounded bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">Submit Budget</button>
        </div>
      </form>
    </Card>
  );
};
