import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUserRole, getUserData } from '../utils/auth';

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const location = useLocation();
  const isApplicationRejectedPage = location.pathname === '/application-rejected';
  const isApplicationUnderReviewPage = location.pathname === '/application-under-review';
  const isApplicationApprovedPage = location.pathname === '/application-approved';
  
  if (isAuthenticated()) {
    const role = getCurrentUserRole();
    const userData = getUserData();
    
    switch (role) {
      case 'Admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'Agency':
        // Check agency application status
        const applicationStatus = (userData as any)?.user?.applicationStatus || 'pending';
        const isAgencyVerified = (userData as any)?.user?.isAgencyVerified;
        
        // Allow access to application status pages for agencies
        if (isApplicationRejectedPage && (applicationStatus === 'rejected' || isAgencyVerified === false)) {
          return <>{children}</>;
        }
        if (isApplicationUnderReviewPage && (applicationStatus === 'pending' || applicationStatus === 'under_review')) {
          return <>{children}</>;
        }
        if (isApplicationApprovedPage && (applicationStatus === 'approved' || isAgencyVerified === true)) {
          return <>{children}</>;
        }
        
        if (applicationStatus === 'approved' || isAgencyVerified === true) {
          return <Navigate to="/agency/dashboard" replace />;
        } else if (applicationStatus === 'rejected' || isAgencyVerified === false) {
          return <Navigate to="/application-rejected" replace />;
        } else {
          // FIXED: Don't automatically redirect to application-under-review
          // Let the user access the login page and handle navigation there
          return <>{children}</>;
        }
      case 'Citizen':
        return <Navigate to="/citizen/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // For unauthenticated users, allow access to application status pages
  // This is needed for users coming from OTP verification
  if (isApplicationUnderReviewPage || isApplicationRejectedPage || isApplicationApprovedPage) {
    return <>{children}</>;
  }

  return <>{children}</>;
};

// Keep default export for backward compatibility
export default GuestRoute;
