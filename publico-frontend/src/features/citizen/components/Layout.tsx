import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

/* ---------- tiny inline icons (no extra deps) ---------- */
const Icon = {
  dashboard: (cls="h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 12h8V3H3v9zM13 21h8v-9h-8v9zM3 21h8v-7H3v7zM13 3v7h8V3h-8z" />
    </svg>
  ),
  transparency: (cls="h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 7h16M4 12h10M4 17h7" />
    </svg>
  ),
  ledger: (cls="h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h8M8 9h4" />
    </svg>
  ),
  alerts: (cls="h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zM19 17H5l1.5-2V10a5.5 5.5 0 0 1 11 0v5L19 17z" />
    </svg>
  ),
  user: (cls="h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  faq: (cls="h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 9a4 4 0 1 1 8 0c0 2-2 3-2 3" />
      <path d="M12 17h.01" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
  support: (cls="h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 15v3a3 3 0 0 1-3 3H9l-4 4v-4a3 3 0 0 1-3-3V9a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7v3" />
    </svg>
  ),
  bell: (cls="h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 17H9l-1-1v-4a4 4 0 1 1 8 0v4l-1 1z" />
    </svg>
  ),
  chevronDown: (cls="h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
};

/* ---------- helpers ---------- */
function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    "flex items-center gap-2 rounded px-3 py-2 text-sm transition",
    isActive
      ? "bg-blue-50 text-slate-900"
      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
  ].join(" ");
}
function usePageTitle() {
  const { pathname } = useLocation();
  const p = pathname.toLowerCase();
  if (p.startsWith("/app/transparency")) return "Transparency Portal";
  if (p.startsWith("/app/ledger")) return "Transaction Ledger";
  if (p.startsWith("/app/alerts")) return "Smart Contract Alerts";
  if (p.startsWith("/app/profile")) return "User Profile";
  if (p.startsWith("/app/faq")) return "FAQs";
  if (p.startsWith("/app/support")) return "Contact Support";
  return "Dashboard";
}

export default function AppLayout() {
  const title = usePageTitle();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* very top thin dark strip */}
      <div className="bg-slate-900 text-[11px] tracking-wider uppercase text-slate-300">
       
      </div>

      {/* white brand bar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="text-[16px] font-semibold text-blue-600">Publicoo</div>
          <div className="flex items-center gap-4">
            {/* bell with red dot */}
            <div className="relative">
              {Icon.bell("h-5 w-5 text-slate-600")}
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500"></span>
            </div>
            {/* user bubble */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200">
              <span className="text-[11px] text-slate-600">👤</span>
            </div>
            {/* chevron */}
            {Icon.chevronDown("h-4 w-4 text-slate-500")}
          </div>
        </div>
      </header>

      {/* shell: sidebar + content */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[260px,1fr]">
        {/* sidebar */}
        <aside className="lg:sticky lg:top-[64px]">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            {/* profile vignette */}
            <div className="mb-3 flex items-center gap-3 rounded-md bg-slate-50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200">👤</div>
              <div className="leading-tight">
                <div className="text-sm font-medium text-slate-900">Citizen User</div>
                <div className="text-[11px] text-slate-500">Read Only</div>
              </div>
            </div>

            {/* nav */}
            <nav className="space-y-1">
              <NavLink to="/app/dashboard" end className={navLinkClass}>
                {Icon.dashboard()} <span>Dashboard</span>
              </NavLink>
              <NavLink to="/app/transparency" className={navLinkClass}>
                {Icon.transparency()} <span>Transparency Portal</span>
              </NavLink>
              <NavLink to="/app/ledger" className={navLinkClass}>
                {Icon.ledger()} <span>Transaction Ledger</span>
              </NavLink>
              <NavLink to="/app/alerts" className={navLinkClass}>
                {Icon.alerts()} <span>Smart Contract Alerts</span>
              </NavLink>
              <NavLink to="/app/profile" className={navLinkClass}>
                {Icon.user()} <span>User Profile</span>
              </NavLink>
              <NavLink to="/app/faq" className={navLinkClass}>
                {Icon.faq()} <span>FAQs</span>
              </NavLink>
              <NavLink to="/app/support" className={navLinkClass}>
                {Icon.support()} <span>Contact Support</span>
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* main content */}
        <main>
          {/* content header bar */}
          <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-[18px] font-semibold text-slate-900">{title}</h1>

              <div className="flex items-center gap-3">
                {/* Monthly View dropdown */}
                <select
                  className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none hover:bg-slate-50"
                  defaultValue="Monthly View"
                >
                  <option>Monthly View</option>
                  <option>Quarterly View</option>
                  <option>Yearly View</option>
                </select>

                {/* Last updated */}
                <div className="text-[12px] text-slate-500">
                  <span className="mr-1">Last updated:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* page content */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
