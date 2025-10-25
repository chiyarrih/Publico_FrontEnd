import React, { useEffect, useMemo, useState } from "react";
import { Card, Select, Input, OutlineBtn, statusToPill } from "../../../../shared/ui";
import { fetchLedger } from "../../controller/data/dashboardService";
import { useDebounce } from "../../controller/hooks/useDebounce";

type Tx = {
  date?: string;
  dept?: string;
  project?: string;
  amount?: number;
  status?: "Verified" | "Pending" | "Flagged" | string;
  signature?: string;
};

const money = (n?: number) =>
  typeof n === "number" ? n.toLocaleString("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }) : "-";

const DEPTS    = ["All Departments","Health","Education","Infrastructure","Utilities","Administration"] as const;
const PERIODS  = ["All Time","This Month","Last 30 Days","This Quarter","This Year"] as const;
const STATUSES = ["Verified","Pending","Flagged","All"] as const;

export default function Ledger() {
  const [query, setQuery]     = useState("");
  const debouncedQuery        = useDebounce(query, 300); // Debounce search input
  const [period, setPeriod]   = useState<typeof PERIODS[number]>("All Time");
  const [dept, setDept]       = useState<typeof DEPTS[number]>("All Departments");
  const [status, setStatus]   = useState<typeof STATUSES[number]>("Verified");
  const [page, setPage]       = useState(1);
  const pageSize              = 10;

  const [rows, setRows]       = useState<Tx[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true); setErr(null);
        const res = await fetchLedger(page, pageSize); // {items,total}
        if (ignore) return;
        setRows(Array.isArray(res?.items) ? res.items : []);
        setTotal(typeof res?.total === "number" ? res.total : (res?.items?.length ?? 0));
      } catch (e: any) {
        if (!ignore) setErr(e?.message || "Failed to load ledger");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [page]);

  // Client-side filtering for better UX (combine with server pagination for production)
  const filtered = useMemo(() => {
    const now = new Date();
    const startOfMonth   = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth()/3)*3, 1);
    const startOfYear    = new Date(now.getFullYear(), 0, 1);
    const start = period === "All Time" ? new Date(2000, 0, 1) // Show all historical data
                  : period === "This Month" ? startOfMonth 
                  : period === "Last 30 Days" ? new Date(now.getTime() - 30*24*3600*1000)
                  : period === "This Quarter" ? startOfQuarter 
                  : startOfYear;
    const q = debouncedQuery.trim().toLowerCase(); // Use debounced query
    return rows.filter(r => {
      const dOk  = r.date ? new Date(r.date) >= start : true;
      const dep  = dept === "All Departments" || r.dept === dept;
      const st   = status === "All" || r.status === status;
      const text = q === "" || `${r.project ?? ""} ${r.dept ?? ""} ${r.signature ?? ""}`.toLowerCase().includes(q);
      return dOk && dep && st && text;
    });
  }, [rows, debouncedQuery, period, dept, status]);

  // Note: For production, move filtering to backend and use server-side pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const setSafePage = (p:number) => setPage(Math.min(Math.max(1,p), totalPages));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = () => {
    const header = ["Date","Department","Project","Amount","Status","Signature"];
    const lines  = filtered.map(r => [r.date ?? "", r.dept ?? "", r.project ?? "", money(r.amount), r.status ?? "", r.signature ?? ""]);
    const csv    = [header, ...lines].map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const url    = URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8"}));
    const a = document.createElement("a"); a.href = url; a.download = "transaction_ledger.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:gap-4">
          <div className="flex-1">
            <Input value={query} onChange={(e)=>{ setQuery(e.target.value); setSafePage(1); }} placeholder="Search transactions…" />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Select value={period} onChange={(e)=>{ setPeriod(e.target.value as any); setSafePage(1); }}>{PERIODS.map(p => <option key={p}>{p}</option>)}</Select>
            <Select value={dept} onChange={(e)=>{ setDept(e.target.value as any); setSafePage(1); }}>{DEPTS.map(d => <option key={d}>{d}</option>)}</Select>
            <Select value={status} onChange={(e)=>{ setStatus(e.target.value as any); setSafePage(1); }}>{STATUSES.map(s => <option key={s}>{s}</option>)}</Select>
            <OutlineBtn onClick={exportCSV} disabled={!filtered.length}>Export</OutlineBtn>
          </div>
        </div>

        {err && <div className="px-4 pb-2 text-sm text-rose-600">{err}</div>}
        {loading && <div className="px-4 pb-2 text-sm text-slate-500">Loading ledger…</div>}

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
                <tr key={`${r.signature ?? "row"}-${i}`} className="border-t">
                  <td className="px-4 py-3">{r.date ?? "-"}</td>
                  <td className="px-4 py-3">{r.dept ?? "-"}</td>
                  <td className="px-4 py-3">{r.project ?? "-"}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{money(r.amount)}</td>
                  <td className="px-4 py-3">{statusToPill((r.status as any) ?? "Verified")}</td>
                  <td className="px-4 py-3 text-slate-500 truncate max-w-[16rem]">{r.signature ?? "-"}</td>
                  <td className="px-4 py-3 text-right"><button className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50">⋯</button></td>
                </tr>
              ))}
              {!loading && pageRows.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-slate-500">No results.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-slate-500">
            Showing <span className="font-medium">{filtered.length ? (page-1)*pageSize+1 : 0}</span> to{" "}
            <span className="font-medium">{Math.min(page*pageSize, filtered.length)}</span> of{" "}
            <span className="font-medium">{filtered.length}</span> results
          </div>
          <div className="flex items-center gap-1">
            <button onClick={()=>setSafePage(page-1)} disabled={page===1} className="rounded border border-slate-300 px-2 py-1 text-sm disabled:opacity-50">‹</button>
            {Array.from({length: Math.min(6, totalPages)}, (_,i)=> {
              const p = Math.min(Math.max(1, page-3)+i, totalPages);
              return <button key={p} onClick={()=>setSafePage(p)} className={`rounded border px-2 py-1 text-sm ${p===page ? "border-blue-500 bg-blue-600 text-white" : "border-slate-300 hover:bg-slate-50"}`}>{p}</button>;
            })}
            <button onClick={()=>setSafePage(page+1)} disabled={page===totalPages} className="rounded border border-slate-300 px-2 py-1 text-sm disabled:opacity-50">›</button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-2 text-xs text-slate-600">
          <span className="pill pill-green">✓</span>
          <div>All transactions are immutably recorded on the blockchain for complete transparency. Each transaction includes a verifiable signature.</div>
        </div>
      </Card>
    </div>
  );
}
