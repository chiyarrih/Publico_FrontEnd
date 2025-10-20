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
      <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-slate-100 animate-pulse"></div>
            <div className="h-5 w-36 rounded bg-slate-200 animate-pulse"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-5">
                <div className="animate-pulse">
                  <div className="h-5 w-3/4 rounded bg-slate-200 mb-3"></div>
                  <div className="h-4 w-1/2 rounded bg-slate-200 mb-3"></div>
                  <div className="h-4 w-1/3 rounded bg-slate-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-amber-100 flex items-center justify-center">
              <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-slate-900">Pending Approvals</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-base font-semibold text-slate-700">
              No Pending Approvals
            </div>
            <div className="text-sm text-slate-500 mt-1">
              All your budget requests have been processed
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-amber-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-slate-900">
            Pending Approvals ({requests.length})
          </span>
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          View All →
        </button>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {requests.slice(0, 4).map((request) => (
            <div key={request._id} className="group rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <div className="font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                      {request.projectName}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {request.department}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 shadow-sm"
                      style={{
                        backgroundColor: `${getCategoryColor(request.category)}15`,
                        color: getCategoryColor(request.category),
                        borderColor: `${getCategoryColor(request.category)}30`,
                      }}
                    >
                      {request.category}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 shadow-sm">
                      {request.status}
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="flex items-center gap-1 text-lg font-bold text-slate-900">
                    <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {request.amountRequested.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
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
