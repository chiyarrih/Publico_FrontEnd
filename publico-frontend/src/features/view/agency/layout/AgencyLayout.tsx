import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from '../../../../utils/auth';

/* ====================== inline icons (no deps) ====================== */
const I = {
  menu: () => <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-600"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  bell: () => <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-500"><path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  chevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" className="text-slate-500"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  dashboard: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" fill="currentColor"/></svg>,
  budget: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 7h18v12H3z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M3 7l2-3h14l2 3" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>,
  docs: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 3h8l4 4v14H7z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M15 3v4h4" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>,
  ledger: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 5h16M4 12h16M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  alert: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 3l9 16H3z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  user: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zM3 21a9 9 0 0 1 18 0" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>,
  faq: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 18h.01M8 9a4 4 0 1 1 6.7 2.9 4.3 4.3 0 0 0-1.7 3.1v.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  support: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M18 16v-5a6 6 0 1 0-12 0v5M6 20h12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  search: () => <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400"><path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  money:  () => <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400"><path d="M3 6h18v12H3z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 12h10M12 9v6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  dept:   () => <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400"><path d="M3 21h18M5 21V7l7-4 7 4v14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  cal:    () => <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400"><path d="M7 3v4M17 3v4M3 9h18M5 21h14a2 2 0 0 0 2-2V9H3v10a2 2 0 0 0 2 2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  check:  () => <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chev:   () => <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-500"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};
/* ==================================================================== */

