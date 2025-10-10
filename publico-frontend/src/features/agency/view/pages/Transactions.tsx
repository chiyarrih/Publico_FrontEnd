import useLedger from "@agency/controller/hooks/useLedger";
import React from "react";

type Row = {
  date: string;
  dept: string;
  proj: string;
  amt: string;
  status: "Verified" | "Pending";
  sig: string;
};

const Tag: React.FC<{ s: Row["status"] }> = ({ s }) => (
  <span
    className={`text-xs px-2 py-0.5 rounded ${
      s === "Verified"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-700"
    }`}
  >
    {s}
  </span>
);

export default function Transactions() {
  const { ledgers, page, totalPages, setPage, isLoading } = useLedger();

  return (
    <div className="space-y-4">
      {/* Header Filters */}
      <div className="p-4 bg-white border rounded-lg border-slate-200">
        <div className="text-lg font-semibold">Transaction Ledger</div>
        <div className="flex items-center gap-2 mt-3">
          <input
            placeholder="Search transactions..."
            className="w-full px-3 text-sm border rounded h-9 border-slate-300"
          />
          <select className="px-2 text-sm border rounded h-9 border-slate-300">
            <option>All Dates</option>
          </select>
          <select className="px-2 text-sm border rounded h-9 border-slate-300">
            <option>All Departments</option>
          </select>
          <select className="px-2 text-sm border rounded h-9 border-slate-300">
            <option>All Statuses</option>
          </select>
          <button className="px-3 text-sm border rounded h-9 border-slate-300">
            Export
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto bg-white border rounded-lg border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Project</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Signature</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-500">
                  Loading transactions...
                </td>
              </tr>
            ) : (
              ledgers.map((r: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{r.department || "—"}</td>
                  <td className="px-4 py-3">{r.projectName || "—"}</td>
                  <td className="px-4 py-3">${r.amount?.toLocaleString() || 0}</td>
                  <td className="px-4 py-3">
                    <Tag s={r.status || "Pending"} />
                  </td>
                  <td className="px-4 py-3">
                    {r.blockchainTxHash
                      ? r.blockchainTxHash.slice(0, 10) + "…"
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-blue-600 hover:underline">...</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-3 text-xs border-t text-slate-500">
          Showing page {page} of {totalPages}
          <div className="float-right space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-2 py-1 border rounded ${
                  page === i + 1 ? "bg-blue-500 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="p-3 text-xs bg-white border rounded-lg border-slate-200 text-slate-600">
        ✅ All transactions are immutably recorded on the blockchain for complete
        transparency.
      </div>
    </div>
  );
}
