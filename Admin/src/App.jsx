import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/Dashboard";
import EmployeeManagement from "./Pages/EmployeeManagement";
import EditEmployee from "./Pages/EditEmployee";

import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import LeaveRequests from "./Pages/LeaveRequests";
import LeaveBalance from "./Pages/LeaveBalance";
import Settings from "./Pages/Settings";
import AdminLogin from "./Pages/AdminLogin";
import ProtectedRoute from "./Components/ProtectedRoute";
import { useState } from "react";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-100">
                {/* Desktop Sidebar */}
                <div className="hidden md:flex w-64 shrink-0">
                  <Sidebar />
                </div>

                {/* Backdrop */}
                {isSidebarOpen && (
                  <div
                    className="md:hidden fixed inset-0 bg-black/40 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                  />
                )}

                {/* Drawer */}
                <div
                  className={`md:hidden fixed top-0 left-0 h-screen w-72 z-50 transform transition-transform duration-200 bg-white shadow-lg ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
                >
                  <Sidebar />
                  {/* click outside handled by backdrop */}
                </div>

                {/* Right Side */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Header */}
                  <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
                  <div className="flex-1 p-6 overflow-y-auto">
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="employees" element={<EmployeeManagement />} />
                      <Route path="employees/edit" element={<EditEmployee />} />

                      <Route path="leaves" element={<LeaveRequests />} />
                      <Route path="balance" element={<LeaveBalance />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

