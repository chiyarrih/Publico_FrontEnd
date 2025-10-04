import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

type Phase = {
  key: string;
  name: string;
  budget: number;
  spent: number;
  percent: number; // 0..100
  range: string;
  status: "Completed"|"In Progress"|"Pending";
  proofs: { id: string; title: string; note: string; size: string; by: string; date: string; status: "Verified"|"Pending Verification" }[];
};

const peso = (n:number)=> `₱${n.toLocaleString()}`;

const phases: Phase[] = [
  {
    key: "planning", name: "Planning", budget: 300_000, spent: 280_000, percent: 100, range: "Jun 1, 2023 – Jun 15, 2023", status: "Completed",
    proofs: [
      { id:"plan-receipts", title:"Material Purchase Receipts", note:"Official receipts for all construction materials purchased", size:"2.6 MB", by:"Procurement Officer", date:"2023-06-25", status:"Verified" }
    ],
  },
  {
    key: "procurement", name: "Procurement", budget: 900_000, spent: 950_000, percent: 75, range: "Jun 16, 2023 – Jul 15, 2023", status: "In Progress",
    proofs: [
      { id:"equip-contract", title:"Equipment Rental Agreement", note:"Signed contract for equipment rental including terms and conditions", size:"1.5 MB", by:"Procurement Officer", date:"2023-07-06", status:"Pending Verification" }
    ],
  },
  { key: "construction", name: "Construction", budget: 1_200_000, spent: 0, percent: 0, range: "Jul 16, 2023 – Aug 15, 2023", status:"Pending", proofs: [] },
  { key: "completion", name: "Completion", budget: 200_000, spent: 0, percent: 0, range: "Aug 16, 2023 – Aug 30, 2023", status:"Pending", proofs: [] },
];

