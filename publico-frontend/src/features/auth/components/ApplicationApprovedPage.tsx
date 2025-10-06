import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import AuthCard from "./ui/AuthCard";
import { CheckCircle, ArrowRight, Mail, Phone } from "lucide-react";
import { getUserData, isAuthenticated, getCurrentUserRole, logout } from "../../../utils/auth";

const ApplicationApprovedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [agencyName, setAgencyName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Get data from location state first (for unauthenticated users)
      const stateEmail = location.state?.email || '';
      const stateAgencyName = location.state?.agencyName || '';
      
      // If we have state data, use it
      if (stateEmail) {
        setEmail(stateEmail);
        setAgencyName(stateAgencyName);
        setIsLoading(false);
        // Set the flag that user has seen the approval page
        console.log('🔍 Setting agency_approval_seen flag to true');
        localStorage.setItem('agency_approval_seen', 'true');
        return;
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

      // Get email and agency name from user data
      const userEmail = userData?.email || 
                        (userData as any)?.user?.email || 
                        (userData as any)?.contact_email || '';
      
      const userAgencyName = (userData as any)?.user?.agency_name || 
                            (userData as any)?.agency_name || 
                            'Your Agency';
      
      if (userEmail) {
        setEmail(userEmail);
        setAgencyName(userAgencyName);
        setIsLoading(false);
        // Set the flag that user has seen the approval page
        console.log('🔍 Setting agency_approval_seen flag to true');
        localStorage.setItem('agency_approval_seen', 'true');
      } else {
        setError('No email found in user data');
        navigate('/login');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  }, [navigate, location.state]);

  const handleContinueToDashboard = () => {
    // Navigate to agency dashboard
    navigate('/agency/dashboard');
  };

  const handleBackToLogin = () => {
    // Clear authentication data and redirect to login
    logout();
  };

  const handleContactSupport = () => {
    // You can implement contact support functionality here
    window.open('mailto:support@publico.com?subject=Agency Application Approved - Welcome', '_blank');
  };

  // Show loading state
  if (isLoading) {
    return (
      <AuthLayout>
        <AuthCard title="Loading...">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
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
              <CheckCircle className="w-12 h-12 mx-auto" />
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
        title="Application Approved"
        footer={
          <div className="space-y-3">
            <button
              onClick={handleContinueToDashboard}
              className="w-full bg-green-600 text-white py-3 px-4 rounded text-sm font-medium hover:bg-green-700 transition flex items-center justify-center space-x-2"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleContactSupport}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition"
            >
              Contact Support
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
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-green-600">
              Congratulations!
            </h2>
            
            <div className="space-y-3 text-sm text-slate-600">
              <p className="text-lg font-medium text-slate-800">
                Your agency application has been <strong className="text-green-600">approved</strong>!
              </p>
              
              <p>
                Welcome to <strong>{agencyName}</strong>! Your agency account is now active and ready to use.
              </p>
              
              <p>
                You can now access all agency features including budget management, project tracking, 
                and document management through your dashboard.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-green-800">
                  <strong>Status:</strong> Your application has been reviewed and approved by our admin team.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-slate-700">What's Next?</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Access your agency dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Set up your agency profile</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Start managing projects and budgets</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-slate-700">Need Help?</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Email: support@publico.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>Phone: +1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="text-xs text-slate-500 text-center">
            <p>Application submitted for: <strong>{email}</strong></p>
            <p>Agency: <strong>{agencyName}</strong></p>
            <p>Status: <strong className="text-green-600">Approved</strong></p>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default ApplicationApprovedPage;
