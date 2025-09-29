import React from "react";

type Row = { date: string; dept: string; proj: string; amt: string; status: "Verified" | "Pending"; sig: string };
const tx: Row[] = [
  { date: "2023-09-20", dept: "Health", proj: "City Hospital Equipment", amt: "$186,000", status: "Verified", sig: "0x7d8f…f4c1" },
  { date: "2023-09-18", dept: "Education", proj: "School Renovation Phase 1", amt: "$89,500", status: "Verified", sig: "0x3c76…c79e" },
  { date: "2023-09-15", dept: "Infrastructure", proj: "Downtown Bridge Repair", amt: "$24,500", status: "Verified", sig: "0x9e8b…7c4b" },
  { date: "2023-09-12", dept: "Flood Control", proj: "Drainage System Upgrade", amt: "$156,000", status: "Pending", sig: "0x2b9e…5d4e" },
  { date: "2023-09-10", dept: "Education", proj: "Teacher Training Program", amt: "$12,300", status: "Verified", sig: "0x3ef3…2dc2" },
];

const Tag: React.FC<{ s: Row["status"] }> = ({ s }) => (
  <span className={`text-xs px-2 py-0.5 rounded ${s==="Verified"?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>{s}</span>
);

export default function Transactions() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="text-lg font-semibold">Transaction Ledger</div>
        <div className="mt-3 flex items-center gap-2">
          <input placeholder="Search transactions..." className="h-9 w-full rounded border border-slate-300 px-3 text-sm" />
          <select className="h-9 rounded border border-slate-300 px-2 text-sm"><option>All Dates</option></select>
          <select className="h-9 rounded border border-slate-300 px-2 text-sm"><option>All Departments</option></select>
          <select className="h-9 rounded border border-slate-300 px-2 text-sm"><option>All Statuses</option></select>
          <button className="h-9 px-3 rounded border border-slate-300 text-sm">Export</button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Department</th>
              <th className="text-left px-4 py-3">Project</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Signature</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {tx.map((r,i)=>(
              <tr key={i} className="border-t">
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">{r.dept}</td>
                <td className="px-4 py-3">{r.proj}</td>
                <td className="px-4 py-3">{r.amt}</td>
                <td className="px-4 py-3"><Tag s={r.status}/></td>
                <td className="px-4 py-3">{r.sig}</td>
                <td className="px-4 py-3 text-right"><button className="text-blue-600 hover:underline">...</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 border-t text-xs text-slate-500">
          Showing 1 to 5 of 10 results
          <div className="float-right space-x-2">
            <button className="px-2 py-1 rounded border">1</button>
            <button className="px-2 py-1 rounded border">2</button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
        ✅ All transactions are immutably recorded on the blockchain for complete transparency.
      </div>
    </div>
  );
}
