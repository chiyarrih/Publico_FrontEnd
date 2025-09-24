import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Brand from "../components/Brand";

const SignupPage: React.FC = () => {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirm: "",
    role: "citizen" as "citizen" | "agency", terms: false,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(s => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return alert("Passwords do not match.");
    if (!form.terms) return alert("Please agree to the terms and conditions.");
    console.log("Signup:", form);
  };

  return (
    <AuthLayout>
      <div className="w-[440px]">
        <Brand />
        <div className="bg-white rounded-lg shadow border border-slate-200">
          <div className="p-5">
            <h1 className="text-[15px] font-semibold text-center mb-4">Create an Account</h1>

            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="block text-[12px] text-slate-700 mb-1">First Name</span>
                  <input name="firstName" value={form.firstName} onChange={onChange} required
                         className="w-full h-8 rounded border border-slate-300 px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40" />
                </label>
                <label className="block">
                  <span className="block text-[12px] text-slate-700 mb-1">Last Name</span>
                  <input name="lastName" value={form.lastName} onChange={onChange} required
                         className="w-full h-8 rounded border border-slate-300 px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40" />
                </label>
              </div>

              <label className="block">
                <span className="block text-[12px] text-slate-700 mb-1">Email</span>
                <input type="email" name="email" value={form.email} onChange={onChange} required
                       className="w-full h-8 rounded border border-slate-300 px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40" />
              </label>

              <label className="block">
                <span className="block text-[12px] text-slate-700 mb-1">Password</span>
                <input type="password" name="password" value={form.password} onChange={onChange} required
                       className="w-full h-8 rounded border border-slate-300 px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40" />
              </label>

              <label className="block">
                <span className="block text-[12px] text-slate-700 mb-1">Confirm Password</span>
                <input type="password" name="confirm" value={form.confirm} onChange={onChange} required
                       className="w-full h-8 rounded border border-slate-300 px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40" />
              </label>

              <div>
                <span className="block text-[12px] text-slate-700 mb-1">I am creating an account as a:</span>
                <div className="flex items-center gap-4 text-[12px]">
                  <label className="inline-flex items-center gap-1">
                    <input type="radio" name="role" value="citizen" checked={form.role==="citizen"} onChange={onChange} className="accent-[#2563eb]" /> Citizen
                  </label>
                  <label className="inline-flex items-center gap-1">
                    <input type="radio" name="role" value="agency" checked={form.role==="agency"} onChange={onChange} className="accent-[#2563eb]" /> Agency Representative
                  </label>
                </div>
              </div>

              <label className="flex items-center gap-2 text-[12px]">
                <input type="checkbox" name="terms" checked={form.terms} onChange={onChange} className="accent-[#2563eb]" />
                I agree to the terms and conditions
              </label>

              <button type="submit" className="w-full h-9 rounded bg-[#2563eb] text-white text-[13px] font-medium hover:bg-[#1d4fd8] transition">
                Sign Up
              </button>
            </form>

            <p className="mt-3 text-center text-[12px] text-slate-600">
              Already have an account? <Link to="/login" className="text-[#2563eb] hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
