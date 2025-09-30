import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUserRole } from '../utils/auth';

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  if (isAuthenticated()) {
    const role = getCurrentUserRole();
    
    switch (role) {
      case 'Admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'Agency':
        return <Navigate to="/agency/dashboard" replace />;
      case 'Citizen':
        return <Navigate to="/citizen/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

// Keep default export for backward compatibility
export default GuestRoute;
