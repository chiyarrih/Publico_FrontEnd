import React from "react";
import { useAgencyDashboard } from "../../controller/hooks/useAgencyDashboard";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* -- tiny UI bits (kept inline to minimize files) -- */
const Card: React.FC<React.PropsWithChildren<{ title?: React.ReactNode; right?: React.ReactNode; className?: string }>> =
({ title, right, className = "", children }) => (
  <div className={`rounded-xl border border-slate-200 bg-white ${className}`}>
    {(title || right) && <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
      <div className="text-[15px] font-semibold text-slate-800">{title}</div>{right}</div>}
    <div className="p-4">{children}</div>
  </div>
);
const pill = (t:"blue"|"green"|"yellow"|"red"|"gray"="gray")=>{
  const m={blue:"bg-blue-50 text-blue-700 ring-blue-200",green:"bg-emerald-50 text-emerald-700 ring-emerald-200",
           yellow:"bg-yellow-50 text-yellow-700 ring-yellow-200",red:"bg-red-50 text-red-700 ring-red-200",
           gray:"bg-slate-50 text-slate-700 ring-slate-200"};
  return `inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${m[t]}`;
};
/* -------------------------------------------------------------------- */

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" className="mx-auto mb-1 h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
    <path d="M7 9l5-5 5 5M12 4v12"/>
  </svg>
);

