import React from "react";

type Doc = {
  name: string; dept: string; cat: string; date: string; size: string; status: "Verified" | "Pending";
};
const docs: Doc[] = [
  { name: "Q3 Budget Report.pdf", dept: "Finance", cat: "Budget", date: "2023-09-01", size: "2.4 MB", status: "Verified" },
  { name: "Downtown Bridge Design.jpg", dept: "Transportation", cat: "Project", date: "2023-08-25", size: "5.7 MB", status: "Verified" },
  { name: "City Park Renovation Contract.pdf", dept: "Parks & Recreation", cat: "Contract", date: "2023-08-20", size: "1.2 MB", status: "Verified" },
  { name: "Monthly Expenditure.xlsx", dept: "Finance", cat: "Budget", date: "2023-08-15", size: "1.8 MB", status: "Verified" },
  { name: "Infrastructure_Project_ation.p", dept: "Infrastructure", cat: "Project", date: "2023-09-10", size: "4.2 MB", status: "Verified" },
  { name: "Public_Library_Expansion.pdf", dept: "Education", cat: "Project", date: "2023-08-06", size: "3.1 MB", status: "Pending" },
  { name: "IT Infrastructure_Upgrade.pdf", dept: "IT", cat: "Invoice", date: "2023-08-02", size: "2.5 MB", status: "Verified" },
  { name: "Annual Budget Allocation.xlsx", dept: "Finance", cat: "Budget", date: "2023-07-28", size: "1.7 MB", status: "Verified" },
];

const Status: React.FC<{ s: Doc["status"] }> = ({ s }) => (
  <span className={`text-xs px-2 py-0.5 rounded ${s === "Verified" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{s}</span>
);

export default function Documents() {
  const [q, setQ] = React.useState("");
  const filtered = docs.filter(d => d.name.toLowerCase().includes(q.toLowerCase()) || d.dept.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="text-lg font-semibold">Document Management</div>
        <div className="mt-3 flex items-center gap-2">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search documents..." className="h-9 w-full rounded border border-slate-300 px-3 text-sm" />
          <select className="h-9 rounded border border-slate-300 px-2 text-sm"><option>All Categories</option></select>
          <select className="h-9 rounded border border-slate-300 px-2 text-sm"><option>All Departments</option></select>
          <button className="h-9 px-3 rounded border border-slate-300 text-sm">▦</button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d=>(
          <div key={d.name} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="h-24 mb-3 rounded bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm">file preview</div>
            <div className="font-medium truncate">{d.name}</div>
            <div className="mt-1 text-xs text-slate-500">Department: {d.dept}</div>
            <div className="text-xs text-slate-500">Category: {d.cat}</div>
            <div className="text-xs text-slate-500">Uploaded: {d.date} • {d.size}</div>
            <div className="mt-2"><Status s={d.status}/></div>
            <div className="mt-3 flex items-center gap-3">
              <button className="text-sm text-blue-600 hover:underline">View</button>
              <button className="text-sm text-slate-600 hover:underline">Download</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between text-xs text-slate-600">
        <span>🔐 All documents are verified and secured on the blockchain for complete transparency.</span>
        <button className="text-blue-600 hover:underline">View on Blockchain Explorer</button>
      </div>
    </div>
  );
}
