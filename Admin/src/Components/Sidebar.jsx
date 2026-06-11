import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import logo from "../assets/KC_logo-icon.png";
import { LuLogOut, LuLayoutDashboard } from "react-icons/lu";
import { GoPeople } from "react-icons/go";
import { SiGoogledocs } from "react-icons/si";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function Sidebar() {
  const [adminProfile, setAdminProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        setAdminProfile(data);
      } catch (e) {
        setAdminProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const initials = useMemo(() => {
    const name = adminProfile?.fullName || adminProfile?.name;
    if (!name || typeof name !== "string") return "ER";

    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "E";
    const second = parts[1]?.[0] || parts[0]?.[1] || "R";

    return (first + second).toUpperCase();
  }, [adminProfile]);

  const displayName = adminProfile?.fullName || adminProfile?.name || "Admin";
  const displayRole = adminProfile?.role || "HR Admin";

  return (
    <div className="w-full h-full bg-white shadow-md flex flex-col justify-between p-4 md:p-5">
      {/* Top Section */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* Header row inside sidebar */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-8 h-8 shadow-sm" />
            <h1 className="block text-sm font-bold text-gray-800 tracking-wide">
              Kalyani Caste Tech Ltd
            </h1>
          </div>

          {/* Notification + Profile (mobile only) */}
          <div className="flex items-center gap-4 md:hidden">
            <div className="relative cursor-pointer">
              <FaBell className="text-gray-600 text-lg hover:text-blue-500 transition" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                3
              </span>
            </div>

            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full font-semibold">
                {loadingProfile ? "..." : initials}
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold">
                  {loadingProfile ? "Loading..." : displayName}
                </p>
                <p className="text-xs text-gray-500">{displayRole}</p>
              </div>

              <RiArrowDropDownLine className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:shadow-sm"
              }`
            }
          >
            <LuLayoutDashboard className="text-xl" />
            <span className="inline">Dashboard</span>
          </NavLink>

          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:shadow-sm"
              }`
            }
          >
            <GoPeople className="text-xl" />
            <span className="inline">Employees</span>
          </NavLink>

          <NavLink
            to="/leaves"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:shadow-sm"
              }`
            }
          >
            <SiGoogledocs className="text-xl" />
            <span className="inline">Leave Requests</span>
          </NavLink>

          <NavLink
            to="/balance"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:shadow-sm"
              }`
            }
          >
            <MdOutlineAccountBalanceWallet className="text-xl" />
            <span className="inline">Leave Balance</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:shadow-sm"
              }`
            }
          >
            <IoSettingsOutline className="text-xl" />
            <span className="inline">Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* Logout */}
      <button
        className="w-full flex items-center justify-center sm:justify-start gap-3 bg-red-600 text-white px-3 sm:px-4 py-3 rounded-xl hover:bg-red-700 transition"
        onClick={async () => {
          try {
            const { adminLogout } = await import("../utils/adminLogout");
            await adminLogout();
          } finally {
            window.location.href = "/login";
          }
        }}
      >
        <LuLogOut />
        <span className="inline">Logout</span>
      </button>
    </div>
  );
}
