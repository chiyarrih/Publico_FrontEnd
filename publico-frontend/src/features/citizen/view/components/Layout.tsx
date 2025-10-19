// ============================================================================
// CITIZEN LAYOUT COMPONENT
// ============================================================================
// This component provides the main layout for the citizen portal, including:
// - Header with user profile and notifications
// - Sidebar navigation
// - Main content area
// - Responsive design for mobile and desktop
// ============================================================================

import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../../utils/auth";

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/**
 * LocalStorage keys for user data
 */
const STORAGE_KEYS = {
  AVATAR: "profile.avatarDataUrl",
  USER_DATA: "publico_user_data",
} as const;

/**
 * Default fallback values
 */
const DEFAULTS = {
  FALLBACK_EMOJI: "👤",
  FALLBACK_AVATAR: "https://images.unsplash.com/photo-1603415526960-f7e0328d13a7?q=80&w=300&auto=format&fit=crop",
  DEFAULT_NAME: "Citizen",
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
  alerts: (className = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zM19 17H5l1.5-2V10a5.5 5.5 0 0 1 11 0v5L19 17z" />
    </svg>
  ),
  user: (className = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  faq: (className = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 9a4 4 0 1 1 8 0c0 2-2 3-2 3" />
      <path d="M12 17h.01" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
  support: (className = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 15v3a3 3 0 0 1-3 3H9l-4 4v-4a3 3 0 0 1-3-3V9a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7v3" />
    </svg>
  ),
  bell: (className = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 17H9l-1-1v-4a4 4 0 1 1 8 0v4l-1 1z" />
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
 * Extract first name from user data with fallbacks
 */
function extractFirstName(userData: any): string {
  if (!userData || typeof userData !== "object") {
    return DEFAULTS.DEFAULT_NAME;
  }
  
  // Try direct user object
  const user = userData.user || userData;
  
  // Priority order for first name fields
  const firstNameFields = [
    'first_name',
    'firstName', 
    'firstname',
    'given_name',
    'givenName'
  ];
  
  for (const field of firstNameFields) {
    const value = user[field];
    if (value && typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  
  // Try full name fields
  const fullNameFields = [
    'fullName',
    'full_name', 
    'name',
    'displayName'
  ];
  
  for (const field of fullNameFields) {
    const value = user[field];
    if (value && typeof value === "string" && value.trim()) {
      return value.trim().split(/\s+/)[0];
    }
  }
  
  // Try email (before @)
  const email = user.email || userData.email;
  if (email && typeof email === "string") {
    const emailName = email.split("@")[0];
    if (emailName) {
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
  }
  
  return DEFAULTS.DEFAULT_NAME;
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
    '/app/alerts': 'Smart Contract Alerts',
    '/citizen/alerts': 'Smart Contract Alerts',
    '/app/profile': 'User Profile',
    '/citizen/profile': 'User Profile',
    '/app/faq': 'FAQs',
    '/citizen/faq': 'FAQs',
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
  const baseClasses = "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition";
  const activeClasses = "bg-blue-50 text-blue-700";
  const inactiveClasses = "text-slate-600 hover:bg-slate-50 hover:text-slate-900";
  
  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Custom hook for managing local profile data
 * Optimized for performance with minimal localStorage access
 */
function useLocalProfile() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>(DEFAULTS.DEFAULT_NAME);

  useEffect(() => {
    /**
     * Load profile data from localStorage
     */
    const loadProfileData = () => {
      try {
        // Load avatar URL
        const avatar = localStorage.getItem(STORAGE_KEYS.AVATAR);
        setAvatarUrl(avatar || null);
        
        // Load user data from primary key
        const userDataRaw = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (userDataRaw) {
          const userData = safeJSONParse(userDataRaw);
          if (userData) {
            setFirstName(extractFirstName(userData));
            return;
          }
        }
        
        // Fallback to default
        setFirstName(DEFAULTS.DEFAULT_NAME);
      } catch (error) {
        console.warn("Error loading profile from localStorage:", error);
        setAvatarUrl(null);
        setFirstName(DEFAULTS.DEFAULT_NAME);
      }
    };

    // Initial load
    loadProfileData();

    /**
     * Handle storage events (for cross-tab synchronization)
     */
    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key || 
          event.key === STORAGE_KEYS.AVATAR || 
          event.key === STORAGE_KEYS.USER_DATA) {
        loadProfileData();
      }
    };
    
    /**
     * Handle custom profile update events
     */
    const handleProfileUpdate = () => loadProfileData();

    // Add event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profile:updated", handleProfileUpdate as EventListener);
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profile:updated", handleProfileUpdate as EventListener);
    };
  }, []);

  return { avatarUrl, firstName };
}

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
    path: "/citizen/alerts",
    icon: Icon.alerts,
    label: "Smart Contract Alerts",
    exact: false,
  },
  {
    path: "/citizen/profile",
    icon: Icon.user,
    label: "User Profile",
    exact: false,
  },
  {
    path: "/citizen/faq",
    icon: Icon.faq,
    label: "FAQs",
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
 * Header component with user profile and notifications
 */
const Header: React.FC<{ 
  avatarUrl: string | null; 
  firstName: string; 
  onLogout: () => void; 
}> = ({ avatarUrl, firstName, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 h-16 w-full border-b bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-6">
        <div className="text-lg font-bold text-blue-600">Publicoo</div>
        
        <div className="relative flex items-center gap-4" ref={menuRef}>
          {/* Notifications */}
          <button className="relative rounded p-2 hover:bg-slate-100">
            {Icon.bell()}
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
          </button>
          
          {/* User Menu */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="flex items-center gap-2 rounded p-2 hover:bg-slate-100"
          >
            <UserAvatar avatarUrl={avatarUrl} size="sm" />
            {Icon.chevronDown()}
          </button>
          
          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-12 w-40 rounded-md border border-slate-200 bg-white shadow-lg">
              <button
                onClick={onLogout}
                className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// SIDEBAR COMPONENTS
// ============================================================================

/**
 * User profile section for sidebar
 */
const SidebarProfile: React.FC<{ 
  avatarUrl: string | null; 
  firstName: string; 
}> = ({ avatarUrl, firstName }) => (
  <div className="mb-6 flex items-center gap-3">
    <UserAvatar avatarUrl={avatarUrl} size="md" />
    <div>
      <div className="text-sm font-medium text-slate-900">{firstName}</div>
      <div className="text-xs text-slate-500">Read Only</div>
    </div>
  </div>
);

/**
 * Sidebar component
 */
const Sidebar: React.FC<{ 
  avatarUrl: string | null; 
  firstName: string; 
}> = ({ avatarUrl, firstName }) => (
  <aside className="hidden lg:block border-r border-slate-200 bg-white">
    <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-auto p-6">
      <SidebarProfile avatarUrl={avatarUrl} firstName={firstName} />
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
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Transparency Portal Filters */}
        {isTransparency && (
          <>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-sm hover:bg-slate-50"
              aria-label="Department"
            >
              <option>All Departments</option>
              <option>Transportation</option>
              <option>Parks & Recreation</option>
              <option>Education</option>
              <option>Utilities</option>
            </select>

            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-sm hover:bg-slate-50"
              aria-label="Time View"
            >
              <option>Monthly View</option>
              <option>Quarterly View</option>
              <option>Yearly View</option>
            </select>
          </>
        )}

        {/* Last Updated */}
        <div className="hidden sm:block text-xs text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
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
  <main className="flex min-h-[calc(100vh-4rem)] flex-col px-8 py-8">
    <PageHeader title={title} isTransparency={isTransparency} />
    <div className="flex-1 min-h-0">
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
 * - Responsive header with user profile and notifications
 * - Sidebar navigation (hidden on mobile)
 * - Main content area with page-specific headers
 * - Proper routing and outlet rendering
 */
export default function AppLayout() {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================
  
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { avatarUrl, firstName } = useLocalProfile();
  const title = usePageTitle();

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const isTransparency = pathname.startsWith("/citizen/transparency");

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleLogout = () => {
    logout();
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Header */}
      <Header 
        avatarUrl={avatarUrl} 
        firstName={firstName} 
        onLogout={handleLogout} 
      />

      {/* Main Layout Grid */}
      <div className="grid w-full grid-cols-1 lg:grid-cols-[260px,1fr] min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar avatarUrl={avatarUrl} firstName={firstName} />

        {/* Main Content */}
        <MainContent title={title} isTransparency={isTransparency} />
      </div>
    </div>
  );
}