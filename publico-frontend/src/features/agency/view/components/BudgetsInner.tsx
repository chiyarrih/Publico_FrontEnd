import { Loader } from "lucide-react"
import { useState } from "react"
import { Toaster } from "react-hot-toast"
import InfiniteScroll from "react-infinite-scroll-component"
import ProposalCard from "../../controller/components/cards/ProposalCard"
import ProposalForm from "../../controller/components/forms/ProposalForm"
import useBudget from "../../controller/hooks/useBudget"
import { Status } from "@/utils/helpers"
import { SimpleDepartmentSelect } from "@/shared/components/DepartmentSelect"

export const BudgetsInner: React.FC = () => {
  const { fetchedData, hasMore, loadMore } = useBudget()
  const [tab, setTab] = useState<"proposals" | "new">("proposals")
  const [q, setQ] = useState("")
  const [status, setStatus] = useState<"All" | Status>("All")
  const [dept, setDept] = useState("All Departments")

  const data = fetchedData
    .filter((r) => (status === "All" ? true : r.status === status))
    .filter((r) => (dept === "All Departments" ? true : r.category === dept))
    .filter((r) => [r.category, r.category].some((t) => t.toLowerCase().includes(q?.toLowerCase())))

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      {/* header card */}
      <div className="p-6 bg-white border rounded-2xl border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Project Proposals</h1>
              <p className="text-sm text-slate-600">Manage your budget proposals and submissions</p>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="flex items-center gap-8 text-sm">
          <button
            onClick={() => setTab("proposals")}
            className={`pb-3 border-b-2 font-semibold transition-colors ${
              tab === "proposals"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Proposals
          </button>
          <button
            onClick={() => setTab("new")}
            className={`pb-3 border-b-2 font-semibold transition-colors ${
              tab === "new" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            New Proposal
          </button>
        </div>

        {/* search + filters */}
        {tab === "proposals" && (
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="relative min-w-[280px] flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search proposals..."
                className="w-full pl-10 pr-4 py-3 text-sm border rounded-xl h-12 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 transition-all"
              />
              <span className="absolute inset-y-0 flex items-center pointer-events-none left-3">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-4 py-3 text-sm border rounded-xl h-12 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px] transition-all"
            >
              <option>All</option>
              <option>Approved</option>
              <option>In Review</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="px-4 py-3 text-sm border rounded-xl h-12 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[160px] transition-all"
            >
              <option value="All">All Departments</option>
              <option>City Mayor's Office</option>
              <option>City Engineering Office</option>
              <option>City Health Office</option>
              <option>City Planning & Development Office</option>
              <option>City Tourism Office</option>
            </select>
          </div>
        )}
      </div>

      {/* content */}
      {tab === "proposals" ? (
        <>
          <div className="bg-white border divide-y rounded-2xl border-slate-200/60 shadow-sm overflow-hidden">
            <InfiniteScroll
              next={loadMore}
              hasMore={hasMore}
              children={<ProposalCard data={data} />}
              loader={<Loader />}
              dataLength={data.length}
            />
          </div>

          <div className="p-4 text-sm bg-gradient-to-r from-emerald-50 to-blue-50 border rounded-2xl border-emerald-200/60 text-slate-700">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center p-2 rounded-full bg-emerald-100">
                <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <span className="font-medium">Blockchain Security:</span>
              <span>
                All proposals are securely recorded on the blockchain for complete transparency and auditability.
              </span>
            </div>
          </div>
        </>
      ) : (
        <ProposalForm setTab={() => setTab("proposals")} />
      )}
    </div>
  )
}