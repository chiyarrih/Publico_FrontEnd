import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

/** ---------- Small icon set (inline SVG so no deps) ---------- */
const I = {
  menu: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-600">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-500">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  chevronL: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-slate-500">
      <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  chevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-slate-500">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  dashboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" fill="currentColor" />
    </svg>
  ),
  budget: () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M3 7h18v12H3z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 7l2-3h14l2 3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  docs: () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M7 3h8l4 4v14H7z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 3v4h4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  ledger: () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M4 5h16M4 12h16M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  alert: () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M12 3l9 16H3z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  user: () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zM3 21a9 9 0 0 1 18 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  faq: () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M12 18h.01M8 9a4 4 0 1 1 6.7 2.9 4.3 4.3 0 0 0-1.7 3.1v.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  support: () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M18 16v-5a6 6 0 1 0-12 0v5M6 20h12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

/** ---------- helpers ---------- */
function linkClass({ isActive }: { isActive: boolean }) {
  return [
    "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition",
    isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
  ].join(" ");
}

const titleMap: Record<string, string> = {
  "/agency": "Agency Dashboard",
  "/agency/": "Agency Dashboard",
  "/agency/budgets": "Budgets",
  "/agency/documents": "Documents",
  "/agency/transactions": "Transaction Ledger",
  "/agency/alerts": "Smart Contract Alerts",
  "/agency/profile": "User Profile",
  "/agency/faqs": "FAQs",
  "/agency/support": "Contact Support",
};

function usePageTitle() {
  const { pathname } = useLocation();
  return titleMap[pathname] ??
    (pathname.startsWith("/agency/") ? pathname.split("/").slice(-1)[0].replace(/-/g, " ") : "Agency");
}

export default function AgencyLayout() {
  const title = usePageTitle();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/agency/login");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Header (fixed 64px) */}
      <header className="sticky top-0 z-10 h-16 w-full border-b bg-white shadow-sm">
        <div className="flex h-full items-center justify-between px-6">
          {/* Brand pinned left */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-blue-600">Publicoo</span>
            <span className="text-sm text-slate-500">• Agency Portal</span>
          </div>

          {/* Actions + profile */}
          <div className="relative flex items-center gap-3" ref={menuRef}>
            <button className="rounded p-2 hover:bg-slate-100"><I.menu /></button>
            <button className="rounded p-2 hover:bg-slate-100 relative">
              <I.bell />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center gap-2 rounded p-2 hover:bg-slate-100"
            >
              <span className="hidden text-xs text-slate-600 sm:block">Agency User — Full Access</span>
              <div className="h-8 w-8 rounded-full bg-slate-200" />
              <I.chevronDown />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-40 rounded-md border border-slate-200 bg-white shadow-lg">
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Shell under header: full-width, stable padding/height */}
      <div className="grid min-h-[calc(100vh-4rem)] w-full grid-cols-1 lg:grid-cols-[260px,1fr]">
        {/* Sidebar (sticky, scrollable) */}
        <aside className="hidden border-r border-slate-200 bg-white lg:block">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-auto p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div>
                <div className="text-sm font-medium text-slate-900">Agency User</div>
                <div className="text-xs text-slate-500">Full Access</div>
              </div>
            </div>

            <nav className="space-y-1">
              <NavLink to="/agency" end className={linkClass}>
                <I.dashboard /> <span>Dashboard</span>
              </NavLink>
              <NavLink to="/agency/budgets" className={linkClass}>
                <I.budget /> <span>Budgets</span>
              </NavLink>
              <NavLink to="/agency/documents" className={linkClass}>
                <I.docs /> <span>Documents</span>
              </NavLink>
              <NavLink to="/agency/transactions" className={linkClass}>
                <I.ledger /> <span>Transaction Ledger</span>
              </NavLink>
              <NavLink to="/agency/alerts" className={linkClass}>
                <I.alert /> <span>Smart Contract Alerts</span>
              </NavLink>
              <NavLink to="/agency/profile" className={linkClass}>
                <I.user /> <span>User Profile</span>
              </NavLink>
              <NavLink to="/agency/faqs" className={linkClass}>
                <I.faq /> <span>FAQs</span>
              </NavLink>
              <NavLink to="/agency/support" className={linkClass}>
                <I.support /> <span>Contact Support</span>
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* Main content (constant padding; content height won’t “shrink”) */}
        <main className="flex min-h-[calc(100vh-4rem)] flex-col px-8 py-8">
          {/* Page header row */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
              <div className="mt-1 text-xs text-slate-500">
                Agency:&nbsp;
                <button className="text-blue-600 hover:underline">
                  Department of Transportation
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
                Monthly View
              </button>
              <div className="text-xs text-slate-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Routed page content */}
          <div className="flex-1 min-h-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
