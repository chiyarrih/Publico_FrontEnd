import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/** tiny helpers */
type Status = "In Progress" | "Approved" | "Pending";
const Chip: React.FC<{ s: Status }> = ({ s }) => {
  const m: Record<Status, string> = {
    "In Progress": "bg-blue-100 text-blue-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
  };
  return <span className={`px-2 py-0.5 rounded text-xs ${m[s]}`}>{s}</span>;
};

type Row = {
  id: string; projectId: string; name: string; dept: string;
  budget: string; range: string; status: Status;
};

const rows: Row[] = [
  { id: "road-rehab", projectId: "PRJ-2023-0125", name: "Road Rehabilitation – Perez Blvd", dept: "Public Works", budget: "₱2,500,000", range: "Jun 1, 2023 – Aug 30, 2023", status: "In Progress" },
  { id: "school-gym", projectId: "PRJ-2023-0168", name: "Public School Renovation – Central Elementary", dept: "Education", budget: "₱1,800,000", range: "May 15, 2023 – Jul 30, 2023", status: "In Progress" },
  { id: "procure-hospital", projectId: "PRJ-2023-0127", name: "Medical Equipment Procurement – City Hospital", dept: "Health", budget: "₱3,200,000", range: "Jun 10, 2023 – Sep 10, 2023", status: "Pending" },
];

export default function Milestones() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All Departments");
  const [stat, setStat] = useState<"All Statuses" | Status>("All Statuses");
  const navigate = useNavigate();

  const data = useMemo(
    () =>
      rows
        .filter(r => dept === "All Departments" ? true : r.dept === dept)
        .filter(r => stat === "All Statuses" ? true : r.status === stat)
        .filter(r =>
          [r.projectId, r.name, r.dept].join(" ").toLowerCase().includes(q.toLowerCase())
        ),
    [q, dept, stat]
  );

  return (
    <div className="space-y-4">
      {/* header + filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="text-lg font-semibold text-slate-900">
          Project <span className="bg-yellow-200 px-1 rounded">Milestones</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Search projects…"
            className="h-9 border border-slate-300 rounded px-3 flex-1 min-w-[240px]"
          />
          <select className="h-9 border border-slate-300 rounded px-2" value={dept} onChange={e=>setDept(e.target.value)}>
            <option>All Departments</option><option>Public Works</option><option>Education</option><option>Health</option>
          </select>
          <select className="h-9 border border-slate-300 rounded px-2" value={stat} onChange={e=>setStat(e.target.value as any)}>
            <option>All Statuses</option><option>In Progress</option><option>Approved</option><option>Pending</option>
          </select>
        </div>
      </div>

      {/* table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 text-sm font-semibold text-slate-700">Approved Projects</div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3 text-left font-medium">Project ID</th>
              <th className="p-3 text-left font-medium">Project Name</th>
              <th className="p-3 text-left font-medium">Department</th>
              <th className="p-3 text-left font-medium">Budget</th>
              <th className="p-3 text-left font-medium">Timeline</th>
              <th className="p-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map(r=>(
              <tr key={r.id} className="hover:bg-slate-50 cursor-pointer" onClick={()=>navigate(`/citizen/milestones/${r.id}`)}>
                <td className="p-3 text-slate-700">{r.projectId}</td>
                <td className="p-3 font-medium text-slate-900">{r.name}</td>
                <td className="p-3 text-slate-700">{r.dept}</td>
                <td className="p-3 text-blue-600 font-medium">{r.budget}</td>
                <td className="p-3 text-slate-700">{r.range}</td>
                <td className="p-3"><Chip s={r.status}/></td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length===0 && <div className="p-6 text-center text-slate-500 text-sm">No results.</div>}
      </div>
    </div>
  );
}
