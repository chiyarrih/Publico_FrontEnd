import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import AuthCard from "./ui/AuthCard";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { getUserData, isAuthenticated, getCurrentUserRole, logout } from "../../../utils/auth";

const ApplicationUnderReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [progress, setProgress] = useState(65); // Mock progress
  const [applicationStatus, setApplicationStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Get email and status from location state first (for unauthenticated users from OTP)
      const stateEmail = location.state?.email || '';
      const stateStatus = location.state?.applicationStatus || 'pending';
      
      // If we have state data (from OTP verification), use it
      if (stateEmail) {
        setEmail(stateEmail);
        setApplicationStatus(stateStatus);
        setIsLoading(false);
        
        // Simulate progress animation
        const timer = setTimeout(() => {
          setProgress(75);
        }, 2000);
        return () => clearTimeout(timer);
      }
      
      // If no state data, check if user is authenticated
      const authStatus = isAuthenticated();
      
      if (!authStatus) {
        navigate('/login');
        return;
      }

      // Get user data from localStorage
      const userData = getUserData();
      const userRole = getCurrentUserRole();
      
      // Only allow Agency users to access this page
      if (userRole !== 'Agency') {
        navigate('/login');
        return;
      }

      // Get email and status from user data
      const userEmail = userData?.email || 
                        (userData as any)?.user?.email || 
                        (userData as any)?.contact_email || '';
      
      const status = (userData as any)?.user?.applicationStatus || 
                    (userData as any)?.applicationStatus || 
                    'pending';
      
      if (userEmail) {
        setEmail(userEmail);
        setApplicationStatus(status);
        setIsLoading(false);
      } else {
        setError('No email found in user data');
        navigate('/login');
      }

      // Simulate progress animation
      const timer = setTimeout(() => {
        setProgress(75);
      }, 2000);

      return () => clearTimeout(timer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  }, [navigate, location.state]);

  const handleBackToLogin = () => {
    // Clear authentication data and redirect to login
    logout();
  };

  const handleContactSupport = () => {
    // You can implement contact support functionality here
    window.open('mailto:support@publico.com?subject=Agency Application Inquiry', '_blank');
  };

  const handleCheckStatus = () => {
    // Refresh the page to check for status updates
    // Use a safer approach to avoid CSP issues
    const currentPath = window.location.pathname;
    navigate(currentPath, { replace: true });
  };

  // If application is rejected, redirect to rejected page
  if (applicationStatus === 'rejected') {
    navigate('/application-rejected', { 
      state: { email, applicationStatus: 'rejected' } 
    });
    return null;
  }

  // If application is approved, redirect to agency dashboard
  if (applicationStatus === 'approved') {
    navigate('/agency/dashboard');
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <AuthLayout>
        <AuthCard title="Loading...">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading application status...</p>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <AuthLayout>
        <AuthCard title="Error">
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <XCircle className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleBackToLogin}
              className="bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition"
            >
              Back to Login
            </button>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Application Under Review"
        footer={
          <div className="space-y-3">
            <button
              onClick={handleCheckStatus}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition"
            >
              Check Application Status
            </button>
            <button
              onClick={handleBackToLogin}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-gray-700 transition"
            >
              Back to Login
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Status Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Application Under Review
            </h2>
            
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                Thank you for submitting your agency application. Our team is currently reviewing your documents and information.
              </p>
              
              <p>
                This process typically takes 1-2 business days. We'll notify you via email at <strong>{email}</strong> once the review is complete.
              </p>
              
              <p>
                You can close this page and return later. We'll send you an email when your application status changes.
              </p>
              
              {applicationStatus === 'pending' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Status:</strong> Your application is currently under review by our admin team.
                  </p>
                </div>
              )}
              
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Review Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Status Steps */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-slate-600">Application Submitted</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-slate-600">Email Verified</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-slate-600">Documents Under Review</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
              <span className="text-slate-400">Admin Decision</span>
            </div>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default ApplicationUnderReviewPage;
