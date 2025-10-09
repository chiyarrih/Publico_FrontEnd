import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { setRole, setPortalRole, Portal } from "../../../utils/auth";
import { UserRole } from "../../../shared/types/auth";
import AuthLayout from "./AuthLayout";
import AuthCard from "./ui/AuthCard";
import FormField from "./ui/FormField";
import RadioRow from "./ui/RadioRow";


const LoginPage = () => {
  const { loginWithRoleValidation, isLoading, error, clearError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", portal: "citizen" as Portal, remember: false });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(s => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    if (error) clearError();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate role-based access
    const expectedRole = form.portal === "admin" ? "Admin" : 
                        form.portal === "agency" ? "Agency" : "Citizen";
    
    setPortalRole(form.portal);
    await loginWithRoleValidation({ email: form.email, password: form.password }, expectedRole);
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Log In to Publico"
        footer={
          <p className="mt-3 text-center text-[12px] text-slate-600">
            Don&apos;t have an account? <Link to="/signup" className="text-[#2563eb] hover:underline">Sign up</Link>
          </p>
        }
      >
        {error && (
          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-[12px] text-red-600 mb-3">
            {error}
          </div>
        )}

        <form className="space-y-3" onSubmit={onSubmit}>
          <FormField label="Email" type="email" name="email" value={form.email} onChange={onChange} disabled={isLoading} />
          <FormField label="Password" type="password" name="password" value={form.password} onChange={onChange} disabled={isLoading} />

          <div className="flex items-center justify-between">
            <span className="text-[12px] text-slate-700">I am a:</span>
            <Link to="/forgot-password" className="text-[12px] text-[#2563eb] hover:underline">Forgot password?</Link>
          </div>
          <RadioRow
            name="portal"
            value={form.portal}
            onChange={onChange}
            options={[
              { label: "Citizen", value: "citizen" },
              { label: "Agency Representative", value: "agency" },
              { label: "Administrator", value: "admin" }
            ]}
          />

          <label className="inline-flex items-center gap-2 text-[12px]">
            <input className="accent-[#2563eb]" type="checkbox" name="remember" checked={form.remember} onChange={onChange} />
            Remember me
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 rounded bg-[#2563eb] text-white text-[13px] font-medium hover:bg-[#1d4fd8] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;
