import React from "react";
import { Badge } from "@admin/view/ui/blocks";
import type { BudgetProposal } from "@admin/model/types/admin";
import { Eye, Trash2 } from "lucide-react";

interface BudgetRequestsTableProps {
  requests: BudgetProposal[];
  onView?: (request: BudgetProposal) => void;
  onDelete?: (request: BudgetProposal) => void;
}

const tone = (s: BudgetProposal["status"]) =>
  s === "Approved" ? "green" : s === "Pending" ? "yellow" : s === "Rejected" ? "red" : "blue";

export default function BudgetRequestsTable({ 
  requests, 
  onView, 
  onDelete 
}: BudgetRequestsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50/80">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Project ID</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Department</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Project Name</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Amount</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id} className="bg-white hover:bg-slate-50/60 border-t border-slate-100">
              <td className="px-4 py-3">
                <button
                  onClick={() => onView?.(request)}
                  className="text-sky-600 hover:underline font-medium"
                >
                  {request.projectId}
                </button>
              </td>
              <td className="px-4 py-3 text-slate-700">
                {new Date(request.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-slate-700">{request.department}</td>
              <td className="px-4 py-3 text-slate-700">{request.projectName}</td>
              <td className="px-4 py-3 text-slate-900 font-medium">
                ₱{request.amountRequested.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <Badge tone={tone(request.status)}>{request.status}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView?.(request)}
                    className="text-sky-600 hover:text-sky-700 transition-colors"
                    title="View details"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

