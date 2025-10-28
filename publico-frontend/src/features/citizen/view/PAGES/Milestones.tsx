import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getKeyProjects } from "../../controller/data/dashboardService";
import { useDebounce } from "../../controller/hooks/useDebounce";
import { SimpleDepartmentSelect } from "@/shared/components/DepartmentSelect";
import { useDepartmentFilter } from "../context/DepartmentFilterContext";

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
      className="grid grid-cols-12 items-center gap-4 border-t first:border-t-0 px-6 py-5 hover:bg-slate-50 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="col-span-2 text-sm text-slate-500 truncate">{row.code ?? row._id}</div>
      <div className="col-span-2">
        <div className="text-sm font-medium text-slate-900 leading-5 truncate">{row.projectName ?? "-"}</div>
      </div>
      <div className="col-span-2">
        <span className="text-slate-500 text-sm truncate block">{row.department ?? "-"}</span>
      </div>
      <div className="col-span-2">
        <span className="text-slate-500 text-sm truncate block">{row.agencyId?.agency_name ?? "-"}</span>
      </div>
      <div className="col-span-2">
        <span className="text-blue-600 text-sm font-semibold">{peso(row.totalBudget || row.budget)}</span>
      </div>
      <div className="col-span-2 flex justify-end">
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap">
          {row.overallStatus || (row.status ?? "In Progress")}
        </span>
      </div>
    </div>
  );
};

// Pagination component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  startIndex: number;
  endIndex: number;
}> = ({ currentPage, totalPages, onPageChange, totalResults, startIndex, endIndex }) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Number of page buttons to show
    
    if (totalPages <= showPages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        end = showPages;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - showPages + 1;
      }
      
      if (start > 2) pages.push('...');
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) pages.push('...');
      
      // Always show last page
      if (totalPages > 1) pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
      <div className="text-sm text-slate-600">
        Showing {startIndex + 1} to {endIndex} of {totalResults} results
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          ‹ Prev
        </button>
        
        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`min-w-[2.5rem] px-3 py-1.5 text-sm border rounded ${
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : page === '...'
                ? 'border-transparent cursor-default'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

const Milestones: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDepartment, setSelectedDepartment, availableDepartments, setAvailableDepartments } = useDepartmentFilter();
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);
  const [status, setStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Use selectedDepartment from context, defaulting to "All Departments"
  const dept = selectedDepartment === "All" ? "All Departments" : selectedDepartment;

  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true); setErr(null);
        const arr = await getKeyProjects(1000);
        console.log('Loaded projects:', arr);
        if (!ignore) {
          setRows(arr);
          
          // Extract unique departments and update context
          const uniqueDepartments = Array.from(new Set(arr.map(p => p.department).filter(d => d && d !== "-")));
          setAvailableDepartments(uniqueDepartments);
          
          if (arr.length === 0) {
            setErr("No projects available. Check back later or contact support.");
          }
        }
      } catch (e: any) {
        console.error('Error loading projects:', e);
        if (!ignore) setErr(e?.message || "Failed to load projects. Please try refreshing the page.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQ, selectedDepartment, status]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const name = (r.projectName ?? "").toLowerCase();
      const code = (r._id ?? r.code ?? "").toLowerCase();
      const searchQuery = debouncedQ.toLowerCase();
      
      const mQ = !debouncedQ || name.includes(searchQuery) || code.includes(searchQuery);
      
      const projectDept = (r.department ?? "").trim();
      const selectedDept = dept.trim();
      const mDept = selectedDept === "All Departments" || 
                    projectDept === selectedDept || 
                    projectDept.toLowerCase() === selectedDept.toLowerCase();
      
      const projectStatus = (r.status ?? r.overallStatus ?? "").trim();
      const selectedStatus = status.trim();
      const mStat = selectedStatus === "All Statuses" ||
                    projectStatus === selectedStatus ||
                    projectStatus.toLowerCase() === selectedStatus.toLowerCase();
      
      return mQ && mDept && mStat;
    });
  }, [debouncedQ, dept, status, rows]);

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const paginatedData = filtered.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr,220px,220px]">
          <div className="relative">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects..." className="w-full rounded-lg border border-slate-200 px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2.5 text-sm text-slate-700"
          >
            <option value="All">All Departments</option>
            {availableDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2.5 text-sm text-slate-700">
            <option>All Statuses</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Delayed</option>
            <option>Not Started</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-3 text-sm font-medium text-slate-600">Approved Projects</div>
        
        {/* Horizontal scroll wrapper */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <div className="col-span-2">Project ID</div>
              <div className="col-span-2">Project Name</div>
              <div className="col-span-2">Department</div>
              <div className="col-span-2">Agency</div>
              <div className="col-span-2">Budget</div>
              <div className="col-span-2 text-right">Status</div>
            </div>
            
            {/* Table body */}
            {err && <div className="px-6 py-4 text-sm text-rose-600">{err}</div>}
            {loading && <div className="px-6 py-4 text-sm text-slate-500">Loading projects…</div>}
            
            {!loading && !err && (
              <div>
                {paginatedData.map((r) => (
                  <RowCard 
                    key={r._id ?? r.code} 
                    row={r} 
                    onClick={() => navigate(`/citizen/milestones/${encodeURIComponent(String(r._id ?? r.code))}`)} 
                  />
                ))}
                {filtered.length === 0 && (
                  <div className="px-6 py-8 text-center text-sm text-slate-500">No projects found.</div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Pagination */}
        {!loading && !err && filtered.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalResults={filtered.length}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        )}
       </div>
     </div>
  );
};

export default Milestones;
