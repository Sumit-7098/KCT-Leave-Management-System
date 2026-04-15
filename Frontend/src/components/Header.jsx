import { useNavigate } from "react-router-dom"
import { Sun, Moon, Bell, Menu } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

export default function Header({ setSidebarOpen }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between px-4 lg:px-7 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-gray-700">

      {/* Left — Hamburger on mobile, Search on desktop */}
      <div className="flex items-center gap-3">

        {/* Hamburger — only on mobile */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-slate-500 hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar 
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 w-60">
          <Search className="text-slate-400 w-4 h-4 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400 w-full"
          />
        </div> */}

      </div>

      {/* Right */}
      <div className="flex items-center gap-2 lg:gap-3">

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-slate-500 dark:text-slate-200" />
          ) : (
            <Moon className="w-5 h-5 text-slate-500 dark:text-slate-200" />
          )}
        </button>
        {/* Notification */}
        <button className="hover:bg-slate-100 dark:hover:bg-slate-800  p-2 rounded-lg transition-colors duration-200">
          <Bell className="w-5 h-5 text-slate-500 dark:text-slate-200" />
        </button>

        {/* Divider — hidden on mobile */}
        <div className="hidden sm:block w-px h-8 bg-slate-200" />

        {/* User Info */}
        {user ? (
          <div
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-xl transition-colors duration-200"
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full object-cover ring-2 ring-slate-200 bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'JD'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {user.fullName || 'User'}
              </p>
              <p className="text-xs text-slate-400">
                {user.email || 'user@example.com'}
              </p>
            </div>
            <span className="hidden md:block text-slate-400 text-xl ml-1">›</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-slate-50">
            <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin"></div>
            <span className="text-xs font-medium text-slate-500">Loading...</span>
          </div>
        )}

      </div>
    </header>
  )
}
