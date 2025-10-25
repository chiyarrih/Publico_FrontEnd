// ============================================================================
// GUEST-FRIENDLY CITIZEN LAYOUT COMPONENT
// ============================================================================
// This component provides the main layout for the citizen portal with guest access:
// - No authentication required
// - Header with login/signup buttons for guests
// - Sidebar navigation works for both guests and logged-in users
// - Main content area with page-specific headers
// - Responsive design for mobile and desktop
// ============================================================================

import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout, isAuthenticated, getUserData } from "../../../../utils/auth";

// Create context for filter state
const FilterContext = createContext<{
  department: string;
  view: string;
  setDepartment: (value: string) => void;
  setView: (value: string) => void;
}>({
  department: "All Departments",
  view: "Monthly View",
  setDepartment: () => {},
  setView: () => {},
});

export const useFilters = () => useContext(FilterContext);

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
  DEFAULT_NAME: "Guest",
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
  login: (className = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
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
  
  const user = userData.user || userData;
  
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
    '/citizen/transparency': 'Transparency Portal',
    '/citizen/ledger': 'Transaction Ledger',
    '/citizen/alerts': 'Smart Contract Alerts',
    '/citizen/profile': 'User Profile',
    '/citizen/faq': 'FAQs',
    '/citizen/support': 'Contact Support',
  };
  
  if (routeMap[path]) {
    return routeMap[path];
  }
  
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
 * Custom hook for managing local profile data
 */
function useLocalProfile() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>(DEFAULTS.DEFAULT_NAME);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const loadProfileData = () => {
      try {
        const authenticated = isAuthenticated();
        setIsLoggedIn(authenticated);

        if (authenticated) {
          const avatar = localStorage.getItem(STORAGE_KEYS.AVATAR);
          setAvatarUrl(avatar || null);
          
          const userDataRaw = localStorage.getItem(STORAGE_KEYS.USER_DATA);
          if (userDataRaw) {
            const userData = safeJSONParse(userDataRaw);
            if (userData) {
              setFirstName(extractFirstName(userData));
              return;
            }
          }
        } else {
          setAvatarUrl(null);
          setFirstName(DEFAULTS.DEFAULT_NAME);
        }
      } catch (error) {
        console.warn("Error loading profile from localStorage:", error);
        setAvatarUrl(null);
        setFirstName(DEFAULTS.DEFAULT_NAME);
        setIsLoggedIn(false);
      }
    };

    loadProfileData();

    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key || 
          event.key === STORAGE_KEYS.AVATAR || 
          event.key === STORAGE_KEYS.USER_DATA ||
          event.key === 'publico_auth_token') {
        loadProfileData();
      }
    };
    
    const handleProfileUpdate = () => loadProfileData();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profile:updated", handleProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profile:updated", handleProfileUpdate as EventListener);
    };
  }, []);

  return { avatarUrl, firstName, isLoggedIn };
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
 * Guest header component (for non-authenticated users)
 */
const GuestHeader: React.FC = () => {
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
          <span className="hidden sm:inline-block text-xs text-gray-500 ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full">
            Public Access
          </span>
          <span className="text-sm text-gray-600">- Government Transparency Portal</span>
        </div>
      </div>
    </header>
  );
};

/**
 * Authenticated header component (for logged-in users)
 */
const AuthenticatedHeader: React.FC<{ 
  avatarUrl: string | null; 
  firstName: string; 
  onLogout: () => void; 
}> = ({ avatarUrl, firstName, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
        
        <div className="relative flex items-center gap-3" ref={menuRef}>
          {/* Notifications */}
          <button className="relative rounded-xl p-2.5 hover:bg-gray-100 transition-colors group">
            {Icon.bell("h-5 w-5 text-gray-600 group-hover:text-gray-900")}
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
          </button>
          
          {/* User Menu */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            <UserAvatar avatarUrl={avatarUrl} size="sm" className="ring-2 ring-gray-200" />
            <span className="hidden sm:block text-sm font-medium text-gray-700">{firstName}</span>
            {Icon.chevronDown("h-4 w-4 text-gray-500")}
          </button>
          
          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-14 w-48 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="text-sm font-semibold text-gray-900">{firstName}</div>
                <div className="text-xs text-gray-500 mt-0.5">Citizen Account</div>
              </div>
              <NavLink
                to="/citizen/profile"
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  {Icon.user("h-4 w-4")}
                  Profile
                </span>
              </NavLink>
              <button
                onClick={onLogout}
                className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </span>
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
 * User profile section for sidebar (authenticated)
 */
const SidebarProfile: React.FC<{ 
  avatarUrl: string | null; 
  firstName: string;
  isLoggedIn: boolean;
}> = ({ avatarUrl, firstName, isLoggedIn }) => {
  if (!isLoggedIn) {
    return (
      <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50">
        <div className="text-sm font-semibold text-gray-900 mb-2">Public Access</div>
        <p className="text-xs text-gray-600">
          Browse government transparency data without creating an account. All information is publicly accessible.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8 flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50">
      <UserAvatar avatarUrl={avatarUrl} size="md" className="ring-2 ring-white shadow-md" />
      <div>
        <div className="text-sm font-semibold text-gray-900">{firstName}</div>
        <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Citizen Portal
        </div>
      </div>
    </div>
  );
};

/**
 * Sidebar component
 */
const Sidebar: React.FC<{ 
  avatarUrl: string | null; 
  firstName: string;
  isLoggedIn: boolean;
}> = ({ avatarUrl, firstName, isLoggedIn }) => (
  <aside className="hidden lg:block border-r border-gray-200/60 bg-white/50 backdrop-blur-sm">
    <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-auto p-6">
      <SidebarProfile avatarUrl={avatarUrl} firstName={firstName} isLoggedIn={isLoggedIn} />
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
        {isTransparency && (
          <>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="select-field text-xs py-2"
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
              className="select-field text-xs py-2"
              aria-label="Time View"
            >
              <option>Monthly View</option>
              <option>Quarterly View</option>
              <option>Yearly View</option>
            </select>
          </>
        )}

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
 * Main layout component for the citizen portal (guest-friendly)
 * 
 * This component provides:
 * - Guest access without authentication
 * - Responsive header with login/signup buttons for guests or profile menu for logged-in users
 * - Sidebar navigation (hidden on mobile)
 * - Main content area with page-specific headers
 * - Proper routing and outlet rendering
 */
export default function GuestLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { avatarUrl, firstName, isLoggedIn } = useLocalProfile();
  const title = usePageTitle();

  const isTransparency = pathname.startsWith("/citizen/transparency");

  const handleLogout = () => {
    logout();
    // Stay on the same page after logout (now as guest)
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header - Different for guest vs authenticated */}
      {isLoggedIn ? (
        <AuthenticatedHeader 
          avatarUrl={avatarUrl} 
          firstName={firstName} 
          onLogout={handleLogout} 
        />
      ) : (
        <GuestHeader />
      )}

      {/* Main Layout Grid */}
      <div className="grid w-full grid-cols-1 lg:grid-cols-[280px,1fr] min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar avatarUrl={avatarUrl} firstName={firstName} isLoggedIn={isLoggedIn} />

        {/* Main Content */}
        <MainContent title={title} isTransparency={isTransparency} />
      </div>
    </div>
  );
}

