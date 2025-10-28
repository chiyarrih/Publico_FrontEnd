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
  // Calculate real progress from phases
  const getProjectProgress = (milestone: Milestone) => {
    // If milestone has overallProgress, use it (from backend calculation)
    if (milestone.overallProgress !== undefined && milestone.overallProgress !== null) {
      return milestone.overallProgress;
    }
    
    // Calculate from phases
    if (!milestone.phases || milestone.phases.length === 0) return 0;
    
    const totalBudget = milestone.phases.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = milestone.phases.reduce((sum, p) => sum + (p.spent || 0), 0);
    
    if (totalBudget === 0) return 0;
    return Math.min(100, Math.round((totalSpent / totalBudget) * 100));
  };
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-slate-100 animate-pulse"></div>
            <div className="h-5 w-32 rounded bg-slate-200 animate-pulse"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-5">
                <div className="animate-pulse">
                  <div className="h-5 w-3/4 rounded bg-slate-200 mb-3"></div>
                  <div className="h-4 w-1/2 rounded bg-slate-200 mb-4"></div>
                  <div className="h-3 w-full rounded-full bg-slate-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (milestones.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center">
              <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-slate-900">Active Projects</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-base font-semibold text-slate-700">No Active Projects</div>
            <div className="text-sm text-slate-500 mt-1">
              Your approved projects will appear here
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
          <div className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-slate-900">
            Active Projects ({milestones.length})
          </span>
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          View All →
        </button>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {milestones.slice(0, 4).map((milestone) => {
            const progress = getProjectProgress(milestone);
            const spent = milestone.phases?.reduce((sum, p) => sum + (p.spent || 0), 0) || 0;
            const budget = milestone.totalBudget || 0;
            
            return (
              <div key={milestone._id} className="group rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getProgressColor(progress) }}></div>
                      <div className="font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                        {milestone.projectName}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {milestone.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Budget: ₱{budget.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Spent: ₱{spent.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 shadow-sm"
                      style={{
                        backgroundColor: `${getStatusColor(milestone.overallStatus)}15`,
                        color: getStatusColor(milestone.overallStatus),
                        borderColor: `${getStatusColor(milestone.overallStatus)}30`,
                      }}
                    >
                      {milestone.overallStatus}
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">{progress}%</div>
                      <div className="text-xs text-slate-500">Complete</div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${getProgressColor(progress)} 0%, ${getProgressColor(progress)}dd 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
