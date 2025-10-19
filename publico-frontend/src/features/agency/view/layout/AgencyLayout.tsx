import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from '../../../../utils/auth';
import ProposalForm from "@agency/controller/components/forms/ProposalForm";
import ProposalCard from "@agency/controller/components/cards/ProposalCard";
import useBudget from "@agency/controller/hooks/useBudget";
import useConnectWallet from "@agency/controller/hooks/useConnectWallet";
import InfiniteScroll from "react-infinite-scroll-component";
import {Toaster} from "react-hot-toast"
import Loader from "@agency/controller/components/loaders/Loader";

/* ====================== Enhanced inline icons (no deps) ====================== */
const I = {
  menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-700"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-600"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronDown: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-500"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  budget: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  docs: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ledger: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="3" width="20" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  alert: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  user: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  faq: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  support: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  search: () => <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-slate-400"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  money:  () => <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-slate-400"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  dept:   () => <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-slate-400"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  cal:    () => <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-slate-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:  () => <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-emerald-600"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chev:   () => <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-slate-500"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
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
    Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200 shadow-emerald-100",
    "In Review": "bg-blue-50 text-blue-700 ring-blue-200 shadow-blue-100",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200 shadow-amber-100",
    Rejected: "bg-red-50 text-red-700 ring-red-200 shadow-red-100",
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 shadow-sm ${m[s]}`}>{s}</span>;
};

const BudgetsInner: React.FC = () => {
  const {fetchedData, hasMore, loadMore} = useBudget();
  const [tab, setTab] = useState<"proposals" | "new">("proposals");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | Status>("All");
  const [dept, setDept] = useState("All Departments");

  const data = fetchedData
    .filter(r => (status === "All" ? true : r.status === status))
    .filter(r => (dept === "All Departments" ? true : r.category === dept))
    .filter(r => [r.category, r.category].some(t => t.toLowerCase().includes(q?.toLowerCase())));

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      {/* header card */}
      <div className="p-6 bg-white border rounded-2xl border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Project Proposals</h1>
              <p className="text-sm text-slate-600">Manage your budget proposals and submissions</p>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="flex items-center gap-8 text-sm">
          <button 
            onClick={()=>setTab("proposals")} 
            className={`pb-3 border-b-2 font-semibold transition-colors ${
              tab==="proposals"
                ? "border-blue-600 text-blue-700" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Proposals
          </button>
          <button 
            onClick={()=>setTab("new")} 
            className={`pb-3 border-b-2 font-semibold transition-colors ${
              tab==="new"
                ? "border-blue-600 text-blue-700" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            New Proposal
          </button>
        </div>

        {/* search + filters */}
        {tab==="proposals" && (
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="relative min-w-[280px] flex-1">
              <input 
                value={q} 
                onChange={e=>setQ(e.target.value)} 
                placeholder="Search proposals..." 
                className="w-full pl-10 pr-4 py-3 text-sm border rounded-xl h-12 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 transition-all"
              />
              <span className="absolute inset-y-0 flex items-center pointer-events-none left-3">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            <select 
              value={status} 
              onChange={e=>setStatus(e.target.value as any)} 
              className="px-4 py-3 text-sm border rounded-xl h-12 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px] transition-all"
            >
              <option>All</option><option>Approved</option><option>In Review</option><option>Pending</option><option>Rejected</option>
            </select>
            <select 
              value={dept} 
              onChange={e=>setDept(e.target.value)} 
              className="px-4 py-3 text-sm border rounded-xl h-12 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[160px] transition-all"
            >
              <option>All Departments</option><option>Transportation</option><option>Parks & Recreation</option><option>Education</option><option>Finance</option><option>IT</option>
            </select>
          </div>
        )}
      </div>

      {/* content */}
      {tab==="proposals" ? (
        <>
          <div className="bg-white border divide-y rounded-2xl border-slate-200/60 shadow-sm overflow-hidden">
            <InfiniteScroll 
              next={loadMore} 
              hasMore={hasMore} 
              children={<ProposalCard data={data}/>} 
              loader={<Loader/>} 
              dataLength={data.length}
            />
          </div>

          <div className="p-4 text-sm bg-gradient-to-r from-emerald-50 to-blue-50 border rounded-2xl border-emerald-200/60 text-slate-700">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center p-2 rounded-full bg-emerald-100">
                <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="font-medium">Blockchain Security:</span>
              <span>All proposals are securely recorded on the blockchain for complete transparency and auditability.</span>
            </div>
          </div>
        </>
      ) : (
        <ProposalForm setTab={()=>setTab("proposals")}/>
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
  const { profile } = useConnectWallet();

  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("mousedown", onDown); return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Reusable sidebar inner content so we don't duplicate markup
  const SidebarInner = ({ mobile }: { mobile?: boolean }) => (
    <div className={mobile ? "h-full overflow-auto p-6" : "sticky top-16 h-[calc(100vh-4rem)] overflow-auto p-6"}>
      {mobile && (
        <div className="mb-4 flex justify-end">
          <button
            className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-slate-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            title="Close"
          >
            <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          {(profile.name || 'Agency User').charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">{profile.name || 'Agency User'}</div>
          <div className="text-xs text-blue-600 font-medium">Full Access</div>
        </div>
      </div>
      <nav className="space-y-2">
        <NavLink to="/agency" end className={linkClass}><I.dashboard/><span>Dashboard</span></NavLink>
        <NavLink to="/agency/milestones" className={linkClass}><I.docs/><span>Project Milestones</span></NavLink>
        <NavLink to="/agency/budgets" className={linkClass}><I.budget/><span>Budgets</span></NavLink>
        <NavLink to="/agency/documents" className={linkClass}><I.docs/><span>Documents</span></NavLink>
        <NavLink to="/agency/transactions" className={linkClass}><I.ledger/><span>Transaction Ledger</span></NavLink>
        <NavLink to="/agency/alerts" className={linkClass}><I.alert/><span>Smart Contract Alerts</span></NavLink>
        <NavLink to="/agency/profile" className={linkClass}><I.user/><span>User Profile</span></NavLink>
        <NavLink to="/agency/faqs" className={linkClass}><I.faq/><span>FAQs</span></NavLink>
        <NavLink to="/agency/support" className={linkClass}><I.support/><span>Contact Support</span></NavLink>
      </nav>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-lg hover:bg-slate-100 lg:hidden transition-colors"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
            >
              <I.menu />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Publico</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
              title="Notifications"
            >
              <I.bell />
              <span className="absolute w-2 h-2 rounded-full right-1 top-1 bg-red-500 animate-pulse" />
            </button>

            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(v => !v)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="hidden sm:block">
                  <span className="text-sm font-medium text-slate-700">{profile.name || 'Agency User'}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {(profile.name || 'Agency User').charAt(0).toUpperCase()}
                </div>
                <I.chevronDown />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-xl shadow-xl z-50 border-slate-200/60 overflow-hidden">
                  <div className="p-3 border-b border-slate-100">
                    <div className="text-sm font-semibold text-slate-900">{profile.name || 'Agency User'}</div>
                    <div className="text-xs text-slate-500">Agency Account</div>
                  </div>
                  <button
                    onClick={logout}
                    className="block w-full px-4 py-3 text-sm text-left text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay — reuse existing sidebar content */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />

          {/* panel */}
          <aside className="relative w-64 h-full bg-white shadow-lg">
            {/* reuse the same sidebar markup used for desktop */}
            <SidebarInner mobile />
          </aside>
        </div>
      )}

      {/* Shell */}
      <div className="grid min-h-[calc(100vh-4rem)] w-full grid-cols-1 lg:grid-cols-[260px,1fr]">
        {/* Sidebar */}
        <aside className="hidden bg-white border-r border-slate-200 lg:block">
          <SidebarInner />
        </aside>

        {/* Main */}
        <main className="flex min-h-[calc(100vh-4rem)] flex-col px-8 py-8">
          {/* title only */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            <div />
          </div>

          <div className="flex-1 min-h-0">
            {isBudgets ? <BudgetsInner /> : <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
