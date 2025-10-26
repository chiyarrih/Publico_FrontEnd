import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getKeyProjects } from "../../controller/data/dashboardService";
import { useDebounce } from "../../controller/hooks/useDebounce";

type ProjectRow = {
  _id?: string;
  code?: string;
  projectName?: string;
  department?: string;
  budget?: number;
  totalBudget?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  overallStatus?: string;
  agencyId?: {
    agency_name?: string;
    email?: string;
  };
};

const peso = (n: number | undefined) =>
  typeof n === "number" ? n.toLocaleString("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }) : "-";

const RowCard: React.FC<{ row: ProjectRow; onClick: () => void }> = ({ row, onClick }) => {
  return (
    <div
      className="border-t first:border-t-0 p-4 sm:p-6 hover:bg-slate-50 cursor-pointer transition-colors duration-200"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {/* Mobile Layout */}
      <div className="block sm:hidden space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 leading-tight mb-1">
              {row.projectName ?? "-"}
            </div>
            <div className="text-xs text-slate-500 mb-2">
              {row.code ?? row._id}
            </div>
          </div>
          <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 flex-shrink-0">
            {row.overallStatus || (row.status ?? "In Progress")}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm text-slate-600">{row.department ?? "-"}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm text-slate-600">{row.agencyId?.agency_name ?? "-"}</span>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-sm font-semibold text-blue-600">
              {peso(row.totalBudget || row.budget)}
            </span>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:grid grid-cols-12 items-center gap-4">
        <div className="col-span-2 text-sm text-slate-500">{row.code ?? row._id}</div>
        <div className="col-span-2">
          <div className="text-sm font-medium text-slate-900 leading-5">{row.projectName ?? "-"}</div>
        </div>
        <div className="col-span-2">
          <span className="text-slate-500 text-sm">{row.department ?? "-"}</span>
        </div>
        <div className="col-span-2">
          <span className="text-slate-500 text-sm">{row.agencyId?.agency_name ?? "-"}</span>
        </div>
        <div className="col-span-2">
          <button className="text-blue-600 hover:underline text-sm font-semibold">{peso(row.totalBudget || row.budget)}</button>
        </div>
        <div className="col-span-1 flex justify-end">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
            {row.overallStatus || (row.status ?? "In Progress")}
          </span>
        </div>
      </div>
    </div>
  );
};

const Milestones: React.FC = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300); // Debounce search input
  const [dept, setDept] = useState("All Departments");
  const [status, setStatus] = useState("All Statuses");

  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true); setErr(null);
        const arr = await getKeyProjects(100); // normalized -> always array
        if (!ignore) setRows(arr);
      } catch (e: any) {
        if (!ignore) setErr(e?.message || "Failed to load projects");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const name = (r.projectName ?? "").toLowerCase();
      const code = (r._id ?? r.code ?? "").toLowerCase();
      const searchQuery = debouncedQ.toLowerCase();
      const mQ   = !debouncedQ || name.includes(searchQuery) || code.includes(searchQuery);
      const mDept = dept === "All Departments" || r.department === dept;
      const mStat = status === "All Statuses" || r.status === status;
      return mQ && mDept && mStat;
    });
  }, [debouncedQ, dept, status, rows]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr,220px,220px,40px]">
          <div className="relative">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects..." className="w-full rounded-lg border border-slate-200 px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          </div>
          <select value={dept} onChange={(e) => setDept(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
            <option>All Departments</option>
            <option>Public Works</option><option>Education</option><option>Health</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
            <option>All Statuses</option><option>In Progress</option><option>Completed</option><option>Pending</option>
          </select>
          <button title="More filters" className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 7h16M7 12h10M10 17h4" /></svg>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-3 text-sm font-medium text-slate-600">Approved Projects</div>
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <div className="col-span-2">Project ID</div><div className="col-span-2">Project Name</div><div className="col-span-2">Department</div>
          <div className="col-span-2">Agency</div><div className="col-span-2">Budget</div><div className="col-span-1 text-right">Status</div>
        </div>
        {err && <div className="px-6 py-4 text-sm text-rose-600">{err}</div>}
        {loading && <div className="px-6 py-4 text-sm text-slate-500">Loading projects…</div>}
        <div>
          {filtered.map((r) => (
            <RowCard key={r._id ?? r.code} row={r} onClick={() => navigate(`/citizen/milestones/${encodeURIComponent(String(r._id ?? r.code))}`)} />
          ))}
          {!loading && filtered.length === 0 && <div className="px-6 py-8 text-center text-sm text-slate-500">No projects found.</div>}
        </div>
      </div>
    </div>
  );
};

export default Milestones;
