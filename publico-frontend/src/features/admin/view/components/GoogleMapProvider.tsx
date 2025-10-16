import React from 'react';
import { APIProvider, APILoadingStatus } from '@vis.gl/react-google-maps';

interface GoogleMapProviderProps {
  children: React.ReactNode;
}

const LoadingOverlay: React.FC = () => (
  <div className="flex h-full w-full items-center justify-center bg-slate-50">
    <div className="text-center">
      <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-sky-500 mx-auto"></div>
      <div className="text-sm text-slate-600">Loading map...</div>
    </div>
  </div>
);

const ErrorOverlay: React.FC = () => (
  <div className="flex h-full w-full items-center justify-center bg-slate-50">
    <div className="text-center text-red-500">
      <div className="mb-2 text-2xl">⚠️</div>
      <div className="text-sm">Failed to load map</div>
    </div>
  </div>
);

export const GoogleMapProvider: React.FC<GoogleMapProviderProps> = ({ children }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('Google Maps API key is missing');
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-50">
        <div className="text-center text-amber-600">
          <div className="mb-2 text-2xl">🔑</div>
          <div className="text-sm">Map configuration error</div>
        </div>
      </div>
    );
  }

  return (
    <APIProvider 
      apiKey={apiKey}
      onLoad={() => console.log('Google Maps API loaded')}
    >
      {children}
    </APIProvider>
  );
};