export default function MilestoneDetail() {
  const { id } = useParams();
  const title = id === "road-rehab" ? "Road Rehabilitation - Perez Blvd" : "Selected Project";
  const [openProof, setOpenProof] = useState<null | Phase["proofs"][number]>(null);

  return (
    <div className="space-y-4">
      {/* banner alerts (examples) */}
      <div className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
        Procurement phase exceeded budget by ₱150,000 (0.43 ETH)
      </div>
      <div className="rounded border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
        Planning phase completed under budget by ₱20,000 (0.06 ETH)
      </div>

      {/* breadcrumb + title row */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Link to="/citizen/milestones" className="hover:underline">
          Project <span className="bg-yellow-200 px-1 rounded">Milestones</span>
        </Link>
        <span>›</span>
        <span className="text-slate-900 font-medium">{title}</span>
        <div className="ml-auto text-xs text-slate-500">Project ID: PRJ-2023-0125</div>
      </div>

      {/* overview */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-slate-500">Department</div>
            <div className="font-medium text-slate-900">Public Works</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Total Budget</div>
            <div className="font-medium text-blue-600">₱2,500,000</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Timeline</div>
            <div className="font-medium text-slate-900">Jun 1, 2023 – Aug 30, 2023</div>
          </div>
          <div className="sm:col-span-3">
            <div className="text-sm text-slate-500 mt-3 mb-1">Overall Progress</div>
            <div className="h-2 bg-slate-200 rounded overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: "45%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* timeline (cards per phase) */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-4 py-3 font-semibold text-slate-900">Project Timeline</div>
        <div className="divide-y">
          {phases.map((p, idx)=>(
            <div key={p.key} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-white ${p.status==="Completed"?"bg-emerald-600":p.status==="In Progress"?"bg-blue-600":"bg-slate-400"}`}>{idx+1}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-slate-900">{p.name}</div>
                    <span className={`text-xs px-2 py-0.5 rounded ${p.status==="Completed"?"bg-emerald-100 text-emerald-700":p.status==="In Progress"?"bg-blue-100 text-blue-700":"bg-slate-100 text-slate-600"}`}>{p.status}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="text-sm text-slate-700">
                      <div className="text-slate-500">Budget</div>
                      <div className="font-medium">{peso(p.budget)} <span className="text-slate-400 text-xs">( { (p.budget/1_000_000).toFixed(2)} ETH )</span></div>
                    </div>
                    <div className="text-sm text-slate-700">
                      <div className="text-slate-500">Spent</div>
                      <div className="font-medium">{peso(p.spent)} <span className="text-slate-400 text-xs">( { (p.spent/1_000_000).toFixed(2)} ETH )</span></div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="mb-1 text-xs text-slate-500">Progress</div>
                    <div className="h-2 rounded bg-slate-200 overflow-hidden">
                      <div className={`h-full ${p.status==="Completed"?"bg-emerald-600":"bg-blue-600"}`} style={{ width: `${p.percent}%` }} />
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{p.range}</div>
                  </div>

                  {/* proofs (read-only, open modal) */}
                  {p.proofs.length>0 && (
                    <div className="mt-4 rounded border border-slate-200">
                      {p.proofs.map((f,i)=>(
                        <div key={f.id} className="flex items-center justify-between px-3 py-2 text-sm border-t first:border-t-0">
                          <div className="min-w-0">
                            <div className="font-medium text-slate-800 truncate">{f.title}</div>
                            <div className="text-xs text-slate-500 truncate">{f.note}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-2 py-0.5 rounded ${f.status==="Verified"?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>{f.status}</span>
                            <button onClick={()=>setOpenProof(f)} className="h-8 rounded border border-slate-300 px-2 text-xs">View</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* expense summary for current phase (sample) */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-slate-900">Procurement <span className="text-slate-400 font-normal">Phase</span></div>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">In Progress</span>
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="rounded bg-slate-50 p-3"><div className="text-slate-500">Budget Allocation</div><div className="font-semibold">{peso(900000)}</div></div>
          <div className="rounded bg-slate-50 p-3"><div className="text-slate-500">Expenses to Date</div><div className="font-semibold">{peso(950000)}</div></div>
          <div className="rounded bg-slate-50 p-3"><div className="text-slate-500">Remaining Budget</div><div className="font-semibold">₱-150,000</div></div>
          <div className="rounded bg-slate-50 p-3"><div className="text-slate-500">Timeline</div><div className="font-semibold">Jun 16, 2023 – Jul 15, 2023</div></div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium text-slate-800 mb-2">Expense Tracker</div>
          <div className="rounded border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Amount (PHP)</th>
                  <th className="p-2 text-left">Amount (ETH)</th>
                  <th className="p-2 text-left">Supporting File</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="p-2">2023-06-20</td><td className="p-2">Construction materials purchase</td><td className="p-2">{peso(650000)}</td><td className="p-2">1.88 ETH</td><td className="p-2"><button onClick={()=>setOpenProof(phases[1].proofs[0])} className="text-blue-600 underline text-xs">View</button></td></tr>
                <tr><td className="p-2">2023-07-05</td><td className="p-2">Equipment rental</td><td className="p-2">{peso(300000)}</td><td className="p-2">0.87 ETH</td><td className="p-2"><button onClick={()=>setOpenProof(phases[1].proofs[0])} className="text-blue-600 underline text-xs">View</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Proof Modal (read-only) */}
      {openProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={()=>setOpenProof(null)} />
          <div className="relative w-[min(640px,94vw)] rounded-lg border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <div className="font-semibold text-slate-900">{openProof.title}</div>
              <button className="p-1 rounded hover:bg-slate-100" onClick={()=>setOpenProof(null)}>✕</button>
            </div>
            <div className="px-5 py-4 text-sm">
              <div className="text-slate-600">{openProof.note}</div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-slate-500">Uploaded By</div><div className="font-medium">{openProof.by}</div></div>
                <div><div className="text-slate-500">Upload Date</div><div className="font-medium">{openProof.date}</div></div>
                <div><div className="text-slate-500">Verification Status</div>
                  <div className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${openProof.status==="Verified"?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>{openProof.status}</div>
                </div>
              </div>

              <div className="mt-4 rounded border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-800 truncate">receipts-bundle.pdf</div>
                  <div className="text-xs text-slate-500">{openProof.size}</div>
                </div>
                <button className="mt-3 h-9 rounded bg-blue-600 px-3 text-sm text-white hover:bg-blue-700">
                  View Document
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
              <button className="h-9 rounded border border-slate-300 px-3 text-sm" onClick={()=>setOpenProof(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
