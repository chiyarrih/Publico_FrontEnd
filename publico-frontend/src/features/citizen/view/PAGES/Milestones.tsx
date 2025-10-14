import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getKeyProjects } from "../../controller/data/dashboardService";

type ProjectRow = {
  _id?: string;
  code?: string;
  projectName?: string;
  department?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
};

const peso = (n: number | undefined) =>
  typeof n === "number" ? n.toLocaleString("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }) : "-";

const RowCard: React.FC<{ row: ProjectRow; onClick: () => void }> = ({ row, onClick }) => {
  return (
    <div
      className="grid grid-cols-12 items-center gap-4 border-t first:border-t-0 px-6 py-5 hover:bg-slate-50 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="col-span-2 text-sm text-slate-500">{row.code ?? row._id}</div>
      <div className="col-span-3">
        <div className="text-sm font-medium text-slate-900 leading-5">{row.projectName ?? "-"}</div>
      </div>
      <div className="col-span-2">
        <span className="text-slate-500 text-sm">{row.department ?? "-"}</span>
      </div>
      <div className="col-span-2">
        <button className="text-blue-600 hover:underline text-sm font-semibold">{peso(row.budget)}</button>
      </div>
      <div className="col-span-2 text-sm text-slate-500">
        {row.startDate ? new Date(row.startDate).toLocaleDateString() : "-"} —{" "}
        {row.endDate ? new Date(row.endDate).toLocaleDateString() : "-"}
      </div>
      <div className="col-span-1 flex justify-end">
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
          {row.status ?? "In Progress"}
        </span>
      </div>
    </div>
  );
};

const Milestones: React.FC = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
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
      const mQ   = !q || name.includes(q.toLowerCase()) || code.includes(q.toLowerCase());
      const mDept = dept === "All Departments" || r.department === dept;
      const mStat = status === "All Statuses" || r.status === status;
      return mQ && mDept && mStat;
    });
  }, [q, dept, status, rows]);

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
          <div className="col-span-2">Project ID</div><div className="col-span-3">Project Name</div><div className="col-span-2">Department</div>
          <div className="col-span-2">Budget</div><div className="col-span-2">Timeline</div><div className="col-span-1 text-right">Status</div>
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
