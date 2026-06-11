import React, { useEffect, useMemo, useState } from "react";
import { FaBell } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import logo from "../assets/KC_logo-icon.png";

const Header = ({ onOpenSidebar } = {}) => {
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
    <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Mobile: logo left, hamburger right */}
      <div className="md:hidden w-full flex items-center justify-between">
        <img src={logo} alt="company logo" className="w-8 h-8 shadow-sm" />

        <button
          type="button"
          className="p-2 rounded-lg bg-blue-600 text-white shadow-md"
          aria-label="Open sidebar"
          onClick={onOpenSidebar}
        >
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white" />
        </button>
      </div>

      {/* Desktop/tablet: Search + profile/notification */}
      <div className="hidden md:flex w-full items-center justify-between">
        {/* Search */}
        <div className="w-full max-w-md relative">
          <input
            type="text"
            placeholder="Search employees, leaves..."
            className="w-full pl-12 pr-5 py-2 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <IoIosSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 sm:gap-6 ml-4">
          {/* Notification */}
          <div className="relative cursor-pointer">
            <FaBell className="text-gray-600 text-lg hover:text-blue-500 transition" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          {/* Profile */}
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
    </div>
  );
};

export default Header;

