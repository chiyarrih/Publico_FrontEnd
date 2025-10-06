import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, AlertCircle } from "lucide-react";

interface ApplicationRejectedModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
  agencyName?: string;
}

const ApplicationRejectedModal = ({ 
  isOpen, 
  onClose, 
  reason = "Incomplete documentation or information that couldn't be verified.",
  agencyName = "Your Agency"
}: ApplicationRejectedModalProps) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  const handleSignUpAgain = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      navigate('/signup');
    }, 300);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full p-6 transition-all duration-300 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Rejection Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Application Rejected
          </h2>
          
          <div className="space-y-3 text-sm text-slate-600">
            <p>
              We're sorry, but your agency application has been rejected. This could be due to incomplete documentation or information that couldn't be verified.
            </p>
            
            {reason && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-left">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800 text-xs">Reason for rejection:</p>
                    <p className="text-red-700 text-xs mt-1">{reason}</p>
                  </div>
                </div>
              </div>
            )}
            
            <p>
              Please review the requirements and sign up again with the correct information.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleSignUpAgain}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition"
            >
              Sign Up Again
            </button>
            
            <button
              onClick={handleClose}
              className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded text-sm font-medium hover:bg-slate-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationRejectedModal;
