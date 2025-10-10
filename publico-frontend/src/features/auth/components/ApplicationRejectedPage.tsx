import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import AuthCard from "./ui/AuthCard";
import { XCircle, Mail, Phone } from "lucide-react";
import { getUserData, isAuthenticated, getCurrentUserRole, logout } from "../../../utils/auth";

const ApplicationRejectedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
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

    // Get email from user data or location state
    const stateEmail = location.state?.email || userData?.email || '';
    if (stateEmail) {
      setEmail(stateEmail);
    } else {
      // If no email found, redirect to login
      navigate('/login');
    }
  }, [navigate, location.state]);

  const handleBackToLogin = () => {
    // Clear authentication data and redirect to login
    logout();
  };

  const handleContactSupport = () => {
    // You can implement contact support functionality here
    window.open('mailto:support@publico.com?subject=Agency Application Rejection Inquiry', '_blank');
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Application Rejected"
        footer={
          <div className="space-y-3">
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
          {/* Status Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Application Not Approved
            </h2>
            
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                We regret to inform you that your agency application has not been approved at this time.
              </p>
              
              <p>
                Our team has reviewed your submitted documents and information, and unfortunately, 
                we cannot proceed with your application based on our current criteria.
              </p>
              
              <p>
                If you believe this is an error or would like to discuss the decision, 
                please contact our support team for more information.
              </p>
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
            <p>Status: Rejected</p>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default ApplicationRejectedPage;
