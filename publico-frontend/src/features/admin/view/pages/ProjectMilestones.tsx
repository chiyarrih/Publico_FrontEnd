import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProjectMilestones } from "../../controller/hooks/useProjectMilestones";
import { Panel, Pill, IconButton } from "../ui/kit";
import CreateMilestoneModal from "../modals/CreateMilestoneModal";
import { ALL_DEPARTMENTS } from "@/shared/constants/departments";

const Eye = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const Edit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>;
const Trash= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const Plus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

export default function ProjectMilestones(){
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [state, setState] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [allMilestones, setAllMilestones] = useState<any[]>([]);
  
  const { milestones, budgetProjects, loading, error, fetchMilestones, pagination } = useProjectMilestones('all');

  // Store all milestones for status dropdown (never filtered)
  useEffect(() => {
    if (milestones.length > 0 && allMilestones.length === 0) {
      setAllMilestones(milestones);
    }
  }, [milestones, allMilestones.length]);

  // Get unique departments from data, fallback to constants if no data
  const availableDepartments = useMemo(() => {
    // ALWAYS use the new Dagupan City LGU departments from constants
    // This ensures the dropdown shows the correct, updated department list
    return ALL_DEPARTMENTS.map(d => d.value);
  }, []);

  const filtered = useMemo(()=>milestones.filter(p =>
    (dept==="All"||p.department===dept) &&
    (state==="All"||p.overallStatus===state) &&
    (p.projectName.toLowerCase().includes(search.toLowerCase()) || p._id.includes(search))
  ),[milestones, search, dept, state]);

  const handleFilterChange = () => {
    fetchMilestones({
      status: state !== 'All' ? state : undefined,
      department: dept !== 'All' ? dept : undefined
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading milestones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xl font-semibold">Project Milestones</div>
      </div>

      <Panel className="mb-4">
        <div className="flex flex-wrap gap-2 p-3">
          <input 
            className="h-10 flex-1 rounded-md border px-3" 
            placeholder="Search projects..." 
            value={search} 
            onChange={e=>setSearch(e.target.value)}
          />
          <select 
            className="h-10 rounded-md border px-2" 
            value={dept} 
            onChange={e=>{setDept(e.target.value); handleFilterChange();}}
          >
            <option value="All">All Departments</option>
            {availableDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select 
            className="h-10 rounded-md border px-2" 
            value={state} 
            onChange={e=>{setState(e.target.value); handleFilterChange();}}
          >
            <option value="All">All Statuses</option>
            {Array.from(new Set(allMilestones.map(m => m.overallStatus).filter(Boolean))).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </Panel>

      <Panel>
        <div className="px-4 py-3 text-[13px] text-slate-500 border-b">All Project Milestones {filtered.length > 0 && `(${filtered.length} shown)`}</div>
        <div className="grid grid-cols-[140px_1fr_160px_140px_180px_130px] gap-x-4 px-4 py-2 text-xs text-slate-500">
          <div>Project ID</div><div>Project Title</div><div>Department</div><div>Total Budget</div><div>Timeline</div><div className="text-right">Actions</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-500">
            No milestones found
          </div>
        ) : (
          filtered.map(p=>(
            <div key={p._id} className="grid grid-cols-[140px_1fr_160px_140px_180px_130px] gap-x-4 px-4 py-3 border-t">
              <div className="text-[13px]">{p._id.slice(-8)}</div>
              <div className="text-[13px]">
                <div className="font-medium leading-4">{p.projectName}</div>
                <div className="text-slate-500 text-xs">Status: <Pill tone="blue">{p.overallStatus}</Pill></div>
              </div>
              <div className="text-[13px]">{p.department}</div>
              <div className="text-[13px] font-semibold text-blue-600">₱{p.totalBudget.toLocaleString()}</div>
              <div className="text-[13px]">
                {new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center justify-end gap-1">
                <Link to={`/admin/milestones/${p._id}`} className="rounded px-2 py-1.5 text-blue-600 hover:bg-blue-50 text-[13px] inline-flex items-center gap-1">
                  <Eye/>View
                </Link>
                <IconButton title="Edit"><Edit/></IconButton>
                <IconButton title="Delete"><Trash/></IconButton>
              </div>
            </div>
          ))
        )}
      </Panel>
      
      {/* Pagination Info */}
      {pagination && (
        <div className="mt-4 text-sm text-slate-600 text-center">
          Showing {filtered.length} of {pagination.totalItems} milestones
          {pagination.totalPages > 1 && ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
        </div>
      )}

      <CreateMilestoneModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        budgetProjects={budgetProjects}
      />
    </>
  );
}
