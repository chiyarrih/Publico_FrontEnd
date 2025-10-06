import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

interface ApplicationApprovedModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyName?: string;
}

const ApplicationApprovedModal = ({ 
  isOpen, 
  onClose, 
  agencyName = "Your Agency" 
}: ApplicationApprovedModalProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Auto-close after 5 seconds and redirect to login
      const timer = setTimeout(() => {
        onClose();
        navigate('/login');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, navigate]);

  const handleContinueToDashboard = () => {
    onClose();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Application Approved
          </h2>
          
          <p className="text-sm text-slate-600">
            Congratulations! Your agency application has been reviewed and approved. 
            You can now access your dashboard.
          </p>

          {/* Action Button */}
          <button
            onClick={handleContinueToDashboard}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition"
          >
            Continue to Dashboard
          </button>

          {/* Auto-close notice */}
          <p className="text-xs text-slate-400">
            This window will automatically close in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationApprovedModal;
