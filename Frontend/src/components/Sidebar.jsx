import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { LayoutDashboard, CalendarPlus, CalendarDays, Settings, LogOut, X } from "lucide-react"
import LogoutModal from "./LogoutModal"
import KC from "../assets/KC_logo-icon.png"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Apply Leave", icon: CalendarPlus, path: "/apply-leave" },
  { label: "My Leave", icon: CalendarDays, path: "/my-leave" },
  { label: "Setting", icon: Settings, path: "/settings" },
]

export default function Sidebar({ setSidebarOpen }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [showLogout, setShowLogout] = useState(false)

  const handleNav = (path) => {
    navigate(path)
    setSidebarOpen(false)
  }

  const handleLogoutConfirm = async () => {
    setShowLogout(false)
    localStorage.removeItem('token');
    navigate("/login")
  }

  return (
    <>
      <aside className="w-56 h-screen bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm flex flex-col px-4 py-6 shadow-md dark:shadow-gray-900/50 shrink-0">

        {/* Logo + Close button on mobile */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-700 text-white text-xs font-bold w-9 h-9 flex items-center justify-center rounded-lg shrink-0">
              <img src={KC} />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
              Kalyani Cast Tech Ltd
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item.path)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                  ${location.pathname === item.path
                    ? "bg-blue-700 text-white shadow-md "
                    : "text-slate-500 dark:text-white hover:bg-blue-50 hover:text-blue-600"
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogout(true)}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

      </aside>

      {/* Logout Modal */}
      {showLogout && (
        <LogoutModal
          onCancel={() => setShowLogout(false)}
          onConfirm={handleLogoutConfirm}
        />
      )}
    </>
  )
}
