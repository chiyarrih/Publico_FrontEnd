import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearRole } from "../utils/auth";

/* --- tiny inline icons (no deps) --- */
const Icon = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h5v8H3v-8zm7 0h11v8H10v-8z"/></svg>
  ),
  transparency: (
    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M3 3h18v2H3V3zm3 6h12v2H6V9zm-3 6h18v2H3v-2z"/></svg>
  ),
  ledger: (
    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M6 2h9a3 3 0 013 3v15H6a3 3 0 01-3-3V5a3 3 0 013-3zm0 2a1 1 0 00-1 1v12a1 1 0 001 1h10V5a1 1 0 00-1-1H6zm2 4h6v2H8V8zm0 4h6v2H8v-2z"/></svg>
  ),
  alerts: (
    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12 2l9 16H3L12 2zm0 14a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-1-7h2v5h-2V9z"/></svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
  ),
  faq: (
    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 17h2v2h-2v-2zm1-12a4 4 0 00-4 4h2a2 2 0 114 0c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5a4 4 0 00-4-4z"/></svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12 2a9 9 0 00-9 9v3a4 4 0 004 4h1v4h6v-4h1a4 4 0 004-4v-3a9 9 0 00-9-9zM5 11a7 7 0 1114 0v3a2 2 0 01-2 2h-2v-2H9v2H7a2 2 0 01-2-2v-3z"/></svg>
  ),
};

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: Icon.dashboard },
  { to: "/app/transparency", label: "Transparency Portal", icon: Icon.transparency },
  { to: "/app/ledger", label: "Transaction Ledger", icon: Icon.ledger },
  { to: "/app/alerts", label: "Smart Contract Alerts", icon: Icon.alerts },
  { to: "/app/profile", label: "User Profile", icon: Icon.user },
  { to: "/app/faq", label: "FAQs", icon: Icon.faq },
  { to: "/app/support", label: "Contact Support", icon: Icon.support },
];

const AppLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-60 border-r bg-white flex flex-col">
        {/* Brand */}
        <div className="h-12 border-b flex items-center px-4 text-[#2563eb] font-semibold">Publicoo</div>

        {/* User capsule */}
        <div className="px-3 py-3 border-b">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">👤</div>
            <div>
              <div className="text-[13px] font-medium text-slate-900">Citizen User</div>
              <div className="text-[11px] text-slate-500">Read Only</div>
            </div>
          </div>
        </div>

        {/* Nav list */}
        <nav className="p-2 space-y-1">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-[#eaf1ff] text-[#1d4fd8] font-medium"
                    : "text-slate-700 hover:bg-slate-100",
                ].join(" ")
              }
            >
              <span className="text-slate-500">{it.icon}</span>
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* spacer */}
        <div className="flex-1" />

        {/* Exit */}
        <div className="p-3 border-t">
          <button
            onClick={() => {
              clearRole();
              navigate("/login");
            }}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
          >
            Exit
          </button>
        </div>
      </aside>

      {/* Main panel */}
      <div className="flex-1 min-w-0">
        {/* Top bar (thin) */}
        <header className="h-12 border-b bg-white px-4 md:px-6 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            role: <span className="font-medium">{localStorage.getItem("auth_role") || "none"}</span>
          </div>
          <div className="text-xs text-slate-500">Guest view</div>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
