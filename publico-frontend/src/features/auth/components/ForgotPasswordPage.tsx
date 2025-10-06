import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "./AuthLayout";
import AuthCard from "./ui/AuthCard";
import FormField from "./ui/FormField";

const ForgotPasswordPage = () => {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    if (error) clearError();
    if (message) setMessage("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    
    try {
      await forgotPassword({ email });
      setMessage("Reset code sent to your email! Please check your inbox.");
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Forgot Password"
        footer={
          <p className="mt-3 text-center text-[12px] text-slate-600">
            Remember your password? <Link to="/login" className="text-[#2563eb] hover:underline">Log in</Link>
          </p>
        }
      >
        <p className="text-[12px] text-slate-600 mb-4 text-center">
          Enter your email address and we'll send you a reset code
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-[12px] text-red-600 mb-3">
            {error}
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
            value={email} 
            onChange={onChange} 
            disabled={isLoading}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 rounded bg-[#2563eb] text-white text-[13px] font-medium hover:bg-[#1d4fd8] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/reset-password"
            className="text-[12px] text-[#2563eb] hover:underline"
          >
            Already have a reset code?
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
