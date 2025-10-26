// ============================================================================
// CITIZEN LAYOUT COMPONENT
// ============================================================================
// This component provides the main layout for the citizen portal, including:
// - Header with public access badge
// - Sidebar navigation
// - Main content area
// - Responsive design for mobile and desktop
// ============================================================================

import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { SimpleDepartmentSelect } from "@/shared/components/DepartmentSelect";

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/**
 * Default fallback values
 */
const DEFAULTS = {
  FALLBACK_EMOJI: "👤",
  FALLBACK_AVATAR: "https://images.unsplash.com/photo-1603415526960-f7e0328d13a7?q=80&w=300&auto=format&fit=crop",
} as const;

// ============================================================================
// ICON COMPONENTS
// ============================================================================

/**
 * SVG Icon components for navigation
 */
const Icon = {
  dashboard: (className = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 12h8V3H3v9zM13 21h8v-9h-8v9zM3 21h8v-7H3v7zM13 3v7h8V3h-8z" />
    </svg>
  ),
  milestones: (className = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16v4H4zM4 10h10v4H4zM4 16h16v4H4z" />
    </svg>
  ),
  transparency: (className = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 7h16M4 12h10M4 17h7" />
    </svg>
  ),
  ledger: (className = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M14 2v6h6M8 13h8M8 17h8M8 9h4" />
    </svg>
  ),
  support: (className = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 15v3a3 3 0 0 1-3 3H9l-4 4v-4a3 3 0 0 1-3-3V9a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7v3" />
    </svg>
  ),
  chevronDown: (className = "h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safe JSON parsing with error handling
 */
function safeJSONParse(value: string | null): any | null {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}


/**
 * Generate page title based on current route
 */
function getPageTitle(pathname: string): string {
  const path = pathname.toLowerCase();
  
  const routeMap: Record<string, string> = {
    '/citizen/milestones': 'Project Milestones',
    '/app/milestones': 'Project Milestones',
    '/app/transparency': 'Transparency Portal',
    '/citizen/transparency': 'Transparency Portal',
    '/app/ledger': 'Transaction Ledger',
    '/citizen/ledger': 'Transaction Ledger',
    '/app/support': 'Contact Support',
    '/citizen/support': 'Contact Support',
  };
  
  // Check for exact matches first
  if (routeMap[path]) {
    return routeMap[path];
  }
  
  // Check for prefix matches
  for (const [route, title] of Object.entries(routeMap)) {
    if (path.startsWith(route)) {
      return title;
    }
  }
  
  return 'Dashboard';
}

/**
 * Generate CSS classes for navigation links
 */
function getNavLinkClasses(isActive: boolean): string {
  const baseClasses = "nav-link";
  const activeClasses = "nav-link-active";
  const inactiveClasses = "nav-link-inactive";
  
  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================


/**
 * Custom hook for getting page title based on current route
 */
function usePageTitle(): string {
  const { pathname } = useLocation();
  return getPageTitle(pathname);
}

// ============================================================================
// NAVIGATION COMPONENTS
// ============================================================================

/**
 * Navigation menu items configuration
 */
const NAVIGATION_ITEMS = [
  {
    path: "/citizen/dashboard",
    icon: Icon.dashboard,
    label: "Dashboard",
    exact: true,
  },
  {
    path: "/citizen/milestones",
    icon: Icon.milestones,
    label: "Project Milestones",
    exact: false,
  },
  {
    path: "/citizen/transparency",
    icon: Icon.transparency,
    label: "Transparency Portal",
    exact: false,
  },
  {
    path: "/citizen/ledger",
    icon: Icon.ledger,
    label: "Transaction Ledger",
    exact: false,
  },
  {
    path: "/citizen/support",
    icon: Icon.support,
    label: "Contact Support",
    exact: false,
  },
] as const;

/**
 * Navigation component for sidebar
 */
const Navigation: React.FC = () => (
  <nav className="space-y-1">
    {NAVIGATION_ITEMS.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.exact}
        className={({ isActive }) => getNavLinkClasses(isActive)}
      >
        {item.icon()} 
        <span>{item.label}</span>
      </NavLink>
    ))}
  </nav>
);

