import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, hasRole, validateRoleAccess, canAccessPortal } from '../utils/auth';
import { UserRole } from '../shared/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true,
}) => {
  const location = useLocation();

  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Enhanced role-specific route components with strict validation
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!validateRoleAccess('Admin') || !canAccessPortal('admin')) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

export const AgencyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!validateRoleAccess('Agency') || !canAccessPortal('agency')) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

export const CitizenRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!validateRoleAccess('Citizen') || !canAccessPortal('citizen')) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

export const AdminAgencyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['Admin', 'Agency']}>{children}</ProtectedRoute>
);