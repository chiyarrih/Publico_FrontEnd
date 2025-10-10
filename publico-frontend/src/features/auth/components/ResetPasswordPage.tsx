import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "./AuthLayout";
import AuthCard from "./ui/AuthCard";
import FormField from "./ui/FormField";

const ResetPasswordPage = () => {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [form, setForm] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from URL params or state
    const urlParams = new URLSearchParams(location.search);
    const emailParam = urlParams.get('email') || location.state?.email;
    if (emailParam) {
      setForm(prev => ({ ...prev, email: emailParam }));
    }
  }, [location]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (error) clearError();
    if (message) setMessage("");
    if (validationError) setValidationError("");
  };

  const validateForm = () => {
    if (form.newPassword !== form.confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }
    if (form.newPassword.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return false;
    }
    if (form.code.length !== 6) {
      setValidationError("Reset code must be 6 digits");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setValidationError("");

    if (!validateForm()) return;

    try {
      await resetPassword({
        email: form.email,
        code: form.code,
        newPassword: form.newPassword
      });
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Reset Password"
        footer={
          <p className="mt-3 text-center text-[12px] text-slate-600">
            Don't have a reset code? <Link to="/forgot-password" className="text-[#2563eb] hover:underline">Get one here</Link>
          </p>
        }
      >
        <p className="text-[12px] text-slate-600 mb-4 text-center">
          Enter the reset code and your new password
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-[12px] text-red-600 mb-3">
            {error}
          </div>
        )}

        {validationError && (
          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-[12px] text-red-600 mb-3">
            {validationError}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 rounded px-3 py-2 text-[12px] text-green-600 mb-3">
            {message}
          </div>
        )}

        <form className="space-y-3" onSubmit={onSubmit}>
          <FormField 
            label="Email" 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={onChange} 
            disabled={isLoading}
            required
          />

          <FormField 
            label="Reset Code" 
            type="text" 
            name="code" 
            value={form.code} 
            onChange={onChange} 
            disabled={isLoading}
            placeholder="Enter 6-digit code"
            maxLength={6}
            required
          />

          <FormField 
            label="New Password" 
            type="password" 
            name="newPassword" 
            value={form.newPassword} 
            onChange={onChange} 
            disabled={isLoading}
            required
          />

          <FormField 
            label="Confirm Password" 
            type="password" 
            name="confirmPassword" 
            value={form.confirmPassword} 
            onChange={onChange} 
            disabled={isLoading}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 rounded bg-[#2563eb] text-white text-[13px] font-medium hover:bg-[#1d4fd8] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
