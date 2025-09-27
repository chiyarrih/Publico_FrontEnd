import React from "react";

type Status = "Approved" | "In Review" | "Pending" | "Rejected";

const rows = [
  { title: "Downtown Bridge Repair", dept: "Transportation", timeline: "2023-09-01 to 2024-02-28", amount: "₱2,800,000", status: "Approved" as Status, submitted: "2023-08-15" },
  { title: "City Park Renovation", dept: "Parks & Recreation", timeline: "2023-10-01 to 2024-05-30", amount: "₱1,200,000", status: "In Review" as Status, submitted: "2023-08-10" },
  { title: "Public Library Expansion", dept: "Education", timeline: "2023-11-01 to 2024-12-15", amount: "₱3,500,000", status: "Pending" as Status, submitted: "2023-07-22" },
  { title: "Smart Traffic Light System", dept: "Transportation", timeline: "2023-09-15 to 2024-03-30", amount: "₱950,000", status: "Rejected" as Status, submitted: "2023-08-05" },
];

/* inline SVGs (no deps) */
const I = {
  search: () => <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400"><path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  money:  () => <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400"><path d="M3 6h18v12H3z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 12h10M12 9v6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  dept:   () => <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400"><path d="M3 21h18M5 21V7l7-4 7 4v14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  cal:    () => <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400"><path d="M7 3v4M17 3v4M3 9h18M5 21h14a2 2 0 0 0 2-2V9H3v10a2 2 0 0 0 2 2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  check:  () => <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chev:   () => <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-500"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

const Chip: React.FC<{ s: Status }> = ({ s }) => {
  const m: Record<Status, string> = {
    Approved:  "bg-emerald-100 text-emerald-700",
    "In Review":"bg-blue-100 text-blue-700",
    Pending:   "bg-amber-100 text-amber-700",
    Rejected:  "bg-rose-100 text-rose-700",
  };
  return <span className={`rounded px-2 py-0.5 text-xs ${m[s]}`}>{s}</span>;
};

export default function Budgets() {
  const [tab, setTab] = React.useState<"proposals"|"new">("proposals");
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"All" | Status>("All");
  const [dept, setDept] = React.useState("All Departments");

  const data = rows
    .filter(r => (status === "All" ? true : r.status === status))
    .filter(r => (dept === "All Departments" ? true : r.dept === dept))
    .filter(r => [r.title, r.dept].some(t => t.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="space-y-4">
      {/* Top card with title, tabs, controls */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold text-slate-900">Project Proposals</div>
          <button onClick={()=>setTab("new")} className="h-9 rounded bg-blue-600 px-3 text-sm text-white hover:bg-blue-700">+ New Proposal</button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <button onClick={()=>setTab("proposals")} className={`pb-2 border-b-2 ${tab==="proposals"?"border-blue-600 text-blue-700":"border-transparent text-slate-500"}`}>Proposals</button>
          <button onClick={()=>setTab("new")}       className={`pb-2 border-b-2 ${tab==="new"      ?"border-blue-600 text-blue-700":"border-transparent text-slate-500"}`}>New Proposal</button>
        </div>

        {/* Search + Filters (only on Proposals tab) */}
        {tab==="proposals" && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search proposals..." className="h-9 w-full rounded border border-slate-300 pl-8 pr-3 text-sm" />
              <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center"><I.search/></span>
            </div>
            <select value={status} onChange={e=>setStatus(e.target.value as any)} className="h-9 rounded border border-slate-300 px-2 text-sm">
              <option>All</option><option>Approved</option><option>In Review</option><option>Pending</option><option>Rejected</option>
            </select>
            <select value={dept} onChange={e=>setDept(e.target.value)} className="h-9 rounded border border-slate-300 px-2 text-sm">
              <option>All Departments</option><option>Transportation</option><option>Parks & Recreation</option><option>Education</option><option>Finance</option><option>IT</option>
            </select>
          </div>
        )}
      </div>

      {/* Main content */}
      {tab==="proposals" ? (
        <>
          <div className="divide-y rounded-lg border border-slate-200 bg-white">
            {data.map((r)=>(
              <div key={r.title} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* left */}
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-medium text-slate-900">{r.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1"><I.dept/>{r.dept}</span>
                      <span className="inline-flex items-center gap-1"><I.cal/>Timeline: {r.timeline}</span>
                    </div>
                  </div>

                  {/* right */}
                  <div className="shrink-0 text-right">
                    <div className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-900">
                      <I.money/>{r.amount}
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-3">
                      <div className="text-xs text-slate-500 inline-flex items-center gap-1">
                        <I.cal/> Submitted: {r.submitted}
                      </div>
                      <Chip s={r.status}/>
                    </div>
                    <button className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                      View Details <I.chev/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* footer notice */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
            <span className="mr-2 inline-flex items-center justify-center rounded-full bg-emerald-50 p-1"><I.check/></span>
            All proposals are securely recorded on the blockchain for complete transparency and auditability.
          </div>
        </>
      ) : (
        /* New Proposal (compact mock to match style) */
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-medium text-slate-800">Create New Proposal</div>
          <form className="grid grid-cols-2 gap-3">
            <label className="col-span-2 text-xs">
              <span className="mb-1 block text-slate-700">Project Title</span>
              <input className="h-9 w-full rounded border border-slate-300 px-2 text-sm" placeholder="e.g., Riverside Flood Barrier" />
            </label>
            <label className="text-xs">
              <span className="mb-1 block text-slate-700">Department</span>
              <select className="h-9 w-full rounded border border-slate-300 px-2 text-sm">
                <option>Transportation</option><option>Education</option><option>Health</option><option>IT</option><option>Finance</option><option>Parks & Recreation</option>
              </select>
            </label>
            <label className="text-xs">
              <span className="mb-1 block text-slate-700">Estimated Budget (₱)</span>
              <input className="h-9 w-full rounded border border-slate-300 px-2 text-sm" placeholder="1,500,000" />
            </label>
            <label className="text-xs">
              <span className="mb-1 block text-slate-700">Start Date</span>
              <input type="date" className="h-9 w-full rounded border border-slate-300 px-2 text-sm" />
            </label>
            <label className="text-xs">
              <span className="mb-1 block text-slate-700">End Date</span>
              <input type="date" className="h-9 w-full rounded border border-slate-300 px-2 text-sm" />
            </label>
            <label className="col-span-2 text-xs">
              <span className="mb-1 block text-slate-700">Objectives</span>
              <textarea className="min-h-[90px] w-full rounded border border-slate-300 px-2 py-2 text-sm" placeholder="Describe the objectives and expected outcomes…" />
            </label>
            <div className="col-span-2">
              <div className="rounded border border-dashed border-slate-300 p-5 text-center text-xs text-slate-600">
                Upload supporting docs (PDF, JPG, PNG up to 10MB)
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <button type="button" className="h-9 rounded bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">Submit Proposal</button>
              <button type="button" onClick={()=>setTab("proposals")} className="h-9 rounded border border-slate-300 px-4 text-sm hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
