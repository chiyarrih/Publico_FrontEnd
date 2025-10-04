import React from "react";
import { Link, useParams } from "react-router-dom";

type Phase = {
  name: string;
  target: string;
  deliverable: string;
  status: "Approved" | "Under Review" | "Pending";
  proofs: number;
  priority?: "High" | "None";
};
const chip = (txt: string, cls: string) => (
  <span className={`text-xs px-2 py-0.5 rounded ${cls}`}>{txt}</span>
);

const phases: Phase[] = [
  { name: "Planning", target: "Jul 05, 2023", deliverable: "Complete site survey and engineering plans", status: "Approved", proofs: 2 },
  { name: "Procurement", target: "Jul 15, 2023", deliverable: "Purchase of construction materials and rental", status: "Under Review", proofs: 2, priority: "High" },
  { name: "Construction", target: "Aug 15, 2023", deliverable: "Concrete road construction according to spec", status: "Pending", proofs: 0 },
  { name: "Completion", target: "Aug 30, 2023", deliverable: "Final inspection and handover", status: "Pending", proofs: 0, priority: "None" },
];

export default function MilestoneDetail() {
  const { id } = useParams();
  const projectName =
    id === "road-rehab" ? "Road Rehabilitation – Perez Blvd" : "Selected Project";

  return (
    <div className="space-y-4">
      {/* breadcrumb / title */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Link to="/agency/milestones" className="hover:underline">
          Project <span className="bg-yellow-200 px-1 rounded">Milestones</span>
        </Link>
        <span>›</span>
        <span className="text-slate-900 font-medium">{projectName}</span>
      </div>

      {/* overview */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex flex-wrap justify-between gap-3">
          <div>
            <div className="text-sm text-slate-500">Department</div>
            <div className="font-medium text-slate-900">Public Works</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Total Budget</div>
            <div className="font-medium text-blue-600">₱2,500,000</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Timeline</div>
            <div className="font-medium text-slate-900">Jun 1, 2023 – Aug 30, 2023</div>
          </div>
          <div className="w-full">
            <div className="text-sm text-slate-500 mt-3">Overall Progress</div>
            <div className="h-2 bg-slate-200 rounded mt-1 overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: "28%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* phases table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 font-semibold text-slate-900">Milestones</div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left p-3">Milestone</th>
              <th className="text-left p-3">Target Date</th>
              <th className="text-left p-3">Deliverables</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Proofs</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {phases.map((p, i) => (
              <tr key={i}>
                <td className="p-3 font-medium text-slate-900">{p.name}</td>
                <td className="p-3 text-slate-700">{p.target}</td>
                <td className="p-3 text-slate-700">{p.deliverable}</td>
                <td className="p-3">
                  {p.status === "Approved" && chip("Approved", "bg-emerald-100 text-emerald-700")}
                  {p.status === "Under Review" && chip("Under Review", "bg-blue-100 text-blue-700")}
                  {p.status === "Pending" && chip("Pending", "bg-amber-100 text-amber-700")}
                  {p.priority === "High" && (
                    <span className="ml-2 text-xs text-rose-600">• High</span>
                  )}
                </td>
                <td className="p-3 text-slate-700">{p.proofs} uploaded</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="h-8 px-2 rounded border border-slate-300 text-xs">
                      Upload Proof
                    </button>
                    <button className="h-8 px-2 rounded border border-slate-300 text-xs">
                      View Files
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* current phase quick panel */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Current Phase</div>
            <div className="font-semibold text-slate-900">Procurement</div>
          </div>
          <button className="h-9 px-3 rounded bg-blue-600 text-white text-sm hover:bg-blue-700">
            Upload New Proof
          </button>
        </div>
        <div className="mt-3 text-sm text-slate-600">
          e.g., material purchase receipts, rental agreements. Files are recorded with hash for
          audit.
        </div>
      </div>
    </div>
  );
}
