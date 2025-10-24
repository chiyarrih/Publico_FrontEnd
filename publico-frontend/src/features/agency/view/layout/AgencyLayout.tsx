"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { logout } from "../../../../utils/auth"
import ProposalForm from "@agency/controller/components/forms/ProposalForm"
import ProposalCard from "@agency/controller/components/cards/ProposalCard"
import useBudget from "@agency/controller/hooks/useBudget"
import useConnectWallet from "@agency/controller/hooks/useConnectWallet"
import InfiniteScroll from "react-infinite-scroll-component"
import { Toaster } from "react-hot-toast"
import Loader from "@agency/controller/components/loaders/Loader"
import useSwitch from "../../controller/hooks/useSwitch"
import { I } from "@/utils/helpers"
import SidebarInner from "../components/SidebarInner"
import Header from "../components/Header"
import { BudgetsInner } from "../components/BudgetsInner"
function linkClass({ isActive }: { isActive: boolean }) {
  return [
    "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition",
    isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
  ].join(" ")
}


export default function AgencyLayout() {
  const {
        title,
        isBudgets,
        navigate,
        profile,
        menuOpen,
        setMenuOpen,
        sidebarOpen,
        setSidebarOpen,
        notificationsEnabled,
        setNotificationsEnabled,
        menuRef,
      } = useSwitch();
  return (
    <div className="w-full min-h-screen bg-slate-50">
      {/* Header */}
       <Header notificationsEnabled={notificationsEnabled} setSidebarOpen={()=>setSidebarOpen(true)} setNotificationsEnabled={()=>setNotificationsEnabled(!notificationsEnabled)} menuOpen={menuOpen} logout={logout} profile={profile} menuRef={menuRef} setMenuOpen={()=> setMenuOpen((v) => !v)}/>

      {/* Mobile sidebar overlay — reuse existing sidebar content */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} aria-hidden />

          {/* panel */}
          <aside className="relative w-64 h-full bg-white shadow-lg">
            {/* reuse the same sidebar markup used for desktop */}
            <SidebarInner mobile profile={profile} className={linkClass} setSidebarOpen={()=>setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Shell */}
      <div className="grid min-h-[calc(100vh-4rem)] w-full grid-cols-1 lg:grid-cols-[260px,1fr]">
        {/* Sidebar */}
        <aside className="hidden bg-white border-r border-slate-200 lg:block">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-auto p-6">
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
              <NavLink to="/agency" end className={linkClass}>
                <I.dashboard />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/agency/milestones" className={linkClass}>
                <I.docs />
                <span>Project Milestones</span>
              </NavLink>
              <NavLink to="/agency/budgets" className={linkClass}>
                <I.budget />
                <span>Budgets</span>
              </NavLink>
              <NavLink to="/agency/documents" className={linkClass}>
                <I.docs />
                <span>Documents</span>
              </NavLink>
              <NavLink to="/agency/transactions" className={linkClass}>
                <I.ledger />
                <span>Transaction Ledger</span>
              </NavLink>
              <NavLink to="/agency/alerts" className={linkClass}>
                <I.alert />
                <span>Smart Contract Alerts</span>
              </NavLink>
              <NavLink to="/agency/profile" className={linkClass}>
                <I.user />
                <span>User Profile</span>
              </NavLink>
              <NavLink to="/agency/faqs" className={linkClass}>
                <I.faq />
                <span>FAQs</span>
              </NavLink>
              <NavLink to="/agency/support" className={linkClass}>
                <I.support />
                <span>Contact Support</span>
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex min-h-[calc(100vh-4rem)] flex-col px-8 py-8">
          {/* title only */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            <div />
          </div>

          <div className="flex-1 min-h-0">{isBudgets ? <BudgetsInner /> : <Outlet />}</div>
        </main>
      </div>
    </div>
  )
}
