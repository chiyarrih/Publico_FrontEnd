import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Panel, Pill, IconButton } from "../ui/kit";
import { Button } from "../ui/blocks";
import CreateMilestoneModal from "../modals/CreateMilestoneModal";
import { ALL_DEPARTMENTS } from "@/shared/constants/departments";
import { API_BASE_URL } from "@/config/api";

const Eye = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const Edit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>;
const Trash= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;

interface Milestone {
  _id: string;
  projectName: string;
  department: string;
  totalBudget: number;
  startDate: string;
  endDate: string;
  overallStatus: string;
}

export default function ProjectMilestones(){
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [state, setState] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let abortController = new AbortController();
    
    const fetchMilestones = async () => {
      try {
        const token = localStorage.getItem('publico_auth_token');
        if (!token) {
          if (mounted) {
            setError('Please log in to view milestones');
            setLoading(false);
          }
          return;
        }

        const response = await fetch(`${API_BASE_URL}/milestone/projects/all?limit=1000`, {
          signal: abortController.signal,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        
        if (!mounted) return;
        
        const data = Array.isArray(result.data) ? result.data : [];
        console.log('✅ Loaded', data.length, 'milestones');
        setMilestones(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('Failed to fetch:', err);
        if (mounted) {
          setError('Failed to load milestones');
          setLoading(false);
        }
      }
    };

    fetchMilestones();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, []);

  const handleExport = () => {
    const csvHeaders = ['Project ID', 'Project Title', 'Department', 'Total Budget', 'Start Date', 'End Date', 'Status'];
    const csvRows = filtered.map(p => [
      p._id.slice(-8),
      p.projectName,
      p.department,
      `₱${p.totalBudget.toLocaleString()}`,
      new Date(p.startDate).toLocaleDateString(),
      new Date(p.endDate).toLocaleDateString(),
      p.overallStatus
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `project_milestones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const availableDepartments = useMemo(() => {
    return ALL_DEPARTMENTS.map(d => d.value);
  }, []);

  const filtered = useMemo(() => {
    if (!milestones || milestones.length === 0) return [];
    
    return milestones.filter(p => {
      const deptMatch = dept === "All" || p.department === dept;
      const statusMatch = state === "All" || p.overallStatus === state;
      const searchMatch = !search || 
        (p.projectName?.toLowerCase().includes(search.toLowerCase()) || 
         p._id?.toLowerCase().includes(search.toLowerCase()));
      
      return deptMatch && statusMatch && searchMatch;
    });
  }, [milestones, search, dept, state]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(milestones.map(m => m.overallStatus).filter(Boolean)));
  }, [milestones]);

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
        <Button 
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Milestones
        </Button>
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
            onChange={e=>setDept(e.target.value)}
          >
            <option value="All">All Departments</option>
            {availableDepartments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select 
            className="h-10 rounded-md border px-2" 
            value={state} 
            onChange={e=>setState(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </Panel>

      <Panel>
        <div className="px-4 py-3 text-[13px] text-slate-500 border-b">
          All Project Milestones {filtered.length > 0 && `(${filtered.length} shown)`}
        </div>
        <div className="grid grid-cols-[140px_1fr_160px_140px_180px_130px] gap-x-4 px-4 py-2 text-xs text-slate-500">
          <div>Project ID</div>
          <div>Project Title</div>
          <div>Department</div>
          <div>Total Budget</div>
          <div>Timeline</div>
          <div className="text-right">Actions</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-500">
            {milestones.length === 0 ? 'No milestones found' : 'No milestones match your filters'}
          </div>
        ) : (
          filtered.map(p => (
            <div key={p._id} className="grid grid-cols-[140px_1fr_160px_140px_180px_130px] gap-x-4 px-4 py-3 border-t">
              <div className="text-[13px]">{p._id.slice(-8)}</div>
              <div className="text-[13px]">
                <div className="font-medium leading-4">{p.projectName}</div>
                <div className="text-slate-500 text-xs">
                  Status: {p.overallStatus === 'Completed' ? (
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs bg-green-500 text-white font-medium">
                      {p.overallStatus}
                    </span>
                  ) : p.overallStatus === 'In Progress' ? (
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs bg-yellow-400 text-yellow-900 font-medium">
                      {p.overallStatus}
                    </span>
                  ) : p.overallStatus === 'Cancelled' ? (
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs bg-red-500 text-white font-medium">
                      {p.overallStatus}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs bg-slate-500 text-white font-medium">
                      {p.overallStatus}
                    </span>
                  )}
                </div>
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
      
      <div className="mt-4 text-sm text-slate-600 text-center">
        Showing {filtered.length} of {milestones.length} milestones
      </div>

      <CreateMilestoneModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        budgetProjects={[]}
      />
    </>
  );
}
