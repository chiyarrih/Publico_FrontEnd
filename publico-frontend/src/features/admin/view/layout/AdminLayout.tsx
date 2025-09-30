import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Input, Ghost } from "../ui/blocks";

/* Minimal inline icons to match your screenshot */
const I = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
      <path d="M3 3h8v8H3V3Zm10 0h8v5h-8V3ZM3 13h8v8H3v-8Zm10 7v-7h8v7h-8Z" fill="currentColor"/>
    </svg>
  ),
  folder: (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
      <path d="M3 6h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" fill="currentColor"/>
    </svg>
  ),
  chart: (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
      <path d="M4 20V4h2v16H4Zm7 0V10h2v10h-2Zm7 0v-6h2v6h-2Z" fill="currentColor"/>
    </svg>
  ),
  ledger: (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
      <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5V3Zm2 4h10v2H7V7Zm0 4h10v2H7v-2Zm0 4h7v2H7v-2Z" fill="currentColor"/>
    </svg>
  ),
  bell: (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
      <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z" fill="currentColor"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" fill="currentColor"/>
    </svg>
  ),
};

/* Link with green accent when active */
function SidebarItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <div
          className={[
            "relative flex items-center gap-2 rounded-md px-3 py-2 text-sm",
            isActive
              ? "bg-blue-600 text-white shadow-inner"
              : "text-white/90 hover:bg-white/10",
          ].join(" ")}
        >
          {/* left accent bar */}
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded bg-emerald-400" />
          )}
          <span className="w-4">{icon}</span>
          <span>{label}</span>
        </div>
      )}
    </NavLink>
  );
}

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid lg:grid-cols-[260px_1fr]">
        {/* Sidebar — royal blue like your sample */}
        <aside className="hidden min-h-screen border-r border-blue-800 bg-gradient-to-b from-blue-800 via-blue-800 to-blue-700 px-3 py-3 lg:block">
          {/* Brand header bar */}
          <div className="mb-3 rounded-sm bg-blue-900/40 px-3 py-2 text-sm font-semibold text-white">
            Dagupan Admin
          </div>

          <nav className="space-y-1">
            <SidebarItem to="/admin"              icon={I.dashboard} label="Dashboard" />
            <SidebarItem to="/admin/requests"     icon={I.folder}    label="Budget Requests" />
            <SidebarItem to="/admin/analytics"    icon={I.chart}     label="Analytics & Reports" />
            <SidebarItem to="/admin/transactions" icon={I.ledger}    label="Transaction Ledger" />
            <SidebarItem to="/admin/alerts"       icon={I.bell}      label="Smart Contract Alerts" />
            <SidebarItem to="/admin/profile"      icon={I.user}      label="User Profile" />
          </nav>
        </aside>

        {/* Main */}
        <main>
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center gap-3 p-3">
              <button className="rounded p-2 text-slate-600 hover:bg-slate-100 lg:hidden">☰</button>
              <Input placeholder="Search…" />
              <div className="ml-auto flex items-center gap-2">
                <Ghost title="Notifications">🔔</Ghost>
                <Ghost>Admin User ⌄</Ghost>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-6xl p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
