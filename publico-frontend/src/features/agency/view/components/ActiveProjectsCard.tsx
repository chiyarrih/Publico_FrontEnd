import React from 'react';
import type { Milestone } from '../../model/types/dashboard';

interface ActiveProjectsCardProps {
  milestones: Milestone[];
  isLoading: boolean;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Planning': '#94a3b8',
    'In Progress': '#3b82f6',
    'Completed': '#22c55e',
    'On Hold': '#f59e0b',
    'Cancelled': '#ef4444',
  };
  return colors[status] || '#94a3b8';
};

const getProgressColor = (progress: number) => {
  if (progress >= 75) return '#22c55e';
  if (progress >= 50) return '#3b82f6';
  if (progress >= 25) return '#f59e0b';
  return '#ef4444';
};

export const ActiveProjectsCard: React.FC<ActiveProjectsCardProps> = ({ 
  milestones, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-[15px] font-semibold text-slate-800">Active Projects</div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded border border-slate-200 p-4">
                <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                <div className="mt-2 h-3 w-1/2 rounded bg-slate-200"></div>
                <div className="mt-3 h-2 w-full rounded bg-slate-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (milestones.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-[15px] font-semibold text-slate-800">Active Projects</div>
        </div>
        <div className="p-4">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-2 text-4xl">📋</div>
            <div className="text-sm font-medium text-slate-700">No Active Projects</div>
            <div className="text-xs text-slate-500">
              Your approved projects will appear here
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
          Active Projects ({milestones.length})
        </div>
        <button className="text-xs font-medium text-blue-600 hover:underline">
          View All
        </button>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {milestones.slice(0, 4).map((milestone) => (
            <div key={milestone._id} className="rounded border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">
                    {milestone.projectName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {milestone.department} • Budget: ₱
                    {milestone.totalBudget.toLocaleString()}
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1"
                    style={{
                      backgroundColor: `${getStatusColor(milestone.overallStatus)}15`,
                      color: getStatusColor(milestone.overallStatus),
                      borderColor: `${getStatusColor(milestone.overallStatus)}30`,
                    }}
                  >
                    {milestone.overallStatus}
                  </span>
                  <span className="text-xs font-medium text-slate-600">
                    {milestone.overallProgress}%
                  </span>
                </div>
              </div>
              <div className="mt-3 h-2 w-full rounded bg-slate-100">
                <div
                  className="h-2 rounded transition-all"
                  style={{
                    width: `${milestone.overallProgress}%`,
                    backgroundColor: getProgressColor(milestone.overallProgress),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
