import { useEffect, useRef, useState } from "react"
import useConnectWallet from "./useConnectWallet"
import { useLocation, useNavigate } from "react-router-dom"

export default function useSwitch(){
    const title = usePageTitle()
      const { pathname } = useLocation()
      const isBudgets = pathname.replace(/\/+$/, "") === "/agency/budgets"
      const navigate = useNavigate()
      const { profile } = useConnectWallet()
    
      const [menuOpen, setMenuOpen] = useState(false)
      const [sidebarOpen, setSidebarOpen] = useState(false)
      const [notificationsEnabled, setNotificationsEnabled] = useState(true)
      const menuRef = useRef<HTMLDivElement | null>(null)
    
      useEffect(() => {
        const onDown = (e: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
        }
        document.addEventListener("mousedown", onDown)
        return () => document.removeEventListener("mousedown", onDown)
      }, [])

        return {
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
      }
}


export  function usePageTitle() {
  const { pathname } = useLocation()
  const clean = pathname.replace(/\/+$/, "")
  if (clean === "/agency" || clean === "/agency/") return "Agency Dashboard"
  const last = clean.split("/").pop() || "Agency"
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}