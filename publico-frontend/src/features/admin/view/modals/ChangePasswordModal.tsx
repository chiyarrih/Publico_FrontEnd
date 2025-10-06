import React, { useState, useEffect } from 'react';
import useAdminProfile from '../../controller/hooks/useAdminProfile';
import { AuthService } from '../../../auth/services/authApi';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { admin, forgotPassword, resetPassword, isLoading, error, clearError } = useAdminProfile();
  const [step, setStep] = useState<'code' | 'password'>('code');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [localError, setLocalError] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);

  // Auto-fill email when modal opens
  useEffect(() => {
    if (isOpen && admin?.email) {
      setEmail(admin.email);
    }
  }, [isOpen, admin?.email]);

  const handleSendCode = async () => {
    setMessage('');
    setLocalError('');
    clearError();

    try {
      await forgotPassword({ email });
      setMessage('Verification code sent to your email!');
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLocalError('');
    clearError();

    if (code.length !== 6) {
      setLocalError('Please enter a valid 6-digit code');
      return;
    }

    try {
      // Verify the code with backend
      await AuthService.verifyResetCode(email, code);
      setMessage('Code verified! Please enter your new password.');
      setIsCodeValid(true);
      setStep('password');
    } catch (err: any) {
      setLocalError(err.message || 'Invalid verification code');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLocalError('');
    clearError();

    // Ensure code is valid before allowing password change
    if (!isCodeValid) {
      setLocalError('Please verify your code first');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setLocalError('New passwords do not match');
      return;
    }

    if (form.newPassword.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return;
    }

    try {
      await resetPassword({
        email,
        code,
        newPassword: form.newPassword
      });
      setMessage('Password changed successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
        resetForm();
      }, 2000);
    } catch (err) {
      // Error handled by hook
    }
  };

  const resetForm = () => {
    setStep('code');
    setCode('');
    setForm({ newPassword: '', confirmPassword: '' });
    setMessage('');
    setLocalError('');
    setIsCodeValid(false);
    clearError();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded">
            {message}
          </div>
        )}

        {(error || localError) && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {error || localError}
          </div>
        )}

        {step === 'code' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm bg-gray-50 text-gray-600"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </button>
            </div>
            
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-100"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || code.length !== 6}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  Verify Code
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('code');
                  setIsCodeValid(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
