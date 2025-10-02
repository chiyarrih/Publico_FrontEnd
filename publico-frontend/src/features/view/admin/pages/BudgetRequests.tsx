import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../../controller/admin/services/admin.api";
import { Badge, Button, Card, Input, Select, Table, Ghost } from "../ui/blocks";
import type { BudgetRequest } from "../../../model/admin/types/admin";

const tone=(s:BudgetRequest["status"])=>s==="Approved"?"green":s==="Pending"?"yellow":s==="Rejected"?"red":"blue";

export default function BudgetRequests(){
  const [items,setItems]=useState<BudgetRequest[]>([]);
  const [q,setQ]=useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(()=>{ api.getBudgetRequests().then(setItems);},[]);
  
  const filtered=useMemo(()=>{
    return items.filter(i=>{
      const matchesSearch = [i.id,i.dept,i.project].join(" ").toLowerCase().includes(q.toLowerCase());
      const matchesDept = deptFilter === "All Departments" || i.dept === deptFilter;
      const matchesStatus = statusFilter === "All Statuses" || i.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  },[items,q,deptFilter,statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filtered.length);

  const departments = ["All Departments", ...Array.from(new Set(items.map(i => i.dept)))];
  const statuses = ["All Statuses", "Pending", "Approved", "Reviewed", "Rejected"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Budget Requests</h1>
      </div>
      
      <Card>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input 
                placeholder="Search projects, departments, or ID..." 
                value={q} 
                onChange={e=>setQ(e.target.value)} 
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </Select>
            
            <Select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
            
            <Ghost className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              More Filters
            </Ghost>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Project ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Department</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Project Name</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((r,ri)=>(
                <tr key={ri} className="bg-white hover:bg-slate-50/60 border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-3">
                    <a href="#" className="text-sky-600 hover:underline font-medium">{r.id}</a>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.date}</td>
                  <td className="px-4 py-3 text-slate-600">{r.dept}</td>
                  <td className="px-4 py-3 text-slate-900">{r.project}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">₱{r.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge tone={tone(r.status)}>{r.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-sky-600 hover:text-sky-700">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {startItem} to {endItem} of {filtered.length} results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-lg ${
                  currentPage === page
                    ? 'bg-sky-600 text-white'
                    : 'border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
