import React, { useEffect, useMemo, useState } from "react";
import { Card, Select, Input, OutlineBtn, statusToPill } from "../../../../shared/ui";
import { fetchLedger } from "../../controller/data/dashboardService";
import { useDebounce } from "../../controller/hooks/useDebounce";
import toast from "react-hot-toast";

type Tx = {
  _id?: string;
  id?: string;
  date?: string;
  dept?: string;
  department?: string;
  project?: string;
  projectName?: string;
  amount?: number;
  status?: "Verified" | "Pending" | "Flagged" | string;
  signature?: string;
  hash?: string;
  sig?: string;
  purpose?: string;
  createdAt?: string;
};

const money = (n?: number) =>
  typeof n === "number" ? n.toLocaleString("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }) : "-";

const DEPTS    = ["All Departments","Health","Education","Infrastructure","Utilities","Administration","Public Works","Social Welfare","Department of Public Works and Highways"] as const;
const PERIODS  = ["This Month","Last 30 Days","This Quarter","This Year","All Time"] as const;
const STATUSES = ["Verified","Pending","Flagged","All"] as const;

// Transaction Detail Modal Component
const TransactionModal: React.FC<{
  transaction: Tx | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const verifyTransaction = () => {
    toast.success("Transaction verification initiated!");
    // In a real app, this would trigger blockchain verification
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Transaction Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Project</label>
              <p className="text-sm">{transaction.project || transaction.projectName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Department</label>
              <p className="text-sm">{transaction.dept || transaction.department || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Amount</label>
              <p className="text-sm font-semibold">{money(transaction.amount)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-1">{statusToPill(transaction.status as any)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date</label>
              <p className="text-sm">{transaction.date || transaction.createdAt?.slice(0, 10) || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Purpose</label>
              <p className="text-sm">{transaction.purpose || "Government Project Funding"}</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Blockchain Signature</label>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs font-mono bg-gray-100 p-2 rounded flex-1 truncate">
                {transaction.signature || transaction.hash || transaction.sig || "N/A"}
              </p>
              <button 
                onClick={() => copyToClipboard(transaction.signature || transaction.hash || transaction.sig || "")}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4 border-t">
            <button 
              onClick={verifyTransaction}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Verify on Blockchain
            </button>
            <button 
              onClick={() => window.open(`https://etherscan.io/tx/${transaction.signature || transaction.hash}`, '_blank')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              View on Explorer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Ledger() {
  const [query, setQuery]     = useState("");
  const debouncedQuery        = useDebounce(query, 300); // Debounce search input
  const [period, setPeriod]   = useState<typeof PERIODS[number]>("All Time");
  const [dept, setDept]       = useState<typeof DEPTS[number]>("All Departments");
  const [status, setStatus]   = useState<typeof STATUSES[number]>("All");
  const [page, setPage]       = useState(1);
  const pageSize              = 10;

  const [rows, setRows]       = useState<Tx[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Tx | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true); setErr(null);
      const res = await fetchLedger(page, pageSize); // {items,total}
      setRows(Array.isArray(res?.items) ? res.items : []);
      setTotal(typeof res?.total === "number" ? res.total : (res?.items?.length ?? 0));
    } catch (e: any) {
      setErr(e?.message || "Failed to load ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      await loadData();
    })();
    return () => { ignore = true; };
  }, [page]);

  const refreshData = () => {
    toast.success("Refreshing ledger data...");
    loadData();
  };

  // Client-side filtering for better UX (combine with server pagination for production)
  const filtered = useMemo(() => {
    const now = new Date();
    const startOfMonth   = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth()/3)*3, 1);
    const startOfYear    = new Date(now.getFullYear(), 0, 1);
    const start = period === "This Month" ? startOfMonth : period === "Last 30 Days" ? new Date(now.getTime() - 30*24*3600*1000)
                  : period === "This Quarter" ? startOfQuarter : startOfYear;
    const q = debouncedQuery.trim().toLowerCase(); // Use debounced query
    const result = rows.filter(r => {
      const dOk  = period === "All Time" ? true : (r.date ? new Date(r.date) >= start : true);
      const dep  = dept === "All Departments" || 
                   r.dept?.toLowerCase().includes(dept.toLowerCase()) || 
                   dept.toLowerCase().includes(r.dept?.toLowerCase() || '');
      const st   = status === "All" || r.status === status;
      const text = q === "" || `${r.project ?? ""} ${r.dept ?? ""} ${r.signature ?? ""}`.toLowerCase().includes(q);
      return dOk && dep && st && text;
    });
    return result;
  }, [rows, debouncedQuery, period, dept, status]);

  // Note: For production, move filtering to backend and use server-side pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const setSafePage = (p:number) => setPage(Math.min(Math.max(1,p), totalPages));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = () => {
    const header = ["Date","Department","Project","Amount","Status","Signature"];
    const lines  = filtered.map(r => [r.date ?? "", r.dept ?? r.department ?? "", r.project ?? r.projectName ?? "", money(r.amount), r.status ?? "", r.signature ?? r.hash ?? r.sig ?? ""]);
    const csv    = [header, ...lines].map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const url    = URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8"}));
    const a = document.createElement("a"); a.href = url; a.download = `transaction_ledger_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  const exportJSON = () => {
    const json = JSON.stringify(filtered, null, 2);
    const url = URL.createObjectURL(new Blob([json], {type:"application/json"}));
    const a = document.createElement("a"); a.href = url; a.download = `transaction_ledger_${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
    toast.success("JSON exported successfully!");
  };

  const openTransactionDetails = (transaction: Tx) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleStatusClick = (transaction: Tx) => {
    if (transaction.status === "Verified") {
      toast.success("Transaction is verified and recorded on blockchain!");
    } else if (transaction.status === "Pending") {
      toast("Transaction is pending verification...", { icon: "ℹ️" });
    } else {
      toast("Transaction has been flagged for review.", { icon: "⚠️" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:gap-4">
          <div className="flex-1">
            <Input value={query} onChange={(e)=>{ setQuery(e.target.value); setSafePage(1); }} placeholder="Search transactions…" />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button 
              onClick={refreshData}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1"
              title="Refresh data"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <Select value={period} onChange={(e)=>{ setPeriod(e.target.value as any); setSafePage(1); }}>{PERIODS.map(p => <option key={p}>{p}</option>)}</Select>
            <Select value={dept} onChange={(e)=>{ setDept(e.target.value as any); setSafePage(1); }}>{DEPTS.map(d => <option key={d}>{d}</option>)}</Select>
            <Select value={status} onChange={(e)=>{ setStatus(e.target.value as any); setSafePage(1); }}>{STATUSES.map(s => <option key={s}>{s}</option>)}</Select>
            <div className="flex gap-2">
              <OutlineBtn onClick={exportCSV} disabled={!filtered.length}>Export CSV</OutlineBtn>
              <OutlineBtn onClick={exportJSON} disabled={!filtered.length}>Export JSON</OutlineBtn>
            </div>
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
                <tr key={`${r.signature ?? r._id ?? "row"}-${i}`} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{r.date ?? r.createdAt?.slice(0, 10) ?? "-"}</td>
                  <td className="px-4 py-3">{r.dept ?? r.department ?? "-"}</td>
                  <td className="px-4 py-3">{r.project ?? r.projectName ?? "-"}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{money(r.amount)}</td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleStatusClick(r)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {statusToPill((r.status as any) ?? "Verified")}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-500 truncate max-w-[16rem]">{r.signature ?? r.hash ?? r.sig ?? "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => openTransactionDetails(r)}
                      className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50 hover:border-slate-400 transition-colors"
                      title="View details"
                    >
                      ⋯
                    </button>
                  </td>
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

      {/* Transaction Detail Modal */}
      <TransactionModal 
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
      />
    </div>
  );
}
