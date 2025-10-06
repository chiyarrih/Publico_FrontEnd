import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Project } from "../../model/projectTypes";
import { ProjectService } from "../../services/projectService";
import { Panel, Pill, IconButton } from "../ui/kit";

const Eye = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const Edit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>;
const Trash= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;

export default function ProjectMilestones(){
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [state, setState] = useState("All");

  useEffect(()=>{ ProjectService.getAll().then(setProjects); },[]);

  const filtered = useMemo(()=>projects.filter(p =>
    (dept==="All"||p.department===dept) &&
    (state==="All"||p.status===state) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search))
  ),[projects, search, dept, state]);

  return (
    <>
      <div className="mb-3 text-xl font-semibold">Project Milestones</div>

      <Panel className="mb-4">
        <div className="flex flex-wrap gap-2 p-3">
          <input className="h-10 flex-1 rounded-md border px-3" placeholder="Search projects..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className="h-10 rounded-md border px-2" value={dept} onChange={e=>setDept(e.target.value)}>
            <option>All</option><option>Public Works</option><option>Education</option><option>Health</option>
          </select>
          <select className="h-10 rounded-md border px-2" value={state} onChange={e=>setState(e.target.value)}>
            <option>All</option><option>In Progress</option><option>Pending</option><option>Completed</option>
          </select>
        </div>
      </Panel>

      <Panel>
        <div className="px-4 py-3 text-[13px] text-slate-500 border-b">Approved Projects</div>
        <div className="grid grid-cols-[140px_1fr_160px_140px_180px_130px] gap-x-4 px-4 py-2 text-xs text-slate-500">
          <div>Project ID</div><div>Project Title</div><div>Department</div><div>Total Budget</div><div>Timeline</div><div className="text-right">Actions</div>
        </div>
        {filtered.map(p=>(
          <div key={p.id} className="grid grid-cols-[140px_1fr_160px_140px_180px_130px] gap-x-4 px-4 py-3 border-t">
            <div className="text-[13px]">{p.id}</div>
            <div className="text-[13px]">
              <div className="font-medium leading-4">{p.title}</div>
              <div className="text-slate-500 text-xs">Status: <Pill tone="blue">{p.status}</Pill></div>
            </div>
            <div className="text-[13px]">{p.department}</div>
            <div className="text-[13px] font-semibold text-blue-600">₱{p.totalBudget.toLocaleString()}</div>
            <div className="text-[13px]">{p.timeline.start} - {p.timeline.end}</div>
            <div className="flex items-center justify-end gap-1">
              <Link to={`/admin/milestones/${p.id}`} className="rounded px-2 py-1.5 text-blue-600 hover:bg-blue-50 text-[13px] inline-flex items-center gap-1"><Eye/>View</Link>
              <IconButton title="Edit"><Edit/></IconButton>
              <IconButton title="Delete"><Trash/></IconButton>
            </div>
          </div>
        ))}
      </Panel>
    </>
  );
}
