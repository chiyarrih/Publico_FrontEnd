import React from 'react';
import { Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { DAGUPAN_CITY_CENTER, type BarangayProject } from '../../model/types/map';

interface DagupanCityMapProps {
  barangays: BarangayProject[];
  selectedBarangay: BarangayProject | null;
  onMarkerClick: (barangay: BarangayProject) => void;
  onInfoWindowClose: () => void;
}

const getMarkerColor = (projectCount: number): string => {
  if (projectCount >= 6) return '#dc2626'; // red-600
  if (projectCount >= 4) return '#f59e0b'; // amber-500
  if (projectCount >= 2) return '#0ea5e9'; // sky-500
  return '#10b981'; // emerald-500
};

const MarkerPin: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: color,
      border: '2px solid white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      cursor: 'pointer'
    }}
  />
);

export const DagupanCityMap: React.FC<DagupanCityMapProps> = ({
  barangays,
  selectedBarangay,
  onMarkerClick,
  onInfoWindowClose
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Map
      defaultCenter={DAGUPAN_CITY_CENTER}
      defaultZoom={13}
      gestureHandling="greedy"
      disableDefaultUI={false}
      mapId="dagupan-city-map"
      className="w-full h-full"
    >
      {barangays.map((barangay) => (
        <AdvancedMarker
          key={barangay.id}
          position={{ lat: barangay.lat, lng: barangay.lng }}
          onClick={() => onMarkerClick(barangay)}
        >
          <MarkerPin 
            color={getMarkerColor(barangay.projectCount)}
            size={16 + (barangay.projectCount * 3)}
          />
        </AdvancedMarker>
      ))}

      {selectedBarangay && (
        <InfoWindow
          position={{ lat: selectedBarangay.lat, lng: selectedBarangay.lng }}
          onCloseClick={onInfoWindowClose}
          maxWidth={300}
        >
          <div className="p-2">
            <h3 className="text-sm font-bold text-slate-800 mb-2">
              {selectedBarangay.barangay}
            </h3>
            
            <div className="mb-3">
              <div className="text-xs text-slate-600">
                Active Projects: <span className="font-semibold text-slate-800">{selectedBarangay.projectCount}</span>
              </div>
              <div className="text-xs text-slate-600">
                Total Budget: <span className="font-semibold text-slate-800">
                  {formatCurrency(selectedBarangay.projects.reduce((sum, p) => sum + p.budget, 0))}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              <div className="text-xs font-semibold text-slate-700 mb-1">Projects:</div>
              {selectedBarangay.projects.map((project) => (
                <div key={project.id} className="border-l-2 border-slate-300 pl-2 py-1">
                  <div className="text-xs font-medium text-slate-700">{project.name}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{project.department}</span>
                    <span className={`px-1.5 py-0.5 rounded font-medium ${
                      project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      project.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600">{formatCurrency(project.budget)}</div>
                </div>
              ))}
            </div>
          </div>
        </InfoWindow>
      )}
    </Map>
  );
};
