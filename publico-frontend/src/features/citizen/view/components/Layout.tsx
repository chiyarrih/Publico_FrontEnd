import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../../utils/auth";

/* ---------- Icons ---------- */
const Icon = {
  dashboard: (cls = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 12h8V3H3v9zM13 21h8v-9h-8v9zM3 21h8v-7H3v7zM13 3v7h8V3h-8z" />
    </svg>
  ),
  milestones: (cls = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16v4H4zM4 10h10v4H4zM4 16h16v4H4z" />
    </svg>
  ),
  transparency: (cls = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 7h16M4 12h10M4 17h7" />
    </svg>
  ),
  ledger: (cls = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M14 2v6h6M8 13h8M8 17h8M8 9h4" />
    </svg>
  ),
  alerts: (cls = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zM19 17H5l1.5-2V10a5.5 5.5 0 0 1 11 0v5L19 17z" />
    </svg>
  ),
  user: (cls = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  faq: (cls = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 9a4 4 0 1 1 8 0c0 2-2 3-2 3" />
      <path d="M12 17h.01" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
  support: (cls = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 15v3a3 3 0 0 1-3 3H9l-4 4v-4a3 3 0 0 1-3-3V9a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7v3" />
    </svg>
  ),
  bell: (cls = "h-5 w-5") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 17H9l-1-1v-4a4 4 0 1 1 8 0v4l-1 1z" />
    </svg>
  ),
  chevronDown: (cls = "h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
};

/* ---------- Helpers ---------- */
function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition",
    isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
  ].join(" ");
}

function usePageTitle() {
  const { pathname } = useLocation();
  const p = pathname.toLowerCase();
  if (p.startsWith("/citizen/milestones") || p.startsWith("/app/milestones")) return "Project Milestones";
  if (p.startsWith("/app/transparency") || p.startsWith("/citizen/transparency")) return "Transparency Portal";
  if (p.startsWith("/app/ledger") || p.startsWith("/citizen/ledger")) return "Transaction Ledger";
  if (p.startsWith("/app/alerts") || p.startsWith("/citizen/alerts")) return "Smart Contract Alerts";
  if (p.startsWith("/app/profile") || p.startsWith("/citizen/profile")) return "User Profile";
  if (p.startsWith("/app/faq") || p.startsWith("/citizen/faq")) return "FAQs";
  if (p.startsWith("/app/support") || p.startsWith("/citizen/support")) return "Contact Support";
  return "Dashboard";
}

/* ---------- Avatar + First name from localStorage ---------- */
const AVATAR_KEY = "profile.avatarDataUrl";
const FIRST_KEY = "profile.firstName";
const FULL_KEY = "profile.fullName";
const FALLBACK_EMOJI = "👤";
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1603415526960-f7e0328d13a7?q=80&w=300&auto=format&fit=crop";

function pickFirstName(obj: any): string | null {
  if (!obj || typeof obj !== "object") return null;
  const direct =
    obj.firstName ?? obj.firstname ?? obj.given_name ?? obj.givenName ?? obj.first_name ?? obj.given ?? null;
  if (typeof direct === "string" && direct.trim()) return direct.trim();
  const full = obj.fullName ?? obj.name ?? obj.full_name ?? obj.displayName ?? null;
  if (typeof full === "string" && full.trim()) return full.trim().split(/\s+/)[0];
  if (obj.profile) return pickFirstName(obj.profile);
  if (obj.user) return pickFirstName(obj.user);
  if (obj.data) return pickFirstName(obj.data);
  return null;
}
function getJSON(v: string | null) {
  if (!v) return null;
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
}
function useLocalProfile() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("Citizen");

  useEffect(() => {
    const CANDIDATE_KEYS = [
      "profile.firstName",
      "profile.fullName",
      "profile",
      "user",
      "auth",
      "currentUser",
      "account",
      "session",
      "publicoo.user",
      "Auth:user",
      "auth.user",
      "auth_state",
      "redux_state",
    ];

    const load = () => {
      try {
        setAvatarUrl(localStorage.getItem(AVATAR_KEY) || null);
      } catch {
        setAvatarUrl(null);
      }

      const directFirst = localStorage.getItem(FIRST_KEY);
      if (directFirst && directFirst.trim()) {
        setFirstName(directFirst.trim());
        return;
      }
      const directFull = localStorage.getItem(FULL_KEY);
      if (directFull && directFull.trim()) {
        setFirstName(directFull.trim().split(/\s+/)[0]);
        return;
      }

      for (const k of CANDIDATE_KEYS) {
        const raw = localStorage.getItem(k);
        const obj = getJSON(raw);
        const found = pickFirstName(obj);
        if (found) {
          setFirstName(found);
          return;
        }
      }

      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)!;
        const obj = getJSON(localStorage.getItem(k));
        const found = pickFirstName(obj);
        if (found) {
          setFirstName(found);
          return;
        }
      }

      setFirstName("Citizen");
    };

    load();

    const onStorage = (e: StorageEvent) => {
      if (
        !e.key ||
        e.key === AVATAR_KEY ||
        e.key.includes("profile") ||
        e.key.includes("user") ||
        e.key.includes("auth")
      )
        load();
    };
    const onManual = () => load();

    window.addEventListener("storage", onStorage);
    window.addEventListener("profile:updated", onManual as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("profile:updated", onManual as EventListener);
    };
  }, []);

  return { avatarUrl, firstName };
}