const AgencyDashboard: React.FC = () => {
  const { alerts, kpis, spendingSeries, statusPie, projects, tab, switchTab, submitBudget } =
    useAgencyDashboard();

  return (
    <div className="space-y-6">
      {/* Alerts */}
      <Card title={<div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">⚠️</span>
        <span>Smart Contract Alerts</span></div>}
        right={<button className="text-xs font-medium text-blue-600 hover:underline">View All</button>}>
        <div className="space-y-2">
          {alerts.map((a,i)=>(
            <div key={i} className={`rounded px-3 py-2 ${a.color} border border-slate-100`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5">{a.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{a.title}</div>
                    <div className="text-[12px] text-slate-600">{a.desc}</div>
                  </div>
                </div>
                <span className="text-[12px] text-slate-500">{a.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map((k,i)=>(
          <Card key={i}>
            <div className="text-[12px] text-slate-500">{k.label}</div>
            <div className="mt-1 text-xl font-semibold text-slate-900">{k.value}</div>
            {k.delta && <div className={`text-xs ${k.up?"text-emerald-600":"text-rose-600"}`}>{k.delta}</div>}
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Monthly Spending vs. Allocation">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingSeries} margin={{ left:-10, right:10, top:10 }}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                <Line type="monotone" dataKey="actual" name="Actual Spending" stroke="#2563eb" strokeWidth={2} dot={false}/>
                <Line type="monotone" dataKey="budget" name="Allocated Budget" stroke="#94a3b8" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Project Status Overview">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPie} dataKey="value" nameKey="name" outerRadius={90} label>
                  {statusPie.map((s,i)=><Cell key={i} fill={s.color}/>)}
                </Pie>
                <Tooltip/><Legend/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Projects */}
      <Card title="Department Projects" right={<button className="text-xs font-medium text-blue-600 hover:underline">View All Projects</button>}>
        <div className="space-y-3">
          {projects.map((p,i)=>(
            <div key={i} className="rounded border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.dept}{p.budget?` • Budget: ${p.budget}`:""}{p.spent?` • Spent: ${p.spent}`:""}</div>
                </div>
                <span className="text-xs text-slate-500">{p.pct}%</span>
              </div>
              <div className="mt-3 h-2 w-full rounded bg-slate-100">
                <div className="h-2 rounded" style={{ width:`${p.pct}%`, backgroundColor:p.color }}/>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Budget + Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title={
          <div className="flex items-center gap-6">
            <button className={`text-sm pb-2 border-b-2 ${tab==="budget"?"border-blue-600 text-blue-700":"border-transparent text-slate-500"}`} onClick={()=>switchTab("budget")}>Budget Submission</button>
            <button className={`text-sm pb-2 border-b-2 ${tab==="proposal"?"border-blue-600 text-blue-700":"border-transparent text-slate-500"}`} onClick={()=>switchTab("proposal")}>Project Proposal</button>
          </div>
        }>
          {tab==="budget" ? (
            <form onSubmit={(e)=>{e.preventDefault(); const fd=new FormData(e.currentTarget as HTMLFormElement); submitBudget(Object.fromEntries(fd.entries()));}} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-xs"><span className="mb-1 block text-slate-700">Budget Title</span>
                  <input name="title" defaultValue="Q3 Infrastructure Budget" className="h-9 w-full rounded border border-slate-300 px-2 text-sm"/></label>
                <label className="text-xs"><span className="mb-1 block text-slate-700">Amount (USD)</span>
                  <input name="amount" defaultValue="1,500,000" className="h-9 w-full rounded border border-slate-300 px-2 text-sm"/></label>
                <label className="text-xs md:col-span-2"><span className="mb-1 block text-slate-700">Budget Category</span>
                  <select name="category" defaultValue="" className="h-9 w-full rounded border border-slate-300 px-2 text-sm">
                    <option value="">Select a category</option><option>Roads & Bridges</option><option>Public Works</option>
                    <option>Water Systems</option><option>Health & Safety</option>
                  </select></label>
                <div className="grid grid-cols-2 gap-3 md:col-span-2">
                  <label className="text-xs"><span className="mb-1 block text-slate-700">Start Date</span>
                    <input type="date" name="start" className="h-9 w-full rounded border border-slate-300 px-2 text-sm"/></label>
                  <label className="text-xs"><span className="mb-1 block text-slate-700">End Date</span>
                    <input type="date" name="end" className="h-9 w-full rounded border border-slate-300 px-2 text-sm"/></label>
                </div>
                <label className="text-xs md:col-span-2"><span className="mb-1 block text-slate-700">Description</span>
                  <textarea name="description" placeholder="Provide details about this budget request" className="min-h-[80px] w-full rounded border border-slate-300 px-2 py-2 text-sm"/></label>
                <label className="text-xs md:col-span-2">
                  <span className="mb-1 block text-slate-700">Supporting Documents</span>
                  <div className="flex h-28 flex-col items-center justify-center rounded border border-dashed border-slate-300 text-[12px] text-slate-500">
                    <UploadIcon/>
                    <input name="file" type="file" id="fileup" className="hidden"/>
                    <label htmlFor="fileup" className="cursor-pointer">Upload files <span className="text-slate-400">or drag & drop</span></label>
                    <div className="text-[11px] text-slate-400">PDF, Excel, or Word up to 10MB</div>
                  </div>
                </label>
              </div>
              <label className="flex items-start gap-2 text-xs">
                <input type="checkbox" className="mt-0.5" required/>
                <span className="text-slate-600">I confirm this submission is accurate and will be recorded on the blockchain</span>
              </label>
              <button className="h-9 rounded bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">Submit Budget Request</button>
            </form>
          ) : (
            <div className="pt-4 text-sm text-slate-600">
              <div className="rounded border border-slate-200 p-4">Project Proposal form goes here.</div>
            </div>
          )}
        </Card>

        <Card title="Recent Activity">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><span className={pill("green")}>Approved</span>
              <div><div className="text-slate-700">Budget Amendment Approved</div>
                <div className="text-[12px] text-slate-500">Q3 Infrastructure Budget +₱250,000 • 2 hours ago</div></div></li>
            <li className="flex items-start gap-2"><span className={pill("yellow")}>Pending</span>
              <div><div className="text-slate-700">Project Proposal Submitted</div>
                <div className="text-[12px] text-slate-500">Downtown Bridge Repair • yesterday</div></div></li>
            <li className="flex items-start gap-2"><span className={pill("blue")}>Verified</span>
              <div><div className="text-slate-700">Document Uploaded</div>
                <div className="text-[12px] text-slate-500">Annual Financial Report 2023 • 2 days ago</div></div></li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AgencyDashboard;