/* -------- make the title from the URL (no title map) -------- */
function usePageTitle() {
  const { pathname } = useLocation();
  const clean = pathname.replace(/\/+$/, "");
  if (clean === "/agency" || clean === "/agency/") return "Agency Dashboard";
  const last = clean.split("/").pop() || "Agency";
  return last.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function linkClass({ isActive }: { isActive: boolean }) {
  return [
    "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition",
    isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
  ].join(" ");
}

/* ====================== Budgets (inner page) ====================== */
type Status = "Approved" | "In Review" | "Pending" | "Rejected";
const StatusChip: React.FC<{ s: Status }> = ({ s }) => {
  const m: Record<Status, string> = {
    Approved: "bg-emerald-100 text-emerald-700",
    "In Review": "bg-blue-100 text-blue-700",
    Pending: "bg-amber-100 text-amber-700",
    Rejected: "bg-rose-100 text-rose-700",
  };
  return <span className={`rounded px-2 py-0.5 text-xs ${m[s]}`}>{s}</span>;
};

const BudgetsInner: React.FC = () => {
  const rows = useMemo(
    () => [
      { title: "Downtown Bridge Repair", dept: "Transportation", timeline: "2023-09-01 to 2024-02-28", amount: "₱2,800,000", status: "Approved" as Status, submitted: "2023-08-15" },
      { title: "City Park Renovation", dept: "Parks & Recreation", timeline: "2023-10-01 to 2024-05-30", amount: "₱1,200,000", status: "In Review" as Status, submitted: "2023-08-10" },
      { title: "Public Library Expansion", dept: "Education", timeline: "2023-11-01 to 2024-12-15", amount: "₱3,500,000", status: "Pending" as Status, submitted: "2023-07-22" },
      { title: "Smart Traffic Light System", dept: "Transportation", timeline: "2023-09-15 to 2024-03-30", amount: "₱950,000", status: "Rejected" as Status, submitted: "2023-08-05" },
    ],
    []
  );
  const [tab, setTab] = useState<"proposals" | "new">("proposals");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | Status>("All");
  const [dept, setDept] = useState("All Departments");

  const data = rows
    .filter(r => (status === "All" ? true : r.status === status))
    .filter(r => (dept === "All Departments" ? true : r.dept === dept))
    .filter(r => [r.title, r.dept].some(t => t.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="space-y-4">
      {/* header card */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold text-slate-900">Project Proposals</div>
          <button onClick={()=>setTab("new")} className="h-9 rounded bg-blue-600 px-3 text-sm text-white hover:bg-blue-700">+ New Proposal</button>
        </div>

        {/* tabs */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <button onClick={()=>setTab("proposals")} className={`pb-2 border-b-2 ${tab==="proposals"?"border-blue-600 text-blue-700":"border-transparent text-slate-500"}`}>Proposals</button>
          <button onClick={()=>setTab("new")} className={`pb-2 border-b-2 ${tab==="new"?"border-blue-600 text-blue-700":"border-transparent text-slate-500"}`}>New Proposal</button>
        </div>

        {/* search + filters */}
        {tab==="proposals" && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search proposals..." className="h-9 w-full rounded border border-slate-300 pl-8 pr-3 text-sm"/>
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

      {/* content */}
      {tab==="proposals" ? (
        <>
          <div className="divide-y rounded-lg border border-slate-200 bg-white">
            {data.map(r=>(
              <div key={r.title} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-medium text-slate-900">{r.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1"><I.dept/>{r.dept}</span>
                      <span className="inline-flex items-center gap-1"><I.cal/>Timeline: {r.timeline}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-900"><I.money/>{r.amount}</div>
                    <div className="mt-1 flex items-center justify-end gap-3">
                      <div className="inline-flex items-center gap-1 text-xs text-slate-500"><I.cal/> Submitted: {r.submitted}</div>
                      <StatusChip s={r.status}/>
                    </div>
                    <button className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                      View Details <I.chev/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
            <span className="mr-2 inline-flex items-center justify-center rounded-full bg-emerald-50 p-1"><I.check/></span>
            All proposals are securely recorded on the blockchain for complete transparency and auditability.
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-medium text-slate-800">Create New Proposal</div>
          <form className="grid grid-cols-2 gap-3">
            <label className="col-span-2 text-xs"><span className="mb-1 block text-slate-700">Project Title</span>
              <input className="h-9 w-full rounded border border-slate-300 px-2 text-sm" placeholder="e.g., Riverside Flood Barrier"/></label>
            <label className="text-xs"><span className="mb-1 block text-slate-700">Department</span>
              <select className="h-9 w-full rounded border border-slate-300 px-2 text-sm">
                <option>Transportation</option><option>Education</option><option>Health</option><option>IT</option><option>Finance</option><option>Parks & Recreation</option>
              </select></label>
            <label className="text-xs"><span className="mb-1 block text-slate-700">Estimated Budget (₱)</span>
              <input className="h-9 w-full rounded border border-slate-300 px-2 text-sm" placeholder="1,500,000"/></label>
            <label className="text-xs"><span className="mb-1 block text-slate-700">Start Date</span>
              <input type="date" className="h-9 w-full rounded border border-slate-300 px-2 text-sm"/></label>
            <label className="text-xs"><span className="mb-1 block text-slate-700">End Date</span>
              <input type="date" className="h-9 w-full rounded border border-slate-300 px-2 text-sm"/></label>
            <label className="col-span-2 text-xs"><span className="mb-1 block text-slate-700">Objectives</span>
              <textarea className="min-h-[90px] w-full rounded border border-slate-300 px-2 py-2 text-sm" placeholder="Describe the objectives and expected outcomes…"/></label>
            <div className="col-span-2"><div className="rounded border border-dashed border-slate-300 p-5 text-center text-xs text-slate-600">
              Upload supporting docs (PDF, JPG, PNG up to 10MB)
            </div></div>
            <div className="col-span-2 flex items-center gap-2">
              <button type="button" className="h-9 rounded bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">Submit Proposal</button>
              <button type="button" onClick={()=>setTab("proposals")} className="h-9 rounded border border-slate-300 px-4 text-sm hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
/* =================================================================== */

export default function AgencyLayout() {
  const title = usePageTitle();
  const { pathname } = useLocation();
  const isBudgets = pathname.replace(/\/+$/, "") === "/agency/budgets";
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("mousedown", onDown); return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 h-16 w-full border-b bg-white shadow-sm">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-blue-600">Publicoo</span>
            <span className="text-sm text-slate-500">• Agency Portal</span>
          </div>
          <div className="relative flex items-center gap-3" ref={menuRef}>
            <button className="rounded p-2 hover:bg-slate-100"><I.menu /></button>
            <button className="relative rounded p-2 hover:bg-slate-100"><I.bell /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500"/></button>
            <button onClick={() => setMenuOpen(v=>!v)} className="flex items-center gap-2 rounded p-2 hover:bg-slate-100">
              <span className="hidden text-xs text-slate-600 sm:block">Agency User — Full Access</span>
              <div className="h-8 w-8 rounded-full bg-slate-200"/><I.chevronDown/>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-12 w-40 rounded-md border border-slate-200 bg-white shadow-lg">
                <button onClick={logout}
                        className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Shell */}
      <div className="grid min-h-[calc(100vh-4rem)] w-full grid-cols-1 lg:grid-cols-[260px,1fr]">
        {/* Sidebar */}
        <aside className="hidden border-r border-slate-200 bg-white lg:block">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-auto p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div><div className="text-sm font-medium text-slate-900">Agency User</div>
                <div className="text-xs text-slate-500">Full Access</div></div>
            </div>
            <nav className="space-y-1">
              <NavLink to="/agency" end className={linkClass}><I.dashboard/><span>Dashboard</span></NavLink>
              <NavLink to="/agency/budgets" className={linkClass}><I.budget/><span>Budgets</span></NavLink>
              <NavLink to="/agency/documents" className={linkClass}><I.docs/><span>Documents</span></NavLink>
              <NavLink to="/agency/transactions" className={linkClass}><I.ledger/><span>Transaction Ledger</span></NavLink>
              <NavLink to="/agency/alerts" className={linkClass}><I.alert/><span>Smart Contract Alerts</span></NavLink>
              <NavLink to="/agency/profile" className={linkClass}><I.user/><span>User Profile</span></NavLink>
              <NavLink to="/agency/faqs" className={linkClass}><I.faq/><span>FAQs</span></NavLink>
              <NavLink to="/agency/support" className={linkClass}><I.support/><span>Contact Support</span></NavLink>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex min-h-[calc(100vh-4rem)] flex-col px-8 py-8">
          {/* title only */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            <div />
          </div>

          <div className="min-h-0 flex-1">
            {isBudgets ? <BudgetsInner /> : <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
