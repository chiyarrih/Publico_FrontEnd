import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { logout } from "../../../../utils/auth";

/* Icons matching the original design */
const Icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  budgetRequests: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  analytics: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  transactions: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  ),
  projects: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  alerts: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  verification: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 12l2 2 4-4"/>
      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
      <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
      <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
    </svg>
  ),
  profile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16,17 21,12 16,7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
};

/* Sidebar navigation item */
function SidebarItem({ to, icon, label, onClick }: { 
  to?: string; 
  icon: React.ReactNode; 
  label: string;
  onClick?: () => void;
}) {
  const location = useLocation();
  const isActive = to ? (
    to === '/admin' 
      ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
      : location.pathname.startsWith(to)
  ) : false;
  
  const content = (
    <div
      className={`flex items-center gap-3 px-6 py-4 text-white transition-colors cursor-pointer ${
        isActive 
          ? 'bg-blue-600 border-r-4 border-blue-300' 
          : 'hover:bg-blue-700/50'
      }`}
      onClick={onClick}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  if (to) {
    return <NavLink to={to}>{content}</NavLink>;
  }
  
  return content;
}

export default function AdminLayout() {
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-6 py-6 border-b border-blue-700">
          <h1 className="text-white text-lg font-semibold">Dagupan Admin</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <SidebarItem 
            to="/admin" 
            icon={Icons.dashboard} 
            label="Dashboard" 
          />
          <SidebarItem 
            to="/admin/requests" 
            icon={Icons.budgetRequests} 
            label="Budget Requests" 
          />
          <SidebarItem 
            to="/admin/analytics" 
            icon={Icons.analytics} 
            label="Analytics & Reports" 
          />
          <SidebarItem 
            to="/admin/transactions" 
            icon={Icons.transactions} 
            label="Transaction Ledger" 
          />
          <SidebarItem 
            to="/admin/milestones" 
            icon={Icons.projects} 
            label="Project Milestones" 
          />
          <SidebarItem 
            to="/admin/alerts" 
            icon={Icons.alerts} 
            label="Smart Contract Alerts" 
          />
          <SidebarItem 
            to="/admin/verification" 
            icon={Icons.verification} 
            label="Agency Verification" 
          />
          <SidebarItem 
            to="/admin/profile" 
            icon={Icons.profile} 
            label="User Profile" 
          />
        </nav>

        {/* Logout */}
        <div className="border-t border-blue-700">
          <SidebarItem 
            icon={Icons.logout} 
            label="Logout" 
            onClick={handleLogout}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
