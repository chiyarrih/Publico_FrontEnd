import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Input, Ghost } from "../ui/blocks";
import { logout } from "../../../../utils/auth";
import ErrorBoundary from "@/shared/components/layout/ErrorBoundary";
import LogoutConfirmationModal from "@/shared/components/LogoutConfirmationModal";

/* Icons matching the sidebar UI */
const I = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  folder: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  ledger: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  ),
  milestone: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M2 12l10-10 10 10-10 10z" />
    </svg>
  ),
  bell: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  verification: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  support: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

/* Sidebar navigation item */
function SidebarItem({ to, icon, label, end }: { to: string; icon: React.ReactNode; label: string; end?: boolean }) {
  return (
    <NavLink to={to} end={end} className="block">
      {({ isActive }) => (
        <div
          className={[
            "flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-normal transition-all",
            isActive
              ? "bg-blue-600 text-white"
              : "text-white/90 hover:bg-white/10",
          ].join(" ")}
        >
          <span className="flex-shrink-0">{icon}</span>
          <span>{label}</span>
        </div>
      )}
    </NavLink>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <LogoutConfirmationModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 4000,
            style: {
              background: '#10b981',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
      <Toaster/>
      <div className="grid lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:sticky lg:top-0 lg:h-screen overflow-hidden bg-gradient-to-b from-blue-700 via-blue-700 to-blue-800 lg:flex lg:flex-col">
          <div className="flex-1 px-4 py-6">
            {/* Brand header */}
            <div className="mb-8 px-2">
              <h1 className="text-xl font-semibold text-white">Dagupan Admin</h1>
            </div>

            {/* Navigation */}
            <nav className="space-y-3">
              {/* Primary */}
              <SidebarItem to="/admin/dashboard" end icon={I.dashboard} label="Dashboard" />
              <SidebarItem to="/admin/requests" icon={I.folder} label="Budget Requests" />

              {/* Secondary */}
              <SidebarItem to="/admin/transactions" icon={I.ledger} label="Transaction Ledger" />
              <SidebarItem to="/admin/milestones" icon={I.milestone} label="Project Milestones" />
              <SidebarItem to="/admin/alerts" icon={I.bell} label="Smart Contract Alerts" />
              <SidebarItem to="/admin/verification" icon={I.verification} label="Agency Verification" />
              <SidebarItem to="/admin/contact-support" icon={I.support} label="Contact Support" />
              <SidebarItem to="/admin/profile" icon={I.user} label="User Profile" />
            </nav>
          </div>

          {/* Logout button at bottom */}
          <div className="px-4 pb-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-normal text-white/90 transition-all hover:bg-white/10"
            >
              <span className="flex-shrink-0">{I.logout}</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-blue-700 via-blue-700 to-blue-800 p-0 lg:hidden flex flex-col">
              <div className="flex-1 px-4 py-6 overflow-y-auto">
                <div className="mb-8 px-2 flex items-center justify-between">
                  <h1 className="text-xl font-semibold text-white">Dagupan Admin</h1>
                  <button aria-label="Close menu" className="rounded p-2 text-white/90 hover:bg-white/10" onClick={() => setMobileOpen(false)}>✕</button>
                </div>
                <nav className="space-y-3" onClick={() => setMobileOpen(false)}>
                  <SidebarItem to="/admin/dashboard" end icon={I.dashboard} label="Dashboard" />
                  <SidebarItem to="/admin/requests" icon={I.folder} label="Budget Requests" />
                  <SidebarItem to="/admin/transactions" icon={I.ledger} label="Transaction Ledger" />
                  <SidebarItem to="/admin/milestones" icon={I.milestone} label="Project Milestones" />
                  <SidebarItem to="/admin/alerts" icon={I.bell} label="Smart Contract Alerts" />
                  <SidebarItem to="/admin/verification" icon={I.verification} label="Agency Verification" />
                  <SidebarItem to="/admin/contact-support" icon={I.support} label="Contact Support" />
                  <SidebarItem to="/admin/profile" icon={I.user} label="User Profile" />
                </nav>
              </div>
              <div className="px-4 pb-6">
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-normal text-white/90 transition-all hover:bg-white/10"
                >
                  <span className="flex-shrink-0">{I.logout}</span>
                  <span>Logout</span>
                </button>
              </div>
            </aside>
          </>
        )}

        {/* Main */}
        <main>
          {/* Mobile hamburger button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <div className="mx-auto max-w-6xl p-4 lg:p-6">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
