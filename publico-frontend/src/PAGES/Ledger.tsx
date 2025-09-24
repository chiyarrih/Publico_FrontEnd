import React, { useMemo, useState } from "react";

/* ---------------- Demo rows ---------------- */
type Row = {
  date: string; // YYYY-MM-DD
  dept: "Health" | "Education" | "Infrastructure" | "Utilities" | "Administration";
  project: string;
  amount: number; // cents not necessary here
  status: "Verified" | "Pending" | "Flagged";
  signature: string;
};

const ROWS: Row[] = [
  { date: "2023-09-20", dept: "Health",         project: "City Hospital Equipment",     amount: 156000, status: "Verified", signature: "0x97a7f63…" },
  { date: "2023-09-18", dept: "Education",      project: "School Renovation Phase 1",   amount: 98500,  status: "Verified", signature: "0x3c45c79…" },
  { date: "2023-09-15", dept: "Infrastructure", project: "Downtown Bridge Repair",      amount: 24500,  status: "Verified", signature: "0x89a47b0…" },
  { date: "2023-09-10", dept: "Education",      project: "Teacher Training Program",    amount: 12300,  status: "Verified", signature: "0xf54f782…" },
  { date: "2023-09-01", dept: "Infrastructure", project: "Road Maintenance",            amount: 45600,  status: "Verified", signature: "0x4bb3c446…" },
  // extra rows so pagination feels real
  { date: "2023-08-27", dept: "Administration", project: "Office Supplies",             amount: 3450,   status: "Verified", signature: "0x1c0aa5d…" },
  { date: "2023-08-25", dept: "Utilities",      project: "Water Sensor Upgrade",        amount: 18200,  status: "Pending",  signature: "0x2abef76…" },
  { date: "2023-08-17", dept: "Health",         project: "Clinic HVAC Repair",          amount: 8200,   status: "Verified", signature: "0x6a9d3e1…" },
  { date: "2023-08-10", dept: "Infrastructure", project: "IT Infrastructure – City Hall", amount: 87200, status: "Flagged",  signature: "0x3e2b5e4…" },
  { date: "2023-08-03", dept: "Education",      project: "STEM Lab Equipment",          amount: 26800,  status: "Verified", signature: "0x0c54a05…" },
];

/* ---------------- Small helpers ---------------- */
const formatMoney = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const StatusPill: React.FC<{ v: Row["status"] }> = ({ v }) => {
  const cls =
    v === "Verified" ? "pill pill-green" :
    v === "Pending"  ? "pill pill-yellow" :
                        "pill pill-red";
  return <span className={cls}>{v}</span>;
};

const DEPARTMENTS = ["All Departments", "Health", "Education", "Infrastructure", "Utilities", "Administration"] as const;
const PERIODS = ["This Month", "Last 30 Days", "This Quarter", "This Year"] as const;
const STATUSES = ["Verified", "Pending", "Flagged", "All"] as const;

/* ---------------- Component ---------------- */
const Ledger: React.FC = () => {
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState<typeof PERIODS[number]>("This Month");
  const [dept, setDept] = useState<typeof DEPARTMENTS[number]>("All Departments");
  const [status, setStatus] = useState<typeof STATUSES[number]>("Verified");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // naive period filter (demo): “This Month” = keep rows after the 1st of current month, etc.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startByPeriod =
      period === "This Month"   ? startOfMonth :
      period === "Last 30 Days" ? new Date(now.getTime() - 30*24*3600*1000) :
      period === "This Quarter" ? startOfQuarter : startOfYear;

    return ROWS.filter(r => {
      // period
      const dOk = new Date(r.date) >= startByPeriod;
      // dept
      const depOk = (dept === "All Departments") || (r.dept === dept);
      // status
      const sOk = (status === "All") || (r.status === status);
      // search
      const s = `${r.project} ${r.dept} ${r.signature}`.toLowerCase();
      const qOk = q === "" || s.includes(q);
      return dOk && depOk && sOk && qOk;
    });
  }, [query, period, dept, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const setSafePage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  const exportCSV = () => {
    const header = ["Date","Department","Project","Amount","Status","Signature"];
    const lines = filtered.map(r => [r.date, r.dept, r.project, formatMoney(r.amount), r.status, r.signature]);
    const csv = [header, ...lines].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transaction_ledger.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header + actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Transaction Ledger</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Export
          </button>
        </div>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-3 border-b">
          <div className="flex-1">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSafePage(1); }}
                placeholder="Search transactions…"
                className="w-full rounded border border-slate-300 bg-white pl-3 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <select value={period} onChange={(e)=>{ setPeriod(e.target.value as any); setSafePage(1); }}
                    className="rounded border border-slate-300 bg-white px-2 py-2 text-sm">
              {PERIODS.map(p => <option key={p}>{p}</option>)}
            </select>
            <select value={dept} onChange={(e)=>{ setDept(e.target.value as any); setSafePage(1); }}
                    className="rounded border border-slate-300 bg-white px-2 py-2 text-sm">
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={status} onChange={(e)=>{ setStatus(e.target.value as any); setSafePage(1); }}
                    className="rounded border border-slate-300 bg-white px-2 py-2 text-sm">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Department</th>
                <th className="py-3 px-4 font-medium">Project</th>
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Signature</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="py-3 px-4 text-slate-700 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded border text-[10px]">📅</span>
                    {r.date}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{r.dept}</td>
                  <td className="py-3 px-4 text-slate-700 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded border text-[10px]">📁</span>
                    {r.project}
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-medium">{formatMoney(r.amount)}</td>
                  <td className="py-3 px-4"><StatusPill v={r.status} /></td>
                  <td className="py-3 px-4 text-slate-500">{r.signature}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50">⋯</button>
                  </td>
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">No results.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: results + pagination */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 border-t">
          <div className="text-xs text-slate-500">
            Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
            <span className="font-medium">{Math.min(page * pageSize, filtered.length)}</span> of{" "}
            <span className="font-medium">{filtered.length}</span> results
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setSafePage(page - 1)} disabled={page === 1}
              className="rounded border border-slate-300 px-2 py-1 text-sm disabled:opacity-50">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setSafePage(p)}
                className={`rounded border px-2 py-1 text-sm ${
                  p === page ? "border-blue-500 text-white bg-blue-600" : "border-slate-300 hover:bg-slate-50"
                }`}>
                {p}
              </button>
            ))}
            <button onClick={() => setSafePage(page + 1)} disabled={page === totalPages}
              className="rounded border border-slate-300 px-2 py-1 text-sm disabled:opacity-50">›</button>
          </div>
        </div>
      </div>

      {/* Blockchain footnote */}
      <div className="card p-4">
        <div className="flex items-start gap-2 text-xs text-slate-600">
          <span className="pill pill-green">✓</span>
          <div>
            All transactions are immutably recorded on the blockchain for complete transparency.<br />
            Each transaction has a unique cryptographic signature that can be verified on the public ledger.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
