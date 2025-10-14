import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---------- Dumb data (replace with API later) ---------- */
type ProjectRow = {
  id: string;
  code: string;
  name: string;
  department: "Public Works" | "Education" | "Health";
  budget: number; // PHP
  start: string;  // ISO
  end: string;    // ISO
  status: "In Progress" | "Completed" | "Pending";
};

const ROWS: ProjectRow[] = [
  {
    id: "PRJ-2023-0125",
    code: "PRJ-2023-0125",
    name: "Road Rehabilitation - Perez Blvd",
    department: "Public Works",
    budget: 2_500_000,
    start: "2023-06-01",
    end: "2023-08-30",
    status: "In Progress",
  },
  {
    id: "PRJ-2023-0126",
    code: "PRJ-2023-0126",
    name: "Public School Renovation - Central Elementary",
    department: "Education",
    budget: 1_800_000,
    start: "2023-05-15",
    end: "2023-07-30",
    status: "In Progress",
  },
  {
    id: "PRJ-2023-0127",
    code: "PRJ-2023-0127",
    name: "Medical Equipment Procurement - City Hospital",
    department: "Health",
    budget: 3_200_000,
    start: "2023-06-10",
    end: "2023-09-10",
    status: "In Progress",
  },
];

/* ---------- Helpers ---------- */
const peso = (n: number) =>
  n.toLocaleString("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

const deptIcon = (dept: ProjectRow["department"]) => {
  const base = "inline-flex items-center gap-1.5 text-slate-500";
  const icon = (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 20h16M4 12h16M4 6h16" />
    </svg>
  );
  if (dept === "Public Works")
    return <span className={base}>{icon} Public Works</span>;
  if (dept === "Education")
    return (
      <span className={base}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M21 10v6" />
          <path d="M3 10v6a9 9 0 0 0 18 0" />
        </svg>
        Education
      </span>
    );
  return (
    <span className={base}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21C7 21 3 17 3 12S7 3 12 3s9 4 9 9-4 9-9 9z" />
        <path d="M12 8v4l3 3" />
      </svg>
      Health
    </span>
  );
};

const StatusPill: React.FC<{ label: string; tone?: "blue" | "green" | "gray" }> = ({ label, tone = "blue" }) => {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    gray: "bg-slate-50 text-slate-600 border-slate-200",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {label}
    </span>
  );
};

const RowCard: React.FC<{ row: ProjectRow; onClick: () => void }> = ({ row, onClick }) => {
  return (
    <div
      className="grid grid-cols-12 items-center gap-4 border-t first:border-t-0 px-6 py-5 hover:bg-slate-50 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="col-span-2 text-sm text-slate-500">{row.code}</div>
      <div className="col-span-3">
        <div className="text-sm font-medium text-slate-900 leading-5">{row.name}</div>
      </div>
      <div className="col-span-2">{deptIcon(row.department)}</div>
      <div className="col-span-2">
        <button className="text-blue-600 hover:underline text-sm font-semibold">{peso(row.budget)}</button>
      </div>
      <div className="col-span-2 text-sm text-slate-500">
        {new Date(row.start).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })} —{" "}
        {new Date(row.end).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </div>
      <div className="col-span-1 flex justify-end">
        <StatusPill label={row.status} tone="blue" />
      </div>
    </div>
  );
};

/* ---------- Page ---------- */
const Milestones: React.FC = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All Departments");
  const [status, setStatus] = useState("All Statuses");

  const filtered = useMemo(() => {
    return ROWS.filter((r) => {
      const mQ =
        !q ||
        r.name.toLowerCase().includes(q.toLowerCase()) ||
        r.code.toLowerCase().includes(q.toLowerCase());
      const mDept = dept === "All Departments" || r.department === (dept as any);
      const mStat = status === "All Statuses" || r.status === (status as any);
      return mQ && mDept && mStat;
    });
  }, [q, dept, status]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr,220px,220px,40px]">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-lg border border-slate-200 px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </div>

          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
          >
            <option>All Departments</option>
            <option>Public Works</option>
            <option>Education</option>
            <option>Health</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
          >
            <option>All Statuses</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>

          <button
            title="More filters"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M7 12h10M10 17h4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table-like card */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-3 text-sm font-medium text-slate-600">Approved Projects</div>

        {/* header row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <div className="col-span-2">Project ID</div>
          <div className="col-span-3">Project Name</div>
          <div className="col-span-2">Department</div>
          <div className="col-span-2">Budget</div>
          <div className="col-span-2">Timeline</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        <div>
          {filtered.map((r) => (
            <RowCard key={r.id} row={r} onClick={() => navigate(`/citizen/milestones/${encodeURIComponent(r.id)}`)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Milestones;
