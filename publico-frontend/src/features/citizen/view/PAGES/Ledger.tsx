import React, { useMemo, useState } from "react";
import { Card, Select, Input, OutlineBtn, statusToPill } from "../../../../shared/ui";
import { LEDGER_ROWS } from "../../controller/data/demo";

/* helpers */
const money = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const DEPTS    = ["All Departments","Health","Education","Infrastructure","Utilities","Administration"] as const;
const PERIODS  = ["This Month","Last 30 Days","This Quarter","This Year"] as const;
const STATUSES = ["Verified","Pending","Flagged","All"] as const;

export default function Ledger() {
  const [query, setQuery]     = useState("");
  const [period, setPeriod]   = useState<typeof PERIODS[number]>("This Month");
  const [dept, setDept]       = useState<typeof DEPTS[number]>("All Departments");
  const [status, setStatus]   = useState<typeof STATUSES[number]>("Verified");
  const [page, setPage]       = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    const now = new Date();
    const startOfMonth   = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth()/3)*3, 1);
    const startOfYear    = new Date(now.getFullYear(), 0, 1);
    const start =
      period === "This Month"   ? startOfMonth :
      period === "Last 30 Days" ? new Date(now.getTime() - 30*24*3600*1000) :
      period === "This Quarter" ? startOfQuarter : startOfYear;

    const q = query.trim().toLowerCase();
    return LEDGER_ROWS.filter(r => {
      const dOk  = new Date(r.date) >= start;
      const dep  = dept === "All Departments" || r.dept === dept;
      const st   = status === "All" || r.status === status;
      const text = q === "" || `${r.project} ${r.dept} ${r.signature}`.toLowerCase().includes(q);
      return dOk && dep && st && text;
    });
  }, [query, period, dept, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows   = filtered.slice((page-1)*pageSize, page*pageSize);
  const setSafePage = (p:number) => setPage(Math.min(Math.max(1,p), totalPages));

  const exportCSV = () => {
    const header = ["Date","Department","Project","Amount","Status","Signature"];
    const lines  = filtered.map(r => [r.date,r.dept,r.project,money(r.amount),r.status,r.signature]);
    const csv    = [header, ...lines].map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const url    = URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8"}));
    const a = document.createElement("a"); a.href = url; a.download = "transaction_ledger.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar & Table inside one Card (title comes from layout) */}
      <Card>
        {/* toolbar row: search (left), filters (middle), export (right) */}
        <div className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:gap-4">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(e)=>{ setQuery(e.target.value); setSafePage(1); }}
              placeholder="Search transactions…"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Select value={period} onChange={(e)=>{ setPeriod(e.target.value as any); setSafePage(1); }}>
              {PERIODS.map(p => <option key={p}>{p}</option>)}
            </Select>
            <Select value={dept} onChange={(e)=>{ setDept(e.target.value as any); setSafePage(1); }}>
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </Select>
            <Select value={status} onChange={(e)=>{ setStatus(e.target.value as any); setSafePage(1); }}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </Select>
            <OutlineBtn onClick={exportCSV}>Export</OutlineBtn>
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Signature</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3">{r.dept}</td>
                  <td className="px-4 py-3">{r.project}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{money(r.amount)}</td>
                  <td className="px-4 py-3">{statusToPill(r.status)}</td>
                  <td className="px-4 py-3 text-slate-500">{r.signature}</td>
                  <td className="px-4 py-3 text-right">
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

        {/* footer / pagination */}
        <div className="flex flex-col gap-3 border-t px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-slate-500">
            Showing <span className="font-medium">{filtered.length ? (page-1)*pageSize+1 : 0}</span> to{" "}
            <span className="font-medium">{Math.min(page*pageSize, filtered.length)}</span> of{" "}
            <span className="font-medium">{filtered.length}</span> results
          </div>
          <div className="flex items-center gap-1">
            <button onClick={()=>setSafePage(page-1)} disabled={page===1} className="rounded border border-slate-300 px-2 py-1 text-sm disabled:opacity-50">‹</button>
            {Array.from({length: totalPages}, (_,i)=>i+1).map(p=>(
              <button
                key={p}
                onClick={()=>setSafePage(p)}
                className={`rounded border px-2 py-1 text-sm ${
                  p===page ? "border-blue-500 bg-blue-600 text-white" : "border-slate-300 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button onClick={()=>setSafePage(page+1)} disabled={page===totalPages} className="rounded border border-slate-300 px-2 py-1 text-sm disabled:opacity-50">›</button>
          </div>
        </div>
      </Card>

      {/* verification stripe */}
      <Card>
        <div className="flex items-start gap-2 text-xs text-slate-600">
          <span className="pill pill-green">✓</span>
          <div>
            All transactions are immutably recorded on the blockchain for complete transparency.<br />
            Each transaction has a unique cryptographic signature that can be verified on the public ledger.
          </div>
        </div>
      </Card>
    </div>
  );
}
