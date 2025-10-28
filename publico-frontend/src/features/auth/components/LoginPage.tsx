import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "./AuthLayout";
import AuthCard from "./ui/AuthCard";
import FormField from "./ui/FormField";
import PasswordField from "./ui/PasswordField";


const LoginPage = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", remember: false });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(s => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    if (error) clearError();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Login and automatically determine role from account
    await login({ email: form.email, password: form.password });
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to access your transparency portal"
        footer={
          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an agency account?{" "}
              <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Register your agency
              </Link>
            </p>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500">
                <span className="font-medium">For Citizens:</span> No account needed!{" "}
                <Link to="/citizen" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Access public portal →
                </Link>
              </p>
            </div>
          </div>
        }
      >
        {error && (
          <div className="alert alert-error mb-6 flex items-start gap-3">
            <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">Login Failed</p>
              <p className="text-sm mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          <FormField 
            label="Email Address" 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={onChange} 
            disabled={isLoading}
            placeholder="you@example.com"
            autoComplete="email"
          />
          
          <PasswordField 
            label="Password" 
            name="password" 
            value={form.password} 
            onChange={onChange} 
            disabled={isLoading}
            placeholder="Enter your password"
          />

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer group">
              <input 
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-colors cursor-pointer" 
                type="checkbox" 
                name="remember" 
                checked={form.remember} 
                onChange={onChange} 
              />
              <span className="font-medium group-hover:text-gray-900 transition-colors">Remember me</span>
            </label>
            <Link 
              to="/forgot-password" 
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 text-base"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </span>
            )}
          </button>

          {/* Security Badge */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secured with end-to-end encryption</span>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;