// ============================================================================
// HEADER COMPONENTS
// ============================================================================

/**
 * User avatar component
 */
const UserAvatar: React.FC<{ 
  avatarUrl: string | null; 
  size?: "sm" | "md"; 
  className?: string; 
}> = ({ avatarUrl, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
  };
  
  if (avatarUrl) {
    return (
      <img 
        src={avatarUrl || DEFAULTS.FALLBACK_AVATAR} 
        alt="User avatar" 
        className={`${sizeClasses[size]} rounded-full object-cover border ${className}`}
      />
    );
  }
  
  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-slate-200 ${className}`}>
      {DEFAULTS.FALLBACK_EMOJI}
    </div>
  );
};

/**
 * Header component with public access badge
 */
const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 h-16 w-full border-b border-gray-200/60 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            P
          </div>
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Publico
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Public Access Badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-blue-700">Public Access</span>
            </div>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// SIDEBAR COMPONENTS
// ============================================================================

/**
 * Public access info section for sidebar
 */
const PublicAccessInfo: React.FC = () => (
  <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </div>
    <div>
        <div className="text-sm font-semibold text-gray-900">Public Portal</div>
      <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Open Access
        </div>
      </div>
    </div>
    <div className="text-xs text-blue-600 bg-blue-100/50 px-2 py-1 rounded">
      Browse government transparency data
    </div>
  </div>
);

/**
 * Sidebar component
 */
const Sidebar: React.FC = () => (
  <aside className="hidden lg:block border-r border-gray-200/60 bg-white/50 backdrop-blur-sm">
    <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-auto p-6">
      <PublicAccessInfo />
      <Navigation />
    </div>
  </aside>
);

// ============================================================================
// MAIN CONTENT COMPONENTS
// ============================================================================

/**
 * Page header with title and filters
 */
const PageHeader: React.FC<{ 
  title: string; 
  isTransparency: boolean; 
}> = ({ title, isTransparency }) => {
  const [department, setDepartment] = useState("All Departments");
  const [view, setView] = useState("Monthly View");

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Real-time transparency into public spending
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Transparency Portal Filters */}
        {isTransparency && (
          <>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="select-field text-xs py-2"
              aria-label="Department"
            >
              <option value="All">All Departments</option>
              <option>City Mayor's Office</option>
              <option>City Engineering Office</option>
              <option>City Health Office</option>
              <option>City Social Welfare & Development Office</option>
              <option>City Planning & Development Office</option>
            </select>

            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="select-field text-xs py-2"
              aria-label="Time View"
            >
              <option>Monthly View</option>
              <option>Quarterly View</option>
              <option>Yearly View</option>
            </select>
          </>
        )}

        {/* Last Updated */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Main content area
 */
const MainContent: React.FC<{ 
  title: string; 
  isTransparency: boolean; 
}> = ({ title, isTransparency }) => (
  <main className="flex h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] flex-col overflow-hidden px-8 py-8">
    <PageHeader title={title} isTransparency={isTransparency} />
    <div className="flex-1 overflow-y-auto pb-8">
      <Outlet />
    </div>
  </main>
);

// ============================================================================
// MAIN LAYOUT COMPONENT
// ============================================================================

/**
 * Main layout component for the citizen portal
 * 
 * This component provides:
 * - Responsive header with public access badge
 * - Sidebar navigation (hidden on mobile)
 * - Main content area with page-specific headers
 * - Proper routing and outlet rendering
 */
export default function AppLayout() {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================
  
  const { pathname } = useLocation();
  const title = usePageTitle();

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const isTransparency = pathname.startsWith("/citizen/transparency");

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Layout Grid */}
      <div className="grid w-full grid-cols-1 lg:grid-cols-[280px,1fr] min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <MainContent title={title} isTransparency={isTransparency} />
      </div>
    </div>
  );
}