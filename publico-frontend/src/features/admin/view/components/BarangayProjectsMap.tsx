import React from 'react';
import { GoogleMapProvider } from './GoogleMapProvider';
import { DagupanCityMap } from './DagupanCityMap';
import { useBarangayProjects } from '../../controller/hooks/useBarangayProjects';
import { Card } from '../ui/blocks';

export const BarangayProjectsMap: React.FC = () => {
  const { 
    barangays, 
    loading, 
    selectedBarangay, 
    selectBarangay,
    getTotalProjects 
  } = useBarangayProjects();

  if (loading) {
    return (
      <Card>
        <div className="mb-3 text-base font-semibold text-slate-800">
          Active Projects by Barangay
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center">
          <div className="text-sm text-slate-500">Loading map...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-base font-semibold text-slate-800">
          Active Projects by Barangay
        </div>
        <div className="text-xs text-slate-600">
          Total: <span className="font-semibold text-slate-800">{getTotalProjects()}</span> projects
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-200">
        <GoogleMapProvider>
          <DagupanCityMap
            barangays={barangays}
            selectedBarangay={selectedBarangay}
            onMarkerClick={(barangay) => selectBarangay(barangay.id)}
            onInfoWindowClose={() => selectBarangay(null)}
          />
        </GoogleMapProvider>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
          <span className="text-slate-600">1-3 projects</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-sky-500"></div>
          <span className="text-slate-600">4-5 projects</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
          <span className="text-slate-600">6-7 projects</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-600"></div>
          <span className="text-slate-600">8+ projects</span>
        </div>
      </div>
    </Card>
  );
};
