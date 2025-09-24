import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setRole } from "../utils/auth";

/** Minimal, “can’t-misclick” login card */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "citizen",
    remember: false,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e: React.FormEvent) => e.preventDefault();

  return (
    <div className="min-h-screen w-full bg-[#eaf1ff]">
      <div className="mx-auto flex justify-center pt-24 px-4">
        <div className="w-[360px]">
          {/* Brand */}
          <div className="w-full text-center mb-3">
            <span className="text-[13px] font-semibold text-[#2563eb]">Publicoo</span>
          </div>

          <div className="bg-white rounded-lg shadow border border-slate-200">
            <div className="p-5 relative">
              {/* Simple “role” debug tag so you KNOW what it thinks you are */}
              <div className="absolute right-2 top-2 text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                role: {localStorage.getItem("auth_role") || "none"}
              </div>

              <h1 className="text-[15px] font-semibold text-center mb-4">
                Log In to Publicoo
              </h1>

              <form className="space-y-3" onSubmit={onSubmit}>
                <label className="block">
                  <span className="block text-[12px] text-slate-700 mb-1">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="w-full h-8 rounded border border-slate-300 px-2 text-[13px] outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                  />
                </label>

                <label className="block">
                  <span className="block text-[12px] text-slate-700 mb-1">Password</span>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    required
                    className="w-full h-8 rounded border border-slate-300 px-2 text-[13px] outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                  />
                </label>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-700">I am a:</span>
                    <Link to="#" className="text-[12px] text-[#2563eb] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-[12px]">
                    <label className="inline-flex items-center gap-1">
                      <input
                        className="accent-[#2563eb]"
                        type="radio"
                        name="role"
                        value="citizen"
                        checked={form.role === "citizen"}
                        onChange={onChange}
                      />{" "}
                      Citizen
                    </label>
                    <label className="inline-flex items-center gap-1">
                      <input
                        className="accent-[#2563eb]"
                        type="radio"
                        name="role"
                        value="agency"
                        checked={form.role === "agency"}
                        onChange={onChange}
                      />{" "}
                      Agency Representative
                    </label>
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 text-[12px]">
                  <input
                    className="accent-[#2563eb]"
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={onChange}
                  />
                  Remember me
                </label>

                <button
                  type="submit"
                  className="w-full h-9 rounded bg-[#2563eb] text-white text-[13px] font-medium hover:bg-[#1d4fd8] transition"
                >
                  Log In
                </button>

                {/* Continue as Guest — absolutely isolated click target */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setRole("guest");
                    navigate("/app/dashboard"); // guest area
                  }}
                  className="mt-2 w-full h-9 rounded border border-slate-300 text-[13px] font-medium hover:bg-slate-50 transition"
                >
                  Continue as Guest
                </button>
              </form>

              {/* ✅ form is closed above */}

              {/* Spacer so nothing can overlap the guest button */}
              <div className="h-2" />

              <p className="mt-3 text-center text-[12px] text-slate-600 pointer-events-auto">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-[#2563eb] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
