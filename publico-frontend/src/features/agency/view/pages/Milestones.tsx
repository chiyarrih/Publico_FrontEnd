import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Pill } from "../../../../shared/ui";
import { useProjectMilestone } from "@admin/controller/hooks/useProjectMilestones";
import useMilestone from "@agency/controller/hooks/useMilestone";

const Eye = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const Upload = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

// Mock data for agency milestones - matching the mockup
const mockMilestones = [
  {
    _id: "PRJ-2023-0125",
    projectName: "Road Rehabilitation - Perez Blvd",
    department: "Public Works",
    totalBudget: 2500000,
    startDate: "2023-06-01",
    endDate: "2023-08-30",
    overallStatus: "In Progress",
    overallProgress: 25,
    phases: []
  },
  {
    _id: "PRJ-2023-0126",
    projectName: "Public School Renovation - Central Elementary",
    department: "Education",
    totalBudget: 1800000,
    startDate: "2023-05-15",
    endDate: "2023-07-30",
    overallStatus: "In Progress",
    overallProgress: 35,
    phases: []
  },
  {
    _id: "PRJ-2023-0127",
    projectName: "Medical Equipment Procurement - City Hospital",
    department: "Health",
    totalBudget: 3200000,
    startDate: "2023-06-10",
    endDate: "2023-09-10",
    overallStatus: "In Progress",
    overallProgress: 15,
    phases: []
  }
];

export default function Milestones() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [state, setState] = useState("All");
  const [loading, setLoading] = useState(false);
  const {milestone} = useMilestone()
  const milestones = milestone; // In real app, this would come from API

  const filtered = useMemo(() => milestones?.filter(p =>
    (dept === "All" || p.department === dept) &&
    (state === "All" || p.overallStatus === state) &&
    (p.projectName.toLowerCase().includes(search.toLowerCase()) || p._id.includes(search))
  ), [milestones, search, dept, state]);

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
          value={dept} 
          onChange={e => setDept(e.target.value)}
        >
          <option>All Departments</option>
          {Array.from(new Set(milestones?.map(m => m.department)))?.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select 
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          value={state} 
          onChange={e => setState(e.target.value)}
        >
          <option>All Statuses</option>
          {Array.from(new Set(milestones?.map(m => m.overallStatus)))?.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
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
              <div className="text-right">Status</div>
            </div>
          </div>
          
          {/* Table Body */}
          {filtered?.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No projects found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filtered?.map(project => (
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
                  <div className="flex items-center justify-end">
                    <Link 
                      to={`/agency/milestones/${project._id}`} 
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 transition-colors bg-blue-100 rounded-full hover:bg-blue-200"
                    >
                      {project.overallStatus}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
