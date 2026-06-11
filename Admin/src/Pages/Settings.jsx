import React, { useState } from "react";
import { FiSettings, FiUsers, FiLock, FiSave } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";
import SecuritySettings from "../Components/SecuritySettings";
import GeneralSettings from "../Components/GeneralSettings";
import LeaveConfiguration from "../Components/LeaveConfiguration"; //
import UserRoles from "../Components/UserRoles";
import EmailNotifications from "../Components/EmailNotifications";
import AppNotifications from "../Components/AppNotifications";


export default function Settings() {
  const [activeTab, setActiveTab] = useState("General");

  // Notification states
  const [emailSettings, setEmailSettings] = useState({
    newLeave: true,
    approvals: true,
    holidays: true,
    reports: false,
  });

  const [inAppSettings, setInAppSettings] = useState({
    push: true,
    sound: false,
  });

  const toggleEmail = (key) => {
    setEmailSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleInApp = (key) => {
    setInAppSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const tabs = [
    { name: "General", icon: <FiSettings /> },
    { name: "Notifications", icon: <FaRegBell /> },
    { name: "Roles & Permissions", icon: <FiUsers /> },
    { name: "Security", icon: <FiLock />, component: SecuritySettings },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-500 mb-6">
          Manage your system configuration and preferences
        </p>

        {/* Tabs */}
        <div className="bg-gray-200 p-1 rounded-full flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab.name
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-600 hover:bg-gray-300"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/*  GENERAL TAB */}
        {activeTab === "General" && (
          <>
            {/* General Settings Card */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <GeneralSettings />
            </div>

            {/* Leave Configuration Card */}
            <div className="bg-white rounded-2xl shadow p-6">
              <LeaveConfiguration />
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6">
              <button className="flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow">
                <FiSave />
                Save Changes
              </button>
            </div>
          </>
        )}

        {/* Notification TAB */}
        {activeTab === "Notifications" && (
          <>
            {/* Email Notification card */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <EmailNotifications
                settings={emailSettings}
                toggle={toggleEmail}
              />
            </div>

            {/* App Notification card */}
            <div className="bg-white rounded-2xl shadow p-6">
              <AppNotifications settings={inAppSettings} toggle={toggleInApp} />
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6">
              <button className="flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow">
                <FiSave />
                Save Preferences
              </button>
            </div>
          </>
        )}

        {activeTab === "Roles & Permissions" && <UserRoles />}

        {activeTab === "Security" && (
          <>
            <SecuritySettings />
          </>
        )}
      </div>
    </div>
  );
}
