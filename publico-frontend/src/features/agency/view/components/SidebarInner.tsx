import { I } from "@/utils/helpers";
import { NavLink, NavLinkRenderProps } from "react-router-dom"
interface Profile {
    name: string;
    email: string;
    phone: string;
    address: string;

}
interface SidebarInnerProps {
    mobile?: boolean,
    profile: Profile,
    className:string | ((props: NavLinkRenderProps) => string | undefined),
    setSidebarOpen: () => void
}
export default function SidebarInner ({mobile, profile, className, setSidebarOpen}: SidebarInnerProps) {
    return (
        <div className={mobile ? "h-full overflow-auto p-6" : "sticky top-16 h-[calc(100vh-4rem)] overflow-auto p-6"}>
      {mobile && (
        <div className="mb-4 flex justify-end">
          <button
            className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-slate-100"
            onClick={setSidebarOpen}
            aria-label="Close sidebar"
            title="Close"
          >
            <svg
              className="w-4 h-4 text-slate-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          {(profile.name || "Agency User").charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">{profile.name || "Agency User"}</div>
          <div className="text-xs text-blue-600 font-medium">Full Access</div>
        </div>
      </div>
      <nav className="space-y-2">
        <NavLink to="/agency/dashboard" end className={className}>
          <I.dashboard />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/agency/milestones" className={className}>
          <I.docs />
          <span>Project Milestones</span>
        </NavLink>
        <NavLink to="/agency/budgets" className={className}>
          <I.budget />
          <span>Budgets</span>
        </NavLink>
        <NavLink to="/agency/documents" className={className}>
          <I.docs />
          <span>Documents</span>
        </NavLink>
        <NavLink to="/agency/transactions" className={className}>
          <I.ledger />
          <span>Transaction Ledger</span>
        </NavLink>
        <NavLink to="/agency/alerts" className={className}>
          <I.alert />
          <span>Smart Contract Alerts</span>
        </NavLink>
        <NavLink to="/agency/profile" className={className}>
          <I.user />
          <span>User Profile</span>
        </NavLink>
        <NavLink to="/agency/faqs" className={className}>
          <I.faq />
          <span>FAQs</span>
        </NavLink>
        <NavLink to="/agency/support" className={className}>
          <I.support />
          <span>Contact Support</span>
        </NavLink>
      </nav>
    </div>
    )
}