/* ---------- Layout ---------- */
export default function AppLayout() {
  const title = usePageTitle();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [dept, setDept] = useState("All Departments");
  const [view, setView] = useState("Monthly View");

  const { avatarUrl, firstName } = useLocalProfile();

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const isTransparency = pathname.startsWith("/citizen/transparency");

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* header */}
      <header className="sticky top-0 z-10 h-16 w-full border-b bg-white shadow-sm">
        <div className="flex h-full items-center justify-between px-6">
          <div className="text-lg font-bold text-blue-600">Publicoo</div>
          <div className="relative flex items-center gap-4" ref={menuRef}>
            <button className="relative rounded p-2 hover:bg-slate-100">
              {Icon.bell()}
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 rounded p-2 hover:bg-slate-100">
              {avatarUrl ? (
                <img src={avatarUrl || FALLBACK_IMG} alt="avatar" className="h-8 w-8 rounded-full object-cover border" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">{FALLBACK_EMOJI}</div>
              )}
              {Icon.chevronDown()}
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

      {/* shell */}
      <div className="grid w-full grid-cols-1 lg:grid-cols-[260px,1fr] min-h-[calc(100vh-4rem)]">
        {/* sidebar */}
        <aside className="hidden lg:block border-r border-slate-200 bg-white">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-auto p-6">
            <div className="mb-6 flex items-center gap-3">
              {avatarUrl ? (
                <img src={avatarUrl || FALLBACK_IMG} alt="avatar" className="h-10 w-10 rounded-full object-cover border" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">{FALLBACK_EMOJI}</div>
              )}
              <div>
                <div className="text-sm font-medium text-slate-900">{firstName}</div>
                <div className="text-xs text-slate-500">Read Only</div>
              </div>
            </div>

            <nav className="space-y-1">
              <NavLink to="/citizen/dashboard" end className={navLinkClass}>
                {Icon.dashboard()} <span>Dashboard</span>
              </NavLink>

              {/* NEW: Project Milestones */}
              <NavLink to="/citizen/milestones" className={navLinkClass}>
                {Icon.milestones()} <span>Project Milestones</span>
              </NavLink>

              <NavLink to="/citizen/transparency" className={navLinkClass}>
                {Icon.transparency()} <span>Transparency Portal</span>
              </NavLink>
              <NavLink to="/citizen/ledger" className={navLinkClass}>
                {Icon.ledger()} <span>Transaction Ledger</span>
              </NavLink>
              <NavLink to="/citizen/alerts" className={navLinkClass}>
                {Icon.alerts()} <span>Smart Contract Alerts</span>
              </NavLink>
              <NavLink to="/citizen/profile" className={navLinkClass}>
                {Icon.user()} <span>User Profile</span>
              </NavLink>
              <NavLink to="/citizen/faq" className={navLinkClass}>
                {Icon.faq()} <span>FAQs</span>
              </NavLink>
              <NavLink to="/citizen/support" className={navLinkClass}>
                {Icon.support()} <span>Contact Support</span>
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* main */}
        <main className="flex min-h-[calc(100vh-4rem)] flex-col px-8 py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>

            <div className="flex items-center gap-2 sm:gap-3">
              {isTransparency && (
                <>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
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

              <div className="hidden sm:block text-xs text-slate-500">Last updated: {new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
