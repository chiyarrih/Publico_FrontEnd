import React from 'react';
import { useBarangayProjects } from '../../controller/hooks/useBarangayProjects';

export const MapStatistics: React.FC = () => {
  const { barangays, getTotalProjects, getTotalBudget } = useBarangayProjects();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getActiveProjects = () => {
    return barangays.reduce((sum, b) => {
      return sum + b.projects.filter(p => p.status === 'Active').length;
    }, 0);
  };

  const getPendingProjects = () => {
    return barangays.reduce((sum, b) => {
      return sum + b.projects.filter(p => p.status === 'Pending').length;
    }, 0);
  };

  const getCompletedProjects = () => {
    return barangays.reduce((sum, b) => {
      return sum + b.projects.filter(p => p.status === 'Completed').length;
    }, 0);
  };

  const getMostActiveBarangay = () => {
    if (barangays.length === 0) return 'N/A';
    return barangays.reduce((max, b) => 
      b.projectCount > max.projectCount ? b : max
    ).barangay;
  };

  return (
    <div className="grid grid-cols-2 gap-3 text-xs">
      <div className="rounded-lg bg-emerald-50 p-3">
        <div className="text-emerald-600">Active Projects</div>
        <div className="mt-1 text-xl font-bold text-emerald-700">
          {getActiveProjects()}
        </div>
      </div>
      
      <div className="rounded-lg bg-amber-50 p-3">
        <div className="text-amber-600">Pending Projects</div>
        <div className="mt-1 text-xl font-bold text-amber-700">
          {getPendingProjects()}
        </div>
      </div>
      
      <div className="rounded-lg bg-slate-50 p-3">
        <div className="text-slate-600">Completed Projects</div>
        <div className="mt-1 text-xl font-bold text-slate-700">
          {getCompletedProjects()}
        </div>
      </div>
      
      <div className="rounded-lg bg-sky-50 p-3">
        <div className="text-sky-600">Most Active</div>
        <div className="mt-1 text-sm font-bold text-sky-700">
          {getMostActiveBarangay()}
        </div>
      </div>
    </div>
  );
};
