import ProposalForm from "@agency/controller/components/forms/ProposalForm";
import React from "react";

type Status = "Approved" | "In Review" | "Pending" | "Rejected";

const rows = [
  { title: "Downtown Bridge Repair", dept: "Transportation", timeline: "2023-09-01 to 2024-02-28", amount: "₱2,800,000", status: "Approved" as Status, submitted: "2023-08-15" },
  { title: "City Park Renovation", dept: "Parks & Recreation", timeline: "2023-10-01 to 2024-05-30", amount: "₱1,200,000", status: "In Review" as Status, submitted: "2023-08-10" },
  { title: "Public Library Expansion", dept: "Education", timeline: "2023-11-01 to 2024-12-15", amount: "₱3,500,000", status: "Pending" as Status, submitted: "2023-07-22" },
  { title: "Smart Traffic Light System", dept: "Transportation", timeline: "2023-09-15 to 2024-03-30", amount: "₱950,000", status: "Rejected" as Status, submitted: "2023-08-05" },
];

/* inline SVGs (no deps) */
const I = {
  search: () => <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400"><path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  money:  () => <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400"><path d="M3 6h18v12H3z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 12h10M12 9v6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  dept:   () => <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400"><path d="M3 21h18M5 21V7l7-4 7 4v14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  cal:    () => <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400"><path d="M7 3v4M17 3v4M3 9h18M5 21h14a2 2 0 0 0 2-2V9H3v10a2 2 0 0 0 2 2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  check:  () => <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-600"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chev:   () => <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-500"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

const Chip: React.FC<{ s: Status }> = ({ s }) => {
  const m: Record<Status, string> = {
    Approved:  "bg-emerald-100 text-emerald-700",
    "In Review":"bg-blue-100 text-blue-700",
    Pending:   "bg-amber-100 text-amber-700",
    Rejected:  "bg-rose-100 text-rose-700",
  };
  return <span className={`rounded px-2 py-0.5 text-xs ${m[s]}`}>{s}</span>;
};

export default function Budgets() {
  const [tab, setTab] = React.useState<"proposals"|"new">("proposals");
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"All" | Status>("All");
  const [selectedProposal, setSelectedProposal] = React.useState<typeof rows[0] | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  const data = rows
    .filter(r => (status === "All" ? true : r.status === status))
    .filter(r => [r.title, r.dept].some(t => t.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="space-y-4">
      {/* Top card with title, tabs, controls */}
      <div className="p-4 bg-white border rounded-lg border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold text-slate-900">Project Proposals</div>
          <button onClick={()=>setTab("new")} className="px-3 text-sm text-white bg-blue-600 rounded h-9 hover:bg-blue-700">+ New Proposal</button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mt-4 text-sm">
          <button onClick={()=>setTab("proposals")} className={`pb-2 border-b-2 ${tab==="proposals"?"border-blue-600 text-blue-700":"border-transparent text-slate-500"}`}>Proposals</button>
          <button onClick={()=>setTab("new")}       className={`pb-2 border-b-2 ${tab==="new"      ?"border-blue-600 text-blue-700":"border-transparent text-slate-500"}`}>New Proposal</button>
        </div>

        {/* Search + Filters (only on Proposals tab) */}
        {tab==="proposals" && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <div className="relative flex-1 min-w-[220px]">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search proposals..." className="w-full pl-8 pr-3 text-sm border rounded h-9 border-slate-300" />
              <span className="absolute inset-y-0 flex items-center pointer-events-none left-2"><I.search/></span>
            </div>
            <select value={status} onChange={e=>setStatus(e.target.value as any)} className="px-2 text-sm border rounded h-9 border-slate-300">
              <option>All</option><option>Approved</option><option>In Review</option><option>Pending</option><option>Rejected</option>
            </select>
          </div>
        )}
      </div>

      {/* Main content */}
      {tab==="proposals" ? (
        <>
          <div className="bg-white border divide-y rounded-lg border-slate-200">
            {data.map((r)=>(
              <div key={r.title} className="p-4 hover:bg-slate-50">
                <div className="flex items-start justify-between gap-4">
                  {/* left */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-medium text-slate-900">{r.title}</div>
                    <div className="flex flex-wrap items-center mt-1 text-xs gap-x-4 gap-y-1 text-slate-500">
                      <span className="inline-flex items-center gap-1"><I.dept/>{r.dept}</span>
                      <span className="inline-flex items-center gap-1"><I.cal/>Timeline: {r.timeline}</span>
                    </div>
                  </div>

                  {/* right */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-900">
                        <I.money/>{r.amount}
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-1">
                      <div className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <I.cal/> Submitted: {r.submitted}
                      </div>
                      <Chip s={r.status}/>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedProposal(r);
                        setShowModal(true);
                      }}
                      className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:underline"
                    >
                      View Details <I.chev/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* footer notice */}
          <div className="p-3 text-xs bg-white border rounded-lg border-slate-200 text-slate-600">
            <span className="inline-flex items-center justify-center p-1 mr-2 rounded-full bg-emerald-50"><I.check/></span>
            All proposals are securely recorded on the blockchain for complete transparency and auditability.
          </div>
        </>
      ) : (
        /* New Proposal (compact mock to match style) */
        <ProposalForm setTab={()=>setTab("proposals")}/>
      )}

      {/* View Details Modal */}
      {showModal && selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Project Proposal Details</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Project Title</label>
                <p className="text-base text-gray-900">{selectedProposal.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Department</label>
                  <p className="text-base text-gray-900">{selectedProposal.dept}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1"><Chip s={selectedProposal.status}/></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Budget Amount</label>
                  <p className="text-base font-semibold text-gray-900">{selectedProposal.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Submitted Date</label>
                  <p className="text-base text-gray-900">{selectedProposal.submitted}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Timeline</label>
                <p className="text-base text-gray-900">{selectedProposal.timeline}</p>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Download Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
