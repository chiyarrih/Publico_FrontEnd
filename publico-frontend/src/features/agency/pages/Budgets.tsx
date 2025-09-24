import React from "react";

type Status = "Approved" | "In Review" | "Pending" | "Rejected";

const proposals = [
  {
    title: "Downtown Bridge Repair",
    dept: "Transportation",
    timeline: "2023-09-01 to 2024-02-28",
    amount: "₱2,800,000",
    status: "Approved" as Status,
    submitted: "2023-08-15",
  },
  {
    title: "City Park Renovation",
    dept: "Parks & Recreation",
    timeline: "2023-10-01 to 2024-05-30",
    amount: "₱1,200,000",
    status: "In Review" as Status,
    submitted: "2023-08-10",
  },
  {
    title: "Public Library Expansion",
    dept: "Education",
    timeline: "2023-11-01 to 2024-12-15",
    amount: "₱3,500,000",
    status: "Pending" as Status,
    submitted: "2023-07-22",
  },
  {
    title: "Smart Traffic Light System",
    dept: "Transportation",
    timeline: "2023-09-15 to 2024-03-30",
    amount: "₱950,000",
    status: "Rejected" as Status,
    submitted: "2023-08-05",
  },
];

const StatusChip: React.FC<{ s: Status }> = ({ s }) => {
  const map: Record<Status, string> = {
    Approved: "bg-emerald-100 text-emerald-700",
    "In Review": "bg-blue-100 text-blue-700",
    Pending: "bg-amber-100 text-amber-700",
    Rejected: "bg-rose-100 text-rose-700",
  };
  return <span className={`text-xs px-2 py-0.5 rounded ${map[s]}`}>{s}</span>;
};

const Budgets: React.FC = () => {
  const [tab, setTab] = React.useState<"proposals" | "new">("proposals");
  const [q, setQ] = React.useState("");

  const filtered = proposals.filter(
    (p) =>
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.dept.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header strip */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Project Proposals</div>
          <button
            onClick={() => setTab("new")}
            className="h-9 px-3 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            + New Proposal
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <button
            className={`pb-2 border-b-2 ${
              tab === "proposals"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500"
            }`}
            onClick={() => setTab("proposals")}
          >
            Proposals
          </button>
          <button
            className={`pb-2 border-b-2 ${
              tab === "new"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500"
            }`}
            onClick={() => setTab("new")}
          >
            New Proposal
          </button>
        </div>

        {/* Search + filters */}
        {tab === "proposals" && (
          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search proposals..."
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm"
              />
            </div>
            <select className="h-9 rounded border border-slate-300 px-2 text-sm">
              <option>All Statuses</option>
              <option>Approved</option>
              <option>In Review</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
            <select className="h-9 rounded border border-slate-300 px-2 text-sm">
              <option>All Departments</option>
              <option>Transportation</option>
              <option>Parks & Recreation</option>
              <option>Education</option>
              <option>Finance</option>
              <option>IT</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {tab === "proposals" ? (
        <>
          <div className="bg-white border border-slate-200 rounded-lg divide-y">
            {filtered.map((p) => (
              <div key={p.title} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-800">{p.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
                        {p.dept}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
                        Timeline: {p.timeline}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold">{p.amount}</div>
                    <div className="mt-1 flex items-center justify-end gap-3">
                      <div className="text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
                          Submitted:
                        </span>{" "}
                        {p.submitted}
                      </div>
                      <StatusChip s={p.status} />
                    </div>
                    <button className="mt-2 text-sm text-blue-600 hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
            ✅ All proposals are securely recorded on the blockchain for complete transparency and auditability.
          </div>
        </>
      ) : (
        /* New Proposal form (mock) */
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-sm font-medium mb-3">Create New Proposal</div>
          <form className="grid grid-cols-2 gap-3">
            <label className="col-span-2 text-xs">
              <span className="block mb-1 text-slate-700">Project Title</span>
              <input className="w-full h-9 rounded border border-slate-300 px-2 text-sm" placeholder="e.g., Riverside Flood Barrier" />
            </label>
            <label className="text-xs">
              <span className="block mb-1 text-slate-700">Department</span>
              <select className="w-full h-9 rounded border border-slate-300 px-2 text-sm">
                <option>Transportation</option>
                <option>Education</option>
                <option>Health</option>
                <option>IT</option>
                <option>Finance</option>
                <option>Parks & Recreation</option>
              </select>
            </label>
            <label className="text-xs">
              <span className="block mb-1 text-slate-700">Estimated Budget (₱)</span>
              <input className="w-full h-9 rounded border border-slate-300 px-2 text-sm" placeholder="1,500,000" />
            </label>

            <div className="col-span-2 grid grid-cols-2 gap-3">
              <label className="text-xs">
                <span className="block mb-1 text-slate-700">Start Date</span>
                <input type="date" className="w-full h-9 rounded border border-slate-300 px-2 text-sm" />
              </label>
              <label className="text-xs">
                <span className="block mb-1 text-slate-700">End Date</span>
                <input type="date" className="w-full h-9 rounded border border-slate-300 px-2 text-sm" />
              </label>
            </div>

            <label className="col-span-2 text-xs">
              <span className="block mb-1 text-slate-700">Objectives</span>
              <textarea className="w-full min-h-[90px] rounded border border-slate-300 px-2 py-2 text-sm" placeholder="Describe the objectives and expected outcomes…" />
            </label>

            <div className="col-span-2 text-xs">
              <div className="rounded border border-dashed border-slate-300 p-5 text-center text-slate-600">
                Upload supporting docs (PDF, JPG, PNG up to 10MB)
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <button type="button" className="h-9 px-4 rounded bg-blue-600 text-white text-sm hover:bg-blue-700">
                Submit Proposal
              </button>
              <button
                type="button"
                onClick={() => setTab("proposals")}
                className="h-9 px-4 rounded border border-slate-300 text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Budgets;
