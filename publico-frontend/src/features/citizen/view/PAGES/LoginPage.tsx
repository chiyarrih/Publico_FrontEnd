import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../controller/hooks/useAuth";
import { setRole, setPortalRole } from "../../../../utils/auth";

const LoginPage = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    portal: "citizen" as "citizen" | "agency",
    remember: false,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    if (error) clearError();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store portal role for routing after login
    setPortalRole(form.portal);
    
    await login({
      email: form.email,
      password: form.password,
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#eaf1ff]">
      <div className="mx-auto flex justify-center pt-24 px-4">
        <div className="w-[360px]">
          <div className="w-full text-center mb-3">
            <span className="text-[13px] font-semibold text-[#2563eb]">Publico</span>
          </div>

          <div className="bg-white rounded-lg shadow border border-slate-200">
            <div className="p-5 relative">
              <h1 className="text-[15px] font-semibold text-center mb-4">
                Log In to Publico
              </h1>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-[12px] text-red-600 mb-3">
                  {error}
                </div>
              )}

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
                        name="portal"
                        value="citizen"
                        checked={form.portal === "citizen"}
                        onChange={onChange}
                      />{" "}
                      Citizen
                    </label>
                    <label className="inline-flex items-center gap-1">
                      <input
                        className="accent-[#2563eb]"
                        type="radio"
                        name="portal"
                        value="agency"
                        checked={form.portal === "agency"}
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
                  disabled={isLoading}
                  className="w-full h-9 rounded bg-[#2563eb] text-white text-[13px] font-medium hover:bg-[#1d4fd8] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setRole("guest");
                    setPortalRole(form.portal);
                    window.location.href = form.portal === "agency" ? "/agency" : "/citizen/dashboard";
                  }}
                  className="mt-2 w-full h-9 rounded border border-slate-300 text-[13px] font-medium hover:bg-slate-50 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Continue as Guest
                </button>
              </form>

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
