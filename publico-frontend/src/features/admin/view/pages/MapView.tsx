import React, { useState } from 'react';
import { GoogleMapProvider } from '../components/GoogleMapProvider';
import { DagupanCityMap } from '../components/DagupanCityMap';
import { useBarangayProjects } from '../../controller/hooks/useBarangayProjects';

export default function MapView() {
  const { 
    barangays, 
    loading, 
    selectedBarangay, 
    selectBarangay,
    getTotalProjects,
    getTotalBudget 
  } = useBarangayProjects();

  const [filter, setFilter] = useState<'All' | 'Active' | 'Pending' | 'Completed'>('All');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getFilteredBarangays = () => {
    if (filter === 'All') return barangays;
    
    return barangays.map(barangay => ({
      ...barangay,
      projects: barangay.projects.filter(p => p.status === filter),
      projectCount: barangay.projects.filter(p => p.status === filter).length
    })).filter(b => b.projectCount > 0);
  };

  const filteredBarangays = getFilteredBarangays();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-slate-600">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dagupan City Project Map</h1>
            <p className="text-sm text-slate-600">Real-time barangay project visualization</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Filters */}
            <div className="flex gap-2">
              {(['All', 'Active', 'Pending', 'Completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-6">
          <div className="rounded-lg bg-slate-50 px-4 py-2">
            <div className="text-xs text-slate-500">Total Projects</div>
            <div className="text-xl font-bold text-slate-800">{getTotalProjects()}</div>
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-2">
            <div className="text-xs text-slate-500">Total Budget</div>
            <div className="text-xl font-bold text-slate-800">{formatCurrency(getTotalBudget())}</div>
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-2">
            <div className="text-xs text-slate-500">Barangays</div>
            <div className="text-xl font-bold text-slate-800">{filteredBarangays.length}</div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 overflow-hidden">
        <GoogleMapProvider>
          <DagupanCityMap
            barangays={filteredBarangays}
            selectedBarangay={selectedBarangay}
            onMarkerClick={(barangay) => selectBarangay(barangay.id)}
            onInfoWindowClose={() => selectBarangay(null)}
          />
        </GoogleMapProvider>
      </div>

      {/* Legend */}
      <div className="border-t border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <span className="font-medium text-slate-700">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
              <span className="text-slate-600">1-3 projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-sky-500"></div>
              <span className="text-slate-600">4-5 projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-amber-500"></div>
              <span className="text-slate-600">6-7 projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-600"></div>
              <span className="text-slate-600">8+ projects</span>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Click on markers to view project details
          </div>
        </div>
      </div>
    </div>
  );
}
