import useMilestone from "@agency/controller/hooks/useMilestone";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const Eye = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const Upload = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;


export default function Milestones() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const {milestone, loading, error, refetch} = useMilestone()
  const milestones = milestone || []; // Use real API data

  const filtered = useMemo(() => milestones?.filter(p =>
    (state === "All" || p.overallStatus === state) &&
    (p.projectName.toLowerCase().includes(search.toLowerCase()) || p._id.includes(search))
  ), [milestones, search, state]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleUploadProof = (milestoneId: string, phaseNumber: number) => {
    // In real app, this would open a file upload modal
    alert(`Upload proof of work for milestone ${milestoneId}, phase ${phaseNumber}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading milestones...</div>
      </div>
    );
  }

  // Show empty state if no milestones and no error
  if (!loading && !error && milestones.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mb-2 text-gray-600">No milestones found</div>
          <div className="text-sm text-gray-500">You don't have any project milestones assigned yet.</div>
          <div className="text-sm text-gray-500">Contact your administrator to get milestones assigned to your agency.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mb-2 text-red-600">Error loading milestones</div>
          <div className="mb-4 text-sm text-gray-600">{error}</div>
          <button 
            onClick={refetch} 
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-semibold">Project Milestones</div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Search projects..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          value={state} 
          onChange={e => setState(e.target.value)}
        >
          <option>All Statuses</option>
          <option value="In Progress">In Progress</option>
          <option value="Delayed">Delayed</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Approved Projects Section */}
      <div className="mb-6"> 
        <h2 className="mb-4 text-lg font-semibold">Approved Projects</h2>
        
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
          {/* Table Header */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-6 gap-4 px-6 py-3 text-sm font-medium text-gray-700">
              <div>Project ID</div>
              <div>Project Name</div>
              <div>Department</div>
              <div>Budget</div>
              <div>Timeline</div>
              <div className="flex items-center justify-end gap-2">
                <span>Status</span>
                <span>Action</span>
              </div>
            </div>
          </div>
          
          {/* Table Body */}
          {filtered?.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No projects found
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {paginatedData?.map(project => (
                  <div key={project._id} className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50">
                    <div className="text-sm font-medium text-gray-900">{project._id}</div>
                    <div className="text-sm text-gray-900">{project.projectName}</div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {project.department}
                    </div>
                    <div className="text-sm font-semibold text-blue-600">₱{project.totalBudget.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                        {project.overallStatus}
                      </span>
                      <Link 
                        to={`/agency/milestones/${project._id}`}
                        className="inline-flex items-center justify-center w-8 h-8 text-gray-600 transition-colors rounded-lg hover:text-blue-600 hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {filtered?.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 mt-4 bg-white border border-gray-200 rounded-lg sm:px-6">
            <div className="flex items-center text-sm text-gray-700">
              <span className="mr-2">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)} to{" "}
                {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} results
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    currentPage === idx + 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
