import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../../controller/admin/services/admin.api";
import { Button, Badge, Card, Input, Select, Ghost } from "../ui/blocks";
import type { TxnRow } from "../../../model/admin/types/admin";

const tone=(s:TxnRow["status"])=>s==="Completed"?"green":s==="Pending"?"yellow":"red";

export default function Transactions(){
  const [rows,setRows]=useState<TxnRow[]>([]);
  const [q,setQ]=useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  useEffect(()=>{ api.getTransactions().then(setRows);},[]);
  
  const filtered=useMemo(()=>{
    return rows.filter(r=>{
      const matchesSearch = [r.id,r.dept,r.project].join(" ").toLowerCase().includes(q.toLowerCase());
      const matchesDept = deptFilter === "All Departments" || r.dept === deptFilter;
      const matchesStatus = statusFilter === "All Statuses" || r.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  },[rows,q,deptFilter,statusFilter]);

  const departments = ["All Departments", ...Array.from(new Set(rows.map(r => r.dept)))];
  const statuses = ["All Statuses", "Completed", "Pending", "Failed"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transaction Ledger</h1>
        <Button className="flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Ledger
        </Button>
      </div>

      <Card>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input 
                placeholder="Search transactions by ID, project, department..." 
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
              </svg>
              Date Range
            </Ghost>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Transaction ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Department</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Project</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Digital Signature</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t,index)=>(
                <tr key={index} className="bg-white hover:bg-slate-50/60 border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-3">
                    <a href="#" className="text-sky-600 hover:underline font-medium">{t.id}</a>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{t.date}</td>
                  <td className="px-4 py-3 text-slate-600">{t.dept}</td>
                  <td className="px-4 py-3 text-slate-900">{t.project}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">₱{t.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge tone={tone(t.status)}>{t.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{t.hash}</code>
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
      </Card>
    </div>
  );
}
