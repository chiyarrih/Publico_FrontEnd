import { I } from "@/utils/helpers";

interface Profile {
    name: string;
    email: string;
    phone: string;
    address: string;

}

interface Props{
    notificationsEnabled: boolean,
    setSidebarOpen: (value: boolean) => void,
    setNotificationsEnabled: (value: boolean) => void,
    menuOpen: boolean,
    logout:()=>void,
    profile: Profile,
    menuRef: React.MutableRefObject<HTMLDivElement | null>,
    setMenuOpen: (value: React.SetStateAction<boolean>) => void
}
export default function Header({notificationsEnabled, setSidebarOpen, menuOpen, logout, setNotificationsEnabled, profile, menuRef, setMenuOpen}: Props){
    return (
            <header className="sticky top-0 z-10 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
                    <div className="flex items-center justify-between h-full px-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 lg:hidden transition-colors"
                          aria-label="Open menu"
                          onClick={() => setSidebarOpen(true)}
                        >
                          <I.menu />
                        </button>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">P</span>
                          </div>
                          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Publico
                          </span>
                        </div>
                      </div>
            
                      <div className="flex items-center gap-3">
            
                        <div className="relative" ref={menuRef}>
                          <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <div className="hidden sm:block">
                              <span className="text-sm font-medium text-slate-700">{profile.name || "Agency User"}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                              {(profile.name || "Agency User").charAt(0).toUpperCase()}
                            </div>
                            <I.chevronDown />
                          </button>
                          {menuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-xl shadow-xl z-50 border-slate-200/60 overflow-hidden">
                              <div className="p-3 border-b border-slate-100">
                                <div className="text-sm font-semibold text-slate-900">{profile.name || "Agency User"}</div>
                                <div className="text-xs text-slate-500">Agency Account</div>
                              </div>
                              <button
                                onClick={logout}
                                className="block w-full px-4 py-3 text-sm text-left text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                  />
                                </svg>
                                Logout
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </header>
    )
}