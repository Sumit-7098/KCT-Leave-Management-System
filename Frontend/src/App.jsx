import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Components
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import ProtectedRoute from "./components/ProtectedRoutes.jsx";

// Pages
import Dashboard from "./pages/Dashboard"
import MyLeave from "./pages/MyLeave"
import ApplyLeave from "./pages/ApplyLeave"
import Settings from "./pages/Settings"
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PageNotFound from "./pages/PageNotFound.jsx";

// Styles
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Main App Component
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/*" element={
              <div className="flex h-screen w-full bg-slate-100 dark:bg-gray-900 overflow-hidden">
                {/* Overlay */}
                {sidebarOpen && (
                  <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}
                {/* Sidebar */}
                <div className={`fixed lg:static inset-y-0 left-0 z-30 transition-transform duration-300 ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}>
                  <Sidebar setSidebarOpen={setSidebarOpen} />
                </div>
                {/* Main */}
                <div className="flex flex-col flex-1 overflow-hidden w-full">
                  <Header setSidebarOpen={setSidebarOpen} />
                  <div className="flex-1 overflow-y-auto p-4 lg:p-7">
                    <Routes>
                      <Route index element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
                      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/my-leave" element={<ProtectedRoute><MyLeave /></ProtectedRoute>} />
                      <Route path="/apply-leave" element={<ProtectedRoute><ApplyLeave /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="*" element={<PageNotFound />} />
                    </Routes>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
