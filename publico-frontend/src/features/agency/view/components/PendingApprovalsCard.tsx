import React from 'react';
import type { BudgetRequest } from '../../model/types/dashboard';

interface PendingApprovalsCardProps {
  requests: BudgetRequest[];
  isLoading: boolean;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Infrastructure: '#3b82f6',
    Education: '#8b5cf6',
    Health: '#22c55e',
    Other: '#94a3b8',
  };
  return colors[category] || '#94a3b8';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const PendingApprovalsCard: React.FC<PendingApprovalsCardProps> = ({
  requests,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-[15px] font-semibold text-slate-800">
            Pending Approvals
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded border border-slate-200 p-4">
                <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                <div className="mt-2 h-3 w-1/2 rounded bg-slate-200"></div>
                <div className="mt-2 h-3 w-1/3 rounded bg-slate-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-[15px] font-semibold text-slate-800">
            Pending Approvals
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-2 text-4xl">✅</div>
            <div className="text-sm font-medium text-slate-700">
              No Pending Approvals
            </div>
            <div className="text-xs text-slate-500">
              All your budget requests have been processed
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="text-[15px] font-semibold text-slate-800">
          Pending Approvals ({requests.length})
        </div>
        <button className="text-xs font-medium text-blue-600 hover:underline">
          View All
        </button>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {requests.slice(0, 4).map((request) => (
            <div key={request._id} className="rounded border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">
                    {request.projectName}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {request.department}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1"
                      style={{
                        backgroundColor: `${getCategoryColor(request.category)}15`,
                        color: getCategoryColor(request.category),
                        borderColor: `${getCategoryColor(request.category)}30`,
                      }}
                    >
                      {request.category}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-[11px] font-medium text-yellow-700 ring-1 ring-yellow-200">
                      {request.status}
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-semibold text-slate-800">
                    ₱{request.amountRequested.toLocaleString()}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {formatDate(request.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
